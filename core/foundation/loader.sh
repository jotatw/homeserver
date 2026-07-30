#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: loader.sh
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

_load_module() {

    local module="$1"

    [[ -f "${module}" ]] || {
        echo "Erro: Módulo não encontrado."
        echo "Arquivo esperado: ${module}"
        return 1
    }

    # shellcheck source=/dev/null
    source "${module}"
}

_load_layer() {

    local layer="$1"
    shift

    local module

    for module in "$@"; do
        _load_module "${HS_CORE_ROOT}/${layer}/${module}" || return 1
    done
}

# ----------------------------------------------------------
# API Pública
# ----------------------------------------------------------

#
# Carrega os componentes da Foundation.
#
_load_foundation() {

    _load_layer foundation \
        constants.sh \
        config.sh \
        output.sh \
        validation.sh \
        filesystem.sh
}
#
# Carrega os componentes da Infrastructure.
#
_load_infrastructure() {

    _load_layer infrastructure
}
#
# Carrega os componentes da Applications.
#
_load_applications() {

    _load_layer applications
}
