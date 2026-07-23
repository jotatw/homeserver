#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "${SCRIPT_DIR}/../bootstrap.sh"

echo "========================================"
echo " HomeServer Core"
echo " Validation Test"
echo "========================================"
echo

echo "Comando bash"

if is_command "bash"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Valor vazio"

if is_empty ""; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Número"

if is_number "12345"; then
    echo "PASS"
else
    echo "FAIL"
fi