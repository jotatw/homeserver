#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../bootstrap.sh"

TEST_DIR="/tmp/homeserver-test"

echo "========================================"
echo " HomeServer Infrastructure"
echo " Filesystem - Diretórios"
echo "========================================"
echo

echo "Criando diretório..."

if hs_fs_create_directory "${TEST_DIR}"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Verificando diretório..."

if hs_fs_directory_exists "${TEST_DIR}"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Removendo diretório..."

if hs_fs_remove_directory "${TEST_DIR}"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Verificando remoção..."

if ! hs_fs_directory_exists "${TEST_DIR}"; then
    echo "PASS"
else
    echo "FAIL"
fi
