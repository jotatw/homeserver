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

    _load_library "${HS_CORE_ROOT}/foundation/constants.sh"
    _load_library "${HS_CORE_ROOT}/foundation/config.sh"
    _load_library "${HS_CORE_ROOT}/foundation/output.sh"
    _load_library "${HS_CORE_ROOT}/foundation/validation.sh"

}

#
# Carrega Infrastructure.
#
_load_infrastructure() {

    _load_library "${HS_CORE_INFRASTRUCTURE_DIR}/filesystem.sh"

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
