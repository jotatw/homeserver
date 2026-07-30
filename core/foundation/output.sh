#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: output.sh
# Módulo.......: Foundation
#
# Objetivo.....:
# Padronizar a saída de mensagens do HomeServer Core.
#
# Responsabilidades:
#   - Exibir mensagens padronizadas
#
# Não faz:
#   - Não grava logs
#   - Não utiliza cores
#   - Não controla níveis de log
#
# API Pública
#
#   - info
#   - success
#   - warning
#   - error
#
# API Interna
#
#   - _print
#
# ==========================================================

# ----------------------------------------------------------
# Funções Privadas
# ----------------------------------------------------------

#
# Exibe uma mensagem formatada.
#
_print() {

    local level="$1"

    shift

    local message="$*"

    printf "[%s] %s\n" "${level}" "${message}"

}

# ----------------------------------------------------------
# API Pública
# ----------------------------------------------------------

#
# Exibe uma mensagem informativa.
#
info() {

    _print "${HS_LEVEL_INFO}" "$*"

}

#
# Exibe uma mensagem de sucesso.
#
success() {

    _print "${HS_LEVEL_SUCCESS}" "$*"

}

#
# Exibe uma mensagem de aviso.
#
warning() {

    _print "${HS_LEVEL_WARNING}" "$*"

}

#
# Exibe uma mensagem de erro.
#
error() {

    _print "${HS_LEVEL_ERROR}" "$*"
}