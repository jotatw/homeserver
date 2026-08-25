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

# Snapshot pontual do database.db do FileBrowser Quantum.
# É um BoltDB (não SQLite): sem API de backup online, a cópia é feita
# direto do arquivo. Transações do BoltDB são atômicas (meta-page dupla),
# e o conteúdo é recriável em minutos (usuários/config) — o rsync de
# /srv/services/ segue como segunda cópia.
mkdir -p "${TARGET}/dumps/files"
# Magic do BoltDB: bytes 16-19 = 0xED0CDAED (little-endian)
if cp "/srv/services/files/config/database.db" \
      "${TARGET}/dumps/files/database.db" 2>>"${LOG_FILE}" \
   && [[ "$(head -c 20 "${TARGET}/dumps/files/database.db" | tail -c 4 | od -An -tx4 | tr -d " ")" == "ed0cdaed" ]] \
   && [[ -s "${TARGET}/dumps/files/database.db" ]]; then
    log "Snapshot files/database.db: OK ($(wc -c < "${TARGET}/dumps/files/database.db") bytes)"
else
    log "AVISO: snapshot do database.db falhou ou inválido (rsync mantém cópia)"
fi

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

# Manifest SHA256 para validação (amostra dos arquivos críticos, exclui o próprio manifest)
if command -v sha256sum >/dev/null 2>&1; then
    find "${TARGET}" -type f ! -name "manifest.sha256" -size -50M 2>/dev/null | head -n 500 | xargs sha256sum 2>/dev/null > "${TARGET}/manifest.sha256" || true
fi

find "${BACKUP_ROOT}" -mindepth 1 -maxdepth 1 -type d -mtime +${KEEP_DAYS} -exec rm -rf {} \; 2>/dev/null

log "Backup concluído com sucesso"
