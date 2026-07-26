#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: context.sh
# Módulo.......: Components
#
# Objetivo.....:
# Armazenar informações temporárias durante a execução
# do HomeServer Core.
#
# Responsabilidades:
#   - Armazenar pares chave/valor
#   - Recuperar valores
#   - Verificar existência de chaves
#   - Remover valores
#   - Limpar o contexto
#
# Não Responsabilidades:
#   - Persistir dados
#   - Ler arquivos
#   - Executar operações
#   - Validar regras de negócio
#
# API Pública:
#   - context_create
#   - context_set
#   - context_get
#   - context_exists
#   - context_remove
#   - context_clear
#   - context_keys
#   - context_count
#
# API Interna:
#   - _context_initialize
#
# Dependências:
#   - foundation/constants.sh
#
# ==========================================================

set -euo pipefail

# ----------------------------------------------------------
# Variáveis
# ----------------------------------------------------------

declare -gA __hs_context_storage=()

# ----------------------------------------------------------
# API Pública
# ----------------------------------------------------------

#
# Inicializa o contexto de execução.
#
context_create() {

    _context_initialize

    return "${HS_EXIT_SUCCESS}"

}

#
# Armazena um valor no contexto.
#
context_set() {

    local key="${1:?missing key}"
    local value="${2:?missing value}"

    [[ "${key}" =~ ^[a-zA-Z0-9_.]+$ ]] \
        || return "${HS_EXIT_INVALID_ARGUMENT}"

    __hs_context_storage["${key}"]="${value}"

    return "${HS_EXIT_SUCCESS}"

}

#
# Recupera um valor do contexto.
#
context_get() {

    local key="${1:?missing key}"

    if ! context_exists "${key}"; then
        return "${HS_EXIT_NOT_FOUND}"
    fi

    printf '%s\n' "${__hs_context_storage["${key}"]}"

}

#
# Verifica se uma chave existe.
#
context_exists() {

    local key="${1:?missing key}"

    [[ -v __hs_context_storage["${key}"] ]]

}

#
# Remove uma chave do contexto.
#
context_remove() {

    local key="${1:?missing key}"

    unset '__hs_context_storage[$key]'

    return "${HS_EXIT_SUCCESS}"

}

#
# Remove todas as entradas do contexto.
#
context_clear() {

    _context_initialize

    return "${HS_EXIT_SUCCESS}"

}

#
# Lista todas as chaves do contexto.
#
context_keys() {

    printf '%s\n' "${!__hs_context_storage[@]}"

}

#
# Retorna a quantidade de entradas do contexto.
#
context_count() {

    printf '%d\n' "${#__hs_context_storage[@]}"

}

# ----------------------------------------------------------
# API Interna
# ----------------------------------------------------------

#
# Inicializa a estrutura de armazenamento.
#
_context_initialize() {

    __hs_context_storage=()

}

return 0