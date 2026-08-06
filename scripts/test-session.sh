#!/usr/bin/env bash
# ==========================================================
# HomeServer — Teste de Sessão (unitário)
#
# Valida expiração, sliding (renovação por uso), role e
# versão de token do módulo de sessões da API.
#
# Uso:
#   bash scripts/test-session.sh
# ==========================================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="${SCRIPT_DIR}/../api"

cd "${API_DIR}" || exit 1

npx tsx tests/session.test.ts
