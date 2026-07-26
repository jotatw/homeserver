#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: application.sh
# Módulo.......: Applications
#
# Objetivo.....:
# Implementar operações comuns sobre os serviços do
# HomeServer.
#
# Responsabilidades:
#   - Orquestrar operações sobre serviços
#   - Aplicar validações comuns
#   - Centralizar o fluxo de execução
#
# Não Responsabilidades:
#   - Não acessa Docker diretamente
#   - Não manipula arquivos
#   - Não conhece diretórios
#   - Não implementa regras específicas dos serviços
#
# API Pública:
#   - application_start
#   - application_stop
#   - application_restart
#   - application_status
#   - application_logs
#   - application_validate
#   - application_check
#   - application_pull
#   - application_update
#   - application_info
#
# API Interna:
#   - _application_execute
#
# Dependências:
#   - environment.sh
#   - docker.sh
#   - service.sh
#   - compose.sh
#
# ==========================================================

#
# Executa uma operação sobre um serviço.
#
_application_execute() {

    local service="$1"

    local operation="$2"

    environment_ready || return 1

    docker_available || return 1

    service_exists "${service}" || return 1

    case "${operation}" in

        start)

            compose_validate "${service}" || return 1
            compose_up "${service}"
            ;;

        stop)

            compose_down "${service}"
            ;;

        restart)

            compose_restart "${service}"
            ;;

        logs)

            compose_logs "${service}"
            ;;

        pull)

            compose_pull "${service}"
            ;;

        validate)

            compose_validate "${service}"
            ;;

        status)

            compose_status "${service}"
            ;;

        check)

            compose_check "${service}"
            ;;

        update)

            compose_pull "${service}"      || return 1
            compose_restart "${service}"   || return 1
            compose_check "${service}"
            ;;

        info)

            compose_info "${service}"
            ;;

        *)

            return 1
            ;;

    esac

}

#
# API Pública
#

application_start() {

    _application_execute "$1" start

}

application_stop() {

    _application_execute "$1" stop

}

application_restart() {

    _application_execute "$1" restart

}

application_status() {

    _application_execute "$1" status

}

application_logs() {

    _application_execute "$1" logs

}

application_validate() {

    _application_execute "$1" validate

}

application_check() {

    _application_execute "$1" check

}

application_pull() {

    _application_execute "$1" pull

}

application_update() {

    _application_execute "$1" update

}

application_info() {

    _application_execute "$1" info

}