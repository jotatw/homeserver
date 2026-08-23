#!/usr/bin/env bash
# ==========================================================
# HomeServer — service-watchdog
#
# Verifica os serviços habilitados (config/services.conf) e
# reinicia qualquer um que não esteja 'running'. Registra no
# log de eventos (homeserver-watchdog.log), que alimenta o feed.
#
# Desabilitável sem quebrar o núcleo: basta desativar a tarefa
#   hs scheduler disable service-watchdog
# ==========================================================

set -euo pipefail

HS_PROJECT_ROOT="${HS_PROJECT_ROOT:-/srv/git/homeserver}"
HS_LOG_DIR="${HS_LOG_DIR:-/var/log}"
if [[ -d "/host/var/log" ]]; then
    HS_LOG_DIR="/host/var/log"
fi
LOG_FILE="${HS_LOG_DIR}/homeserver-watchdog.log"
CONF="${HS_PROJECT_ROOT}/config/services.conf"

log() {
    # Tolerante a falha de permissão (execução como usuário comum não
    # deve abortar a verificação — o timer roda como root e consegue gravar).
    printf '[%s] %s\n' "$(date '+%F %T')" "$*" >> "${LOG_FILE}" 2>/dev/null || true
}

# Serviços habilitados (config/services.conf, linhas não-comentadas).
enabled_services() {
    [[ -f "${CONF}" ]] || return 0
    grep -vE '^[[:space:]]*(#|$)' "${CONF}" 2>/dev/null || true
}

log "[watchdog] Iniciando verificação"

restarted=0
failed=0

while IFS= read -r svc; do
    [[ -n "${svc}" ]] || continue

    state="$(docker inspect -f '{{.State.Status}}' "${svc}" 2>/dev/null || echo "unknown")"
    if [[ "${state}" == "running" ]]; then
        continue
    fi

    log "[watchdog] ${svc} está ${state} — reiniciando"
    if docker start "${svc}" >/dev/null 2>&1 || \
       bash "${HS_PROJECT_ROOT}/core/hs.sh" service start "${svc}" >/dev/null 2>&1; then
        log "[watchdog] ${svc} reiniciado com sucesso"
        restarted=$((restarted + 1))
    else
        log "[watchdog] FALHA ao reiniciar ${svc}"
        failed=$((failed + 1))
    fi
done < <(enabled_services)

log "[watchdog] Verificação concluída: ${restarted} reiniciados, ${failed} falhas"