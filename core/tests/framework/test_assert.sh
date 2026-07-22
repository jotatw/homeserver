#!/usr/bin/env bash

set -euo pipefail

source "./assert.sh"

echo "========================================"
echo " Testando assert_equals()"
echo "========================================"

echo

if assert_equals "HomeServer" "HomeServer"; then
    echo "[PASS] Valores iguais"
else
    echo "[FAIL] Valores iguais"
fi

echo

if assert_equals "Docker" "Linux"; then
    echo "[FAIL] Valores diferentes"
else
    echo "[PASS] Valores diferentes"
fi