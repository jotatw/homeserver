#!/usr/bin/env bash

set -euo pipefail

source "../../../bootstrap.sh"

echo "========================================"
echo " HomeServer Core"
echo " Validation Test"
echo "========================================"
echo

echo "Arquivo bootstrap.sh"

if is_file "${HS_CORE_ROOT}/bootstrap.sh"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Diretório common"

if is_directory "${HS_COMMON_DIR}"; then
    echo "PASS"
else
    echo "FAIL"
fi

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