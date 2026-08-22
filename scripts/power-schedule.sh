#!/usr/bin/env bash
set -euo pipefail

# ==========================================================
# HomeServer — power-schedule (night-off)
#
# Suspende o servidor (S3) à noite e agenda o religamento via RTC.
#
# Fonte de verdade do religamento: Core (hs power status), com
# fallback para o argumento $1 ou 07:00. Assim o horário definido
# no App (power_set) é o mesmo usado aqui.
#
# Falhas são registradas e o script nunca "falha em silêncio":
# se o rtcwake não existir ou falhar, tenta systemctl suspend e
# registra claramente no log.
# ==========================================================

LOG_FILE="/var/log/homeserver-power.log"
HS_PROJECT_ROOT="${HS_PROJECT_ROOT:-/srv/git/homeserver}"
RTCWAKE="$(command -v rtcwake || echo /usr/sbin/rtcwake)"
NIC="enp7s0"
ETHTOOL="$(command -v ethtool || echo /usr/sbin/ethtool)"
USB_WAKE_DEVICES="USB0 US15 US12"

log() { echo "[$(date '+%F %T')] $*" >> "${LOG_FILE}"; }

# Lê o wake_time da fonte canônica (Core), fallback: $1 ou 07:00.
wake_time() {
    local from_core
    if [[ -x "${HS_PROJECT_ROOT}/core/hs.sh" ]]; then
        from_core="$(bash "${HS_PROJECT_ROOT}/core/hs.sh" power status 2>/dev/null | grep -oE '"wake":"[0-9]{2}:[0-9]{2}"' | cut -d'"' -f4)"
    fi
    if [[ -n "${from_core:-}" && "${from_core}" =~ ^[0-9]{2}:[0-9]{2}$ ]]; then
        printf '%s' "${from_core}"
    else
        printf '%s' "${1:-07:00}"
    fi
}

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

WAKE_TIME="$(wake_time "$@")"

now="$(date +%s)"
today_epoch="$(date -d "today ${WAKE_TIME}" +%s)"
wake_epoch="$(date -d "tomorrow ${WAKE_TIME}" +%s)"
if [[ "${today_epoch}" -gt "${now}" ]]; then
    wake_epoch="${today_epoch}"
fi

log "Agendando religamento para $(date -d "@${wake_epoch}" '+%F %T')"

_disable_wakes

if [[ ! -x "${RTCWAKE}" ]]; then
    log "AVISO: rtcwake não encontrado — usando systemctl suspend (sem alarme RTC)"
    systemctl suspend
    status=$?
else
    # rtcwake: suspende S3 com alarme RTC para religar no wake_epoch.
    "${RTCWAKE}" -m mem -t "${wake_epoch}"
    status=$?
    if [[ ${status} -ne 0 ]]; then
        log "ERRO: rtcwake falhou (${status}) — tentando systemctl suspend"
        systemctl suspend
        status=$?
    fi
fi

_restore_wakes

log "Power schedule concluído (status ${status})"
exit ${status}