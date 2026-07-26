#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

source "${PROJECT_ROOT}/bootstrap.sh"

echo "== Context =="

context_create

context_set "workspace.root" "/srv"
context_set "runtime.profile" "default"

echo "workspace.root = $(context_get "workspace.root")"
echo "runtime.profile = $(context_get "runtime.profile")"

echo

echo "Existe workspace.root?"

if context_exists "workspace.root"; then
    echo "SIM"
else
    echo "NÃO"
fi

echo

echo "Quantidade:"
context_count

echo

echo "Chaves:"
context_keys

echo

context_remove "runtime.profile"

echo "Após remover:"
context_count

echo

context_clear

echo "Após limpar:"
context_count