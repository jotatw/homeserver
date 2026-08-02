get_uptime() {
    local seconds days hours minutes

    seconds="$(awk '{print int($1)}' /proc/uptime)"
    days=$((seconds / 86400))
    hours=$(((seconds % 86400) / 3600))
    minutes=$(((seconds % 3600) / 60))

    if [[ ${days} -gt 0 ]]; then
        printf "%d dias, %d horas, %d minutos" "${days}" "${hours}" "${minutes}"
    elif [[ ${hours} -gt 0 ]]; then
        printf "%d horas, %d minutos" "${hours}" "${minutes}"
    else
        printf "%d minutos" "${minutes}"
    fi
}
