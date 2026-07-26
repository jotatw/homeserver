#!/usr/bin/env bash

# ==============================================================================
# HomeServer
# Componente : Context
# Módulo     : Runtime Context
#
# Descrição:
#   Fornece um contexto de execução em memória para o Provisioning Engine.
#
# Responsabilidades:
#   - Armazenar informações da execução
#   - Recuperar valores
#   - Remover valores
#   - Validar o contexto
#
# Não Responsabilidades:
#   - Ler manifestos
#   - Executar operações
#   - Persistir dados
# ==============================================================================

set -Eeuo pipefail

# ==============================================================================
# Imports
# ==============================================================================

# shellcheck source=/dev/null
source "${HS_FOUNDATION_DIR}/constants.sh"
source "${HS_FOUNDATION_DIR}/validation.sh"

# ==============================================================================
# Constants
# ==============================================================================

readonly HS_CONTEXT_NAME="runtime"

# ==============================================================================
# Storage
# ==============================================================================

declare -gA HS_RUNTIME_CONTEXT=()

# ==============================================================================
# Public API
# ==============================================================================

##
# Initializes the runtime context.
#
context_create() {

    _context_initialize
}

context_clear() {

    _context_initialize
}

##
# Destroys the runtime context.
#
context_destroy() {

    _context_initialize

    return "${HS_EXIT_SUCCESS}"
}

##
# Stores a value.
#
# Arguments:
#   $1 Key
#   $2 Value
#
context_set() {

    local key="${1:?missing key}"
    local value="${2:?missing value}"

    _context_validate_key "${key}"
    _context_validate_value "${value}"

    HS_RUNTIME_CONTEXT["${key}"]="${value}"

    return "${HS_EXIT_SUCCESS}"
}

##
# Returns a stored value.
#
# Arguments:
#   $1 Key
#
context_get() {

    local key="${1:?missing key}"

    _context_validate_key "${key}"

    if ! context_exists "${key}"; then
        return "${HS_EXIT_NOT_FOUND}"
    fi

    printf '%s\n' "${HS_RUNTIME_CONTEXT["${key}"]}"
}

##
# Checks whether a key exists.
#
# Arguments:
#   $1 Key
#
context_exists() {

    local key="${1:?missing key}"

    _context_validate_key "${key}"

    [[ -v HS_RUNTIME_CONTEXT["${key}"] ]]
}

##
# Removes a key.
#
context_remove() {

    local key="${1:?missing key}"

    _context_validate_key "${key}"

    unset 'HS_RUNTIME_CONTEXT[$key]'

    return "${HS_EXIT_SUCCESS}"
}

##
# Lists all keys.
#
context_keys() {

    printf '%s\n' "${!HS_RUNTIME_CONTEXT[@]}"
}

##
# Returns the number of stored entries.
#
context_count() {

    printf '%d\n' "${#HS_RUNTIME_CONTEXT[@]}"
}

##
# Validates the runtime context.
#
context_validate() {

    declare -p HS_RUNTIME_CONTEXT >/dev/null

    return "${HS_EXIT_SUCCESS}"
}

# ==============================================================================
# Private API
# ==============================================================================

_context_validate_key() {

    local key="${1}"

    [[ -n "${key}" ]] \
        || return "${HS_EXIT_INVALID_ARGUMENT}"

    [[ "${key}" =~ ^[a-zA-Z0-9_]+$ ]] \
        || return "${HS_EXIT_INVALID_ARGUMENT}"
}

_context_validate_value() {

    local value="${1}"

    [[ -n "${value}" ]] \
        || return "${HS_EXIT_INVALID_ARGUMENT}"
}

# ==============================================================================
# End of File
# ==============================================================================

return 0