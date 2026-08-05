#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../bootstrap.sh"

TEST_DIR="/tmp/homeserver-test"
TEST_FILE="${TEST_DIR}/arquivo.txt"
COPY_FILE="${TEST_DIR}/arquivo-copy.txt"
MOVE_FILE="${TEST_DIR}/arquivo-move.txt"

echo "========================================"
echo " HomeServer Infrastructure"
echo " Filesystem - Arquivos"
echo "========================================"
echo

hs_fs_create_directory "${TEST_DIR}"

echo "Criando arquivo..."

if hs_fs_create_file "${TEST_FILE}"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Verificando arquivo..."

if hs_fs_file_exists "${TEST_FILE}"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Copiando arquivo..."

if hs_fs_copy_file "${TEST_FILE}" "${COPY_FILE}"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Movendo arquivo..."

if hs_fs_move_file "${COPY_FILE}" "${MOVE_FILE}"; then
    echo "PASS"
else
    echo "FAIL"
fi

echo

echo "Removendo arquivos..."

hs_fs_remove_file "${TEST_FILE}"
hs_fs_remove_file "${MOVE_FILE}"
hs_fs_remove_directory "${TEST_DIR}"

echo "PASS"
