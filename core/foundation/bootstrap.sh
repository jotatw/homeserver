#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: bootstrap.sh
# Módulo.......: Foundation
#
# Objetivo.....:
# Inicializar o HomeServer Core.
#
# Responsabilidades:
#   - Localizar o diretório do Core
#   - Preparar o ambiente de execução
#   - Carregar o Loader
#   - Controlar a sequência de inicialização
#
# Dependências:
#   - foundation/lib.sh
#
# ==========================================================

set -euo pipefail

# ----------------------------------------------------------
# Variáveis Globais
# ----------------------------------------------------------

declare -gx HS_CORE_ROOT

# ----------------------------------------------------------
# Funções Privadas
# ----------------------------------------------------------

#
# Prepara o ambiente de execução do Core.
#
_prepare_environment() {

    HS_CORE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    export HS_CORE_ROOT

}

#
# Carrega o Loader da Foundation.
#
_load_loader() {

    local loader="${HS_CORE_ROOT}/foundation/lib.sh"

    if [[ ! -f "${loader}" ]]; then
        echo "Erro: Loader não encontrado."
        echo "Arquivo esperado: ${loader}"
        exit 1
    fi

    # shellcheck source=/dev/null
    source "${loader}"

}

# ----------------------------------------------------------
# Ponto de Entrada
# ----------------------------------------------------------

#
# 1. Prepara o ambiente
#
_prepare_environment

#
# 2. Carrega o Loader
#
_load_loader

#
# 3. Inicializa o Core
#
_load_foundation
_load_infrastructure
_load_operations
_load_services