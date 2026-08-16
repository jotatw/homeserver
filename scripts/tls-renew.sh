#!/usr/bin/env bash
# HomeServer — renovação periódica dos certificados TLS locais.
#
# Chamado pelo scheduler como root. Renova o leaf quando necessário
# e recarrega o proxy local. Log em /var/log/homeserver-tls.log.
set -uo pipefail

HS_LOG="/var/log/homeserver-tls.log"
HS_CORE="/srv/git/homeserver/core/hs.sh"

[[ -f "${HS_CORE}" ]] || {
    echo "[$(date '+%F %T')] core não encontrado: ${HS_CORE}" >> "${HS_LOG}"
    exit 1
}

bash "${HS_CORE}" tls renew >> "${HS_LOG}" 2>&1