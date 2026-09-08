get_uptime() {
    local seconds days hours minutes

    seconds="$(awk '{print int($1)}' /proc/uptime)"
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
