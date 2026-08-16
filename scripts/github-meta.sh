#!/usr/bin/env bash
# Atualiza os metadados públicos do repositório no GitHub (About).
#
# Uso:
#   GH_TOKEN=<pat> bash scripts/github-meta.sh
#
# O token precisa do scope `repo` (ou um fine-grained PAT com
# permissão de escrita em metadados do repositório).
#
# Altera: description, homepage e topics.
set -uo pipefail

REPO="${GH_REPO:-jotatw/homeserver}"
TOKEN="${GH_TOKEN:-}"

DESCRIPTION="Uma plataforma modular para transformar um computador comum em um servidor doméstico simples, organizado e fácil de expandir."
HOME_PAGE=""
TOPICS='["homeserver","selfhosted","homelab","debian","docker","bash","typescript","fastify","local-first"]'

[[ -n "${TOKEN}" ]] || { echo "Defina GH_TOKEN (scope repo)." >&2; exit 1; }

payload=$(python3 - "$DESCRIPTION" "$HOME_PAGE" "$TOPICS" <<'PY'
import json, sys
desc, home, topics = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
print(json.dumps({"description": desc, "homepage": home, "topics": topics}))
PY
)

code=$(curl -s -o /tmp/github-meta.out -w "%{http_code}" \
    -X PATCH "https://api.github.com/repos/${REPO}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -d "${payload}")

echo "HTTP ${code}"
if [[ "${code}" == "200" ]]; then
    grep -oE '"description": "[^"]*"|"topics": \[[^]]*\]' /tmp/github-meta.out | head -2
else
    cat /tmp/github-meta.out
fi