#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: filebrowser.sh
# Camada.......: Adapters
#
# Objetivo.....:
# Adaptador para o FileBrowser Quantum (sucessor do original,
# EOL 2026-09-01). Unica porta de integracao entre a
# Infrastructure e o servico de arquivos.
#
# Responsabilidades:
#   - Autenticacao (login do admin)
#   - CRUD de usuarios (criacao em 2 passos: conta + senha)
#   - Alteracao de senha
#
# Nao faz:
#   - Nao executa Docker
#   - Nao cria diretorios no storage
#   - Nao conhece regras de negocio do HomeServer
#
# Configuracao (env ou /srv/scripts/fb-credentials.env):
#   FILEBROWSER_URL        (default http://localhost:8080)
#   FILEBROWSER_ADMIN_USER (default admin)
#   FILEBROWSER_ADMIN_PASS
#
# Notas da API Quantum (diferem do original):
#   - login: POST /api/auth/login?username=U com header X-Password
#   - token: Authorization: Bearer <jwt>
#   - confirmacao admin: header X-Password nas operacoes sensiveis
#   - criacao de usuario NAO define senha; requer PUT separado
#
# Saidas JSON sao compactadas (tr -d espacos/newlines) para
# extracoes sed/grep estaveis. Normalizacao complexa fica na
# camada API (TypeScript).
#
# ==========================================================

FILEBROWSER_URL="${FILEBROWSER_URL:-http://localhost:8080}"
FILEBROWSER_ADMIN_USER="${FILEBROWSER_ADMIN_USER:-admin}"

if [[ -f /srv/scripts/fb-credentials.env ]]; then
    # shellcheck source=/dev/null
    source /srv/scripts/fb-credentials.env
fi

filebrowser_available() {
    command -v curl >/dev/null 2>&1
}

# Autentica o admin e retorna o token (JWT).
filebrowser_login() {
    if [[ -z "${FILEBROWSER_ADMIN_PASS:-}" ]]; then
        echo "Credenciais do FileBrowser nao configuradas." >&2
        return 1
    fi
    curl -fsS -m 10 -X POST \
        "${FILEBROWSER_URL}/api/auth/login?username=${FILEBROWSER_ADMIN_USER}&recaptcha=" \
        -H "X-Password: ${FILEBROWSER_ADMIN_PASS}"
}

# Lista usuarios (JSON cru compactado do Quantum).
filebrowser_list_users() {
    curl -fsS -m 10 "${FILEBROWSER_URL}/api/users" \
        -H "Authorization: Bearer $(filebrowser_login)" \
        | tr -d ' \n\t'
}

# Retorna o id de um usuario pelo nome (ou vazio).
filebrowser_user_id() {
    local username="$1"
    filebrowser_list_users \
        | sed -n 's/.*{"id":\([0-9]*),"username":"${username}".*/\1/p'
}

# Cria um usuario (conta SEM senha; aplicar depois via update_password).
filebrowser_create_user() {
    local token="$1" username="$2" scope="$3"
    curl -fsS -m 10 -X POST "${FILEBROWSER_URL}/api/users" \
        -H "Authorization: Bearer ${token}" \
        -H "X-Password: ${FILEBROWSER_ADMIN_PASS}" \
        -H "Content-Type: application/json" \
        -d "{\"what":"user","which":[],"data":{"username":"${username}","scopes":[{"name":"Storage","scope":"${scope}}],"lockPassword":false,"permissions":{"api":false,"admin":false,"modify":true,"share":true,"realtime":false,"delete":true,"create":true,"download":true},"locale":"ptBR","viewMode":"normal","singleClick":false}}" >/dev/null
}

# Define/altera a senha de um usuario.
filebrowser_update_password() {
    local token="$1" id="$2" password="$3"
    curl -fsS -m 10 -X PUT "${FILEBROWSER_URL}/api/users?id=${id}" \
        -H "Authorization: Bearer ${token}" \
        -H "X-Password: ${FILEBROWSER_ADMIN_PASS}" \
        -H "Content-Type: application/json" \
        -d "\"what\":\"user\",\"which\":[\"password\"],\"data\":{\"id\":${id},\"password\":\"${password}\"}}" >/dev/null
}

# Remove um usuario.
filebrowser_remove_user() {
    local token="$1" id="$2"
    curl -fsS -m 10 -X DELETE "${FILEBROWSER_URL}/api/users?id=${id}" \
        -H "Authorization: Bearer ${token}" \
        -H "X-Password: ${FILEBROWSER_ADMIN_PASS}" >/dev/null
}

# Verifica as credenciais de um usuario comum.
# Retorno: 0 validas / 1 invalidas
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
