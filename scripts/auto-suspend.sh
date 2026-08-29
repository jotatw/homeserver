#!/usr/bin/env bash
# ==========================================================
# HomeServer — auto-suspend.sh
# Suspende o servidor automaticamente quando OCIOSO:
#   - Sem sessões SSH ativas (exceto a própria verificação)
#   - CPU abaixo de 5% (média 5min)
#   - Sem containers reiniciando (uptime > 2min)
#   - Fora do horário crítico (06:00-22:00 sempre acordado)
#
# Agendado via scheduler a cada 5min (systemd timer root).
# Acorda via WOL (testado) ou RTC (08:00).
#
# Uso: sudo /srv/scripts/auto-suspend.sh [--dry-run] [--force]
# ==========================================================
set -euo pipefail

LOG_FILE="/var/log/hs-auto-suspend.log"
MODE="${1:-run}"
HORA_ATUAL="$(date +%H:%M)"
HORA_NUM="$(date +%H%M)"

log() { echo "[$(date '+%F %T')] $*" >> "${LOG_FILE}"; }
die() { log "ERRO: $*"; echo "ERRO: $*" >&2; exit 1; }

[[ "$(id -u)" -eq 0 ]] || die "Execute como root (sudo)."

# ── Checks de inatividade ─────────────────────────────────────

# 1. Sessões SSH ativas? (exclui a nossa própria checagem)
ssh_sessoes="$(ss -tn state established '( dport = :22 or sport = :22 )' 2>/dev/null | tail -n +2 | wc -l)"
# A própria conexão do check conta 1; permitir até 2 (pode ter 1 real)
if [[ "${ssh_sessoes}" -gt 2 ]]; then
    log "SSH ativo (${ssh_sessoes} conexões) — não suspender"
    echo "SSH ativo: ${ssh_sessoes} conexões"
    exit 0
fi

# 2. CPU ociosa? (load avg 5min < 0.5 em ~2 cores)
load5="$(cat /proc/loadavg | awk '{print $2}')"
if [[ "$(echo "${load5} > 0.5" | bc 2>/dev/null || echo 1)" == "1" ]]; then
    log "CPU ocupada (load5=${load5}) — não suspender"
    echo "CPU ocupada: load5=${load5}"
    exit 0
fi

# 3. Containers subindo recentemente? (não suspender durante boot/update)
container_novo="$(docker ps --format '{{.Status}}' 2>/dev/null | grep -ciE 'up (less than|1|2) minute' || true)"
if [[ "${container_novo}" -gt 0 ]]; then
    log "Containers reiniciando — não suspender"
    echo "Containers reiniciando"
    exit 0
fi

# 4. Horário crítico (06:00-22:00): sempre acordado
if [[ "${HORA_NUM}" -ge 600 && "${HORA_NUM}" -le 2200 ]]; then
    log "Horário crítico (${HORA_ATUAL}) — não suspender"
    echo "Horário crítico (${HORA_ATUAL}) — aguardando"
    exit 0
fi

# 5. Última atividade recente (arquivos modificados nos últimos 10min)?
recentes="$(find /srv /home/joao -newermt '-10 minutes' -type f 2>/dev/null | wc -l)"
if [[ "${recentes}" -gt 5 ]]; then
    log "Atividade recente (${recentes} arquivos) — não suspender"
    echo "Atividade recente: ${recentes} arquivos"
    exit 0
fi

echo "✅ Sistema ocioso — suspendendo..."
log "Sistema ocioso — suspendendo (SSH=${ssh_sessoes}, load5=${load5}, hora=${HORA_ATUAL})"

if [[ "${MODE}" == "--dry-run" ]]; then
    echo "[DRY-RUN] Suspenderia agora (sem executar)"
    log "[DRY-RUN] Suspenderia agora"
    exit 0
fi

# Acorda às 08:00 via RTC (segurança), suspende agora
WAKE_EPOCH="$(date -d 'tomorrow 08:00' +%s)"
rtcwake -m mem -t "${WAKE_EPOCH}" 2>> "${LOG_FILE}" || {
    log "rtcwake falhou — tentando systemctl suspend"
    systemctl suspend
}
log "Suspenso (wake RTC $(date -d "@${WAKE_EPOCH}" '+%F %T'))"