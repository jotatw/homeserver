#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: docker.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Fornecer uma API para interação com o Docker Engine.
#
# Responsabilidades:
#   - Verificar disponibilidade do Docker
#   - Verificar estado do Docker
#   - Consultar versão do Docker
#
# Não Responsabilidades:
#   - Não executa Docker Compose
#   - Não inicia containers
#   - Não conhece serviços
#
# API Pública:
#   - docker_available
#   - docker_running
#   - docker_version
#
# ==========================================================

docker_available() {

    command -v docker >/dev/null 2>&1

}

docker_running() {

    docker info >/dev/null 2>&1

}

docker_version() {

    docker --version

}