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
#   - Validar arquivos
#   - Validar diretórios
#   - Validar comandos
#   - Validar valores
#
# Não faz:
#   - Não imprime mensagens
#   - Não encerra scripts
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