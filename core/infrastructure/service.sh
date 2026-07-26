#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: service.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Centralizar informações sobre os serviços do HomeServer.
#
# Responsabilidades:
#   - Localizar serviços
#   - Validar sua existência
#   - Disponibilizar caminhos
#
# Não Responsabilidades:
#   - Não executa Docker
#   - Não executa Docker Compose
#   - Não cria diretórios
#   - Não altera arquivos
#
# API Pública:
#   - service_exists
#   - service_directory
#   - service_file
#
# Dependências:
#   - config.sh
#   - filesystem.sh
#
# ==========================================================

#
# Retorna o diretório de um serviço.
#
service_directory() {

    local service="$1"

    printf "%s/%s\n" \
        "${HS_PROJECT_SERVICES_DIR}" \
        "${service}"

}

#
# Verifica se um serviço existe.
#
service_exists() {

    directory_exists "$(service_directory "$1")"

}

#
# Retorna um arquivo pertencente ao serviço.
#
service_file() {

    local service="$1"
    local file="$2"

    printf "%s/%s\n" \
        "$(service_directory "$service")" \
        "$file"

}