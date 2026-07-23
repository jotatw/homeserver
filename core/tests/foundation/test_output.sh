#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "${SCRIPT_DIR}/../bootstrap.sh"

echo "========================================"
echo " HomeServer Core"
echo " Output Test"
echo "========================================"
echo

info "Inicializando HomeServer..."

success "Foundation carregado."

warning "Arquivo de exemplo."

error "Mensagem de teste."

echo
echo "Teste concluído."