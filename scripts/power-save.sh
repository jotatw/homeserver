#!/usr/bin/env bash
# ==========================================================
# HomeServer — power-save.sh
# Aplica automações de energia, SALVA o estado original para
# reversão, e reporta o estado em modo leitura.
#
# Uso: sudo /srv/scripts/power-save.sh           # aplica
#      sudo /srv/scripts/power-save.sh status    # só reporta (JSON, read-only)
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
# hdparm nao esta no PATH de sessoes systemd/cron (so /usr/sbin)
HDPARM="/usr/sbin/hdparm"

disk_spindown() {
    # -S responde 0 (desligado) ou o timeout; pode falhar em disco USB.
    "${HDPARM}" -S /dev/sda 2>/dev/null | grep -oE '[0-9]+' | head -1 || echo "desconhecido"
}

collect_state() {
    local gpu_ctrl gpu_runtime disk_timeout
    gpu_ctrl="$(cat "${GPU_CTRL}" 2>/dev/null || echo desconhecido)"
    gpu_runtime="$(cat "${GPU_RUNTIME}" 2>/dev/null || echo desconhecido)"
    disk_timeout="$(disk_spindown)"
    cat <<EOF
{
  "gpu_power_control": "${gpu_ctrl}",
  "gpu_runtime": "${gpu_runtime}",
  "disk_standby_timeout": "${disk_timeout}"
}
EOF
}

# ── Modo status: read-only, JSON numa linha (API/App consomem) ──
if [[ "${1:-apply}" == "status" ]]; then
    gpu_ctrl="$(cat "${GPU_CTRL}" 2>/dev/null || echo desconhecido)"
    gpu_runtime="$(cat "${GPU_RUNTIME}" 2>/dev/null || echo desconhecido)"
    disk_timeout="$(disk_spindown)"
    screen_blank="desconhecido"
    [[ -f /sys/class/graphics/fb0/blank ]] && screen_blank=$(cat /sys/class/graphics/fb0/blank 2>/dev/null || echo desconhecido)
    state_saved="false"
    [[ -f "${STATE_FILE}" ]] && state_saved="true"
    printf '{"gpu_control":"%s","gpu_runtime":"%s","hdd_spindown":"%s","screen_blank":"%s","state_saved":%s}\n' \
        "${gpu_ctrl}" "${gpu_runtime}" "${disk_timeout}" "${screen_blank}" "${state_saved}"
    exit 0
fi

# SALVAR o estado ANTES de qualquer mudança — mas NUNCA sobrescrever um
# estado salvo por uma aplicação ativa: se o control já está "auto", o
# power-save rodou antes e re-coletar agora gravaria o estado modificado
# como se fosse o original (destrói a reversão).
if [[ "$(cat "${GPU_CTRL}" 2>/dev/null || echo on)" == "auto" && -f "${STATE_FILE}" ]]; then
    log "Estado ja salvo de aplicacao anterior — mantendo ${STATE_FILE}"
else
    STATE_PREVIO="$(collect_state)"
    echo "${STATE_PREVIO}" > "${STATE_FILE}"
    log "Estado original salvo ANTES das mudanças: ${STATE_PREVIO}"
fi

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

# ── 3. HDD — spindown após 15min de ociosidade (hdparm) ──────
echo "3/4 HDD: agendando spindown (15min)..."
if [[ -x "${HDPARM}" ]]; then
    "${HDPARM}" -S 180 /dev/sda 2>/dev/null >> "${LOG_FILE}" && log "HDD: spindown 180 (15min)" || log "HDD: hdparm -S falhou"
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