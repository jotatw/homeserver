#!/usr/bin/env bash

# ==========================================================
# HomeServer Test Suite
#
# Arquivo......: bootstrap.sh
# Módulo.......: Tests
#
# Objetivo:
# Inicializar a infraestrutura da Test Suite.
# ==========================================================

if [[ -n "${HS_TEST_BOOTSTRAP_LOADED:-}" ]]; then
    return 0
fi

readonly HS_TEST_BOOTSTRAP_LOADED=1

set -euo pipefail

HS_TEST_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HS_CORE_ROOT="$(dirname "${HS_TEST_ROOT}")"
HS_PROJECT_ROOT="$(dirname "${HS_CORE_ROOT}")"

readonly HS_TEST_ROOT
readonly HS_CORE_ROOT
readonly HS_PROJECT_ROOT

readonly HS_TEST_COMMON_DIR="${HS_TEST_ROOT}/common"

# Core bootstrap (Foundation + Infrastructure)
source "${HS_CORE_ROOT}/bootstrap.sh"
_load_infrastructure || return 1

# Framework de testes
source "${HS_TEST_COMMON_DIR}/runner.sh"
