#!/usr/bin/env bash
# servicos.sh — Lista serviços do homeserver (para /servicos no Telegram)
set -euo pipefail

echo "📊 Serviços do servidor:"

sudo -n /srv/git/homeserver/core/hs.sh system services 2>/dev/null \
  | python3 -c '
import json, sys
try:
    data = json.load(sys.stdin)
except Exception:
    print("  Erro ao ler status")
    sys.exit(0)
for s in data:
    nome = s.get("name", "?")
    status = s.get("status", "?")
    if status == "running":
        icone = "🟢"
    elif status == "restarting":
        icone = "🟡"
    else:
        icone = "⚪"
    print("  " + icone + " " + nome + " (" + status + ")")
' || echo "  Erro ao listar serviços"