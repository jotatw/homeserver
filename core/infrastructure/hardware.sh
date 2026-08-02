#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: hardware.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Fornecer informações sobre o servidor em si.
#
# Responsabilidades:
#   - Temperatura (hwmon: CPU, GPU — via sysfs)
#   - Discos (lsblk + smartctl)
#   - Rede (hostname, IP)
#   - USB (lsusb)
#
# Não faz:
#   - Não gerencia dispositivos removíveis (ver devices.sh)
#   - Não monta nada
#
# ==========================================================

#
# Resolve o caminho legível do hardware (container via /sys montado).
#
_hw_hwmon() {
    if [[ -d "/host/sys/class/hwmon" ]]; then
        printf "/host/sys/class/hwmon"
    else
        printf "/sys/class/hwmon"
    fi
}

#
# Hostname.
#
hw_hostname() {
    hostname 2>/dev/null || cat /etc/hostname 2>/dev/null || echo "unknown"
}

#
# IP da interface principal.
# No container, usa HS_HOST_IP (env) quando definido.
#
hw_ip() {
    if [[ -n "${HS_HOST_IP:-}" ]]; then
        printf "%s" "${HS_HOST_IP}"
        return 0
    fi
    hostname -i 2>/dev/null | awk '{print $1}'
}

#
# Temperaturas via sysfs hwmon (JSON).
#
hw_temperature_json() {
    local root chip t label temp_milli temp first=1

    root="$(_hw_hwmon)"

    printf '['
    for chip_dir in "${root}"/hwmon*/; do
        [[ -d "${chip_dir}" ]] || continue
        chip="$(cat "${chip_dir}name" 2>/dev/null || echo "unknown")"
        for t in "${chip_dir}"temp*_input; do
            [[ -f "${t}" ]] || continue
            label="$(cat "${t%_input}_label" 2>/dev/null || echo "temp")"
            temp_milli="$(cat "${t}" 2>/dev/null || echo 0)"
            temp="$(awk -v x="${temp_milli}" 'BEGIN {printf "%.1f", x / 1000}')"
            [[ ${first} -eq 0 ]] && printf ','
            printf '\n  {"chip":"%s","label":"%s","temp":%s}' "${chip}" "${label}" "${temp}"
            first=0
        done
    done
    printf '\n]'
}

#
# Discos via lsblk (JSON).
#
hw_disks_json() {
    lsblk -J -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,TRAN 2>/dev/null \
        || echo '[]'
}

#
# smartctl (sudo quando não-root).
#
_hw_smart() {
    if [[ "$(id -u)" -eq 0 ]]; then
        command smartctl "$@"
    else
        sudo smartctl "$@"
    fi
}

#
# Saúde/temperatura do disco via smartctl (JSON).
#
hw_disk_smart_json() {
    local disk="${1:-sda}" raw temp realloc available

    raw="$(_hw_smart -A "/dev/${disk}" 2>/dev/null)"
    temp="$(printf '%s\n' "${raw}" | awk '/Temperature_Celsius/ {print $10}')"

    if [[ -z "${temp}" ]]; then
        printf '{"disk":"%s","available":false,"temp":null,"reallocated_sectors":null}' "${disk}"
        return 0
    fi

    realloc="$(printf '%s\n' "${raw}" | awk '/Reallocated_Sector_Ct/ {print $10}')"

    printf '{"disk":"%s","available":true,"temp":%s,"reallocated_sectors":%s}' \
        "${disk}" "${temp}" "${realloc}"
}

#
# Rede (JSON).
#
hw_network_json() {
    printf '{"hostname":"%s","ip":"%s"}' \
        "$(hw_hostname)" "$(hw_ip)"
}

#
# USB via lsusb (JSON array de strings).
#
hw_usb_json() {
    lsusb 2>/dev/null | awk 'BEGIN {printf "["}
        { if (NR > 1) printf ","; printf "\n  \"%s\"", $0 }
        END {printf "\n]"}'
}

#
# Estado completo do hardware (JSON).
#
hw_status_json() {
    printf '{\n'
    printf '  "network": %s,\n' "$(hw_network_json)"
    printf '  "temperature": %s,\n' "$(hw_temperature_json)"
    printf '  "disks": %s,\n' "$(hw_disks_json)"
    printf '  "disk_smart": %s,\n' "$(hw_disk_smart_json "${HS_SMART_DISK:-sda}")"
    printf '  "usb": %s\n' "$(hw_usb_json)"
    printf '}\n'
}
