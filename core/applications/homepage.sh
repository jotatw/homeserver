#!/usr/bin/env bash

# ==========================================================
# HomeServer
#
# Arquivo......: homepage.sh
# Módulo.......: Applications
#
# Objetivo.....:
# Gerenciar o Homepage do HomeServer.
#
# Responsabilidades:
#   - Iniciar o Homepage
#   - Parar o Homepage
#   - Reiniciar o Homepage
#   - Atualizar o Homepage
#   - Exibir informações
#   - Exibir logs
#
# Não Responsabilidades:
#   - Não executa Docker
#   - Não executa Compose
#   - Não conhece a estrutura dos serviços
#
# Dependências:
#   - application.sh
#
# ==========================================================

readonly HS_APPLICATION_NAME="homepage"

homepage_start() {

    application_start "${HS_APPLICATION_NAME}"

}

homepage_stop() {

    application_stop "${HS_APPLICATION_NAME}"

}

homepage_restart() {

    application_restart "${HS_APPLICATION_NAME}"

}

homepage_status() {

    application_status "${HS_APPLICATION_NAME}"

}

homepage_logs() {

    application_logs "${HS_APPLICATION_NAME}"

}

homepage_update() {

    application_update "${HS_APPLICATION_NAME}"

}

homepage_info() {

    application_info "${HS_APPLICATION_NAME}"

}