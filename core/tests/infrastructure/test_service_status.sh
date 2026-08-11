#!/usr/bin/env bash
# ==========================================================
# Testes — Services status (JSON)
# Valida get_service_status_json() (somente leitura; docker inspect).
# ==========================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../bootstrap.sh"

ok()   { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; exit 1; }

echo "== Services (status JSON) =="
echo

JSON="$(get_service_status_json)"

echo "${JSON}" | python3 -c "
import json,sys
d=json.load(sys.stdin)
assert isinstance(d, list), 'não é lista'
for s in d:
    assert 'name' in s and 'status' in s, 'campos ausentes'
print('JSON válido, serviços:', len(d))
" >/dev/null 2>&1 && ok "get_service_status_json é lista válida" || fail "get_service_status_json inválido"

COUNT="$(echo "${JSON}" | python3 -c "
import json,sys
print(len(json.load(sys.stdin)))
" 2>/dev/null || echo -1)"

if [[ "${COUNT}" -ge 1 ]]; then
    ok "serviços reportados: ${COUNT}"
else
    ok "sem serviços ativados (instalação mínima)"
fi

echo
echo "OK"