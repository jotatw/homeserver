#!/usr/bin/env bash

set -euo pipefail

TEST_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CORE_ROOT="$(cd "${TEST_ROOT}/../.." && pwd)"

source "${CORE_ROOT}/bootstrap.sh"

echo "==========================="
echo " Bootstrap Test"
echo "==========================="
echo

echo "HS_CORE_ROOT"

echo "    ${HS_CORE_ROOT}"

echo

echo "Bootstrap carregado com sucesso."