#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: automation.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Executar automações desacopladas por hooks.
#
# Cada evento possui uma pasta em /srv/automation/hooks/<evento>/.
# A execução de um evento roda TODOS os scripts .sh da sua pasta,
# em ordem alfabética. Novas automações são adicionadas sem alterar
# o núcleo.
#
# Eventos:
#   usb · sdcard · backup · startup · shutdown · users · services
#
# ==========================================================

AUTOMATION_ROOT="${AUTOMATION_ROOT:-/srv/automation/hooks}"

#
# Lista os eventos disponíveis.
#
automation_events() {
    ls -1 "${AUTOMATION_ROOT}" 2>/dev/null \
        | grep -v '^\.' || true
}

#
# Lista os scripts de um evento.
#
automation_scripts() {
    local event="$1"

    ls -1 "${AUTOMATION_ROOT}/${event}"/*.sh 2>/dev/null \
        | xargs -n1 basename 2>/dev/null || true
}

#
# Executa todos os scripts de um evento.
#
# Uso: automation_run <evento>
#
automation_run() {
    local event="${1:?evento}"
    local dir="${AUTOMATION_ROOT}/${event}"
    local script

    if [[ ! -d "${dir}" ]]; then
        echo "Evento não encontrado: ${event}" >&2
        return 1
    fi

    for script in "${dir}"/*.sh; do
        [[ -f "${script}" ]] || continue
        echo "[automation] ${event}: $(basename "${script}")"
        bash "${script}" || echo "[automation] falha: ${script}" >&2
    done

    return 0
}

#
# Lista eventos e scripts (texto).
#
automation_list() {
    local event

    for event in $(automation_events); do
        echo "=== ${event} ==="
        local scripts
        scripts="$(automation_scripts "${event}")"
        if [[ -z "${scripts}" ]]; then
            echo "  (vazio)"
        else
            while read -r s; do
                [[ -n "${s}" ]] && echo "  ${s}"
            done <<< "${scripts}"
        fi
    done
}
