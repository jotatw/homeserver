#!/usr/bin/env bash
# ==========================================================
# HomeServer — power-save.sh
# Aplica automações de economia de energia e SALVA o estado
# original para permitir reversão via power-restore.sh.
#
# Uso: sudo /srv/scripts/power-save.sh
#      (NOPASSWD configurado em /etc/sudoers.d/hs-power)
#
# Reverter: sudo /srv/scripts/power-restore.sh
# ==========================================================
set -euo pipefail

STATE_FILE="/var/log/hs-power-state.json"
LOG_FILE="/var/log/hs-power-save.log"

log() { echo "[$(date '+%F %T')] $*" >> "${LOG_FILE}"; }
die() { log "ERRO: $*"; echo "ERRO: $*" >&2; exit 1; }

[[ "$(id -u)" -eq 0 ]] || die "Execute como root (sudo)."

# ── Estado original (coletar ANTES de mudar) ─────────────────
NIC="enp7s0"
GPU_CTRL="/sys/class/drm/card0/device/power/control"
GPU_RUNTIME="/sys/class/drm/card0/device/power/runtime_status"

collect_state() {
    local gpu_ctrl gpu_runtime disk_timeout
    gpu_ctrl="$(cat "${GPU_CTRL}" 2>/dev/null || echo desconhecido)"
    gpu_runtime="$(cat "${GPU_RUNTIME}" 2>/dev/null || echo desconhecido)"
    disk_timeout="$(hdparm -S /dev/sda 2>/dev/null | grep -oE '[0-9]+' | head -1 || echo desconhecido)"
    cat <<EOF
{
  "gpu_power_control": "${gpu_ctrl}",
  "gpu_runtime": "${gpu_runtime}",
  "disk_standby_timeout": "${disk_timeout}"
}
EOF
}

# SALVAR o estado ANTES de qualquer mudança (crítico para reversão)
STATE_PREVIO="$(collect_state)"
echo "${STATE_PREVIO}" > "${STATE_FILE}"
log "Estado original salvo ANTES das mudanças: ${STATE_PREVIO}"

# ── 1. GPU (nouveau) — runtime PM auto (dorme quando ociosa) ─
echo "1/4 GPU: suspend automático (runtime PM)..."
if [[ -f "${GPU_CTRL}" ]]; then
    echo auto > "${GPU_CTRL}" && log "GPU runtime PM -> auto" || log "GPU: falha ao setar auto"
else
    log "GPU: ${GPU_CTRL} não existe"
fi

# ── 2. Tela — desligar saída DVI (headless) ───────────────────
echo "2/4 Tela: desligando saída de vídeo..."
# Blank do framebuffer = desliga a saída DVI (economiza GPU+porta)
echo 1 > /sys/class/graphics/fb0/blank 2>/dev/null && log "Tela: fb0 blank (saída DVI desligada)" || log "Tela: sem fb0 (ignorado)"

# ── 3. HDD — spindown após 15min de ociosidade (hddparm) ─────
echo "3/4 HDD: agendando spindown (15min)..."
if command -v hdparm >/dev/null 2>&1; then
    hdparm -S 180 /dev/sda 2>/dev/null >> "${LOG_FILE}" && log "HDD: spindown 180 (15min)" || log "HDD: hdparm -S falhou"
else
    log "HDD: hdparm não instalado (instale: apt-get install hdparm)"
fi

# ── 4. CPU — governor schedutil (já adequado, manter) ────────
echo "4/4 CPU: governor schedutil (mantido — já economiza)"

# ── Salvar estado original ────────────────────────────────────
# (JÁ salvo ANTES das mudanças acima — não sobrescrever aqui)
log "Economia aplicada."
echo ""
echo "✅ Economia aplicada. Estado original salvo."
echo "   Reverter: sudo /srv/scripts/power-restore.sh"