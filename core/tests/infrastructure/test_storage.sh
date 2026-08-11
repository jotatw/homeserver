#!/usr/bin/env bash
# ==========================================================
# Testes — Storage (status)
# Valida storage_status_json() da Infrastructure (somente leitura).
# ==========================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../bootstrap.sh"

ok()   { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; exit 1; }

echo "== Storage (status) =="
echo

JSON="$(storage_status_json)"

echo "${JSON}" | python3 -c "
import json,sys
d=json.load(sys.stdin)
assert 'root' in d, 'root ausente'
assert 'ready' in d, 'ready ausente'
print('JSON válido, root:', d['root'])
" >/dev/null 2>&1 && ok "storage_status_json é JSON válido" || fail "storage_status_json inválido"

echo "${JSON}" | python3 -c "
import json,sys
d=json.load(sys.stdin)
assert d['root'] == '/srv/storage', 'root inesperado'
" >/dev/null 2>&1 && ok "root = /srv/storage" || fail "root inesperado"

echo
echo "OK"