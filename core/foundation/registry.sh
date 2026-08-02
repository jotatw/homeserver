#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: registry.sh
# Módulo.......: Foundation
#
# Objetivo.....:
# Registrar serviços e controlar a ativação de módulos.
#
# Responsabilidades:
#   - Listar serviços disponíveis
#   - Listar serviços ativados
#   - Ativar/desativar serviços
#
# Não faz:
#   - Não executa Docker
#   - Não gerencia arquivos
#   - Não conhece serviços específicos
#
# Dependências:
#   - config.sh (HS_SERVICES_DIR)
#   - filesystem.sh (foundation)
#
# ==========================================================

readonly HS_SERVICES_CONF="${HS_PROJECT_ROOT}/config/services.conf"

#
# Lista os serviços disponíveis (módulos em modules/ que
# possuem um arquivo compose).
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
        echo "Serviço já ativado: ${service}"
        return 0
    fi

    echo "${service}" >> "${HS_SERVICES_CONF}"
    echo "Serviço ativado: ${service}"
}

#
# Desativa um serviço.
#
service_disable() {

    local service="$1"

    if ! service_enabled "${service}"; then
        echo "Serviço não ativado: ${service}"
        return 0
    fi

    sed -i "/^${service}$/d" "${HS_SERVICES_CONF}"
    echo "Serviço desativado: ${service}"
}
