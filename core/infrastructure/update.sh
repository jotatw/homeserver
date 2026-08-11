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

#
# Retorna a versão atual (última tag alcançável do HEAD).
#
# Saída:
#   vX.Y.Z ou o hash do commit.
#
hs_version() {

    local version
    version="$(git -C "${HS_PROJECT_ROOT}" describe --tags --abbrev=0 2>/dev/null || true)"

    if [[ -z "${version}" ]]; then
        version="$(git -C "${HS_PROJECT_ROOT}" rev-parse --short HEAD 2>/dev/null || echo "desconhecida")"
    fi

    printf "%s\n" "${version}"

}

#
# Última release (tag vX.Y.Z) do remote.
#
# Saída:
#   vX.Y.Z ou vazio.
#
hs_update_latest_remote() {

    git -C "${HS_PROJECT_ROOT}" ls-remote --tags --refs "${HS_REMOTE}" \
        | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+(-rc(\.[0-9]+)?)?$' \
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
