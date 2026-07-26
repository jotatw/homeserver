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
#   - Remover valores
#   - Limpar o contexto
#
# Não Responsabilidades:
#   - Persistir dados
#   - Ler arquivos
#   - Executar operações
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

declare -gA __hs_context_storage

# ----------------------------------------------------------
# API Interna
# ----------------------------------------------------------

#
# Inicializa o armazenamento do contexto.
#
_context_initialize() {

    __hs_context_storage=()

}

# ----------------------------------------------------------
# API Pública
# ----------------------------------------------------------

#
# Cria um novo contexto de execução.
#
context_create() {

    _context_initialize

    return "${HS_EXIT_SUCCESS}"

}

return 0