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
#   - cria usuário no FileBrowser via ADAPTER
#   - opcionalmente cria o usuário no Gitea (perfil OIDC)
#
# Dependências:
#   - adapters/filebrowser.sh (apenas para criar usuário no FileBrowser)
#   - foundation/filesystem.sh (criação/remoção de pasta em /srv/storage)
#   - docker apenas para Gitea opcional
#
# Não faz:
#   - Não monta storage nem depende de módulo específico para criar pasta
#     (usa filesystem puro — desacoplado de FileBrowser).
#   - Não conversa diretamente com a API do FileBrowser.
#   - Toda integração externa passa pelo adapter.
#
# ==========================================================

set -euo pipefail

# ----------------------------------------------------------
# Interno
# ----------------------------------------------------------

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
#   hs_user_create <nome> [--password=...|--password <valor>]
#                        [--email=...] [--gitea]
#
hs_user_create() {
    local username="${1:?nome do usuário}"
    shift
    local password="" email="" gitea=0
    local token scope

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --password=*) password="${1#*=}"; shift ;;
            --password)   password="${2:-}"; shift 2 ;;
            --email=*)    email="${1#*=}"; shift ;;
            --email)      email="${2:-}"; shift 2 ;;
            --gitea)      gitea=1; shift ;;
            *)            echo "Argumento desconhecido: $1" >&2; return 1 ;;
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

    # Garante a pasta própria no storage via camada Infrastructure
    # (desacoplado de FileBrowser — funciona mesmo se o módulo estiver
    # desabilitado/trocado; FileBrowser apenas recebe o scope).
    local user_dir="${HS_STORAGE_ROOT:-/srv/storage}/users/${username}"
    if ! hs_fs_directory_exists "${user_dir}"; then
        hs_fs_create_directory "${user_dir}" || {
            echo "Falha ao criar diretório do usuário: ${user_dir}" >&2
            return 1
        }
        chown 1000:1000 "${user_dir}" 2>/dev/null || true
        chmod 755 "${user_dir}" 2>/dev/null || true
    fi

    token="$(filebrowser_login)"
    filebrowser_create_user "${token}" "${username}" "${password}" "${scope}"

    if [[ ${gitea} -eq 1 ]]; then
        hs_user_create_gitea "${username}" "${password}" "${email}"
    fi

    export HS_USER_NAME="${username}"
    automation_run users >/dev/null 2>&1 || true

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
    filebrowser_list_users
}

#
# Exibe informações de um usuário.
#
hs_user_info() {
    local username="${1:?nome do usuário}"

    if command -v python3 >/dev/null 2>&1; then
        filebrowser_list_users | python3 -c "
import sys, json
users = json.load(sys.stdin)
u = next((x for x in users if x['username'] == '${username}'), None)
if not u:
    raise SystemExit(1)
print('username:', u['username'])
print('scope   :', u['scope'])
print('admin   :', u['perm']['admin'])
print('locale  :', u['locale'])
"
    else
        filebrowser_list_users | grep -oE "\"username\":\"${username}\"[^}]*" | head -1
    fi
}

#
# Altera a senha de um usuário.
#
# Uso:
#   hs_user_password <nome> [--password=...|--password <valor>]
#
hs_user_password() {
    local username="${1:?nome do usuário}"
    shift
    local password="" token id

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --password=*) password="${1#*=}"; shift ;;
            --password)   password="${2:-}"; shift 2 ;;
            *)            echo "Argumento desconhecido: $1" >&2; return 1 ;;
        esac
    done

    if [[ -z "${password}" ]]; then
        password="$(_generate_password)"
        echo "Senha gerada: ${password}" >&2
    fi

    id="$(filebrowser_user_id "${username}")"
    if [[ -z "${id}" ]]; then
        echo "Usuário não encontrado: ${username}" >&2
        return 1
    fi

    token="$(filebrowser_login)"
    filebrowser_update_password "${token}" "${id}" "${password}"

    echo "Senha alterada para: ${username}" >&2
    printf '{"username":"%s","password":"%s"}\n' "${username}" "${password}"
}

#
# Remove um usuário do FileBrowser (e opcionalmente a pasta).
#
# Uso:
#   hs_user_rm <nome> [--remove-folder] [--gitea]
#
hs_user_rm() {
    local username="${1:?nome do usuário}"
    shift
    local remove_folder=0 gitea=0
    local token id

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --remove-folder) remove_folder=1; shift ;;
            --gitea)         gitea=1; shift ;;
            *)               echo "Argumento desconhecido: $1" >&2; return 1 ;;
        esac
    done

    token="$(filebrowser_login)"

    id="$(filebrowser_user_id "${username}")"

    if [[ -n "${id}" ]]; then
        filebrowser_remove_user "${token}" "${id}"
        echo "Usuário FileBrowser removido: ${username}" >&2
    else
        echo "Usuário FileBrowser não encontrado: ${username}" >&2
    fi

    if [[ ${remove_folder} -eq 1 ]]; then
        local user_dir="${HS_STORAGE_ROOT:-/srv/storage}/users/${username}"
        if hs_fs_directory_exists "${user_dir}"; then
            hs_fs_remove_directory "${user_dir}" 2>/dev/null || rm -rf "${user_dir}" 2>/dev/null || true
        fi
        echo "Pasta removida: /users/${username}" >&2
    fi

    if [[ ${gitea} -eq 1 ]]; then
        docker exec -u git gitea /app/gitea/gitea admin user delete \
            --username "${username}" >/dev/null 2>&1 || true
        echo "Usuário Gitea removido: ${username}" >&2
    fi

    export HS_USER_NAME="${username}"
    automation_run users >/dev/null 2>&1 || true
}

#
# Verifica as credenciais de um usuário (senha válida no FileBrowser).
#
# Uso:
#   hs_user_verify <nome> <senha>
#
# Retorno:
#   0 -> Credenciais válidas
#   1 -> Inválidas
#
hs_user_verify() {
    local username="${1:?nome do usuário}"
    local password="${2:?senha}"

    filebrowser_verify_user "${username}" "${password}"
}

#
# Verifica se um usuário é administrador (no FileBrowser).
#
# Uso:
#   hs_user_is_admin <nome>
#
# Retorno:
#   0 -> é admin
#   1 -> não é admin / não encontrado
#
hs_user_is_admin() {
    local username="${1:?nome do usuario}"

    # Container da API nao tem python3: tenta node primeiro.
    if command -v node >/dev/null 2>&1; then
        filebrowser_list_users | node -e '
const name = process.argv[1];
let d = "";
process.stdin.on("data", c => d += c);
process.stdin.on("end", () => {
  try {
    const users = JSON.parse(d);
    const u = users.find(x => x.username === name);
    const admin = u && ((u.permissions && u.permissions.admin) ||
                        (u.perm && u.perm.admin));
    process.exit(admin ? 0 : 1);
  } catch (e) { process.exit(1); }
});' "$username"
        return $?
    fi

    # Host (CLI): python3 disponivel.
    filebrowser_list_users | python3 -c "
import json, sys
name = '$username'
try:
    users = json.load(sys.stdin)
except Exception:
    raise SystemExit(1)
for u in users:
    if u.get('username') == name:
        p = (u.get('permissions') or u.get('perm') or {})
        raise SystemExit(0 if p.get('admin') else 1)
raise SystemExit(1)
" 2>/dev/null
}
