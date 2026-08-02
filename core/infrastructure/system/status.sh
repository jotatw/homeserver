system_status_json() {
    local hostname os kernel arch uptime load cpu
    local mem_t mem_u mem_a mem_p disk_t disk_u disk_a disk_p
    local services backup wol

    hostname="$(get_hostname)"
    os="$(get_os)"
    kernel="$(get_kernel)"
    arch="$(get_architecture)"
    uptime="$(get_uptime)"
    load="$(get_load)"
    cpu="$(get_cpu_percent)"

    mem_t="$(get_memory_total)"
    mem_u="$(get_memory_used)"
    mem_a="$(get_memory_available)"
    mem_p="$(get_memory_percent)"

    disk_t="$(get_disk_total)"
    disk_u="$(get_disk_used)"
    disk_a="$(get_disk_available)"
    disk_p="$(get_disk_percent)"

    services="$(get_services_status_json)"
    backup="$(get_backup_last)"
    wol="$(wol_status)"

    printf '{\n'
    printf '  "hostname": "%s",\n' "${hostname}"
    printf '  "os": "%s",\n' "${os}"
    printf '  "kernel": "%s",\n' "${kernel}"
    printf '  "architecture": "%s",\n' "${arch}"
    printf '  "uptime": "%s",\n' "${uptime}"
    printf '  "load": "%s",\n' "${load}"
    printf '  "cpu": { "percent": %s },\n' "${cpu}"
    printf '  "memory": { "total": %s, "used": %s, "available": %s, "percent": %s },\n' \
        "${mem_t}" "${mem_u}" "${mem_a}" "${mem_p}"
    printf '  "disk": { "total": %s, "used": %s, "available": %s, "percent": %s },\n' \
        "${disk_t}" "${disk_u}" "${disk_a}" "${disk_p}"
    printf '  "services": %s,\n' "${services}"
    printf '  "backup": "%s",\n' "${backup}"
    printf '  "wol": "%s"\n' "${wol}"
    printf '}\n'
}
