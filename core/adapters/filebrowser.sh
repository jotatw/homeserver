#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: filebrowser.sh
# Camada.......: Adapters
#
# Objetivo.....:
# Adaptador para o FileBrowser Quantum. É a única porta de
# integração entre a Infrastructure e o serviço de arquivos.
#
# Responsabilidades:
#   - Autenticação (login do admin)
#   - CRUD de usuários (criação em 2 passos: conta + senha)
#   - Alteração de senha
#
# Não faz:
#   - Não executa Docker
#   - Não cria diretórios no storage
#   - Não conhece regras de negócio do HomeServer
#
# Configuração (env ou /srv/scripts/fb-credentials.env):
#   FILEBROWSER_URL        (default http://localhost:8080)
#   FILEBROWSER_ADMIN_USER (default admin)
#   FILEBROWSER_ADMIN_PASS
#
# Notas da API Quantum (diferem do original):
#   - login: POST /api/auth/login?username=U&recaptcha= com header
#     X-Password (senha não vai no body)
#   - token: Authorization: Bearer <jwt> em todas as chamadas
#   - confirmação admin: header X-Password nas operações sensíveis
#   - criação de usuário NÃO define senha; requer PUT separado
#
# ==========================================================

if [[ -z "${FILEBROWSER_URL:-}" ]]; then
    FILEBROWSER_URL="http://localhost:8080"
fi

FILEBROWSER_ADMIN_USER="${FILEBROWSER_ADMIN_USER:-admin}"

if [[ -f /srv/scripts/fb-credentials.env ]]; then
    # shellcheck source=/dev/null
    source /srv/scripts/fb-credentials.env
fi

#
# Verifica se o adapter está disponível.
#
filebrowser_available() {
    command -v curl >/dev/null 2>&1
}

#
# Autentica o admin e retorna o token (JWT).
#
filebrowser_login() {
    if [[ -z "${FILEBROWSER_ADMIN_PASS:-}" ]]; then
        echo "Credenciais do FileBrowser não configuradas." >&2
        return 1
    fi

    curl -fsS -m 10 -X POST \
        "${FILEBROWSER_URL}/api/auth/login?username=${FILEBROWSER_ADMIN_USER}&recaptcha=" \
        -H "X-Password: ${FILEBROWSER_ADMIN_PASS}"
}

#
# Cria um usuário (conta sem senha — a senha é aplicada por
# filebrowser_update_password como segundo passo).
#
# Uso: filebrowser_create_user <token> <username> <scope>
#
filebrowser_create_user() {
    local token="$1" username="$2" scope="$3"

    curl -fsS -m 10 -X POST "${FILEBROWSER_URL}/api/users" \
        -H "Authorization: Bearer ${token}" \
        -H "X-Password: ${FILEBROWSER_ADMIN_PASS}" \
        -H "Content-Type: application/json" \
        -d "{\"what\":\"user\",\"which\":[],\"data\":{\"username\":\"${username}\",\"scopes\":[{\"name\":\"Storage\",\"scope\":\"${scope}\"}],\"lockPassword\":false,\"permissions\":{\"api\":false,\"admin\":false,\"modify\":true,\"share\":true,\"realtime\":false,\"delete\":true,\"create\":true,\"download\":true},\"locale\":\"ptBR\",\"viewMode\":\"normal\",\"singleClick\":false}}" >/dev/null
}

#
# Lista usuários do FileBrowser (JSON).
#
filebrowser_list_users() {
    curl -fsS -m 10 "${FILEBROWSER_URL}/api/users" \
        -H "Authorization: Bearer $(filebrowser_login)"
}

#
# Retorna o id de um usuário pelo nome (ou vazio).
#
filebrowser_user_id() {
    local username="$1"

    filebrowser_list_users \
        | python3 -c "
import json, sys
name = '${username}'
try:
    users = json.load(sys.stdin)
except Exception:
    raise SystemExit(0)
for u in users:
    if u.get('username') == name:
        print(u['id'])
        break
" 2>/dev/null
}

#
# Remove um usuário.
#
# Uso: filebrowser_remove_user <token> <id>
#
filebrowser_remove_user() {
    local token="$1" id="$2"

    curl -fsS -m 10 -X DELETE "${FILEBROWSER_URL}/api/users?id=${id}" \
        -H "Authorization: Bearer ${token}" \
        -H "X-Password: ${FILEBROWSER_ADMIN_PASS}" >/dev/null
}

#
# Define/altera a senha de um usuário.
# No Quantum a senha não vai na criação — este é o passo obrigatório.
#
# Uso: filebrowser_update_password <token> <id> <password>
#
filebrowser_update_password() {
    local token="$1" id="$2" password="$3"

    curl -fsS -m 10 -X PUT "${FILEBROWSER_URL}/api/users?id=${id}" \
        -H "Authorization: Bearer ${token}" \
        -H "X-Password: ${FILEBROWSER_ADMIN_PASS}" \
        -H "Content-Type: application/json" \
        -d "{\"what\":\"user\",\"which\":[\"password\"],\"data\":{\"id\":${id},\"password\":\"${password}\"}}" >/dev/null
}

#
# Verifica as credenciais de um usuário comum.
#
# Uso:
#   filebrowser_verify_user <username> <password>
#
# Retorno:
#   0 -> Credenciais válidas
#   1 -> Inválidas / falha
#
filebrowser_verify_user() {
    local username="$1"
    local password="$2"

    [[ -n "${username}" && -n "${password}" ]] || return 1

    local status
    status="$(curl -sS -m 10 -o /dev/null -w "%{http_code}" \
        -X POST "${FILEBROWSER_URL}/api/auth/login?username=${username}&recaptcha=" \
        -H "X-Password: ${password}")" 2>/dev/null

    [[ "${status}" == "200" ]]
}
