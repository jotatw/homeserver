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
#   - Autenticacao (login do admin, com cache de token)
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
#   FILEBROWSER_TOKEN_TTL  (default 300 segundos)
#
# Notas da API Quantum (diferem do original):
#   - login: POST /api/auth/login?username=U com header X-Password
#   - token: Authorization: Bearer ***
#   - confirmacao admin: header X-Password nas operacoes sensiveis
#   - criacao de usuario NAO define senha; requer PUT separado
#
# Cache de token:
#   Cada invocacao de `hs` e um processo novo, entao cache apenas
#   em memoria nao reduz os logins entre operacoes consecutivas
#   (rajadas de login causam 429 no Quantum). O token fica em
#   arquivo sob ${TMPDIR:-/tmp}, perms 600, gravacao atomica e TTL
#   curto. O container da API e o host CLI tem /tmp separados:
#   cada ambiente mantem seu proprio cache, sem conflito de dono.
#   `filebrowser_login --refresh` força relogin.
#
# Saidas JSON sao compactadas (tr -d espacos/newlines) para
# extracoes sed/grep estaveis. Normalizacao complexa fica na
# camada API (TypeScript).
#
# ==========================================================

FILEBROWSER_URL="${FILEBROWSER_URL:-http://localhost:8080}"
FILEBROWSER_ADMIN_USER="${FILEBROWSER_ADMIN_USER:-admin}"
FILEBROWSER_TOKEN_TTL="${FILEBROWSER_TOKEN_TTL:-300}"
_FB_TOKEN_CACHE="${TMPDIR:-/tmp}/hs-filebrowser-token"

if [[ -f /srv/scripts/fb-credentials.env ]]; then
    # shellcheck source=/dev/null
    source /srv/scripts/fb-credentials.env
fi

filebrowser_available() {
    command -v curl >/dev/null 2>&1
}

# Autentica o admin e retorna o token (JWT).
# Usa cache em arquivo com TTL; --refresh força novo login.
filebrowser_login() {
    local refresh="${1:-}"
    local cached ts now token

    if [[ "${refresh}" != "--refresh" ]]; then
        if cached="$(cat "${_FB_TOKEN_CACHE}" 2>/dev/null)" && [[ -n "${cached}" ]]; then
            ts="${cached%%|*}"
            token="${cached#*|}"
            if [[ "${ts}" =~ ^[0-9]+$ && -n "${token}" ]]; then
                now="$(date +%s)"
                if (( now - ts < FILEBROWSER_TOKEN_TTL )); then
                    printf '%s' "${token}"
                    return 0
                fi
            fi
        fi
    fi

    if [[ -z "${FILEBROWSER_ADMIN_PASS:-}" ]]; then
        echo "Credenciais do FileBrowser nao configuradas." >&2
        return 1
    fi

    token="$(curl -fsS -m 10 -X POST \
        "${FILEBROWSER_URL}/api/auth/login?username=${FILEBROWSER_ADMIN_USER}&recaptcha=" \
        -H "X-Password: ${FILEBROWSER_ADMIN_PASS}")" || {
        _fb_token_invalidate
        return 1
    }

    # Gravacao atomica; falha silenciosa (ex.: sticky bit de outro
    # dono em /tmp) apenas desliga o cache, sem afetar a operacao.
    (
        umask 077
        printf '%s|%s' "$(date +%s)" "${token}" > "${_FB_TOKEN_CACHE}.tmp.$$" &&
            mv -f "${_FB_TOKEN_CACHE}.tmp.$$" "${_FB_TOKEN_CACHE}"
    ) 2>/dev/null || true

    printf '%s' "${token}"
}

# Invalida o cache de token (uso interno em 401/falha de login).
_fb_token_invalidate() {
    rm -f "${_FB_TOKEN_CACHE}" "${_FB_TOKEN_CACHE}".tmp.* 2>/dev/null || true
}

# Lista usuarios (JSON cru compactado do Quantum).
# Em falha com token cacheado, renova uma vez antes de desistir.
filebrowser_list_users() {
    local out
    if out="$(curl -fsS -m 10 "${FILEBROWSER_URL}/api/users" \
        -H "Authorization: Bearer $(filebrowser_login)" 2>/dev/null)"; then
        printf '%s' "${out}" | tr -d ' \n\t'
        return 0
    fi
    filebrowser_login --refresh >/dev/null || return 1
    curl -fsS -m 10 "${FILEBROWSER_URL}/api/users" \
        -H "Authorization: Bearer $(filebrowser_login)" \
        | tr -d ' \n\t'
}

# Retorna o id de um usuario pelo nome (ou vazio).
# Parse estrutural (node/python3); sed apenas como ultimo recurso,
# pois depende da ordem das chaves no JSON do Quantum.
filebrowser_user_id() {
    local username="$1"
    local out
    out="$(filebrowser_list_users)" || return 0

    if command -v node >/dev/null 2>&1; then
        printf '%s' "${out}" | node -e '
const name = process.argv[1];
let d = "";
process.stdin.on("data", c => d += c);
process.stdin.on("end", () => {
  try {
    const u = JSON.parse(d).find(x => x.username === name);
    process.stdout.write(u && u.id !== undefined ? String(u.id) : "");
  } catch { }
});' "${username}"
    elif command -v python3 >/dev/null 2>&1; then
        printf '%s' "${out}" | FB_USERNAME="${username}" python3 -c "
import json, os, sys
try:
    users = json.load(sys.stdin)
except Exception:
    raise SystemExit(0)
name = os.environ['FB_USERNAME']
u = next((x for x in users if x.get('username') == name), None)
sys.stdout.write(str(u['id']) if u else '')
"
    else
        printf '%s' "${out}" \
            | sed -n 's/.*"id":\([0-9]*\),"username":"'"${username}"'.*/\1/p' \
            | head -n 1
    fi
}

# Cria um usuario (conta SEM senha; aplicar depois via update_password).
filebrowser_create_user() {
    local token="$1" username="$2" scope="$3"
    curl -fsS -m 10 -X POST "${FILEBROWSER_URL}/api/users" \
        -H "Authorization: Bearer ${token}" \
        -H "X-Password: ${FILEBROWSER_ADMIN_PASS}" \
        -H "Content-Type: application/json" \
        -d "{\"what\":\"user\",\"which\":[],\"data\":{\"username\":\"${username}\",\"scopes\":[{\"name\":\"Storage\",\"scope\":\"${scope}\"}],\"lockPassword\":false,\"permissions\":{\"api\":false,\"admin\":false,\"modify\":true,\"share\":true,\"realtime\":false,\"delete\":true,\"create\":true,\"download\":true},\"locale\":\"ptBR\",\"viewMode\":\"normal\",\"singleClick\":false}}" >/dev/null
}

# Define/altera a senha de um usuario.
filebrowser_update_password() {
    local token="$1" id="$2" password="$3"
    curl -fsS -m 10 -X PUT "${FILEBROWSER_URL}/api/users?id=${id}" \
        -H "Authorization: Bearer ${token}" \
        -H "X-Password: ${FILEBROWSER_ADMIN_PASS}" \
        -H "Content-Type: application/json" \
        -d "{\"what\":\"user\",\"which\":[\"password\"],\"data\":{\"id\":${id},\"password\":\"${password}\"}}" >/dev/null
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
