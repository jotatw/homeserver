#!/usr/bin/env bash
# ==========================================================
# server-power.sh — Energia do homeserver via Telegram
# Instalado no HOMESERVER (roda local, sem SSH; chamado do gateway
# como usuário comum — privilegios apenas via NOPASSWD do sudoers.d:
# power-save.sh, power-restore.sh, auto-suspend.sh, hs.sh).
#
# Uso:
#   server-power.sh status          → agenda + wake real + economia aplicada
#   server-power.sh dormir [HH:MM]  → suspende com RTC wake (default 08:00)
#   server-power.sh acordar         → informativo (WOL é feito de fora)
#
# Fontes de verdade:
#   - wake real: log do night-off (wakealarm cru congela apos disparo)
#   - economia: power-save.sh status (JSON read-only, mesmo sudoers)
# ==========================================================
set -euo pipefail

POWER_LOG="/var/log/homeserver-power.log"
WAKE_DEFAULT="08:00"
HS_CORE="/srv/git/homeserver/core/hs.sh"
POWER_SAVE="/srv/scripts/power-save.sh"
AUTO_SUSPEND="/srv/scripts/auto-suspend.sh"

log() { echo "[$(date '+%F %T')] $*"; }

show_status() {
    echo "🔌 **Homeserver** — energia"
    echo "📅 $(date '+%Y-%m-%d %H:%M')"
    echo ""

    # Proximo wake REAL: o night-off registra no log o horario que decidiu.
    NEXT_WAKE="$(grep "Agendando religamento" "${POWER_LOG}" 2>/dev/null | tail -1 \
        | sed -E 's/.*para ([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}).*/\1/' || true)"
    if [[ -n "${NEXT_WAKE}" ]]; then
        echo "⏰ Proximo wake: **${NEXT_WAKE}**"
    else
        echo "⏰ Proximo wake: **desconhecido** (night-off sem registro no log)"
    fi

    # Agenda oficial (core hs.sh — le scheduler.conf + power-schedule.sh)
    bash "${HS_CORE}" power status 2>/dev/null | python3 -c '
import json, sys
d = json.load(sys.stdin)
print("🕐 Agenda: desliga {} · religa {} · {}".format(
    d.get("shutdown", "?"), d.get("wake", "?"),
    "ativa" if d.get("enabled") else "inativa"))' 2>/dev/null || true

    # Economia aplicada (power-save.sh status: JSON read-only via NOPASSWD)
    sudo -n "${POWER_SAVE}" status 2>/dev/null | python3 -c '
import json, sys
d = json.load(sys.stdin)
tela = {"1": "desligada", "0": "ligada"}.get(str(d.get("screen_blank")), "?")
sp = d.get("hdd_spindown", "?")
sp = {"0": "sem spindown"}.get(str(sp), "spindown " + str(sp) if sp and sp != "desconhecido" else "?")
print("💤 Economia: GPU {} ({}) · tela {} · HDD {}".format(
    d.get("gpu_control", "?"), d.get("gpu_runtime", "?"), tela, sp))' 2>/dev/null || true

    echo "🟢 Estado: **acordado**"
    echo ""
    echo "Comandos: /energia status · /energia dormir [HH:MM] · /energia acordar"
}

do_dormir() {
    local wake="${1:-${WAKE_DEFAULT}}"
    if ! [[ "${wake}" =~ ^[0-9]{2}:[0-9]{2}$ ]]; then
        echo "Formato inválido: use HH:MM (ex: 07:30)"
        exit 2
    fi
    echo "😴 **Homeserver dormindo** — wake agendado para ${wake}..."
    # auto-suspend.sh --force pula a checagem de ociosidade e faz o rtcwake
    # + desabilitacao de wakes espureos (mesmo mecanismo do night-off).
    # NOPASSWD via /etc/sudoers.d/hs-power. A saida do rtcwake (quando
    # ACORDA) encerra este comando — a sessao Telegram morre junto, sem mal.
    exec sudo -n "${AUTO_SUSPEND}" --force "--wake=${wake}"
}

case "${1:-status}" in
  status)  show_status ;;
  dormir)  do_dormir "${2:-}" ;;
  acordar)
    echo "⚠️ O servidor já está acordado (é ele quem recebe este comando)."
    echo "Se ele estiver dormindo, use WOL do notebook: server-wol.sh"
    ;;
  *)
    echo "Uso: server-power.sh {status|dormir [HH:MM]|acordar}"
    exit 2
    ;;
esac
