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
log "Suspendendo o servidor (S3)"

# Usa suspend (S3) em vez de desligar (S5): o RTC deste hardware
# não gera IRQ de alarme para acordar do poweroff, mas funciona
# do suspend-to-RAM. O rtcwake exibe o wake time em UTC.
/usr/sbin/rtcwake -m mem -t "${wake_epoch}"
