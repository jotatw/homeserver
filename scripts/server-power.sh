#!/usr/bin/env bash
# ==========================================================
# server-power.sh — Liga/desliga o homeserver pelo Telegram
# Instalado no HOMESERVER (roda local, sem SSH).
#
# Uso:
#   server-power.sh status          → mostra estado + próximo wake
#   server-power.sh dormir [HH:MM]  → suspende com RTC wake (default 08:00)
#   server-power.sh acordar         → WOL: acorda agora (requer estar acordado p/ receber)
#
# Nota arquitetural:
#   - "dormir" funciona sempre: rtcwake agenda o RTC e suspende.
#   - "acordar" só funciona se o servidor JÁ está acordado (o gateway
#     mora nele; se dormiu, não há quem receba o comando). Para acordar
#     de fora, usar WOL do notebook (ver server-wol.sh) ou aguardar RTC.
# ==========================================================
set -euo pipefail

POWER_LOG="/var/log/homeserver-power.log"
WAKE_DEFAULT="08:00"

log() { echo "[$(date '+%F %T')] $*" >> "${POWER_LOG}"; }

case "${1:-status}" in
  status)
    echo "🔌 **Homeserver** — energia"
    echo "📅 $(date '+%Y-%m-%d %H:%M')"
    echo ""
    if command -v rtcwake >/dev/null 2>&1 && [ -r /sys/class/rtc/rtc0/wakealarm ]; then
        ALARM=$(cat /sys/class/rtc/rtc0/wakealarm 2>/dev/null || echo "sem alarme")
        if [ -n "$ALARM" ] && [ "$ALARM" != "0" ]; then
            WAKE_TIME=$(date -d "@${ALARM}" '+%Y-%m-%d %H:%M' 2>/dev/null || echo "?")
            echo "⏰ Wake programado: **${WAKE_TIME}**"
        else
            echo "⏰ Wake programado: **nenhum** (sem alarme RTC)"
        fi
    else
        echo "⏰ rtcwake indisponível"
    fi
    echo "🟢 Estado: **acordado**"
    echo ""
    echo "Comandos: /energia status · /energia dormir [HH:MM] · /energia acordar"
    ;;

  dormir)
    WAKE="${2:-${WAKE_DEFAULT}}"
    if ! [[ "$WAKE" =~ ^[0-9]{2}:[0-9]{2}$ ]]; then
        echo "Formato inválido: use HH:MM (ex: 07:30)"
        exit 2
    fi
    NOW=$(date +%s)
    WAKE_EPOCH=$(date -d "today ${WAKE}" +%s 2>/dev/null || echo 0)
    if [ "$WAKE_EPOCH" -le "$NOW" ]; then
        WAKE_EPOCH=$(date -d "tomorrow ${WAKE}" +%s 2>/dev/null || echo 0)
    fi
    log "Dormindo até ${WAKE} (epoch ${WAKE_EPOCH})"
    echo "😴 **Homeserver dormindo** até ${WAKE}..."
    echo "⏰ Wake via RTC agendado."
    # Suspende com alarme RTC (o serviço hs-task-night-off usa o mesmo mecanismo)
    sudo /usr/sbin/rtcwake -m mem -t "${WAKE_EPOCH}" >> "${POWER_LOG}" 2>&1 || sudo systemctl suspend
    ;;

  acordar)
    echo "⚠️ O servidor já está acordado (é ele quem recebe este comando)."
    echo "Se ele estiver dormindo, use WOL do notebook: server-wol.sh"
    ;;

  *)
    echo "Uso: server-power.sh {status|dormir [HH:MM]|acordar}"
    exit 2
    ;;
esac