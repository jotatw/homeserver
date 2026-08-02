#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: filebrowser.sh
# Camada.......: Adapters
#
# Objetivo.....:
# Adaptador para o FileBrowser. É a única porta de
# integração entre a Infrastructure e o FileBrowser.
#
# Responsabilidades:
#   - Autenticação (login do admin)
#   - CRUD de usuários
#   - Alteração de senha
#
# Não faz:
#   - Não executa Docker
#   - Não cria diretórios no storage
#   - Não conhece regras de negócio do HomeServer
#
# Configuração (env ou /srv/scripts/fb-credentials.env):
#   FILEBROWSER_URL
#   FILEBROWSER_ADMIN_USER
#   FILEBROWSER_ADMIN_PASS
#
# ==========================================================

if [[ -z "${FILEBROWSER_URL:-}" ]]; then
    FILEBROWSER_URL="http://localhost:8080"
fi

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
# Autentica o admin e retorna o token.
#
filebrowser_login() {
    if [[ -z "${FILEBROWSER_ADMIN_USER:-}" || -z "${FILEBROWSER_ADMIN_PASS:-}" ]]; then
        echo "Credenciais do FileBrowser não configuradas." >&2
        return 1
    fi

    curl -fsS -m 10 -X POST "${FILEBROWSER_URL}/api/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"${FILEBROWSER_ADMIN_USER}\",\"password\":\"${FILEBROWSER_ADMIN_PASS}\"}"
}

#
# Cria um usuário no FileBrowser.
#
filebrowser_create_user() {
    local token="$1" username="$2" password="$3" scope="$4"

    curl -fsS -m 10 -X POST "${FILEBROWSER_URL}/api/users" \
        -H "X-Auth: ${token}" \
        -H "Content-Type: application/json" \
        -d "{\"what\":\"user\",\"which\":[],\"current_password\":\"${FILEBROWSER_ADMIN_PASS}\",\"data\":{\"username\":\"${username}\",\"password\":\"${password}\",\"scope\":\"${scope}\",\"locale\":\"pt-br\",\"viewMode\":\"mosaic\",\"singleClick\":false,\"perm\":{\"admin\":false,\"execute\":true,\"create\":true,\"rename\":true,\"modify\":true,\"delete\":true,\"share\":true,\"download\":true}}}" >/dev/null
}

#
# Lista usuários do FileBrowser (JSON).
#
filebrowser_list_users() {
    curl -fsS -m 10 "${FILEBROWSER_URL}/api/users" \
        -H "X-Auth: $(filebrowser_login)"
}

#
# Retorna o id de um usuário pelo nome (ou vazio).
#
filebrowser_user_id() {
    local username="$1"

    filebrowser_list_users \
        | grep -oE "\"id\":[0-9]+,\"username\":\"${username}\"" \
        | grep -oE "[0-9]+" | head -1
}

#
# Remove um usuário do FileBrowser.
#
filebrowser_remove_user() {
    local token="$1" id="$2"

    curl -fsS -m 10 -X DELETE "${FILEBROWSER_URL}/api/users/${id}" \
        -H "X-Auth: ${token}" \
        -H "Content-Type: application/json" \
        -d "{\"current_password\":\"${FILEBROWSER_ADMIN_PASS}\"}" >/dev/null
}

#
# Altera a senha de um usuário.
#
filebrowser_update_password() {
    local token="$1" id="$2" password="$3"

    curl -fsS -m 10 -X PUT "${FILEBROWSER_URL}/api/users/${id}" \
        -H "X-Auth: ${token}" \
        -H "Content-Type: application/json" \
        -d "{\"what\":\"user\",\"which\":[\"password\"],\"current_password\":\"${FILEBROWSER_ADMIN_PASS}\",\"data\":{\"id\":${id},\"password\":\"${password}\"}}" >/dev/null
}
