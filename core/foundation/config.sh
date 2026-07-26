#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: config.sh
# Módulo.......: Foundation
#
# Objetivo.....:
# Centralizar a configuração estática do HomeServer Core.
#
# Responsabilidades:
#   - Definir caminhos do Core
#   - Definir caminhos do projeto
#   - Disponibilizar configurações compartilhadas
#
# Não Responsabilidades:
#   - Não cria diretórios
#   - Não valida caminhos
#   - Não altera arquivos
#
# Dependências:
#   - HS_CORE_ROOT
#
# ==========================================================

# ----------------------------------------------------------
# Core
# ----------------------------------------------------------

readonly HS_CORE_ROOT="${HS_CORE_ROOT}"

# ----------------------------------------------------------
# Projeto
# ----------------------------------------------------------

#
# Estrutura esperada:
#
# project/
# ├── core/
# ├── config/
# ├── data/
# └── ...
#
readonly HS_PROJECT_ROOT="$(dirname "${HS_CORE_ROOT}")"

# ----------------------------------------------------------
# Diretórios do Core
# ----------------------------------------------------------

readonly HS_CORE_FOUNDATION_DIR="${HS_CORE_ROOT}/foundation"
readonly HS_CORE_INFRASTRUCTURE_DIR="${HS_CORE_ROOT}/infrastructure"
readonly HS_CORE_COMPONENTS_DIR="${HS_CORE_ROOT}/components"
readonly HS_CORE_PROVISIONING_DIR="${HS_CORE_ROOT}/provisioning"
readonly HS_CORE_APPLICATIONS_DIR="${HS_CORE_ROOT}/applications"
readonly HS_CORE_INTERFACE_DIR="${HS_CORE_ROOT}/interface"
readonly HS_CORE_TESTS_DIR="${HS_CORE_ROOT}/tests"
readonly HS_CORE_DOCS_DIR="${HS_CORE_ROOT}/docs"

# ----------------------------------------------------------
# Diretórios do Projeto
# ----------------------------------------------------------

readonly HS_PROJECT_CONFIG_DIR="${HS_PROJECT_ROOT}/config"
readonly HS_PROJECT_DATA_DIR="${HS_PROJECT_ROOT}/data"
readonly HS_PROJECT_LOGS_DIR="${HS_PROJECT_ROOT}/logs"
readonly HS_PROJECT_BACKUP_DIR="${HS_PROJECT_ROOT}/backup"
readonly HS_PROJECT_SERVICES_DIR="${HS_PROJECT_ROOT}/services"
readonly HS_PROJECT_SCRIPTS_DIR="${HS_PROJECT_ROOT}/scripts"
readonly HS_PROJECT_DOCS_DIR="${HS_PROJECT_ROOT}/docs"

# ----------------------------------------------------------
# Workspace
# ----------------------------------------------------------

readonly HS_WORKSPACE_DIRECTORIES=(
    "${HS_PROJECT_CONFIG_DIR}"
    "${HS_PROJECT_DATA_DIR}"
    "${HS_PROJECT_LOGS_DIR}"
    "${HS_PROJECT_BACKUP_DIR}"
    "${HS_PROJECT_SERVICES_DIR}"
)