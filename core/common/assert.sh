#!/usr/bin/env bash

# ==========================================================
# HomeServer Test Framework
#
# Arquivo......: assert.sh
# Módulo.......: Test Framework
#
# Objetivo.....:
# Fornecer funções de validação reutilizáveis para os testes.
#
# Responsabilidades:
#   - Validar condições
#   - Retornar sucesso ou falha
#
# Não faz:
#   - Não imprime mensagens
#   - Não encerra scripts
#   - Não executa testes
#
# ==========================================================

set -euo pipefail

# ----------------------------------------------------------
# Assertivas de Comparação
# ----------------------------------------------------------

#
# Verifica se dois valores são iguais.
#
# Uso:
#   assert_equals "esperado" "atual"
#
# Retorno:
#   0 -> Valores iguais
#   1 -> Valores diferentes
#
assert_equals() {

    local expected="$1"
    local actual="$2"

    [[ "${expected}" == "${actual}" ]]

}

#
# Verifica se dois valores são diferentes.
#
assert_not_equals() {

    local first="$1"
    local second="$2"

    [[ "${first}" != "${second}" ]]

}