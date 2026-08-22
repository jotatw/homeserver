#!/usr/bin/env bash
# ==========================================================
# HomeServer — backup-check
#
# Valida o último backup (hs system backup validate) e registra
# o resultado no log de backup (alimenta o feed de eventos).
#
# Desabilitável sem quebrar o núcleo:
#   hs scheduler disable backup-check
# ==========================================================

set -euo pipefail

HS_PROJECT_ROOT="${HS_PROJECT_ROOT:-/srv/git/homeserver}"
HS_LOG_DIR="${HS_LOG_DIR:-/var/log}"
if [[ -d "/host/var/log" ]]; then
    HS_LOG_DIR="/host/var/log"
fi
LOG_FILE="${HS_LOG_DIR}/homeserver-backup.log"

log() {
    printf '[%s] %s\n' "$(date '+%F %T')" "$*" >> "${LOG_FILE}"
}

log "[backup-check] Validando backup"
if bash "${HS_PROJECT_ROOT}/core/hs.sh" system backup validate >/tmp/backup-check.json 2>&1; then
    ok="$(grep -o '"ok":true' /tmp/backup-check.json 2>/dev/null || echo false)"
    if [[ "${ok}" == '"ok":true' ]]; then
        log "[backup-check] Backup OK"
    else
        log "[backup-check] Backup INVÁLIDO (verificar)"
    fi
else
    log "[backup-check] Falha ao executar validação"
fi
rm -f /tmp/backup-check.json