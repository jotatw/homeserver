#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"

source "${PROJECT_ROOT}/core/domain/system/system.sh"

echo "== Teste: Hostname =="

HOSTNAME="$(system_get_hostname)"

if [[ -z "${HOSTNAME}" ]]; then
    echo "ERRO: hostname vazio"
    exit 1
fi

echo "Hostname: ${HOSTNAME}"

echo "OK"