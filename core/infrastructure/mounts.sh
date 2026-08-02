#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: mounts.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Gerenciamento dos pontos de montagem de dispositivos.
#
# Responsabilidades:
#   - Definir o destino de montagem (/srv/storage/devices/<tipo>/<rótulo>)
#   - Montar/desmontar/ejetar dispositivos (requer sudo no host)
#   - Reportar pontos de montagem
#
# Não faz:
#   - Não detecta dispositivos (ver devices.sh)
#
# ==========================================================

HS_DEVICES_ROOT="${HS_DEVICES_ROOT:-/srv/storage/devices}"

#
# Retorna o caminho de montagem para um tipo + rótulo.
#
mount_target() {
    local type="$1" label="$2"

    printf "%s/%s/%s" \
        "${HS_DEVICES_ROOT}" \
        "${type}" \
        "${label}"
}

#
# Lista os pontos de montagem (JSON via findmnt).
#
mount_list() {
    findmnt -J -o TARGET,SOURCE,FSTYPE,SIZE,USED 2>/dev/null || echo '[]'
}

#
# Monta um dispositivo.
#
# Uso: mount_device <tipo> <rótulo> <dispositivo>   (ex.: usb KINGSTON sdb1)
#
mount_device() {
    local type="$1" label="$2" device="$3"
    local target

    target="$(mount_target "${type}" "${label}")"

    sudo mkdir -p "${target}"
    sudo systemd-mount "/dev/${device}" "${target}"
}

#
# Desmonta um dispositivo montado.
#
# Uso: unmount_device <tipo> <rótulo>
#
unmount_device() {
    local type="$1" label="$2"
    local target

    target="$(mount_target "${type}" "${label}")"

    sudo systemd-umount "${target}"
}

#
# Ejeta um dispositivo.
#
# Uso: eject_device <dispositivo>   (ex.: sdb)
#
eject_device() {
    sudo eject "/dev/${1}"
}
