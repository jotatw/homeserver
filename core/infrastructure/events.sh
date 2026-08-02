#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: events.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Coletar eventos recentes do sistema a partir dos logs.
#
# Responsabilidades:
#   - Últimas ações (backup, dispositivo, boot, usuário)
#   - Retornar em formato JSON para a API e Homepage
#
# ==========================================================

HS_LOG_DIR="${HS_LOG_DIR:-/var/log}"

if [[ -d "/host/var/log" ]]; then
    HS_LOG_DIR="/host/var/log"
fi

#
# Lê as últimas N linhas de um arquivo de log.
#
_event_tail() {
    local file="$1" lines="${2:-5}"

    if [[ ! -r "${file}" ]]; then
        return 0
    fi

    tail -"${lines}" "${file}" 2>/dev/null
}

#
# Extrai as últimas ocorrências de eventos (JSON).
#
events_recent() {
    local backup event_str first=1

    printf '['

    # Backup
    while read -r line; do
        [[ -n "${line}" ]] || continue
        if printf '%s\n' "${line}" | grep -q "Iniciando backup"; then
            continue
        fi
        if printf '%s\n' "${line}" | grep -q "Backup conclu"; then
            event_str="$(printf '%s\n' "${line}" | sed 's/.*\[\(.*\)\].*/\1/' | sed 's/ Backup.*//')"
            [[ -n "${event_str}" ]] || event_str="$(date '+%F %T')"
            [[ ${first} -eq 0 ]] && printf ','
            printf '\n  {"time":"%s","type":"backup","action":"Backup concluído"}' "${event_str}"
            first=0
        fi
    done < <(_event_tail "${HS_LOG_DIR}/homeserver-backup.log" 3)

    # Dispositivos
    while read -r line; do
        [[ -n "${line}" ]] || continue
        event_str="$(printf '%s\n' "${line}" | grep -oE '\[[0-9-]+ [0-9:]+\]' | tr -d '[]')" || true
        local action label
        if printf '%s\n' "${line}" | grep -q "mount:"; then
            action="mount"
            label="${line##*-> }"
            [[ ${first} -eq 0 ]] && printf ','
            printf '\n  {"time":"%s","type":"device","action":"%s","label":"%s"}' "${event_str}" "Dispositivo conectado" "${label}"
            first=0
        elif printf '%s\n' "${line}" | grep -q "unmount:"; then
            action="unmount"
            label="${line##*-> }"
            [[ ${first} -eq 0 ]] && printf ','
            printf '\n  {"time":"%s","type":"device","action":"%s","label":"%s"}' "${event_str}" "Dispositivo removido" "${label}"
            first=0
        fi
    done < <(_event_tail "${HS_LOG_DIR}/homeserver-devices.log" 3)

    # Boot/shutdown
    while read -r line; do
        [[ -n "${line}" ]] || continue
        event_str="$(printf '%s\n' "${line}" | grep -oE '[0-9-]+ [0-9:]+' | head -1)" || true
        if printf '%s\n' "${line}" | grep -q "startup"; then
            [[ ${first} -eq 0 ]] && printf ','
            printf '\n  {"time":"%s","type":"system","action":"Servidor iniciado"}' "${event_str}"
            first=0
        fi
    done < <(_event_tail "${HS_LOG_DIR}/homeserver-hooks.log" 2)

    printf '\n]'
}