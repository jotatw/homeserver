#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: config.sh
# Módulo.......: Foundation
#
# Objetivo.....:
# Centralizar os caminhos utilizados pelo HomeServer Core.
#
# Responsabilidades:
#   - Definir diretórios do Core
#   - Definir diretórios do projeto
#
# Não faz:
#   - Não cria diretórios
#   - Não valida caminhos
#   - Não altera arquivos
#
# ==========================================================

# ----------------------------------------------------------
# Core
# ----------------------------------------------------------

readonly HS_CORE_ROOT="${HS_CORE_ROOT}"

# ----------------------------------------------------------
# Projeto
# ----------------------------------------------------------

readonly HS_PROJECT_ROOT="$(dirname "${HS_CORE_ROOT}")"

# ----------------------------------------------------------
# Diretórios do Core
# ----------------------------------------------------------

readonly HS_CORE_FOUNDATION_DIR="${HS_CORE_ROOT}/foundation"

readonly HS_CORE_INFRASTRUCTURE_DIR="${HS_CORE_ROOT}/infrastructure"

readonly HS_CORE_SERVICES_CORE_DIR="${HS_CORE_ROOT}/services"

readonly HS_CORE_OPERATIONS_DIR="${HS_CORE_ROOT}/operations"

readonly HS_CORE_INTERFACE_DIR="${HS_CORE_ROOT}/interface"

readonly HS_CORE_DOCS_DIR="${HS_CORE_ROOT}/docs"

readonly HS_CORE_TESTS_DIR="${HS_CORE_ROOT}/tests"

# ----------------------------------------------------------
# Diretórios do Projeto
# ----------------------------------------------------------

readonly HS_SERVICES_DIR="${HS_PROJECT_ROOT}/services"

readonly HS_CONFIG_DIR="${HS_PROJECT_ROOT}/config"

readonly HS_DATA_DIR="${HS_PROJECT_ROOT}/data"

readonly HS_LOGS_DIR="${HS_PROJECT_ROOT}/logs"

readonly HS_BACKUP_DIR="${HS_PROJECT_ROOT}/backup"

readonly HS_SCRIPTS_DIR="${HS_PROJECT_ROOT}/scripts"

readonly HS_DOCS_ROOT_DIR="${HS_PROJECT_ROOT}/docs"

# ----------------------------------------------------------
# Workspace
# ----------------------------------------------------------

readonly HS_WORKSPACE_DIRECTORIES=(
    "${HS_CONFIG_DIR}"
    "${HS_DATA_DIR}"
    "${HS_LOGS_DIR}"
    "${HS_BACKUP_DIR}"
    "${HS_SERVICES_DIR}"
)