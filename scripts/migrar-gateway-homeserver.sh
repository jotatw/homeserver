#!/usr/bin/env bash
# ==========================================================
# migrar-gateway-homeserver.sh
# Pacote de migração: instala o Hermes gateway no homeserver
# e copia config, scripts e skills do notebook.
#
# DEVE ser executado do NOTEBOOK (tem acesso SSH ao homeserver).
# O homeserver precisa estar ACORDADO (ex: após RTC 08:00).
#
# Uso: bash migrar-gateway-homeserver.sh [--dry-run]
# ==========================================================
set -euo pipefail

DRY_RUN="${1:-}"
HOST="joao@homeserver"
SSH_OPTS=(-o ConnectTimeout=15 -o BatchMode=yes)
NOTEBOOK_HERMES="$HOME/.hermes"
SERVER_HERMES="/home/joao/.hermes"

log() { echo "[$(date '+%H:%M:%S')] $*"; }

# ── 0. Servidor acordado? ────────────────────────────────────
log "Verificando se o homeserver está acordado..."
if ! ssh "${SSH_OPTS[@]}" "${HOST}" 'true' 2>/dev/null; then
    echo "ERRO: homeserver offline. Aguarde o RTC (08:00) ou acorde manualmente."
    exit 1
fi
log "Servidor online ✓"

if [ "$DRY_RUN" = "--dry-run" ]; then
    log "MODO DRY-RUN — apenas mostrando o plano (nada será executado)"
    echo ""
fi

run() {
    if [ "$DRY_RUN" = "--dry-run" ]; then
        echo "  [PLAN] $*"
    else
        "$@"
    fi
}

# ── 1. Instalar Python venv + hermes-agent no servidor ────────
log "Passo 1: Instalar hermes-agent no homeserver"
run ssh "${SSH_OPTS[@]}" "${HOST}" \
    'mkdir -p ~/hermes-setup && cd ~/hermes-setup && \
     python3 -m venv venv 2>/dev/null || python3 -m venv --without-pip venv; \
     echo "venv criado"'

# Instalar pip dentro do venv se necessário
run ssh "${SSH_OPTS[@]}" "${HOST}" \
    '~/hermes-setup/venv/bin/python -m ensurepip --upgrade 2>/dev/null || true; \
     ~/hermes-setup/venv/bin/pip --version 2>/dev/null || echo "pip indisponivel"'

# ── 2. Copiar config, .env, scripts, skills ──────────────────
log "Passo 2: Copiar config, .env, scripts e skills"
run ssh "${SSH_OPTS[@]}" "${HOST}" "mkdir -p ${SERVER_HERMES}/scripts ${SERVER_HERMES}/skills"

# rsync se disponível, senão scp
if command -v rsync >/dev/null 2>&1; then
    run rsync -az --delete -e "ssh ${SSH_OPTS[*]}" \
        "${NOTEBOOK_HERMES}/scripts/" "${HOST}:${SERVER_HERMES}/scripts/"
    run rsync -az -e "ssh ${SSH_OPTS[*]}" \
        "${NOTEBOOK_HERMES}/skills/" "${HOST}:${SERVER_HERMES}/skills/"
else
    run scp "${SSH_OPTS[@]}" -r "${NOTEBOOK_HERMES}/scripts/"* "${HOST}:${SERVER_HERMES}/scripts/"
    run scp "${SSH_OPTS[@]}" -r "${NOTEBOOK_HERMES}/skills/"* "${HOST}:${SERVER_HERMES}/skills/"
fi

# config.yaml e .env (com cuidado para não expor segredos no log)
log "Copiando config.yaml e .env (segredos preservados)"
run scp "${SSH_OPTS[@]}" "${NOTEBOOK_HERMES}/config.yaml" "${HOST}:${SERVER_HERMES}/config.yaml"
run scp "${SSH_OPTS[@]}" "${NOTEBOOK_HERMES}/.env" "${HOST}:${SERVER_HERMES}/.env"

# ── 3. Ajustar config para o servidor ─────────────────────────
log "Passo 3: Ajustar paths locais no config (se necessário)"
log "  (verificação manual após cópia)"

# ── 4. Instalar gateway como serviço systemd no servidor ──────
log "Passo 4: Instalar gateway como serviço systemd"
run ssh "${SSH_OPTS[@]}" "${HOST}" \
    "cd ~/hermes-setup && \
     if [ ! -f venv/bin/hermes ]; then \
       venv/bin/pip install hermes-agent 2>&1 | tail -3 || echo 'INSTALL_FALHOU'; \
     else \
       echo 'hermes ja instalado'; \
     fi"

log ""
log "=========================================="
log "MIGRAÇÃO PREPARADA"
log ""
log "Próximos passos manuais após o install:"
log "  1. ssh homeserver: hermes gateway install --start-now"
log "  2. Verificar: hermes gateway status"
log "  3. Testar: enviar /ajuda no Telegram"
log "  4. Parar gateway no notebook: hermes gateway stop"
log "=========================================="