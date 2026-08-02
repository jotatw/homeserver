#!/usr/bin/env bash
# Exemplo: registra o boot/desligamento do servidor.

echo "[hooks] $(date '+%F %T') HomeServer ${HS_HOOK_PHASE:-}" >> /var/log/homeserver-hooks.log
