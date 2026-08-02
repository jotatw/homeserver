#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== HomeServer CI ==="
echo "Shellcheck..."
if command -v shellcheck >/dev/null 2>&1; then
    find "${SCRIPT_DIR}/.." -name "*.sh" -not -path "*/node_modules/*" -not -path "*/.git/*" -exec shellcheck {} \;
    echo "Shellcheck: OK"
else
    echo "shellcheck não encontrado, pulando."
fi

echo
echo "=== Test Suite ==="
bash "${SCRIPT_DIR}/run_all.sh"