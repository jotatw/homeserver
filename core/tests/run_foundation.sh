#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "${SCRIPT_DIR}/foundation"

bash test_bootstrap.sh
bash test_lib.sh
bash test_constants.sh
bash test_config.sh
bash test_output.sh
bash test_validation.sh