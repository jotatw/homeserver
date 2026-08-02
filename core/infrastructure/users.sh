#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: users.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Gerenciar usuários da plataforma:
#   - cria pasta própria em /srv/storage/users/<nome>
#   - cria usuário FileBrowser com escopo na própria pasta
#   - opcionalmente cria o usuário no Gitea (perfil OIDC)
#
# Dependências:
#   - curl (API HTTP do FileBrowser)
#   - docker (Gitea)
#
# ==========================================================

set -euo pipefail

if [[ -z "${FILEBROWSER_URL:-}" ]]; then
    FILEBROWSER_URL="http://localhost:8080"
fi

if [[ -f /srv/scripts/fb-credentials.env ]]; then
    # shellcheck source=/dev/null
    source /srv/scripts/fb-credentials.env
fi

# ----------------------------------------------------------
# Interno
# ----------------------------------------------------------

_fb_login() {
    local token

    if [[ -z "${FILEBROWSER_ADMIN_USER:-}" || -z "${FILEBROWSER_ADMIN_PASS:-}" ]]; then
        echo "Credenciais do FileBrowser não configuradas." >&2
        echo "Defina FILEBROWSER_ADMIN_USER/FILEBROWSER_ADMIN_PASS ou crie /srv/scripts/fb-credentials.env" >&2
        return 1
    fi

    token="$(curl -fsS -m 10 -X POST "${FILEBROWSER_URL}/api/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"${FILEBROWSER_ADMIN_USER}\",\"password\":\"${FILEBROWSER_ADMIN_PASS}\"}")"

    printf "%s" "${token}"
}

_fb_create_user() {
    local token="$1" username="$2" password="$3" scope="$4"

    curl -fsS -m 10 -X POST "${FILEBROWSER_URL}/api/users" \
        -H "X-Auth: ${token}" \
        -H "Content-Type: application/json" \
        -d "{\"what\":\"user\",\"which\":[],\"current_password\":\"${FILEBROWSER_ADMIN_PASS}\",\"data\":{\"username\":\"${username}\",\"password\":\"${password}\",\"scope\":\"${scope}\",\"locale\":\"pt-br\",\"viewMode\":\"mosaic\",\"singleClick\":false,\"perm\":{\"admin\":false,\"execute\":true,\"create\":true,\"rename\":true,\"modify\":true,\"delete\":true,\"share\":true,\"download\":true}}}" >/dev/null
}

_fb_list_users() {
    curl -fsS -m 10 "${FILEBROWSER_URL}/api/users" -H "X-Auth: $(_fb_login)"
}

_fb_remove_user() {
    local token="$1" id="$2"

    curl -fsS -m 10 -X DELETE "${FILEBROWSER_URL}/api/users/${id}" \
        -H "X-Auth: ${token}" \
        -H "Content-Type: application/json" \
        -d "{\"current_password\":\"${FILEBROWSER_ADMIN_PASS}\"}" >/dev/null
}

_generate_password() {
    openssl rand -base64 24 2>/dev/null | tr -dc 'A-Za-z0-9@#%*' | head -c 16
}

_validate_username() {
    local name="$1"
    [[ "${name}" =~ ^[a-z][a-z0-9_-]{1,30}$ ]]
}

# ----------------------------------------------------------
# Público
# ----------------------------------------------------------

#
# Cria um usuário (pasta própria + FileBrowser [+ Gitea]).
#
# Uso:
#   hs_user_create <nome> [--password=...] [--email=...] [--gitea]
#
hs_user_create() {
    local username="${1:?nome do usuário}"
    shift
    local password="" email="" gitea=0
    local arg token scope

    for arg in "$@"; do
        case "${arg}" in
            --password=*) password="${arg#*=}" ;;
            --email=*)     email="${arg#*=}" ;;
            --gitea)       gitea=1 ;;
            *)             echo "Argumento desconhecido: ${arg}" >&2; return 1 ;;
        esac
    done

    _validate_username "${username}" || {
        echo "Usuário inválido: '${username}'. Use [a-z][a-z0-9_-]{1,30}." >&2
        return 1
    }

    if [[ -z "${password}" ]]; then
        password="$(_generate_password)"
        echo "Senha gerada: ${password}" >&2
    fi

    scope="/users/${username}"
    token="$(_fb_login)"

    docker exec filebrowser mkdir -p "/srv${scope}"
    _fb_create_user "${token}" "${username}" "${password}" "${scope}"

    if [[ ${gitea} -eq 1 ]]; then
        hs_user_create_gitea "${username}" "${password}" "${email}"
    fi

    printf '{\n'
    printf '  "username": "%s",\n' "${username}"
    printf '  "scope": "%s",\n' "${scope}"
    printf '  "password": "%s",\n' "${password}"
    printf '  "filebrowser": true,\n'
    printf '  "gitea": %s\n' "$([ "${gitea}" -eq 1 ] && echo true || echo false)"
    printf '}\n'
}

#
# Cria o usuário no Gitea (perfil para OIDC).
#
hs_user_create_gitea() {
    local username="${1:?nome do usuário}" password="${2:?senha}" email="${3:-}"

    if [[ -z "${email}" ]]; then
        email="${username}@home.local"
    fi

    docker exec -u git gitea /app/gitea/gitea admin user create \
        --username "${username}" \
        --password "${password}" \
        --email "${email}" \
        --must-change-password=false >/dev/null

    echo "Usuário Gitea criado: ${username}" >&2
}

#
# Lista os usuários do FileBrowser (JSON).
#
hs_user_list() {
    _fb_list_users
}

#
# Remove um usuário do FileBrowser (e opcionalmente a pasta).
#
# Uso:
#   hs_user_rm <nome> [--remove-folder]
#
hs_user_rm() {
    local username="${1:?nome do usuário}"
    shift
    local remove_folder=0 gitea=0
    local arg token id

    for arg in "$@"; do
        case "${arg}" in
            --remove-folder) remove_folder=1 ;;
            --gitea)         gitea=1 ;;
            *)               echo "Argumento desconhecido: ${arg}" >&2; return 1 ;;
        esac
    done

    token="$(_fb_login)"

    id="$(_fb_list_users \
        | grep -oE "\"id\":[0-9]+,\"username\":\"${username}\"" \
        | grep -oE "[0-9]+" | head -1)"

    if [[ -n "${id}" ]]; then
        _fb_remove_user "${token}" "${id}"
        echo "Usuário FileBrowser removido: ${username}" >&2
    else
        echo "Usuário FileBrowser não encontrado: ${username}" >&2
    fi

    if [[ ${remove_folder} -eq 1 ]]; then
        docker exec filebrowser rm -rf "/srv/users/${username}" 2>/dev/null || true
        echo "Pasta removida: /users/${username}" >&2
    fi

    if [[ ${gitea} -eq 1 ]]; then
        docker exec -u git gitea /app/gitea/gitea admin user delete \
            --username "${username}" >/dev/null 2>&1 || true
        echo "Usuário Gitea removido: ${username}" >&2
    fi
}
