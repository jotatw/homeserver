#!/usr/bin/env bash

# ==========================================================
# HomeServer Test Suite
#
# Arquivo......: bootstrap.sh
# Módulo.......: Tests
#
# Objetivo.....:
# Inicializar a infraestrutura da Test Suite.
#
# Responsabilidades:
#   - Localizar diretórios
#   - Carregar o HomeServer Core
#   - Carregar as bibliotecas da Test Suite
#
# Não faz:
#   - Não executa testes
#   - Não imprime mensagens
#
# ==========================================================

# ----------------------------------------------------------
# Guard
# ----------------------------------------------------------

if [[ -n "${HS_TEST_BOOTSTRAP_LOADED:-}" ]]; then
    return 0
fi

readonly HS_TEST_BOOTSTRAP_LOADED=1

# ----------------------------------------------------------
# Shell
# ----------------------------------------------------------

set -euo pipefail

# ----------------------------------------------------------
# Diretórios
# ----------------------------------------------------------

readonly HS_TEST_ROOT="$(
    cd "$(dirname "${BASH_SOURCE[0]}")" &&
    pwd
)"

readonly HS_CORE_ROOT="$(dirname "${HS_TEST_ROOT}")"

readonly HS_PROJECT_ROOT="$(dirname "${HS_CORE_ROOT}")"

readonly HS_TEST_COMMON_DIR="${HS_TEST_ROOT}/common"

readonly HS_TEST_FOUNDATION_DIR="${HS_TEST_ROOT}/foundation"

readonly HS_TEST_INFRASTRUCTURE_DIR="${HS_TEST_ROOT}/infrastructure"

readonly HS_TEST_DOCKER_DIR="${HS_TEST_ROOT}/docker"

readonly HS_TEST_NETWORK_DIR="${HS_TEST_ROOT}/network"

readonly HS_TEST_SERVICES_DIR="${HS_TEST_ROOT}/services"

readonly HS_TEST_DOCS_DIR="${HS_TEST_ROOT}/docs"

# ----------------------------------------------------------
# Core
# ----------------------------------------------------------

source "${HS_CORE_ROOT}/foundation/bootstrap.sh"

# ----------------------------------------------------------
# Framework
# ----------------------------------------------------------

source "${HS_TEST_COMMON_DIR}/runner.sh"

# output.sh
# assert.sh
# utils.sh
#
# Serão adicionados conforme forem implementados.