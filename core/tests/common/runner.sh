#!/usr/bin/env bash

# ==========================================================
# HomeServer Test Suite
#
# Arquivo......: test_runner.sh
# Módulo.......: Tests
#
# Objetivo.....:
# Executar testes individuais e apresentar um
# resultado padronizado.
#
# ==========================================================

set -euo pipefail

# ----------------------------------------------------------
# Estado
# ----------------------------------------------------------

HS_TEST_CURRENT_SUITE=""

HS_TEST_TOTAL=0
HS_TEST_PASS=0
HS_TEST_FAIL=0

# ----------------------------------------------------------
# Suite
# ----------------------------------------------------------

initialize_suite() {

    local suite_name="$1"

    HS_TEST_CURRENT_SUITE="${suite_name}"

    HS_TEST_TOTAL=0
    HS_TEST_PASS=0
    HS_TEST_FAIL=0

}

# ----------------------------------------------------------
# Runner
# ----------------------------------------------------------

run_test() {

    local test_name="$1"
    local test_script="$2"

    ((++HS_TEST_TOTAL))

    printf "%-40s" "${test_name}"

    if bash "${test_script}" >/dev/null 2>&1; then

        ((++HS_TEST_PASS))

        printf "[PASS]\n"

    else

        ((++HS_TEST_FAIL))

        printf "[FAIL]\n"

    fi

}

tests_passed() {

    [[ "${HS_TEST_FAIL}" -eq 0 ]]

}

tests_failed() {

    [[ "${HS_TEST_FAIL}" -gt 0 ]]

}

show_summary() {

    echo
    echo "----------------------------------------"

    printf "Suite : %s\n" "${HS_TEST_CURRENT_SUITE}"
    printf "Total : %d\n" "${HS_TEST_TOTAL}"
    printf "PASS  : %d\n" "${HS_TEST_PASS}"
    printf "FAIL  : %d\n" "${HS_TEST_FAIL}"

    echo "----------------------------------------"

}

suite_exit_status() {

    if tests_passed; then
        return 0
    fi

    return 1

}

