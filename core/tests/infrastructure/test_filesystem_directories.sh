#!/usr/bin/env bash

set -euo pipefail

source "../common/test_bootstrap.sh"

TEST_DIR="/tmp/homeserver-test"

echo "========================================"
echo " HomeServer Infrastructure"
echo " Filesystem - Diretórios"
echo "========================================"
echo

echo "Criando diretório..."

if create_directory "${TEST_DIR}"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Verificando diretório..."

if directory_exists "${TEST_DIR}"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Removendo diretório..."

if remove_directory "${TEST_DIR}"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Verificando remoção..."

if ! directory_exists "${TEST_DIR}"; then
    echo "PASS"
else
    echo "FAIL"
fi