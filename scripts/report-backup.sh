#!/usr/bin/env bash
# ==========================================================
# report-backup.sh — Relatório de backup para o Telegram
# Chamado pelo quick command /backup do gateway (exec, timeout 30s).
#
# Diferença para o quick command antigo: usa a validação real
# (hs system backup validate) com frescor — um 'latest' de dias atrás
# é STALE, não "Backup OK" (foi o que escondeu a falha de 07-11/09/2026).
# ==========================================================
set -euo pipefail

HS_CORE="/srv/git/homeserver/core/hs.sh"

bash "${HS_CORE}" system backup validate 2>/dev/null | python3 -c '
import json, sys
from datetime import date

try:
    d = json.load(sys.stdin)
except Exception:
    print("⚠️ Sem dados de backup (core indisponível?)")
    raise SystemExit(0)

latest = d.get("latest", "nenhum")
fresh  = d.get("freshness") == "ok"
ok     = d.get("ok") is True
ret    = d.get("retained", 0)

print("📋 **Backup** — homeserver")
print(f"📅 Mais recente: **{latest}**")
if latest not in ("nenhum", ""):
    age = "?"
    try:
        age = (date.today() - date.fromisoformat(latest)).days
    except ValueError:
        pass
    print(f"⏳ Idade: {age} dia(s)" if isinstance(age, int) else f"⏳ Idade: {age}")
status = "✅ saudável" if (ok and fresh) else ("🟡 STALE — não rodou hoje" if ok else "❌ INVÁLIDO (verificar)")
print(f"Estado: **{status}**")
for key, label in (("symlink", "Symlink"), ("storage", "Storage"),
                   ("docker", "Docker"), ("manifest", "Manifest")):
    if d.get(key):
        print(f"  {label}: {d[key]}")
print(f"🗂️ Retidos: {ret}")
if not (ok and fresh):
    import subprocess
    err = subprocess.run(["tail", "-5", "/var/log/homeserver-backup.log"],
                         capture_output=True, text=True)
    tail = (err.stdout or "").strip()
    if tail:
        print("Últimas linhas do log:")
        print(tail)
'
