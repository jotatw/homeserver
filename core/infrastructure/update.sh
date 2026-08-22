#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: update.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Gerenciar atualização do código do HomeServer e atualização
# do sistema operacional como operações independentes.
#
# Atualização do projeto:
#   - compara o estado local com a branch remota configurada
#   - detecta árvore modificada, commits à frente e divergência
#   - aplica somente fast-forward seguro
#   - nunca usa reset --hard como estratégia padrão
#
# API Pública:
#   - hs_version
#   - hs_update_check
#   - hs_update_apply
#   - hs_update_os_check
#   - hs_update_os_apply
#
# Dependências:
#   - git
#   - output.sh (Foundation)
#
# ==========================================================

HS_REMOTE="${HS_REMOTE:-origin}"
HS_UPDATE_BRANCH="${HS_UPDATE_BRANCH:-main}"

_hs_git() {
    git -C "${HS_PROJECT_ROOT}" "$@"
}

# Retorna o identificador curto do commit atualmente instalado.
hs_version() {
    _hs_git rev-parse --short HEAD 2>/dev/null || printf '%s\n' 'desconhecida'
}

# Retorna true quando existem alterações locais rastreadas ou não rastreadas.
_hs_update_worktree_dirty() {
    [[ -n "$(_hs_git status --porcelain 2>/dev/null)" ]]
}

# Atualiza as referências remotas sem alterar o código local.
_hs_update_fetch() {
    _hs_git fetch --quiet "${HS_REMOTE}" "${HS_UPDATE_BRANCH}"
}

# Calcula o estado do repositório em relação ao destino remoto.
# Saída: status\tcurrent\tlatest\tahead\tbehind\tdirty
_hs_update_state() {
    local current latest counts ahead behind dirty status

    current="$(_hs_git rev-parse --short HEAD 2>/dev/null || printf '%s' 'desconhecida')"
    latest="$(_hs_git rev-parse --short "${HS_REMOTE}/${HS_UPDATE_BRANCH}" 2>/dev/null || true)"
    dirty=false
    _hs_update_worktree_dirty && dirty=true

    if [[ -z "${latest}" ]]; then
        printf 'unavailable\t%s\t%s\t0\t0\t%s\n' "${current}" "${current}" "${dirty}"
        return 0
    fi

    counts="$(_hs_git rev-list --left-right --count HEAD..."${HS_REMOTE}/${HS_UPDATE_BRANCH}" 2>/dev/null || true)"
    read -r ahead behind <<< "${counts:-0 0}"

    if [[ "${dirty}" == true ]]; then
        status="modified"
    elif [[ "${ahead}" -eq 0 && "${behind}" -eq 0 ]]; then
        status="up_to_date"
    elif [[ "${ahead}" -eq 0 && "${behind}" -gt 0 ]]; then
        status="update_available"
    elif [[ "${ahead}" -gt 0 && "${behind}" -eq 0 ]]; then
        status="ahead"
    else
        status="diverged"
    fi

    printf '%s\t%s\t%s\t%s\t%s\t%s\n' \
        "${status}" "${current}" "${latest}" "${ahead}" "${behind}" "${dirty}"
}

# Verifica o estado da atualização sem alterar o código.
# Saída JSON:
# {"status":"...","current":"...","latest":"...", "ahead":N,"behind":N,"dirty":bool,"update":bool}
hs_update_check() {
    if ! _hs_update_fetch 2>/dev/null; then
        local current
        current="$(hs_version)"
        printf '{"status":"unavailable","current":"%s","latest":"%s","ahead":0,"behind":0,"dirty":false,"update":false}\n' \
            "${current}" "${current}"
        return 0
    fi

    local status current latest ahead behind dirty update=false
    IFS=$'\t' read -r status current latest ahead behind dirty <<< "$(_hs_update_state)"
    [[ "${status}" == "update_available" ]] && update=true

    printf '{"status":"%s","current":"%s","latest":"%s","ahead":%s,"behind":%s,"dirty":%s,"update":%s}\n' \
        "${status}" "${current}" "${latest}" "${ahead}" "${behind}" "${dirty}" "${update}"
}

# Aplica uma atualização apenas quando ela puder ser feita por fast-forward.
# Uso:
#   hs_update_apply
#
# Retorno:
#   0 -> Atualizado
#   1 -> Já atualizado
#   2 -> Não foi possível atualizar com segurança
#   3 -> Falha operacional
hs_update_apply() {
    if [[ $# -gt 0 ]]; then
        echo "Argumento desconhecido: $1" >&2
        return 2
    fi

    if ! _hs_update_fetch; then
        error "Não foi possível consultar ${HS_REMOTE}/${HS_UPDATE_BRANCH}."
        return 3
    fi

    local status current latest ahead behind dirty
    IFS=$'\t' read -r status current latest ahead behind dirty <<< "$(_hs_update_state)"

    case "${status}" in
        up_to_date)
            echo "Já está atualizado (${current})." >&2
            return 1
            ;;
        modified)
            error "Atualização recusada: existem alterações locais. Nenhum arquivo foi sobrescrito."
            return 2
            ;;
        ahead)
            error "Atualização recusada: a instalação possui commits locais à frente do remoto."
            return 2
            ;;
        diverged)
            error "Atualização recusada: o histórico local divergiu do remoto."
            return 2
            ;;
        unavailable)
            error "Atualização recusada: o destino remoto não está disponível."
            return 3
            ;;
        update_available)
            ;;
        *)
            error "Estado de atualização desconhecido: ${status}."
            return 3
            ;;
    esac

    info "Atualizando ${current} -> ${latest}"

    # Referência local para recuperação do código anterior.
    # Não representa rollback completo de dados ou migrações.
    local backup_ref="refs/homeserver/pre-update/${current}"
    _hs_git update-ref "${backup_ref}" HEAD || {
        error "Não foi possível registrar o ponto de recuperação."
        return 3
    }

    if ! _hs_git merge --ff-only "${HS_REMOTE}/${HS_UPDATE_BRANCH}"; then
        error "Fast-forward falhou. Nenhum reset automático será executado."
        return 3
    fi

    local updated
    updated="$(hs_version)"
    success "Código atualizado para ${updated}. Ponto de recuperação: ${backup_ref}"
    printf '{"from":"%s","to":"%s","recovery":"%s"}\n' \
        "${current}" "${updated}" "${backup_ref}"
}

# ==========================================================
# Atualização de pacotes do sistema (apt) — independente da
# atualização do código do HomeServer. Requer root.
# Resultado em /var/log/homeserver-os-update.log.
# ==========================================================

HS_OS_UPDATE_LOG="${HS_OS_UPDATE_LOG:-/var/log/homeserver-os-update.log}"

_sdo() {
    if [[ "$(id -u)" -eq 0 ]]; then "$@"; else sudo "$@"; fi
}

_os_log() {
    local now
    now="$(date '+%F %T')"
    _sdo bash -c "echo '[${now}] $*' >> '${HS_OS_UPDATE_LOG}'" 2>/dev/null || true
}

_os_apt() { _sdo env DEBIAN_FRONTEND=noninteractive "$@"; }

hs_update_os_check() {
    local upgradable reboot=0
    _sdo apt-get update -qq 2>/dev/null
    upgradable="$(_sdo /usr/bin/apt list --upgradable 2>/dev/null | grep -c 'upgradable' || true)"
    [[ -f /var/run/reboot-required ]] && reboot=1
    printf '{"upgradable":%s,"reboot":%s,"refresh":true}\n' "${upgradable}" "${reboot}"
}

_update_in_container() {
    [[ -f /.dockerenv ]] || [[ -f /run/.containerenv ]] || grep -q '/docker/' /proc/1/cgroup 2>/dev/null
}

_update_os_script() {
    local script="$1"
    cat > "${script}" <<'EOF'
#!/usr/bin/env bash
set -uo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update >/dev/null 2>&1
apt-get upgrade -y --with-new-pkgs >/dev/null 2>&1
apt-get autoremove --purge -y >/dev/null 2>&1
dpkg --configure -a >/dev/null 2>&1
dpkg --triggers-only --pending >/dev/null 2>&1
echo "$?" > /tmp/hs-os-update.status
EOF
    chmod +x "${script}"
}

hs_update_os_apply() {
    local status_file reboot=0 upgradable=0 unit ok=0
    _os_log "update os: inicio"

    if _update_in_container; then
        status_file="/tmp/hs-os-update.status"
        rm -f "${status_file}"
        _update_os_script "/tmp/hs-os-update.sh"
        _sdo systemd-run --quiet --no-block --unit=hs-os-update bash /tmp/hs-os-update.sh 2>/dev/null || {
            _os_log "update os: falha ao agendar via systemd-run"; return 1;
        }
        unit="hs-os-update"
        for _ in $(seq 1 240); do
            [[ -f "${status_file}" ]] && { ok=1; break; }
            sleep 5
        done
        [[ "${ok}" -eq 1 ]] || { _os_log "update os: timeout aguardando systemd-run"; return 1; }
        _sdo systemctl stop "${unit}" 2>/dev/null || true
    else
        _os_apt apt-get update || { _os_log "update os: apt-get update FALHOU"; return 1; }
        _os_apt apt-get upgrade -y --with-new-pkgs || { _os_log "update os: apt-get upgrade FALHOU"; return 1; }
        _os_apt apt-get autoremove --purge -y || true
        _sdo dpkg --configure -a >/dev/null 2>&1 || true
    fi

    upgradable="$(_sdo /usr/bin/apt list --upgradable 2>/dev/null | grep -c 'upgradable' || true)"
    [[ -f /var/run/reboot-required ]] && reboot=1
    _os_log "update os: concluido (reboot=${reboot}, pendentes=${upgradable})"
    printf '{"applied":true,"reboot":%s,"upgradable":%s}\n' "${reboot}" "${upgradable}"
}
