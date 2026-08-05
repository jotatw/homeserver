#!/usr/bin/env bash
# ==========================================================
# HomeServer — Testes de Integração (v1.5 Sprint 6)
#
# Roda: smoke, CLI e API. Para uso após instalação/deploy.
#
# Uso:
#   bash scripts/run-integration.sh
#
# Retorno:
#   0 -> todos passaram
#   1 -> algum falhou
# ==========================================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

FAIL=0

run() {
    local name="$1"
    local script="$2"

    echo
    echo "========================================"
    echo " ${name}"
    echo "========================================"

    if bash "${script}"; then
        echo "[${name}] PASS"
    else
        echo "[${name}] FAIL"
        FAIL=1
    fi
}

run "Smoke"     "${SCRIPT_DIR}/smoke-test.sh"
run "CLI"       "${SCRIPT_DIR}/test-cli.sh"
run "API"       "${SCRIPT_DIR}/test-api.sh"

echo
echo "========================================"
echo " Integration Summary"
if [[ "${FAIL}" -eq 0 ]]; then
    echo " ALL PASSED"
else
    echo " SOME FAILED"
fi
echo "========================================"

exit "${FAIL}"
