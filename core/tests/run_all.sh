#!/usr/bin/env bash

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/../.."

bash "${SCRIPT_DIR}/run_foundation.sh"

echo

bash "${SCRIPT_DIR}/run_infrastructure.sh"
