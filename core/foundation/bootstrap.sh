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
#   - Definir variáveis globais
#   - Carregar o Loader
#
# Dependências.: Nenhuma
#
# ==========================================================

set -euo pipefail

# ----------------------------------------------------------
# Variáveis Globais
# ----------------------------------------------------------

export HS_CORE_ROOT=""

# ----------------------------------------------------------
# Funções Privadas
# ----------------------------------------------------------

#
# Descobre o diretório onde o Core está instalado.
#
_initialize_core() {

    HS_CORE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    export HS_CORE_ROOT

    _load_foundation
    _load_infrastructure
    _load_services
    _load_operations

}

#
# Carrega o Loader do Core.
#
_load_core() {

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
# Inicialização
# ----------------------------------------------------------

_initialize_core

_load_core