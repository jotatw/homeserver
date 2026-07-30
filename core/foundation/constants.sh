#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: constants.sh
# Módulo.......: Foundation
#
# Objetivo.....:
# Centralizar todas as constantes utilizadas pelo
# HomeServer Core.
#
# Responsabilidades:
#   - Definir constantes globais
#   - Padronizar valores compartilhados
#   - Evitar valores mágicos no código
#
# Este arquivo não deve conter funções.
#
# ==========================================================

# ----------------------------------------------------------
# Projeto
# ----------------------------------------------------------

readonly HS_PROJECT_NAME="HomeServer"
readonly HS_PROJECT_DESCRIPTION="Simple HomeServer Platform"

# ----------------------------------------------------------
# Versão
# ----------------------------------------------------------

readonly HS_CORE_VERSION="0.1.0"

# ----------------------------------------------------------
# Status utilizados para representar o resultado de operações.
# ----------------------------------------------------------

readonly HS_STATUS_OK="OK"
readonly HS_STATUS_WARNING="WARNING"
readonly HS_STATUS_ERROR="ERROR"
readonly HS_STATUS_INFO="INFO"

# ----------------------------------------------------------
# Exit Codes
# ----------------------------------------------------------

readonly HS_EXIT_SUCCESS=0
readonly HS_EXIT_FAILURE=1
readonly HS_EXIT_INVALID_ARGUMENT=2
readonly HS_EXIT_NOT_FOUND=3
readonly HS_EXIT_PERMISSION_DENIED=4
readonly HS_EXIT_CONFIGURATION_ERROR=5

# ----------------------------------------------------------
# Valores Padrão
# ----------------------------------------------------------

readonly HS_DEFAULT_TIMEOUT=30
readonly HS_DEFAULT_RETRIES=3

# ----------------------------------------------------------
# Níveis utilizados pelo sistema de logging.
# ----------------------------------------------------------

readonly HS_LEVEL_INFO="INFO"
readonly HS_LEVEL_SUCCESS="SUCCESS"
readonly HS_LEVEL_WARNING="WARNING"
readonly HS_LEVEL_ERROR="ERROR"