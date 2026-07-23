#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/bootstrap.sh"

initialize_suite "Foundation"

run_test \
    "Constants" \
    "${HS_TEST_FOUNDATION_DIR}/test_constants.sh"

run_test \
    "Config" \
    "${HS_TEST_FOUNDATION_DIR}/test_config.sh"

run_test \
    "Output" \
    "${HS_TEST_FOUNDATION_DIR}/test_output.sh"

run_test \
    "Validation" \
    "${HS_TEST_FOUNDATION_DIR}/test_validation.sh"

show_summary

suite_exit_status