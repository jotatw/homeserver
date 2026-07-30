#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: bootstrap.sh
#
# Objetivo:
# Inicializar a Foundation do HomeServer Core.
# ==========================================================

_prepare_environment() {

    [[ -n "${HS_CORE_ROOT:-}" ]] && return 0

    HS_CORE_ROOT="$(
        cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
    )"

    HS_PROJECT_ROOT="$(
        dirname "${HS_CORE_ROOT}"
    )"

    export HS_CORE_ROOT
    export HS_PROJECT_ROOT
}

_load_loader() {

    local loader="${HS_CORE_ROOT}/foundation/loader.sh"

    [[ -f "${loader}" ]] || {
        echo "Erro: Loader não encontrado."
        echo "Arquivo esperado: ${loader}"
        return 1
    }

    # shellcheck source=/dev/null
    # Caminho resolvido dinamicamente em tempo de execução.
    source "${loader}"
}
# Executa a sequência de inicialização da Foundation.
_bootstrap() {

    _prepare_environment || return 1
    _load_loader || return 1
    _load_foundation || return 1
}

_bootstrap || return 1

return 0