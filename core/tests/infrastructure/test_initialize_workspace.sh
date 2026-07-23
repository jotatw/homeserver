#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CORE_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

source "${CORE_ROOT}/bootstrap.sh"

echo "========================================"
echo " HomeServer Infrastructure"
echo " Workspace Test"
echo "========================================"
echo

if initialize_workspace; then
    echo "PASS - Workspace inicializado"
else
    echo "FAIL - Erro ao inicializar"
    exit 1
fi

echo

echo "Verificando diretórios..."

for directory in "${HS_WORKSPACE_DIRS[@]}"; do

    if directory_exists "${directory}"; then
        echo "PASS - ${directory}"
    else
        echo "FAIL - ${directory}"
        exit 1
    fi

done

echo
echo "Workspace validado com sucesso."