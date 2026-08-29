#!/usr/bin/env bash
# ==========================================================
# HomeServer — power-restore.sh
# Reverte as configurações de energia aplicadas por power-save.sh.
#
# Uso:
#   sudo /srv/scripts/power-restore.sh            # restaura estado salvo
#   sudo /srv/scripts/power-restore.sh --default  # volta para valores de fábrica
# ==========================================================
set -euo pipefail

STATE_FILE="/var/log/hs-power-state.json"
LOG_FILE="/var/log/hs-power-save.log"
MODE="${1:-saved}"

log() { echo "[$(date '+%F %T')] $*" >> "${LOG_FILE}"; }
die() { log "ERRO: $*"; echo "ERRO: $*" >&2; exit 1; }

[[ "$(id -u)" -eq 0 ]] || die "Execute como root (sudo)."

GPU_CTRL="/sys/class/drm/card0/device/power/control"

if [[ "${MODE}" == "--default" ]]; then
    echo "Modo DEFAULT — restaurando valores de fábrica:"
    GPU_VAL="on"
    DISK_VAL="0"
    echo "  GPU power control: ${GPU_VAL}"
    echo "  HDD spindown: ${DISK_VAL} (desligado)"
    log "Modo --default: GPU=on, HDD spindown=0"
else
    [[ -f "${STATE_FILE}" ]] || die "Estado original não encontrado. Rode power-save.sh primeiro."
    echo "Modo SAVED — lendo estado original salvo:"
    GPU_VAL="$(python3 -c "import json; print(json.load(open('${STATE_FILE}'))['gpu_power_control'])" 2>/dev/null || echo on)"
    DISK_VAL="$(python3 -c "import json; print(json.load(open('${STATE_FILE}'))['disk_standby_timeout'])" 2>/dev/null || echo 0)"
    # Guardar: se desconhecido, não mexer no disco
    if [[ "${DISK_VAL}" =~ ^[0-9]+$ ]]; then
        : # válido
    else
        DISK_VAL=""
    fi
    echo "  GPU: ${GPU_VAL} | HDD: ${DISK_VAL:-não alterar}"
fi

# ── 1. GPU — restaurar power control ─────────────────────────
echo "1/3 GPU: restaurando (${GPU_VAL})..."
if [[ -f "${GPU_CTRL}" ]]; then
    echo "${GPU_VAL}" > "${GPU_CTRL}" && log "GPU: -> ${GPU_VAL}" || log "GPU: falha ao setar ${GPU_VAL}"
fi

# ── 2. Tela — reativar framebuffer ───────────────────────────
echo "2/3 Tela: reativando saída de vídeo..."
echo 0 > /sys/class/graphics/fb0/blank 2>/dev/null && log "Tela: fb0 unblank" || log "Tela: sem fb0"

# ── 3. HDD — restaurar timeout ───────────────────────────────
echo "3/3 HDD: restaurando timeout..."
if command -v hdparm >/dev/null 2>&1; then
    if [[ -n "${DISK_VAL}" ]]; then
        hdparm -S "${DISK_VAL}" /dev/sda 2>/dev/null >> "${LOG_FILE}" && log "HDD: spindown -> ${DISK_VAL}" || log "HDD: hdparm falhou"
    else
        log "HDD: valor desconhecido, não alterado"
    fi
else
    log "HDD: hdparm não instalado"
fi

echo ""
echo "✅ Configurações restauradas (modo: ${MODE})."
echo "   Reaplicar economia: sudo /srv/scripts/power-save.sh"