#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: environment.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Preparar e manter o ambiente de execução do HomeServer.
#
# Responsabilidades:
#   - Inicializar o workspace
#   - Validar a estrutura do ambiente
#   - Preparar o ambiente para os serviços
#
# Não Responsabilidades:
#   - Não manipula arquivos de configuração
#   - Não executa Docker
#   - Não executa Docker Compose
#   - Não conhece serviços específicos
#   - Não imprime mensagens
#   - Não encerra scripts
#
# API Pública:
#   - initialize_workspace
#   - workspace_exists
#   - environment_ready
#
# Dependências:
#   - filesystem.sh
#   - config.sh
#
# ==========================================================

#
# Inicializa o workspace do HomeServer.
#
initialize_workspace() {

    local directory

    for directory in "${HS_WORKSPACE_DIRECTORIES[@]}"; do

        hs_fs_create_directory "${directory}" || return 1

    done

    return 0

}

#
# Verifica se o workspace existe.
#
workspace_exists() {

    local directory

    for directory in "${HS_WORKSPACE_DIRECTORIES[@]}"; do

        hs_fs_directory_exists "${directory}" || return 1

    done

    return 0

}

#
# Verifica se o ambiente está preparado.
#
environment_ready() {

    workspace_exists

}