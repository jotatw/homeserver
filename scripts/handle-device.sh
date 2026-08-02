#!/usr/bin/env bash
# ==========================================================
# HomeServer — handler de dispositivos (chamado pelo udev)
#
# Uso:
#   handle-device.sh <mount|unmount> <dispositivo>   (ex.: sdb1)
#
# Monta/desmonta em /srv/storage/devices/<tipo>/<rótulo>/
# usando systemd-mount (executado como root pelo udev).
# ==========================================================

set -euo pipefail

ACTION="${1:-mount}"
DEV="${2:-}"

DEVICES_ROOT="/srv/storage/devices"
LOG="/var/log/homeserver-devices.log"

log() { echo "[$(date '+%F %T')] $*" >> "${LOG}"; }

[[ -n "${DEV}" ]] || { log "erro: dispositivo vazio"; exit 1; }

# ---- Tipo pelo prefixo -------------------------------------
if [[ "${DEV}" == mmcblk* ]]; then
    TYPE="sdcard"
elif [[ "${DEV}" == sd* ]]; then
    TYPE="usb"
else
    TYPE="temporary"
fi

# ---- Rótulo (ID_FS_LABEL ou o nome do dispositivo) ----------
LABEL="$(udevadm info --query=property --name="/dev/${DEV}" 2>/dev/null \
    | sed -n 's/^ID_FS_LABEL=//p' | head -1)"
[[ -n "${LABEL}" ]] || LABEL="${DEV}"
LABEL="$(printf '%s' "${LABEL}" | tr ' /' '__' | tr -cd 'A-Za-z0-9._-')"
[[ -n "${LABEL}" ]] || LABEL="${DEV}"

TARGET="${DEVICES_ROOT}/${TYPE}/${LABEL}"

#
# Executa os hooks do evento de dispositivo.
#
_run_hooks() {
    local hook_dir="/srv/automation/hooks/${TYPE}"
    local script

    [[ -d "${hook_dir}" ]] || return 0

    export HS_DEVICE_TYPE="${TYPE}"
    export HS_DEVICE_LABEL="${LABEL}"
    export HS_DEVICE_DEV="${DEV}"
    export HS_DEVICE_TARGET="${TARGET}"
    export HS_DEVICE_ACTION="${ACTION}"

    for script in "${hook_dir}"/*.sh; do
        [[ -f "${script}" ]] || continue
        bash "${script}" >> "${LOG}" 2>&1 || log "falha no hook: ${script}"
    done
}

case "${ACTION}" in

    mount)
        mkdir -p "${TARGET}"
        systemd-mount --no-block "/dev/${DEV}" "${TARGET}" >> "${LOG}" 2>&1 || true
        log "mount: /dev/${DEV} -> ${TARGET}"
        _run_hooks
        ;;

    unmount)
        if mountpoint -q "${TARGET}"; then
            systemd-umount "${TARGET}" >> "${LOG}" 2>&1 || true
        fi
        rmdir "${TARGET}" 2>/dev/null || true
        log "unmount: ${TARGET}"
        _run_hooks
        ;;

    *)
        log "ação desconhecida: ${ACTION}"
        exit 1
        ;;
esac

exit 0
