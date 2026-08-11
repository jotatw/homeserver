#!/usr/bin/env bash
# ==========================================================
# Testes — Backup (último backup)
# Valida get_backup_last() da Infrastructure (somente leitura).
# ==========================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../bootstrap.sh"

ok()   { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; exit 1; }

echo "== Backup (último backup) =="
echo

LAST="$(get_backup_last)"

if [[ "${LAST}" == "nenhum" ]]; then
    ok "sem backup ainda (instalação nova)"
elif [[ "${LAST}" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    ok "último backup: ${LAST}"
else
    fail "formato inesperado: ${LAST}"
fi

echo
echo "OK"