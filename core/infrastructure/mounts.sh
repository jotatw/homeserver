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
# Desmonta um dispositivo montado (e remove o diretório órfão).
#
# Uso: unmount_device <tipo> <rótulo>
#
unmount_device() {
    local type="$1" label="$2"
    local target

    target="$(mount_target "${type}" "${label}")"

    sudo systemd-umount "${target}"
    rmdir "${target}" 2>/dev/null || true
}

#
# Ejeta um dispositivo (e limpa os pontos de montagem sob devices/).
#
# Uso: eject_device <dispositivo>   (ex.: sdb)
#
eject_device() {
    local dev="/dev/${1}"
    local target

    # Desmonta e remove diretórios locais do dispositivo antes de ejetar.
    while read -r target; do
        [[ -n "${target}" ]] || continue
        case "${target}" in
            "${HS_DEVICES_ROOT}"/*)
                sudo systemd-umount "${target}" 2>/dev/null || true
                rmdir "${target}" 2>/dev/null || true
                ;;
        esac
    done < <(findmnt -rn -o SOURCE,TARGET | awk -v d="${dev}" '($1 == d) || ($1 ~ "^" d "[0-9]") {print $2}')

    sudo eject "${dev}"
}
