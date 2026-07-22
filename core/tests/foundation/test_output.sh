#!/usr/bin/env bash

set -euo pipefail

source "../common/test_bootstrap.sh"

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