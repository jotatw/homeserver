#!/usr/bin/env bash
#
# HomeServer Core
#
# Objetivo: formatar uptime (de /proc/uptime) em texto humano.
# get_uptime      -> formato longo pt-BR ("1 dia, 2 horas, 3 minutos")
# get_uptime_short-> formato compacto para widgets ("1d 2h 3m")
#

get_uptime_seconds() {
    awk '{print int($1)}' /proc/uptime
}

get_uptime() {
    local seconds days hours minutes
    seconds="$(get_uptime_seconds)"
    days=$((seconds / 86400))
    hours=$(((seconds % 86400) / 3600))
    minutes=$(((seconds % 3600) / 60))

    local d="dias" h="horas" m="minutos"
    [[ ${days} -eq 1 ]] && d="dia"
    [[ ${hours} -eq 1 ]] && h="hora"
    [[ ${minutes} -eq 1 ]] && m="minuto"

    if [[ ${days} -gt 0 ]]; then
        printf "%d %s, %d %s, %d %s" "${days}" "${d}" "${hours}" "${h}" "${minutes}" "${m}"
    elif [[ ${hours} -gt 0 ]]; then
        printf "%d %s, %d %s" "${hours}" "${h}" "${minutes}" "${m}"
    else
        printf "%d %s" "${minutes}" "${m}"
    fi
}

get_uptime_short() {
    local seconds days hours minutes out=""
    seconds="$(get_uptime_seconds)"
    days=$((seconds / 86400))
    hours=$(((seconds % 86400) / 3600))
    minutes=$(((seconds % 3600) / 60))

    [[ ${days} -gt 0 ]] && out="${days}d "
    [[ ${days} -gt 0 || ${hours} -gt 0 ]] && out="${out}${hours}h "
    out="${out}${minutes}m"
    printf "%s" "${out}"
}
