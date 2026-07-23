#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "${SCRIPT_DIR}/../bootstrap.sh"

echo "================================="
echo " HomeServer Core"
echo " Loader Test"
echo "================================="
echo

echo "Core carregado com sucesso."

echo
echo "HS_CORE_ROOT"
echo "    ${HS_CORE_ROOT}"

echo
echo "Teste concluído com sucesso."