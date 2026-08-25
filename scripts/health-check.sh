#!/usr/bin/env bash
# ==========================================================
# HomeServer — Health Check
#
# Verifica se o HomeServer está operacional após a instalação.
#
# Uso:
#   bash scripts/health-check.sh
#
# Retorno:
#   0 -> tudo operacional
#   1 -> alguma falha
# ==========================================================

set -uo pipefail

HS_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CORE="${HS_ROOT}/core/hs.sh"

PASS=0
FAIL=0

ok()   { printf "  \u2714 %-18s %s\n" "$1" "$2"; PASS=$((PASS + 1)); }
fail() { printf "  \u2718 %-18s %s\n" "$1" "$2"; FAIL=$((FAIL + 1)); }

check_cmd() {
    if command -v "$1" >/dev/null 2>&1; then ok "$1" "disponível"; else fail "$1" "não encontrado"; fi
}

check_http() {
    local name="$1" url="$2" expect="$3"
    local body status
    body="$(curl -fsS --max-time 5 "$url" 2>/dev/null || true)"
    status="$(printf '%s' "$body" | grep -c "${expect}" || true)"
    if [[ "${status}" -ge 1 ]]; then ok "$name" "${url}"; else fail "$name" "${url} (sem resposta)"; fi
}

warn() { printf "  \u26a0 %-18s %s\n" "$1" "$2"; }

echo "== HomeServer Health Check =="
echo

# Docker
check_cmd docker
if command -v docker >/dev/null 2>&1; then
    if docker info >/dev/null 2>&1; then ok "docker daemon" "rodando"; else fail "docker daemon" "não responde"; fi
fi

# Módulos (HTTP)
check_http "homepage"   "http://localhost:3000/"            "html"
check_http "api"        "http://localhost:8000/api/v1/version" "ok"
check_http "files"      "http://localhost:8080/files/"     "html"
check_http "gitea"      "http://localhost:3001/"            "html"

# Core (CLI)
if [[ -x "${CORE}" ]]; then
    version="$(bash "${CORE}" version 2>/dev/null || true)"
    if [[ -n "${version}" ]]; then ok "hs version" "${version}"; else fail "hs version" "sem resposta"; fi
else
    fail "hs version" "${CORE} não encontrado"
fi

# Recursos (saúde do hardware)
load="$(cut -d' ' -f1 /proc/loadavg 2>/dev/null || echo 99)"
ok_load="$(awk -v l="${load}" 'BEGIN{print (l < 2.0) ? 1 : 0}')"
[[ "${ok_load}" == "1" ]] && ok "load (1min)" "${load}" || fail "load (1min)" "${load}"

mem_pct="$(awk '/Mem:/{printf "%.0f", $3/$2*100}' <(free -m) 2>/dev/null || echo 100)"
ok_mem="$(awk -v m="${mem_pct}" 'BEGIN{print (m < 85) ? 1 : 0}')"
[[ "${ok_mem}" == "1" ]] && ok "memória" "${mem_pct}%" || fail "memória" "${mem_pct}%"

temp_max="$(for t in /sys/class/hwmon/hwmon*/temp*_input; do [ -f "$t" ] && cat "$t"; done 2>/dev/null | sort -n | tail -1)"
if [[ -n "${temp_max}" ]]; then
    temp_c="$(awk -v v="${temp_max}" 'BEGIN{printf "%.0f", v/1000}')"
    if [[ "${temp_c}" -gt 85 ]]; then
        fail "temperatura" "${temp_c}C (alta)"
    elif [[ "${temp_c}" -gt 70 ]]; then
        warn "temperatura" "${temp_c}C (atencao)"
        ok "temperatura" "${temp_c}C"
    else
        ok "temperatura" "${temp_c}C"
    fi
fi

echo
echo "== Resumo =="
printf "  PASS : %d\n  FAIL : %d\n" "${PASS}" "${FAIL}"

if [[ "${FAIL}" -eq 0 ]]; then
    echo
    echo "  HomeServer operacional."
    exit 0
else
    echo
    echo "  Alguns itens precisam de atenção. Veja docs/FIRST_BOOT.md."
    exit 1
fi
