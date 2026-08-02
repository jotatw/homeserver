#!/usr/bin/env bash
set -euo pipefail

BACKUP_ROOT="/srv/backup/daily"
TODAY="$(date +%Y-%m-%d)"
TARGET="${BACKUP_ROOT}/${TODAY}"
LATEST="${BACKUP_ROOT}/latest"
KEEP_DAYS=14
LOG_FILE="/var/log/homeserver-backup.log"

log() { echo "[$(date '+%F %T')] $*" >> "${LOG_FILE}"; }

mkdir -p "${TARGET}"

log "Iniciando backup em ${TARGET}"

set +e

rsync -a --delete \
    --link-dest="${LATEST}/docker/" \
    /srv/docker/ \
    "${TARGET}/docker/" >> "${LOG_FILE}" 2>&1
status=$?

rsync -a --delete \
    --link-dest="${LATEST}/git/" \
    /srv/git/ \
    "${TARGET}/git/" >> "${LOG_FILE}" 2>&1
status=$((status + $?))

rsync -a --delete \
    --link-dest="${LATEST}/storage/" \
    /srv/storage/ \
    "${TARGET}/storage/" >> "${LOG_FILE}" 2>&1
status=$((status + $?))

rsync -a --delete \
    --link-dest="${LATEST}/services/" \
    /srv/services/ \
    "${TARGET}/services/" >> "${LOG_FILE}" 2>&1
status=$((status + $?))

mkdir -p "${TARGET}/system"
rsync -a --delete \
    --link-dest="${LATEST}/system/" \
    /etc/samba/smb.conf \
    /etc/ufw/ \
    /etc/hosts \
    /etc/hostname \
    "${TARGET}/system/" >> "${LOG_FILE}" 2>&1
status=$((status + $?))

set -e

if [[ ${status} -ne 0 && ${status} -ne 24 ]]; then
    log "Erro no rsync (status ${status})"
    exit 1
fi

rm -f "${LATEST}"
ln -s "${TARGET}" "${LATEST}"

find "${BACKUP_ROOT}" -mindepth 1 -maxdepth 1 -type d -mtime +${KEEP_DAYS} -exec rm -rf {} \; 2>/dev/null

log "Backup concluído com sucesso"
