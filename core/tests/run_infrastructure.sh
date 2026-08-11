#!/usr/bin/env bash

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/../.."

source "${SCRIPT_DIR}/bootstrap.sh"

initialize_suite "Infrastructure"

run_test \
    "Filesystem - Diretórios" \
    "${SCRIPT_DIR}/infrastructure/test_filesystem_directories.sh"

run_test \
    "Filesystem - Arquivos" \
    "${SCRIPT_DIR}/infrastructure/test_filesystem_files.sh"

run_test \
    "Workspace" \
    "${SCRIPT_DIR}/infrastructure/test_initialize_workspace.sh"

run_test \
    "Services" \
    "${SCRIPT_DIR}/infrastructure/test_service.sh"

show_summary

suite_exit_status