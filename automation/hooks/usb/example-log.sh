#!/usr/bin/env bash
# Exemplo: registra eventos de dispositivo no log.
# Variáveis disponíveis:
#   HS_DEVICE_TYPE, HS_DEVICE_LABEL, HS_DEVICE_DEV, HS_DEVICE_TARGET, HS_DEVICE_ACTION

echo "[usb-hook] ${HS_DEVICE_ACTION:-?} ${HS_DEVICE_TYPE:-?}/${HS_DEVICE_LABEL:-?} -> ${HS_DEVICE_TARGET:-?}" \
    >> /var/log/homeserver-devices.log
