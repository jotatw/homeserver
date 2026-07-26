#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: compose.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Fornecer uma API para operações com Docker Compose.
#
# Responsabilidades:
#   - Executar comandos Docker Compose
#   - Validar arquivos Compose
#   - Gerenciar containers dos serviços
#
# Não Responsabilidades:
#   - Não localiza serviços
#   - Não executa comandos Docker
#   - Não imprime mensagens
#
# API Pública:
#   - compose_up
#   - compose_down
#   - compose_restart
#   - compose_pull
#   - compose_logs
#   - compose_validate
#
# Dependências:
#   - service.sh
#
# ==========================================================

_compose() {

    local service="$1"

    shift

    (
        cd "$(service_directory "$service")" || exit 1
        docker compose "$@"
    )

}

compose_up() {
    _compose "$1" up -d
}

compose_down() {
    _compose "$1" down
}

compose_restart() {
    _compose "$1" restart
}

compose_pull() {
    _compose "$1" pull
}

compose_logs() {
    _compose "$1" logs -f
}

compose_validate() {
    _compose "$1" config >/dev/null
}