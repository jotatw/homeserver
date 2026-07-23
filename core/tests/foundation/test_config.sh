#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "${SCRIPT_DIR}/../bootstrap.sh"

echo "========================================"
echo " HomeServer Core"
echo " Config Test"
echo "========================================"

echo

echo "Core"

echo "    ${HS_CORE_ROOT}"

echo

echo "Projeto"

echo "    ${HS_PROJECT_ROOT}"

echo

echo "Common"

echo "    ${HS_CORE_COMMON_DIR}"

echo

echo "Infrastructure"

echo "    ${HS_CORE_INFRASTRUCTURE_DIR}"

echo

echo "Core Services"

echo "    ${HS_CORE_SERVICES_CORE_DIR}"

echo

echo "Project Services"

echo "    ${HS_SERVICES_DIR}"

echo

echo "Config"

echo "    ${HS_CONFIG_DIR}"

echo

echo "Data"

echo "    ${HS_DATA_DIR}"

echo

echo "Logs"

echo "    ${HS_LOGS_DIR}"

echo

echo "Backup"

echo "    ${HS_BACKUP_DIR}"