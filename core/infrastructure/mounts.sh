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
# Validações de entrada para operações de montagem.
#
_mounts_validate_type() {
    local type="$1"
    [[ "${type}" =~ ^(usb|sdcard|external|temporary)$ ]]
}

_mounts_validate_label() {
    local label="$1"
    [[ "${label}" =~ ^[a-zA-Z0-9_-]+$ ]]
}

_mounts_validate_device() {
    local device="$1"
    [[ "${device}" =~ ^[a-zA-Z0-9]+$ ]]
}

#
# Monta um dispositivo.
#
# Uso: mount_device <tipo> <rótulo> <dispositivo>   (ex.: usb KINGSTON sdb1)
#
mount_device() {
    local type="$1" label="$2" device="$3"
    local target

    _mounts_validate_type "${type}" || {
        echo "Tipo de dispositivo inválido: ${type}. Use: usb, sdcard, external, temporary" >&2
        return 1
    }

    _mounts_validate_label "${label}" || {
        echo "Rótulo inválido: ${label}. Use apenas letras, números, _ e -" >&2
        return 1
    }

    _mounts_validate_device "${device}" || {
        echo "Dispositivo inválido: ${device}. Use apenas letras e números (ex.: sdb1, nvme0n1p1)" >&2
        return 1
    }

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

    _mounts_validate_type "${type}" || {
        echo "Tipo de dispositivo inválido: ${type}." >&2
        return 1
    }

    _mounts_validate_label "${label}" || {
        echo "Rótulo inválido: ${label}." >&2
        return 1
    }

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
    local device="$1"
    local dev

    _mounts_validate_device "${device}" || {
        echo "Dispositivo inválido: ${device}." >&2
        return 1
    }

    dev="/dev/${device}"
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

# Formata um dispositivo removível com FAT32 (padrão USB/SD) e relê a tabela.
#
# Uso: format_device <dispositivo>   (ex.: sdb)
#
# Segurança:
#   - Exige confirmação explícita no App (segunda etapa já é confirm())
#   - Recusa formatar o disco do sistema ou qualquer dispositivo não removível
#   - Nunca formata uma partição individual (evita wipe da tabela por engano)
#
format_device() {
    local device="$1"
    local dev syspath removable

    _mounts_validate_device "${device}" || {
        echo "Dispositivo inválido: ${device}." >&2
        return 1
    }

    dev="/dev/${device}"

    # Bloqueia formatar o disco do sistema (resolvido dinamicamente)
    local root_dev
    root_dev="$(lsblk -n -o PKNAME "$(findmnt -n -o SOURCE / 2>/dev/null)" 2>/dev/null || echo '')"
    if [[ -n "${root_dev}" && "${device}" == "${root_dev}" ]]; then
        echo "Recusado: ${dev} é o disco do sistema." >&2
        return 1
    fi

    # Verifica removível (lsblk -d -o RM) antes de permitir mkfs
    removable="$(lsblk -d -n -o RM "/dev/${device}" 2>/dev/null || echo '')"
    if [[ "${removable}" != "1" ]]; then
        echo "Recusado: ${dev} não é um dispositivo removível." >&2
        return 1
    fi

    # Nunca formatar partição (ex.: sdb1) — só o bloco inteiro
    if [[ "${device}" =~ [0-9]+$ ]]; then
        echo "Recusado: formate o dispositivo inteiro (ex.: sdb), não a partição (ex.: sdb1)." >&2
        return 1
    fi

    # Desmonta qualquer ponto de montagem sob o dispositivo antes de formatar
    sudo umount "/dev/${device}"* 2>/dev/null || true

    # mkfs.vfat -I ignora warnings de tabela existente
    if ! sudo mkfs.vfat -F 32 -I -n "USB" "/dev/${device}"; then
        echo "Falha ao formatar ${dev} com FAT32." >&2
        return 1
    fi

    sudo partprobe "/dev/${device}" 2>/dev/null || true

    echo "Dispositivo ${dev} formatado com FAT32."
}
