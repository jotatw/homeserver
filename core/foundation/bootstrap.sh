#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: bootstrap.sh
# Módulo.......: Foundation
#
# Objetivo.....:
# Inicializar o HomeServer Core.
#
# Responsabilidades:
#   - Localizar o diretório do Core
#   - Preparar o ambiente de execução
#   - Carregar o Loader
#   - Controlar a sequência de inicialização
#
# Dependências:
#   - foundation/lib.sh
#
# ==========================================================

# ----------------------------------------------------------
# Variáveis Globais
# ----------------------------------------------------------

declare -gx HS_CORE_ROOT

# ----------------------------------------------------------
# Funções Privadas
# ----------------------------------------------------------

#
# Prepara o ambiente de execução do Core.
#
_prepare_environment() {

    HS_CORE_ROOT="$(
        cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd
    )"

    export HS_CORE_ROOT

}

#
# Carrega o Loader da Foundation.
#
_load_loader() {

    local loader="${HS_CORE_ROOT}/foundation/lib.sh"

    if [[ ! -f "${loader}" ]]; then
        echo "Erro: Loader não encontrado."
        echo "Arquivo esperado: ${loader}"
        return 1
    fi

    # shellcheck source=/dev/null
    source "${loader}"

}

# ----------------------------------------------------------
# Ponto de Entrada
# ----------------------------------------------------------

#
# 1. Prepara o ambiente
#
echo "[BOOT] Preparando ambiente..."
_prepare_environment
echo "retorno: $?"

echo "[BOOT] Carregando loader..."
_load_loader
echo "retorno: $?"

echo "[BOOT] Carregando Foundation..."
_load_foundation
echo "retorno: $?"

echo "[BOOT] Carregando Infrastructure..."
_load_infrastructure
echo "retorno: $?"

echo "[BOOT] Carregando Components..."
_load_components
echo "retorno: $?"

echo "[BOOT] Carregando Provisioning..."
_load_provisioning
echo "retorno: $?"

echo "[BOOT] Carregando Applications..."
_load_applications
echo "retorno: $?"

return 0