#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: lib.sh
# Módulo.......: Foundation
#
# Objetivo.....:
# Carregar os componentes do HomeServer Core.
#
# Responsabilidades:
#   - Carregar componentes da Foundation
#   - Carregar componentes da Infrastructure
#   - Carregar componentes da Operations
#   - Carregar componentes da Services
#
# API Pública:
#   - _load_foundation
#   - _load_infrastructure
#   - _load_operations
#   - _load_services
#
# API Interna:
#   - _load_library
#
# Dependências:
#   - HS_CORE_ROOT
#   - HS_CORE_INFRASTRUCTURE_DIR
#
# ==========================================================

set -euo pipefail

# ----------------------------------------------------------
# API Interna
# ----------------------------------------------------------

#
# Carrega um componente do Core.
#
_load_library() {

    local library="$1"

    if [[ ! -f "${library}" ]]; then
        echo "Erro: Componente não encontrado."
        echo "Arquivo esperado: ${library}"
        exit 1
    fi

    # shellcheck source=/dev/null
    source "${library}"

}

# ----------------------------------------------------------
# API Pública
# ----------------------------------------------------------

#
# Carrega os componentes da Foundation.
#
_load_foundation() {

    _load_library "${HS_CORE_ROOT}/foundation/constants.sh"
    _load_library "${HS_CORE_ROOT}/foundation/config.sh"
    _load_library "${HS_CORE_ROOT}/foundation/validation.sh"
    _load_library "${HS_CORE_ROOT}/foundation/output.sh"

}

#
# Carrega os componentes da Infrastructure.
#
_load_infrastructure() {

    _load_library "${HS_CORE_INFRASTRUCTURE_DIR}/filesystem.sh"

}

#
# carrega os componentes.
#
_load_components() {

    return 0

}

#
# Carrega os componentes da Provisioning.
#
_load_provisioning() {

    return 0

}

#
# Carrega os componentes da Applications.
#
_load_applications() {

    return 0

}

#
# Carrega os componentes da Operations.
#
_load_operations() {

    return 0

}

#
# Carrega os componentes da Services.
#
_load_services() {

    return 0

}