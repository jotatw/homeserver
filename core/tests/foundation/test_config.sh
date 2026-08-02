#!/usr/bin/env bash

set -euo pipefail

source core/bootstrap.sh

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

echo "Foundation"

echo "    ${HS_CORE_FOUNDATION_DIR}"

echo

echo "Infrastructure"

echo "    ${HS_CORE_INFRASTRUCTURE_DIR}"

echo

echo "Deploy de Serviços"

echo "    ${HS_SERVICES_DIR}"

echo

echo "Config"

echo "    ${HS_PROJECT_CONFIG_DIR}"

echo

echo "Data"

echo "    ${HS_PROJECT_DATA_DIR}"

echo

echo "Logs"

echo "    ${HS_PROJECT_LOGS_DIR}"

echo

echo "Backup"

echo "    ${HS_PROJECT_BACKUP_DIR}"
