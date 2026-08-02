#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: init.sh
# Módulo.......: Core
#
# Objetivo.....:
# Ponto de entrada programático do HomeServer Core.
# Inicializa todas as camadas carregáveis.
#
# Não faz:
#   - Não executa comandos
#   - Não exibe mensagens
#
# Uso:
#   source "$(dirname "${BASH_SOURCE[0]}")/bootstrap.sh"
#   _load_infrastructure
#   _load_applications
# ==========================================================

source "$(dirname "${BASH_SOURCE[0]}")/bootstrap.sh" || return 1

_load_infrastructure || return 1
_load_applications || return 1

return 0
