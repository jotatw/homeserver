#!/usr/bin/env bash

# ==========================================================
# HomeServer
# Script : deploy.sh
# Objetivo:
#   Atualizar e iniciar um serviço Docker Compose.
#
# Uso:
#   ./deploy.sh <servico>
#
# Exemplo:
#   ./deploy.sh homepage
# ==========================================================

set -euo pipefail

# Diretório onde ficam todos os serviços
COMPOSE_ROOT="/srv/docker/compose"

# Serviço informado pelo usuário
SERVICE="${1:-}"

# ----------------------------------------------------------
# Validação
# ----------------------------------------------------------

if [[ -z "$SERVICE" ]]; then
    echo
    echo "Uso:"
    echo "  ./deploy.sh <servico>"
    echo
    exit 1
fi

SERVICE_DIR="${COMPOSE_ROOT}/${SERVICE}"

if [[ ! -d "$SERVICE_DIR" ]]; then
    echo
    echo "Serviço não encontrado:"
    echo "  ${SERVICE}"
    echo
    exit 1
fi

echo
echo "========================================"
echo " HomeServer - Deploy"
echo "========================================"
echo
echo "Serviço : ${SERVICE}"
echo "Pasta   : ${SERVICE_DIR}"
echo

cd "$SERVICE_DIR"

# ----------------------------------------------------------
# Validação do Compose
# ----------------------------------------------------------

echo "[1/4] Validando compose..."

docker compose config > /dev/null

echo "OK"

# ----------------------------------------------------------
# Atualização da imagem
# ----------------------------------------------------------

echo
echo "[2/4] Atualizando imagem..."

docker compose pull

echo "OK"

# ----------------------------------------------------------
# Inicialização
# ----------------------------------------------------------

echo
echo "[3/4] Iniciando serviço..."

docker compose up -d

echo "OK"

# ----------------------------------------------------------
# Status
# ----------------------------------------------------------

echo
echo "[4/4] Status"

docker compose ps

echo
echo "========================================"
echo " Deploy concluído"
echo "========================================"