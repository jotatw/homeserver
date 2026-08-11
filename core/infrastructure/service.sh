#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: service.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Centralizar informações e gerenciamento dos serviços do HomeServer.
#
# Responsabilidades:
#   - Localizar serviços
#   - Validar sua existência
#   - Disponibilizar caminhos
#   - Listar serviços disponíveis e ativados
#   - Ativar/desativar serviços
#
# Não Responsabilidades:
#   - Não executa Docker
#   - Não executa Docker Compose
#   - Não cria diretórios
#
# API Pública:
#   - service_exists
#   - service_directory
#   - service_file
#   - available_services
#   - enabled_services
#   - service_enabled
#   - service_enable
#   - service_disable
#
# Dependências:
#   - config.sh (HS_SERVICES_DIR, HS_SERVICES_CONF)
#   - filesystem.sh (foundation)
#
# ==========================================================

#
# Retorna o diretório de um serviço.
#
service_directory() {

    local service="$1"

    printf "%s/%s\n" \
        "${HS_SERVICES_DIR}" \
        "${service}"

}

#
# Verifica se um serviço existe.
#
service_exists() {

    hs_fs_directory_exists "$(service_directory "$1")"

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

# ==========================================================
# Serviços: disponibilidade e ativação
# ==========================================================

#
# Lista os serviços disponíveis (módulos em modules/ com compose).
#
available_services() {

    local service

    for service in "${HS_PROJECT_ROOT}"/modules/*/; do
        [[ -d "${service}" ]] || continue
        ls "${service}"compose.y*ml >/dev/null 2>&1 || continue
        basename "${service}"
    done | sort

}

#
# Lista os serviços ativados (config/services.conf),
# ignorando comentários e linhas vazias.
#
enabled_services() {

    [[ -f "${HS_SERVICES_CONF}" ]] || return 0

    sed -e '/^[[:space:]]*#/d' -e '/^[[:space:]]*$/d' \
        "${HS_SERVICES_CONF}"

}

#
# Verifica se um serviço está ativado.
#
service_enabled() {

    local service="$1"

    enabled_services | grep -qx "${service}"

}

#
# Ativa um serviço.
#
service_enable() {

    local service="$1"

    if service_enabled "${service}"; then
        return 0
    fi

    echo "${service}" >> "${HS_SERVICES_CONF}"

}

#
# Desativa um serviço.
#
service_disable() {

    local service="$1"

    if ! service_enabled "${service}"; then
        return 0
    fi

    sed -i "/^${service}$/d" "${HS_SERVICES_CONF}"

}