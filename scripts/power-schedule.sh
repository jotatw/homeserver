#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="/var/log/homeserver-power.log"
WAKE_TIME="${1:-07:00}"
NIC="enp7s0"
ETHTOOL="/usr/sbin/ethtool"
USB_WAKE_DEVICES="USB0 US15 US12"

log() { echo "[$(date '+%F %T')] $*" >> "${LOG_FILE}"; }

# Desabilita os wake sources que despertam o sistema imediatamente
# ao entrar em S3 (NIC e dispositivos USB). Restaurados após o resume.
_disable_wakes() {
    if [[ -x "${ETHTOOL}" ]]; then
        "${ETHTOOL}" -s "${NIC}" wol d >> "${LOG_FILE}" 2>&1 || true
    fi

    for dev in ${USB_WAKE_DEVICES}; do
        echo "${dev}" > /proc/acpi/wakeup 2>/dev/null || true
    done

    log "Wakes desabilitados (NIC + ${USB_WAKE_DEVICES})"
}

_restore_wakes() {
    if [[ -x "${ETHTOOL}" ]]; then
        "${ETHTOOL}" -s "${NIC}" wol g >> "${LOG_FILE}" 2>&1 || true
    fi

    for dev in ${USB_WAKE_DEVICES}; do
        echo "${dev}" > /proc/acpi/wakeup 2>/dev/null || true
    done

    log "Wakes restaurados (NIC + ${USB_WAKE_DEVICES})"
}

now="$(date +%s)"
today_epoch="$(date -d "today ${WAKE_TIME}" +%s)"
wake_epoch="$(date -d "tomorrow ${WAKE_TIME}" +%s)"

if [[ "${today_epoch}" -gt "${now}" ]]; then
    wake_epoch="${today_epoch}"
fi

log "Agendando religamento para $(date -d "@${wake_epoch}" '+%F %T')"
log "Suspendendo o servidor (S3)"

_disable_wakes

# Usa suspend (S3) em vez de desligar (S5): o RTC deste hardware
# não gera IRQ de alarme para acordar do poweroff, mas funciona
# do suspend-to-RAM. Desabilitar os wakes (NIC/USB) impede o wake
# imediato. O rtcwake exibe o wake time em UTC.
/usr/sbin/rtcwake -m mem -t "${wake_epoch}"
status=$?

_restore_wakes

exit ${status}
