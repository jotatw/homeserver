#!/usr/bin/env bash
# ==========================================================
# HomeServer — Smoke Tests (v1.5 Sprint 6)
#
# Verifica rapidamente que o sistema está operacional:
#   CLI, Homepage, API, Storage, Users
#
# Uso:
#   bash scripts/smoke-test.sh
#
# Retorno:
#   0 -> tudo ok
#   1 -> alguma falha
# ==========================================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

API="${API_URL:-http://localhost:8000}"
HOMEPAGE="${HOMEPAGE_URL:-http://localhost:3000}"
ADMIN_USER="${HS_ADMIN_USER:-}"
ADMIN_PASS="${HS_ADMIN_PASS:-}"

if [[ -z "${ADMIN_USER}" || -z "${ADMIN_PASS}" ]]; then
    API_ENV="${PROJECT_ROOT:-${SCRIPT_DIR}/..}/api/.env"
    if [[ -f "${API_ENV}" ]]; then
        [[ -z "${ADMIN_USER}" ]] && ADMIN_USER="$(sed -n 's/^FILEBROWSER_ADMIN_USER=//p' "${API_ENV}" | head -1)"
        [[ -z "${ADMIN_PASS}" ]] && ADMIN_PASS="$(sed -n 's/^FILEBROWSER_ADMIN_PASS=//p' "${API_ENV}" | head -1)"
    fi
fi

if [[ -z "${ADMIN_USER}" || -z "${ADMIN_PASS}" ]]; then
    echo "Erro: defina HS_ADMIN_USER e HS_ADMIN_PASS (ou configure api/.env com FILEBROWSER_ADMIN_USER/PASS)." >&2
    exit 1
fi

PASS=0
FAIL=0

report() {
    local label="$1"
    local status="$2"

    if [[ "${status}" -eq 0 ]]; then
        printf "%-50s [PASS]\n" "${label}"
        ((++PASS))
    else
        printf "%-50s [FAIL]\n" "${label}"
        ((++FAIL))
    fi
}

# 1. CLI
if bash "${PROJECT_ROOT}/core/hs.sh" version >/dev/null 2>&1; then
    report "CLI: hs version" 0
else
    report "CLI: hs version" 1
fi

# 2. Homepage responde
if curl -sf -o /dev/null -m 5 "${HOMEPAGE}"; then
    report "Homepage: responde" 0
else
    report "Homepage: responde" 1
fi

# 3. API: version público
if curl -sf -m 5 "${API}/api/v1/version" 2>/dev/null | grep -q '"ok":true'; then
    report "API: /version retorna ok/data" 0
else
    report "API: /version retorna ok/data" 1
fi

# 4. API: login
BODY=$(curl -sf -m 5 -X POST "${API}/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"${ADMIN_USER}\",\"password\":\"${ADMIN_PASS}\"}" 2>/dev/null)
TOKEN=$(echo "${BODY}" | python3 -c "import json,sys; print(json.load(sys.stdin).get('data',{}).get('token',''))" 2>/dev/null)
if [[ -n "${TOKEN}" ]]; then
    report "API: login gera token" 0
else
    report "API: login gera token" 1
fi

if [[ -n "${TOKEN}" ]]; then
    AUTH="Authorization: Bearer ${TOKEN}"

    # 5. API: storage (login)
    if curl -sf -m 5 "${API}/api/v1/storage" -H "${AUTH}" 2>/dev/null | grep -q '"ok":true'; then
        report "API: /storage (login)" 0
    else
        report "API: /storage (login)" 1
    fi

    # 6. API: users (admin)
    if curl -sf -m 5 "${API}/api/v1/users" -H "${AUTH}" 2>/dev/null | grep -q '"ok":true'; then
        report "API: /users (admin)" 0
    else
        report "API: /users (admin)" 1
    fi

    # 7. API: status (login)
    if curl -sf -m 5 "${API}/api/v1/status" -H "${AUTH}" 2>/dev/null | grep -q '"ok":true'; then
        report "API: /status (login)" 0
    else
        report "API: /status (login)" 1
    fi
fi

# Resumo
echo
echo "----------------------------------------"
echo "Smoke Tests"
printf "Total : %d\n" $((PASS + FAIL))
printf "PASS  : %d\n" "${PASS}"
printf "FAIL  : %d\n" "${FAIL}"
echo "----------------------------------------"

[[ "${FAIL}" -eq 0 ]]
