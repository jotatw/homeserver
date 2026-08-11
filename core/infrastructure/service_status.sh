#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: service_status.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Gerar o JSON com o estado de execução dos serviços ativados.
#
# Responsabilidades:
#   - Listar serviços ativados (enabled_services);
#   - Produzir JSON de status por serviço (via docker inspect).
#
# Não Responsabilidades:
#   - Não gerencia serviços
#   - Não altera configurações
#
# ==========================================================

get_service_status_json() {

    local service state first=1

    if ! command -v docker >/dev/null 2>&1; then
        printf "[]"
        return 0
    fi

    printf "["
    while read -r service; do
        [[ -n "${service}" ]] || continue
        state="$(docker inspect -f '{{.State.Status}}' "${service}" 2>/dev/null || echo "not_found")"
        [[ ${first} -eq 0 ]] && printf ","
        printf '\n  {"name":"%s","status":"%s"}' "${service}" "${state}"
        first=0
    done < <(enabled_services)
    printf "\n]"
}