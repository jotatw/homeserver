#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "=== HomeServer CI ==="
echo "Shellcheck..."
if command -v shellcheck >/dev/null 2>&1; then
    find "${SCRIPT_DIR}/.." -name "*.sh" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/data/*" -exec shellcheck {} \;
    echo "Shellcheck: OK"
else
    echo "shellcheck não encontrado, pulando."
fi

echo
echo "=== Test Suite (Foundation + Infrastructure) ==="
bash "${SCRIPT_DIR}/run_all.sh"

echo
echo "=== Integration (Smoke + CLI + API) ==="
if command -v curl >/dev/null 2>&1; then
    bash "${PROJECT_ROOT}/scripts/run-integration.sh"
else
    echo "curl não encontrado, pulando integração."
fi
