#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: validation.sh
# Módulo.......: Foundation
#
# Objetivo.....:
# Fornecer funções de validação reutilizáveis.
#
# Responsabilidades:
#   - Validar comandos
#   - Validar arquivos
#   - Validar diretórios
#   - Validar valores
#
# Não Responsabilidades:
#   - Não imprime mensagens
#   - Não encerra scripts
#   - Não altera estado do sistema
#
# API Pública:
#   - is_command
#   - is_empty
#   - is_number
#
# Observação:
# Todas as funções retornam:
#   0 -> válido
#   1 -> inválido
#
# ==========================================================

# ----------------------------------------------------------
# Sistema
# ----------------------------------------------------------

#
# Verifica se um comando está disponível.
#
is_command() {

    local command="$1"

    command -v "${command}" >/dev/null 2>&1

}

# ----------------------------------------------------------
# Valores
# ----------------------------------------------------------

#
# Verifica se uma variável está vazia.
#
is_empty() {

    local value="${1:-}"

    [[ -z "${value}" ]]

}

#
# Verifica se um valor é numérico.
#
is_number() {

    local value="$1"

    [[ "${value}" =~ ^[0-9]+$ ]]

}