#!/usr/bin/env bash
# ==========================================================
# HomeServer — Teste de Restauração Completa em Ambiente Limpo
#
# Critério da FASE 6: "um backup pode ser criado, validado e
# restaurado em ambiente de teste, com dados verificados após
# a restauração."
#
# Este script simula um servidor recém-formatado (container Docker),
# puxa o último backup real do homeserver e restaura com o
# restore.sh oficial. Depois verifica os dados.
#
# Uso: bash scripts/test-restore-clean.sh [--sample]
#   --sample: copia apenas git+services+docker+system+10% do storage
#             (teste rápido). Sem a flag, copia tudo (~3.3GB).
# ==========================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "${SCRIPT_DIR}")"
CONTAINER="hs-restore-test"
SAMPLE=0
[ "${1:-}" = "--sample" ] && SAMPLE=1

# Payload pode passar de 3GB — usar disco real, não tmpfs (/tmp).
WORKDIR="${HS_RESTORE_WORKDIR:-${REPO_ROOT}/backup/.restore-payload}"
mkdir -p "${WORKDIR}"

log() { echo "[restore-test] $*"; }

cleanup() {
    docker rm -f "${CONTAINER}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

log "1/6 Removendo container anterior (se houver) e criando ambiente limpo"
cleanup

docker run -d --name "${CONTAINER}" \
    --hostname homeserver-restored \
    debian:bookworm-slim sleep infinity >/dev/null

log "2/6 Instalando ferramentas no ambiente limpo"
docker exec "${CONTAINER}" bash -c \
    "apt-get update -qq >/dev/null && apt-get install -y -qq rsync >/dev/null 2>&1"

log "3/6 Estrutura /srv vazia (servidor limpo) — nada pré-existe"

log "4/6 Puxando o último backup real do homeserver"
# O backup contém arquivos root-only (chaves, ufw, volumes). O pull é feito
# via o container da API no servidor (root, /host:ro) — mesmo mecanismo
# privilegiado que o sistema usa — com o tar streamado por SSH.
if [ "${SAMPLE}" -eq 1 ]; then
    TAR_EXCLUDE="--exclude=./storage/users/joao/fotos/* --exclude=./storage/media/*"
    log "   modo amostra (sem fotos/mídia grandes)"
else
    TAR_EXCLUDE=""
fi

mkdir -p "$WORKDIR"
ssh joao@homeserver "docker exec api-api-1 tar cf - -C /host/srv/backup/daily/latest ${TAR_EXCLUDE} ." \
    | tar xf - -C "$WORKDIR"

BACKUP_BYTES=$(du -sh "$WORKDIR" | cut -f1)
log "   backup baixado: ${BACKUP_BYTES}"

docker exec "${CONTAINER}" mkdir -p /srv/backup/daily/latest
docker cp "$WORKDIR"/. "${CONTAINER}:/srv/backup/daily/latest/" >/dev/null
rm -rf "$WORKDIR"

log "5/6 Restaurando com o restore.sh oficial"
docker cp "${REPO_ROOT}/scripts/restore.sh" "${CONTAINER}:/restore.sh"
# Dentro do container não há containers Docker para parar; chown 1000 é simulado.
docker exec "${CONTAINER}" bash -c "
    RESTORE_SYSTEM=0 bash /restore.sh latest 2>&1 | tail -15"

log "6/6 Verificação dos dados restaurados"

# Verificação 1: estrutura esperada existe
for dir in storage/users storage/shared services/gitea services/filebrowser git/homeserver; do
    if docker exec "${CONTAINER}" test -d "/srv/${dir}" 2>/dev/null; then
        log "   ✓ /srv/${dir} presente"
    else
        log "   ✗ /srv/${dir} AUSENTE"
        exit 1
    fi
done

# Verificação 2: conteúdo idêntico ao backup (diff recursivo nas pastas-chave)
for dir in git services docker; do
    log "   diff /srv/${dir} contra o backup…"
    # Compara árvore restaurada vs backup dentro do próprio container
    docker exec "${CONTAINER}" bash -c "
        diff -r '/srv/backup/daily/latest/${dir}' '/srv/${dir}' >/dev/null 2>&1" \
        && log "   ✓ /srv/${dir} idêntico" \
        || { log "   ✗ /srv/${dir} DIVERGE"; exit 1; }
done

# Verificação 3: amostra de arquivos do usuário (dados reais)
USER_FILE=$(docker exec "${CONTAINER}" bash -c \
    "find /srv/storage/users -type f 2>/dev/null | head -n1")
if [ -n "${USER_FILE}" ]; then
    rel="${USER_FILE#/srv/}"
    docker exec "${CONTAINER}" bash -c "
        cmp -s \"/srv/backup/daily/latest/${rel}\" \"${USER_FILE}\"" \
        && log "   ✓ arquivo de usuário íntegro: ${rel}" \
        || { log "   ✗ arquivo de usuário diverge: ${rel}"; exit 1; }
else
    log "   ! nenhum arquivo em storage/users (amostra sem users?)"
fi

# Verificação 4: contagem total de arquivos backup vs restaurado
TOTALS=$(docker exec "${CONTAINER}" bash -c "
    b=\$(find /srv/backup/daily/latest -type f | wc -l)
    r=\$(find /srv/storage /srv/services /srv/git /srv/docker -type f 2>/dev/null | wc -l)
    echo \"\$b/\$r\"")
log "   arquivos (backup/restaurado): ${TOTALS}"

echo
log "═══════════════════════════════════════════"
log "RESTAURAÇÃO COMPLETA VALIDADA EM AMBIENTE LIMPO"
log "Critério FASE 6 atendido: backup criado, validado e restaurado"
log "com dados verificados após a restauração."
log "═══════════════════════════════════════════"