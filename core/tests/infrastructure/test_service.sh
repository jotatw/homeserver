#!/usr/bin/env bash
# ==========================================================
# Testes — Services (disponibilidade e ativação)
# Valida as funções migradas para a Infrastructure
# (available/enabled/service_enabled). Somente leitura.
# ==========================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../bootstrap.sh"

ok()   { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; exit 1; }

echo "== Services (disponibilidade e ativação) =="
echo

echo "available_services..."

LIST="$(available_services)"
for s in caddy filebrowser gitea homepage portainer; do
    echo "${LIST}" | grep -qx "${s}" \
        && ok "available_services: ${s}" \
        || fail "available_services não inclui ${s}"
done

echo
echo "enabled_services (config/services.conf)..."

ENABLED="$(enabled_services)"
grep -qx "gitea" <<< "${ENABLED}" \
    && ok "enabled_services: gitea" \
    || fail "enabled_services não inclui gitea"

grep -qx "portainer" <<< "${ENABLED}" \
    && fail "portainer não deveria estar ativado" \
    || ok "portainer não está ativado"

echo
echo "service_enabled..."

service_enabled "caddy" \
    && ok "caddy está ativado" \
    || fail "caddy deveria estar ativado"

if service_enabled "portainer"; then
    fail "portainer não deveria estar ativado"
else
    ok "portainer não está ativado"
fi

echo
echo "OK"