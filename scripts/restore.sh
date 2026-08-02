#!/usr/bin/env bash
set -euo pipefail

# ==========================================================
# HomeServer Restore
#
# Restaura dados a partir de um backup diário em /srv/backup/daily.
#
# Uso:
#   sudo bash restore.sh [data]        # ex.: 2026-08-02 (default: latest)
#
# Atenção: pare os containers antes de restaurar docker/services.
# ==========================================================

BACKUP_ROOT="/srv/backup/daily"
RESTORE_DATE="${1:-latest}"
SOURCE="${BACKUP_ROOT}/${RESTORE_DATE}"

if [[ ! -d "${SOURCE}" ]]; then
    echo "Backup não encontrado: ${SOURCE}" >&2
    exit 1
fi

_restore() {
    local name="$1"
    if [[ -d "${SOURCE}/${name}" ]]; then
        mkdir -p "/srv/${name}"
        rsync -a "${SOURCE}/${name}/" "/srv/${name}/"
        echo "Restaurado: /srv/${name}"
    else
        echo "Aviso: backup sem '${name}'" >&2
    fi
}

echo "Restaurando a partir de: ${SOURCE}"
echo "Dica: pare os containers antes (docker stop \$(docker ps -q))"
echo

_restore docker
_restore storage
_restore services
_restore git

if [[ "${RESTORE_SYSTEM:-0}" == "1" && -d "${SOURCE}/system" ]]; then
    cp -a "${SOURCE}/system/smb.conf" /etc/samba/smb.conf
    echo "smb.conf restaurado. Reinicie: systemctl restart smbd"
fi

echo
echo "Restauração concluída."
