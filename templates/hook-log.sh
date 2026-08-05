#!/usr/bin/env bash
# Exemplo: registra o boot/desligamento do servidor.
#
# Formato de log padrão do HomeServer (v1.5):
#   [DATA] mensagem
# Ex.: [2026-08-05 07:11:11] HomeServer startup

echo "[$(date '+%F %T')] HomeServer ${HS_HOOK_PHASE:-}" >> /var/log/homeserver-hooks.log
