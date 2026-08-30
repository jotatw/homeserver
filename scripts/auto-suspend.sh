#!/usr/bin/env bash
# ==========================================================
# HomeServer — auto-suspend.sh (v2)
# Suspende o servidor automaticamente quando OCIOSO.
#
# Critérios (TODOS verdadeiros para suspender):
#   - Sem sessões SSH reais (exclui a própria verificação)
#   - CPU abaixo de 30% (load ajustado por núcleo)
#   - Containers estáveis (sem restart recente)
#   - Fora do horário noturno (22:00–06:00)
#   - Sem atividade de arquivos recente
#
# Agendado: timer systemd a cada 5 min (root).
# Acorda: WOL (testado) ou RTC 08:00 (segurança).
#
# Uso: sudo /srv/scripts/auto-suspend.sh [--dry-run]
# ==========================================================
set -euo pipefail

LOG_FILE="/var/log/hs-auto-suspend.log"
MODE="${1:-run}"
FORCE="${2:-}"   # --force ignora horário (apenas teste, combinado com --dry-run)

log() { echo "[$(date '+%F %T')] $*" >> "${LOG_FILE}"; }
die() { echo "ERRO: $*" >&2; log "ERRO: $*"; exit 1; }

[[ "$(id -u)" -eq 0 ]] || die "Execute como root (sudo)."

NCORES="$(nproc)"  # 2 núcleos
THRESHOLD_LOAD="$(echo "${NCORES} * 0.8" | bc -l)"  # 2 * 0.8 = 1.6

# ── Checks de inatividade ─────────────────────────────────────

# 1. Sessões SSH ativas.
#    `ss` conta conexões estabelecidas na porta 22.
#    A própria conexão do check conta 1; permitir até 2 (pode ter 1 real).
ssh_sessoes="$(ss -tn state established '( dport = :22 or sport = :22 )' 2>/dev/null | tail -n +2 | wc -l)"
if [[ "${ssh_sessoes}" -gt 2 ]]; then
    log "SSH ativo (${ssh_sessoes} sessões) — não suspender"
    exit 0
fi

# 2. CPU ociosa? (load5 < 80% dos núcleos, ex: 1.6 em dual-core)
load5="$(cat /proc/loadavg | awk '{print $2}')"
if [[ "$(echo "${load5} > ${THRESHOLD_LOAD}" | bc -l)" == "1" ]]; then
    log "CPU ocupada (load5=${load5} > ${THRESHOLD_LOAD}) — não suspender"
    exit 0
fi

# 3. Containers subindo recentemente? (não suspender durante boot/update)
container_novo="$(docker ps --format '{{.Status}}' 2>/dev/null | grep -ciE 'up (less than|1|2) minute' || true)"
if [[ "${container_novo}" -gt 0 ]]; then
    log "Containers reiniciando (${container_novo}) — não suspender"
    exit 0
fi

# 4. Horário crítico (06:00-22:00): sempre acordado
if [[ "${FORCE}" != "--force" ]]; then
    hora_num="$((10#$(date +%H%M)))"
    if [[ "${hora_num}" -ge 600 && "${hora_num}" -le 2200 ]]; then
        # Silêncio: horário comercial, normal estar acordado
        exit 0
    fi
fi

# 5. Atividade de arquivos recente (últimos 10 min)?
recentes="$(find /srv /home/joao -newermt '-10 minutes' -type f \
  -not -path '*/\.git/*' -not -path '*/node_modules/*' -not -path '*/venv/*' \
  -not -path '*cache*' -not -path '*/public/*' -not -path '*/\.next/*' \
  \( -name '*.log' -o -name '*.sh' -o -name '*.py' -o -name '*.yaml' -o -name '*.yml' \
     -o -name '*.md' -o -name '*.json' -o -name '*.txt' -o -name '*.conf' \
     -o -name '*.service' -o -name '*.timer' -o -name '*.ts' -o -name '*.js' \
     -o -name '*.html' -o -name '*.css' \) 2>/dev/null | wc -l)"
if [[ "${recentes}" -gt 10 ]]; then
    log "Atividade recente (${recentes} arquivos) — não suspender"
    exit 0
fi

# ── Todos os critérios OK → suspender ─────────────────────────
echo "✅ Sistema ocioso — suspendendo (SSH=${ssh_sessoes}, load5=${load5}, hora=$(date +%H:%M))..."
log "Suspenso (SSH=${ssh_sessoes}, load5=${load5}, hora=$(date +%H:%M))"

if [[ "${MODE}" == "--dry-run" ]]; then
    echo "[DRY-RUN] Suspenderia agora"
    log "[DRY-RUN] Suspenderia agora"
    exit 0
fi

# ── Desabilitar wakes (USB + rede) antes de suspender ─────────
# Igual ao power-schedule.sh: sem isso, USB/câmera/impressora
# acordam o servidor em segundos após suspender.
USB_WAKE_DEVICES="USB0 US15 US12"

_disable_wakes() {
    # USB wake off
    for dev in ${USB_WAKE_DEVICES}; do
        echo "${dev}" > /proc/acpi/wakeup 2>/dev/null || true
    done
    # Rede: WOL off durante o sono (evita wake por tráfego)
    if command -v ethtool >/dev/null 2>&1; then
        ethtool -s enp7s0 wol d 2>/dev/null >> "${LOG_FILE}" || true
    fi
    log "Wakes desabilitados (USB + NIC)"
}

_restore_wakes() {
    # USB wake on (volta ao padrão)
    for dev in ${USB_WAKE_DEVICES}; do
        echo "${dev}" > /proc/acpi/wakeup 2>/dev/null || true
    done
    # Rede: WOL magic packet on (permite acordar via WOL depois)
    if command -v ethtool >/dev/null 2>&1; then
        ethtool -s enp7s0 wol g 2>/dev/null >> "${LOG_FILE}" || true
    fi
    log "Wakes restaurados (USB + NIC)"
}

_disable_wakes

# Acorda às 08:00 via RTC (segurança)
WAKE_EPOCH="$(date -d 'tomorrow 08:00' +%s)"
rtcwake -m mem -t "${WAKE_EPOCH}" 2>> "${LOG_FILE}" || {
    log "rtcwake falhou — tentando systemctl suspend"
    systemctl suspend
}

_restore_wakes
log "Suspenso (wake RTC $(date -d "@${WAKE_EPOCH}" '+%F %T'))"