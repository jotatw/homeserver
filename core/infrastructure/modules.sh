#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: modules.sh
# Módulo.......: Infrastructure (Module Core — M1)
#
# Objetivo.....:
# Coordenação mínima da arquitetura modular (M1). Opera sobre
# as Definitions (`modules/<id>/module.json`) e delega operações
# ao engine existente (docker-compose via service/application).
#
# Estado de runtime: /srv/config/modules/{definitions,instances,state,journal}
#
# API Pública:
#   - module_definitions
#   - module_definition_read <id>
#   - module_status <id>
#   - module_op <id> <op>
#
# Decisão: ver planning/architecture/decisions/m1-skeleton-implementation.md
# ==========================================================

HS_MODULES_ROOT="${HS_MODULES_ROOT:-${HS_PROJECT_ROOT}/modules}"
HS_MODULES_STATE="${HS_MODULES_STATE:-/srv/config/modules}"

#
# sudo apenas quando não-root.
#
_module_sdo() {
    if [[ "$(id -u)" -eq 0 ]]; then
        "$@"
    else
        sudo "$@"
    fi
}

_module_definition_path() {
    printf '%s/%s/module.json' "${HS_MODULES_ROOT}" "${1:?id do módulo}"
}

#
# Verifica se o módulo existe (Definition presente).
#
module_exists() {
    [[ -f "$(_module_definition_path "${1:?id do módulo}")" ]]
}

#
# Lê e valida a Definition de um módulo (JSON canônico).
#
module_definition_read() {
    local id="${1:?id do módulo}" file
    file="$(_module_definition_path "${id}")"

    [[ -f "${file}" ]] || {
        echo "Módulo '${id}' não possui Definition (${file})." >&2
        return 1
    }

    python3 - "${file}" <<'PY' || return 1
import json, sys
p = sys.argv[1]
d = json.load(open(p, encoding="utf-8"))
required = ("id", "contractVersion", "version", "classification",
            "capabilities", "operations", "implementation")
missing = [k for k in required if k not in d]
if missing:
    sys.stderr.write(f"Definition inválida ({p}): faltam {missing}\n")
    sys.exit(1)
if d.get("id") != p.split("/")[-2]:
    sys.stderr.write(f"id da Definition ({d.get('id')}) difere do diretório\n")
    sys.exit(1)
print(json.dumps(d, ensure_ascii=False, indent=2))
PY
}

#
# Lista as Definitions do catálogo (resumo JSON).
#
module_definitions() {
    python3 - "${HS_MODULES_ROOT}" <<'PY' || true
import json, sys, os, glob
root = sys.argv[1]
out = []
for f in sorted(glob.glob(os.path.join(root, "*", "module.json"))):
    try:
        d = json.load(open(f, encoding="utf-8"))
        out.append({
            "id": d.get("id"),
            "version": d.get("version"),
            "contractVersion": d.get("contractVersion"),
            "classification": d.get("classification"),
            "capabilities": d.get("capabilities", []),
            "operations": d.get("operations", []),
        })
    except Exception:
        continue
print(json.dumps(out, ensure_ascii=False))
PY
}

#
# Garante os diretórios de estado do Module Core.
#
_module_ensure_state() {
    _module_sdo mkdir -p \
        "${HS_MODULES_STATE}/definitions" \
        "${HS_MODULES_STATE}/instances" \
        "${HS_MODULES_STATE}/state" \
        "${HS_MODULES_STATE}/journal" || return 1
}

#
# Estado observado de um módulo (via engine + estado registrado).
#
module_status() {
    local id="${1:?id do módulo}" observed desired="{}"

    module_exists "${id}" || return 1

    observed="$(application_status "${id}" 2>/dev/null || echo "desconhecido")"

    if [[ -f "${HS_MODULES_STATE}/state/${id}.json" ]]; then
        desired="$(cat "${HS_MODULES_STATE}/state/${id}.json" 2>/dev/null || echo '{}')"
    fi

    printf '{"id":"%s","observed":"%s","desired":%s}\n' \
        "${id}" "$(printf '%s' "${observed}" | tr -d '\n' | tr -s ' ' | head -c 200)" \
        "${desired}"
}

#
# Executa uma operação de módulo (valida contra a Definition, registra
# no journal e delega ao engine).
#
module_op() {
    local id="${1:?id do módulo}" op="${2:?operação}" ok=0 now

    module_exists "${id}" || return 1

    # Valida a operação contra a Definition.
    if ! python3 - "${HS_MODULES_ROOT}" "${id}" "${op}" <<'PY' 2>/dev/null
import json, sys
p = "/".join([sys.argv[1], sys.argv[2], "module.json"])
d = json.load(open(p, encoding="utf-8"))
sys.exit(0 if sys.argv[3] in d.get("operations", []) else 1)
PY
    then
        echo "Operação '${op}' não declarada para o módulo '${id}'." >&2
        return 1
    fi

    _module_ensure_state

    now="$(date '+%F %T')"
    _module_sdo bash -c "echo '[${now}] ${id} ${op}' >> '${HS_MODULES_STATE}/journal/${id}.log'" 2>/dev/null || true

    case "${op}" in
        enable)   service_enable "${id}";  ok=$? ;;
        disable)  service_disable "${id}"; ok=$? ;;
        start)    application_start "${id}";  ok=$? ;;
        stop)     application_stop "${id}";   ok=$? ;;
        restart)  application_restart "${id}"; ok=$? ;;
        update)   application_update "${id}";  ok=$? ;;
        status)   ok=0 ;;
        *)        echo "Operação não suportada: ${op}" >&2; return 1 ;;
    esac

    # Registra desired/observed.
    _module_sdo bash -c "printf '{\"op\":\"${op}\",\"ts\":\"${now}\",\"ok\":${ok}}' > '${HS_MODULES_STATE}/state/${id}.json'" 2>/dev/null || true

    printf '{"id":"%s","op":"%s","ok":%s}\n' "${id}" "${op}" "${ok}"
    return "${ok}"
}