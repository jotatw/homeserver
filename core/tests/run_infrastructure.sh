#!/usr/bin/env bash

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "${SCRIPT_DIR}/common/test_runner.sh"

echo "========================================"
echo " HomeServer Test Suite"
echo " Infrastructure"
echo "========================================"
echo

run_test \
    "Filesystem - Directories" \
    "${SCRIPT_DIR}/infrastructure/test_filesystem_directories.sh"

run_test \
    "Filesystem - Files" \
    "${SCRIPT_DIR}/infrastructure/test_filesystem_files.sh"

show_summary