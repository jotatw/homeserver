#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: update.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Gerenciar a versão e a atualização automática do HomeServer.
#
# Responsabilidades:
#   - Reportar a versão atual (última tag alcançável)
#   - Verificar se há release mais recente no remote
#   - Aplicar atualizações (pull fast-forward) com backup
#
# Não Responsabilidades:
#   - Não reimplanta módulos (isso é do install.sh)
#   - Não altera containers
#
# API Pública:
#   - hs_version
#   - hs_update_check
#   - hs_update_apply
#
# Dependências:
#   - git
#   - output.sh (Foundation)
#
# ==========================================================

HS_REMOTE="${HS_REMOTE:-origin}"
HS_UPDATE_CHANNEL="${HS_UPDATE_CHANNEL:-v1}"   # linha de release acompanhada (ex.: v1)

#
# Retorna a versão atual (última tag alcançável do HEAD).
#
# Saída:
#   vX.Y.Z ou o hash do commit.
#
hs_version() {

    local version
    version="$(git -C "${HS_PROJECT_ROOT}" describe --tags --abbrev=0 \
        --match "v${HS_UPDATE_CHANNEL}.*" 2>/dev/null || true)"

    if [[ -z "${version}" ]]; then
        version="$(git -C "${HS_PROJECT_ROOT}" rev-parse --short HEAD 2>/dev/null || echo "desconhecida")"
    fi

    printf "%s\n" "${version}"

}

#
# Última release (tag vX.Y.Z) da linha atual no remote.
#
# A linha é definida por HS_UPDATE_CHANNEL (default "v1"): somente tags
# `v1.x.y` entram na comparação — tags de outras linhas ficam como histórico.
#
# Saída:
#   vX.Y.Z ou vazio.
#
hs_update_latest_remote() {

    local rx="^${HS_UPDATE_CHANNEL//./\.}\."

    git -C "${HS_PROJECT_ROOT}" ls-remote --tags --refs "${HS_REMOTE}" \
        | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+(-rc(\.[0-9]+)?)?$' \
        | grep -E "${rx}" \
        | sort -V \
        | tail -1

}

#
# Verifica se existe release mais recente disponível no remote.
#
# Saída:
#   JSON com versão atual, última remota e se há update.
#
hs_update_check() {

    git -C "${HS_PROJECT_ROOT}" fetch --tags --quiet "${HS_REMOTE}" 2>/dev/null || true

    local current
    current="$(hs_version)"

    local latest
    latest="$(hs_update_latest_remote)"

    if [[ -z "${latest}" ]]; then
        latest="$(git -C "${HS_PROJECT_ROOT}" rev-parse --short "${HS_REMOTE}/main" 2>/dev/null || echo "${current}")"
    fi

    local update=false
    if [[ -n "${latest}" && "${latest}" != "${current}" ]]; then
        update=true
    fi

    printf '{"current":"%s","latest":"%s","update":%s}\n' \
        "${current}" "${latest}" "${update}"

}

#
# Aplica a atualização para a versão mais recente.
#
# Uso:
#   hs_update_apply [--no-redeploy]
#
# Fluxo:
#   1. Verifica update disponível
#   2. Backup git antes (tag de pre-update)
#   3. Pull fast-forward da branch main
#   4. (Opcional) roda install.sh para reimplantar módulos
#
# Retorno:
#   0 -> Atualizado
#   1 -> Já atualizado
#   2 -> Falha
#
hs_update_apply() {

    local redeploy=1

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --no-redeploy) redeploy=0 ;;
            *) echo "Argumento desconhecido: $1" >&2; return 2 ;;
        esac
        shift
    done

    git -C "${HS_PROJECT_ROOT}" fetch --tags --quiet "${HS_REMOTE}" 2>/dev/null || true

    local current
    current="$(hs_version)"

    local target
    target="$(hs_update_latest_remote)"

    if [[ -z "${target}" || "${target}" == "${current}" ]]; then
        echo "Já está na versão mais recente (${current})." >&2
        return 1
    fi

    info "Atualizando ${current} -> ${target}"

    # Backup do estado atual antes do update.
    local backup_tag="pre-update-${current}"
    git -C "${HS_PROJECT_ROOT}" tag -f "${backup_tag}" >/dev/null 2>&1 || true

    # Pull fast-forward da branch main (mantém repo na branch, sem detached HEAD).
    git -C "${HS_PROJECT_ROOT}" pull --ff-only "${HS_REMOTE}" main || {
        error "Pull falhou. O código não foi alterado."
        return 2
    }

    info "Código atualizado para ${target}."

    if [[ "${redeploy}" -eq 1 && -f "${HS_PROJECT_ROOT}/install.sh" ]]; then
        info "Reimplantando módulos..."
        sudo bash "${HS_PROJECT_ROOT}/install.sh" --no-prompt 2>/dev/null || {
            error "Reimplante falhou. Rollback disponível via tag ${backup_tag}."
            return 2
        }
    fi

    success "Atualizado para ${target}. Backup: ${backup_tag}"
    printf '{"from":"%s","to":"%s","backup":"%s"}\n' "${current}" "${target}" "${backup_tag}"

}

# ==========================================================
# Atualização de pacotes do sistema (apt) — independente do update
# de código/release. Requer root (sudo no host; runner nsenter na
# API). Resultado em /var/log/homeserver-os-update.log.
# ==========================================================

HS_OS_UPDATE_LOG="${HS_OS_UPDATE_LOG:-/var/log/homeserver-os-update.log}"

_sdo() {
    if [[ "$(id -u)" -eq 0 ]]; then
        "$@"
    else
        sudo "$@"
    fi
}

_os_log() {
    local now
    now="$(date '+%F %T')"
    _sdo bash -c "echo '[${now}] $*' >> '${HS_OS_UPDATE_LOG}'" 2>/dev/null || true
}

_os_apt() {
    _sdo env DEBIAN_FRONTEND=noninteractive "$@"
}

#
# Verifica pacotes atualizáveis do sistema.
#
# Saída:
#   {"upgradable":N,"reboot":0|1,"refresh":true}
#
hs_update_os_check() {
    local upgradable reboot=0
    upgradable=0

    _sdo apt-get update -qq 2>/dev/null
    upgradable="$(_sdo /usr/bin/apt list --upgradable 2>/dev/null | grep -c 'upgradable' || true)"
    [[ -f /var/run/reboot-required ]] && reboot=1

    printf '{"upgradable":%s,"reboot":%s,"refresh":true}\n' "${upgradable}" "${reboot}"
}

#
# Detecta se estamos dentro de um container (runner da API).
# Nesse contexto, upgrades que reiniciam o container runtime (docker-ce,
# containerd) matariam o processo em execução — por isso o apply é
# delegado a um unit transient do systemd do HOST (sobrevive ao restart).
#
_update_in_container() {
    [[ -f /.dockerenv ]] || [[ -f /run/.containerenv ]] \
        || grep -q '/docker/' /proc/1/cgroup 2>/dev/null
}

#
# Wrapper do apt usado via systemd-run (roda como root no HOST).
#
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

#
# Aplica atualização de todos os pacotes do sistema (apt).
#
# Retorno:
#   0 -> Sucesso
#   1 -> Falha
#
hs_update_os_apply() {
    local status_file reboot=0 upgradable=0 unit ok=0

    _os_log "update os: inicio"

    if _update_in_container; then
        # Host é o alvo; deleta em unit transient do systemd para
        # sobreviver a restarts do docker/containerd durante o upgrade.
        status_file="/tmp/hs-os-update.status"
        rm -f "${status_file}"
        _update_os_script "/tmp/hs-os-update.sh"

        _sdo systemd-run --quiet --no-block --unit=hs-os-update \
            bash /tmp/hs-os-update.sh 2>/dev/null || {
                _os_log "update os: falha ao agendar via systemd-run"
                return 1
            }

        unit="hs-os-update"
        ok=0
        for _ in $(seq 1 240); do
            [[ -f "${status_file}" ]] && { ok=1; break; }
            sleep 5
        done
        [[ "${ok}" -eq 1 ]] || {
            _os_log "update os: timeout aguardando systemd-run"
            return 1
        }
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
