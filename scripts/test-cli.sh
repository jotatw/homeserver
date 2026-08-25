#!/usr/bin/env bash
# ==========================================================
# HomeServer — Teste de CLI (v1.5 Sprint 6)
#
# Verifica o comportamento do CLI hs: version, update check,
# user verify (credências), user is-admin.
#
# Uso:
#   bash scripts/test-cli.sh
# ==========================================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
HS="${PROJECT_ROOT}/core/hs.sh"

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

# version retorna o identificador do estado git (hash curto do commit).
VERSION=$(bash "${HS}" version 2>/dev/null)
[[ "${VERSION}" =~ ^[0-9a-f]{7,}$ ]]
report "hs version -> ${VERSION}" $?

# update check retorna JSON válido com ok/data (via CLI raw)
CHECK=$(bash "${HS}" update check 2>/dev/null)
echo "${CHECK}" | python3 -c "import json,sys; d=json.load(sys.stdin); assert 'current' in d and 'latest' in d; assert d['update'] in (True, False)" >/dev/null 2>&1
report "hs update check -> JSON válido" $?

# user verify: credenciais corretas (exit 0)
bash "${HS}" user verify "${ADMIN_USER}" "${ADMIN_PASS}" >/dev/null 2>&1
report "hs user verify (admin) -> 0" $?

# user verify: senha errada (exit 1)
bash "${HS}" user verify "${ADMIN_USER}" "senha-errada-xyz" >/dev/null 2>&1
[[ $? -eq 1 ]]
report "hs user verify (senha errada) -> 1" $?

# user is-admin: admin é admin (exit 0)
bash "${HS}" user is-admin "${ADMIN_USER}" >/dev/null 2>&1
report "hs user is-admin (admin) -> 0" $?

# user is-admin: usuário inexistente (exit 1)
bash "${HS}" user is-admin "nao-existe-xyz" >/dev/null 2>&1
[[ $? -eq 1 ]]
report "hs user is-admin (inexistente) -> 1" $?

echo
echo "----------------------------------------"
echo "CLI Tests"
printf "Total : %d\n" $((PASS + FAIL))
printf "PASS  : %d\n" "${PASS}"
printf "FAIL  : %d\n" "${FAIL}"
echo "----------------------------------------"

[[ "${FAIL}" -eq 0 ]]
