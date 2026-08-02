#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="/var/log/homeserver-power.log"
WAKE_TIME="${1:-07:00}"

log() { echo "[$(date '+%F %T')] $*" >> "${LOG_FILE}"; }

now="$(date +%s)"
today_epoch="$(date -d "today ${WAKE_TIME}" +%s)"
wake_epoch="$(date -d "tomorrow ${WAKE_TIME}" +%s)"

if [[ "${today_epoch}" -gt "${now}" ]]; then
    wake_epoch="${today_epoch}"
fi

log "Agendando religamento para $(date -d "@${wake_epoch}" '+%F %T')"
log "Desligando o servidor"

/usr/sbin/rtcwake -m off -t "${wake_epoch}"
