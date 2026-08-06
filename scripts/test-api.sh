#!/usr/bin/env bash
# ==========================================================
# HomeServer — Teste de API (v1.5 Sprint 6)
#
# Valida o contrato padronizado ok/data nas rotas principais,
# autenticação e proteção por escopo.
#
# Uso:
#   bash scripts/test-api.sh
# ==========================================================

set -uo pipefail

API="${API_URL:-http://localhost:8000}"
ADMIN_USER="${HS_ADMIN_USER:-joao}"
ADMIN_PASS="${HS_ADMIN_PASS:-Biel2004}"

PASS=0
FAIL=0

report() {
    local label="$1"
    local status="$2"

    if [[ "${status}" -eq 0 ]]; then
        printf "%-55s [PASS]\n" "${label}"
        ((++PASS))
    else
        printf "%-55s [FAIL]\n" "${label}"
        ((++FAIL))
    fi
}

# 1. /version público retorna ok/data
BODY=$(curl -sf -m 5 "${API}/api/v1/version" 2>/dev/null)
echo "${BODY}" | python3 -c "import json,sys; d=json.load(sys.stdin); assert d['ok'] is True and 'data' in d" >/dev/null 2>&1
report "GET /version -> {ok,data}" $?

# 2. /status sem token -> 401
CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "${API}/api/v1/status")
[[ "${CODE}" == "401" ]]
report "GET /status sem token -> 401" $?

# 3. login inválido -> 401 com mensagem neutra (não revela se o usuário existe)
RESP=$(curl -s -w "\n%{http_code}" -m 5 -X POST "${API}/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"x","password":"y"}' 2>/dev/null)
BODY=$(printf '%s' "${RESP}" | head -n -1)
CODE=$(printf '%s' "${RESP}" | tail -n 1)
[[ "${CODE}" == "401" ]]
report "POST /auth/login inválido -> 401" $?
echo "${BODY}" | python3 -c "import json,sys; d=json.load(sys.stdin); assert d['ok'] is False and 'error' in d" >/dev/null 2>&1
report "POST /auth/login inválido -> mensagem neutra {ok:false,error}" $?

# 3b. body incompleto -> 400
CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 -X POST "${API}/api/v1/auth/login" \
    -H "Content-Type: application/json" -d '{"username":"x"}')
[[ "${CODE}" == "400" ]]
report "POST /auth/login sem password -> 400" $?

# 4. login válido -> ok/data com token, user e expiresIn
BODY=$(curl -sf -m 5 -X POST "${API}/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"${ADMIN_USER}\",\"password\":\"${ADMIN_PASS}\"}" 2>/dev/null)
TOKEN=$(echo "${BODY}" | python3 -c "import json,sys; print(json.load(sys.stdin).get('data',{}).get('token',''))" 2>/dev/null)
[[ -n "${TOKEN}" ]]
report "POST /auth/login -> token" $?

if [[ -n "${TOKEN}" ]]; then
    # 4b. login retorna user {username, admin} e expiresIn
    echo "${BODY}" | python3 -c "
import json,sys
d=json.load(sys.stdin)['data']
u=d['user']
assert d.get('expiresIn',0) > 0, 'expiresIn ausente'
assert u.get('username'), 'user.username ausente'
assert 'admin' in u, 'user.admin ausente'
assert isinstance(u['admin'], bool), 'admin deve ser bool'
" >/dev/null 2>&1
    report "POST /auth/login -> data.user {username, admin} + expiresIn" $?

    AUTH="Authorization: Bearer ${TOKEN}"

    # 5. rotas de leitura (login) retornam ok/data
    for route in status storage services devices events; do
        BODY=$(curl -sf -m 5 "${API}/api/v1/${route}" -H "${AUTH}" 2>/dev/null)
        echo "${BODY}" | python3 -c "import json,sys; d=json.load(sys.stdin); assert d['ok'] is True and 'data' in d" >/dev/null 2>&1
        report "GET /${route} -> {ok,data}" $?
    done

    # 6. rotas admin retornam ok/data
    BODY=$(curl -sf -m 5 "${API}/api/v1/users" -H "${AUTH}" 2>/dev/null)
    echo "${BODY}" | python3 -c "import json,sys; d=json.load(sys.stdin); assert d['ok'] is True and 'data' in d" >/dev/null 2>&1
    report "GET /users (admin) -> {ok,data}" $?

    # 6b. devices admin: validação de body (400 sem campos)
    CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 -X POST "${API}/api/v1/devices/mount" -H "${AUTH}" -H "Content-Type: application/json" -d '{}')
    [[ "${CODE}" == "400" ]]
    report "POST /devices/mount sem body -> 400" $?

    CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 -X POST "${API}/api/v1/devices/unmount" -H "${AUTH}" -H "Content-Type: application/json" -d '{}')
    [[ "${CODE}" == "400" ]]
    report "POST /devices/unmount sem body -> 400" $?

    CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 -X POST "${API}/api/v1/devices/eject" -H "${AUTH}" -H "Content-Type: application/json" -d '{}')
    [[ "${CODE}" == "400" ]]
    report "POST /devices/eject sem body -> 400" $?

    # 6c. tokens de API (admin)
    BODY=$(curl -sf -m 5 "${API}/api/v1/tokens" -H "${AUTH}" 2>/dev/null)
    echo "${BODY}" | python3 -c "import json,sys; d=json.load(sys.stdin); assert d['ok'] is True and 'data' in d" >/dev/null 2>&1
    report "GET /tokens (admin) -> {ok,data}" $?

    CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 -X POST "${API}/api/v1/tokens" -H "${AUTH}" -H "Content-Type: application/json" -d '{}')
    [[ "${CODE}" == "400" ]]
    report "POST /tokens sem name -> 400" $?

    TKBODY=$(curl -sf -m 5 -X POST "${API}/api/v1/tokens" -H "${AUTH}" -H "Content-Type: application/json" -d '{"name":"test-ci"}' 2>/dev/null)
    TKTOKEN=$(echo "${TKBODY}" | python3 -c "import json,sys; print(json.load(sys.stdin)['data'].get('token',''))" 2>/dev/null)
    TKID=$(echo "${TKBODY}" | python3 -c "import json,sys; print(json.load(sys.stdin)['data'].get('id',''))" 2>/dev/null)
    [[ -n "${TKTOKEN}" && "${TKTOKEN}" == hs_token_* ]]
    report "POST /tokens -> cria token hs_token_*" $?

    # token de API autentica (leitura, não-admin)
    CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "${API}/api/v1/status" -H "Authorization: Bearer ${TKTOKEN}")
    [[ "${CODE}" == "200" ]]
    report "GET /status com token de API -> 200 (integração)" $?

    # token de API não acessa rota admin (403)
    CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "${API}/api/v1/users" -H "Authorization: Bearer ${TKTOKEN}")
    [[ "${CODE}" == "403" ]]
    report "GET /users com token de API -> 403 (não-admin)" $?

    # revoga e invalida
    if [[ -n "${TKID}" ]]; then
        CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 -X DELETE "${API}/api/v1/tokens/${TKID}" -H "${AUTH}")
        [[ "${CODE}" == "200" ]]
        report "DELETE /tokens/:id -> revoga" $?
        CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "${API}/api/v1/status" -H "Authorization: Bearer ${TKTOKEN}")
        [[ "${CODE}" == "401" ]]
        report "GET /status com token revogado -> 401" $?
    fi

    # 7. session retorna user {username, admin} + expiresIn
    BODY=$(curl -sf -m 5 "${API}/api/v1/auth/session" -H "${AUTH}" 2>/dev/null)
    echo "${BODY}" | python3 -c "
import json,sys
d=json.load(sys.stdin)['data']
u=d['user']
assert u.get('username') == '${ADMIN_USER}', 'username errado'
assert u.get('admin') is True, 'admin deve ser True'
assert d.get('expiresIn',0) > 0, 'expiresIn ausente'
" >/dev/null 2>&1
    report "GET /auth/session -> user {username, admin} + expiresIn" $?

    # 7b. token inexistente -> 401
    CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "${API}/api/v1/status" \
        -H "Authorization: Bearer abcdef1234567890")
    [[ "${CODE}" == "401" ]]
    report "GET /status com token inexistente -> 401" $?

    # 7c. token malformado (sem Bearer) -> 401
    CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "${API}/api/v1/status" \
        -H "Authorization: ${TOKEN}")
    [[ "${CODE}" == "401" ]]
    report "GET /status com header malformado -> 401" $?

    # 8. logout retorna ok
    CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 -X POST "${API}/api/v1/auth/logout" -H "${AUTH}")
    [[ "${CODE}" == "200" ]]
    report "POST /auth/logout -> 200" $?

    # 8b. sessão destruída: GET /auth/session após logout -> 401
    CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "${API}/api/v1/auth/session" -H "${AUTH}")
    [[ "${CODE}" == "401" ]]
    report "GET /auth/session após logout (destruída) -> 401" $?

    # 9. após logout, token inválido -> 401
    CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "${API}/api/v1/status" -H "${AUTH}")
    [[ "${CODE}" == "401" ]]
    report "GET /status após logout -> 401" $?
fi

echo
echo "----------------------------------------"
echo "API Tests"
printf "Total : %d\n" $((PASS + FAIL))
printf "PASS  : %d\n" "${PASS}"
printf "FAIL  : %d\n" "${FAIL}"
echo "----------------------------------------"

[[ "${FAIL}" -eq 0 ]]
