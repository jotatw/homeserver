#!/usr/bin/env bash

set -euo pipefail

source core/bootstrap.sh

echo "========================================"
echo " HomeServer Core"
echo " Constants Test"
echo "========================================"
echo

echo "Projeto........: ${HS_PROJECT_NAME}"
echo "Versão.........: ${HS_CORE_VERSION}"
echo

echo "Exit Success...: ${HS_EXIT_SUCCESS}"
echo "Exit Failure...: ${HS_EXIT_FAILURE}"
echo

echo "Status OK......: ${HS_STATUS_OK}"
echo "Status Error...: ${HS_STATUS_ERROR}"
echo

echo "Timeout........: ${HS_DEFAULT_TIMEOUT}"
echo "Retries........: ${HS_DEFAULT_RETRIES}"