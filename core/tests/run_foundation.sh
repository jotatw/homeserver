#!/usr/bin/env bash

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/../.."

source "${SCRIPT_DIR}/bootstrap.sh"

initialize_suite "Foundation"

run_test \
    "Constants" \
    "${SCRIPT_DIR}/foundation/test_constants.sh"

run_test \
    "Config" \
    "${SCRIPT_DIR}/foundation/test_config.sh"

run_test \
    "Output" \
    "${SCRIPT_DIR}/foundation/test_output.sh"

run_test \
    "Validation" \
    "${SCRIPT_DIR}/foundation/test_validation.sh"

run_test \
    "Filesystem" \
    "${SCRIPT_DIR}/foundation/test_filesystem.sh"

run_test \
    "Loader" \
    "${SCRIPT_DIR}/foundation/test_loader.sh"

show_summary

suite_exit_status
