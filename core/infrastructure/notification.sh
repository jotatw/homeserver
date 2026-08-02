#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: notification.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Notificar eventos do HomeServer para canais externos.
#
# Design:
# - Os adaptadores em core/adapters/notification/ implementam
#   cada canal (ntfy.sh, telegram.sh, email.sh).
# - O módulo notification.sh orquestra: pega o evento,
#   monta a mensagem e chama todos os adaptadores ativos.
# - Ativação via config/notifications.conf.
#
# Eventos suportados:
#   backup.start, backup.end, backup.fail
#   user.create, user.remove
#   service.start, service.stop
#   device.mount, device.unmount
#   hardware.temp_high, hardware.disk_low
#   reboot, shutdown
#
# ==========================================================

readonly HS_NOTIFY_CONF="${HS_PROJECT_ROOT}/config/notifications.conf"
readonly HS_NOTIFY_ADAPTERS="${HS_CORE_ROOT}/adapters/notification"

#
# Verifica se existe pelo menos um canal configurado.
#
notification_ready() {
    [[ -f "${HS_NOTIFY_CONF}" ]] && [[ -s "${HS_NOTIFY_CONF}" ]]
}

#
# Envia uma notificação.
#
# Uso: notification_send <evento> <mensagem> [detalhes...]
#
notification_send() {
    local event="${1:?evento}" message="${2:?mensagem}" details="${3:-}"

    notification_ready || return 0

    local adapter

    for adapter in "${HS_NOTIFY_ADAPTERS}"/*.sh; do
        [[ -f "${adapter}" ]] || continue
        # shellcheck source=/dev/null
        source "${adapter}"
    done

    return 0
}