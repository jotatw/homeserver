#!/usr/bin/env bash

# ==========================================================
# HomeServer
#
# Arquivo......: hello_core.sh
#
# Objetivo.....:
# Demonstrar a inicialização do HomeServer Core.
#
# ==========================================================

set -euo pipefail

# ----------------------------------------------------------
# Carrega o Core
# ----------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PROJECT_ROOT="$(dirname "${SCRIPT_DIR}")"

source "${PROJECT_ROOT}/bootstrap.sh"

# ----------------------------------------------------------
# Programa Principal
# ----------------------------------------------------------

main() {

    info "Inicializando HomeServer Core..."

    printf "\n"

    info "Projeto : ${HS_PROJECT_NAME}"
    info "Versão  : ${HS_CORE_VERSION}"

    printf "\n"

    info "HS_PROJECT_ROOT : ${HS_PROJECT_ROOT}"
    info "HS_CONFIG_DIR   : ${HS_CONFIG_DIR}"

    if is_directory "${HS_CONFIG_DIR}"; then
        success "Diretório de configuração encontrado."
    else
        error "Diretório de configuração não encontrado."
        exit "${HS_EXIT_FAILURE}"
    fi

    if is_directory "${HS_SERVICES_DIR}"; then
        success "Diretório de serviços encontrado."
    else
        error "Diretório de serviços não encontrado."
        exit "${HS_EXIT_FAILURE}"
    fi

    if is_command "docker"; then
        success "Docker disponível."
    else
        warning "Docker não encontrado."
    fi

    printf "\n"

    success "HomeServer Core inicializado com sucesso."

}

main "$@"