#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: lib.sh
# Módulo.......: Foundation
#
# Objetivo.....:
# Carregar as bibliotecas do HomeServer Core.
#
# Responsabilidades:
#   - Carregar Foundation
#   - Carregar Infrastructure
#   - Carregar Services
#   - Carregar Operations
#
# ==========================================================

set -euo pipefail

# ----------------------------------------------------------
# Funções Privadas
# ----------------------------------------------------------

#
# Carrega uma biblioteca.
#
_load_library() {

    local library="$1"

    if [[ ! -f "${library}" ]]; then
        echo "Erro: Biblioteca não encontrada."
        echo "Arquivo esperado: ${library}"
        exit 1
    fi

    # shellcheck source=/dev/null
    source "${library}"
}

#
# Carrega o Foundation.
#
_load_foundation() {

    _load_library "${HS_CORE_ROOT}/common/constants.sh"
    _load_library "${HS_CORE_ROOT}/common/config.sh"
    _load_library "${HS_CORE_ROOT}/common/output.sh"
    _load_library "${HS_CORE_ROOT}/common/validation.sh"

}

#
# Carrega Infrastructure.
#
_load_infrastructure() {

    return 0

}

#
# Carrega Services.
#
_load_services() {

    return 0

}

#
# Carrega Operations.
#
_load_operations() {

    return 0

}
# ----------------------------------------------------------
# Inicialização
# ----------------------------------------------------------

_initialize_core() {

    _load_foundation
    _load_infrastructure
    _load_services
    _load_operations

}

_initialize_core