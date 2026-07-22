#!/usr/bin/env bash

# ==========================================================
# Biblioteca Docker
# Responsável pelas operações Docker Compose.
# ==========================================================

#
# Executa "docker compose up -d".
#
compose_up() {

    docker compose up -d
}

#
# Executa "docker compose down".
#
compose_down() {

    docker compose down
}

#
# Reinicia um serviço.
#
compose_restart() {

    docker compose restart
}

#
# Atualiza as imagens.
#
compose_pull() {

    docker compose pull
}

#
# Exibe o status.
#
compose_status() {

    docker compose ps
}

#
# Exibe os logs.
#
compose_logs() {

    docker compose logs -f
}

#
# Valida o compose.
#
compose_validate() {

    docker compose config >/dev/null
}
#
# Entra no diretório do serviço.
#
enter_service() {

    local service="$1"

    cd "$(compose_path "$service")"
}
#
# Verifica se um serviço está em execução.
#
service_running() {

    docker compose ps --status running | grep -q .
}
#
# Aguarda um container iniciar.
#
wait_for_service() {

    local timeout="${1:-30}"

    local elapsed=0

    while (( elapsed < timeout )); do

        if service_running; then
            return 0
        fi

        sleep 1

        ((elapsed++))

    done

    return 1
}