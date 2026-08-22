#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: scheduler.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Gerenciar tarefas agendadas.
#
# As tarefas são definidas em config/scheduler.conf:
#   nome|OnCalendar|comando
#
# Backend: systemd timers (hs-task-<nome>.service/.timer).
#
# Comandos (requerem sudo no host):
#   hs scheduler init
#   hs scheduler list
#   hs scheduler enable|disable <nome>
#   hs scheduler run <nome>
#
# ==========================================================

readonly HS_SCHEDULER_CONF="${HS_PROJECT_ROOT}/config/scheduler.conf"

#
# sudo apenas quando não-root.
#
_sdo() {
    if [[ "$(id -u)" -eq 0 ]]; then
        "$@"
    else
        sudo "$@"
    fi
}

#
# Lista as tarefas definidas (ignora comentários/vazios).
#
scheduler_tasks() {
    [[ -f "${HS_SCHEDULER_CONF}" ]] || return 0
    grep -vE '^[[:space:]]*(#|$)' "${HS_SCHEDULER_CONF}"
}

#
# Verifica se uma tarefa está ativa.
#
scheduler_task_enabled() {
    systemctl is-enabled "hs-task-$1.timer" >/dev/null 2>&1
}

#
# Gera os units systemd a partir do config (idempotente).
#
scheduler_init() {
    local line name schedule command persistent

    while IFS='|' read -r name schedule command persistent; do
        [[ -n "${name}" ]] || continue
        [[ -n "${persistent}" ]] || persistent="true"

        _sdo tee "/etc/systemd/system/hs-task-${name}.service" >/dev/null <<EOF
[Unit]
Description=HomeServer Task: ${name}

[Service]
Type=oneshot
ExecStart=/bin/bash -c '${command}'
EOF

        _sdo tee "/etc/systemd/system/hs-task-${name}.timer" >/dev/null <<EOF
[Unit]
Description=HomeServer Timer: ${name}

[Timer]
OnCalendar=${schedule}
Persistent=${persistent}

[Install]
WantedBy=timers.target
EOF
    done < <(scheduler_tasks)

    _sdo systemctl daemon-reload
}

#
# Lista as tarefas com estado (texto).
#
scheduler_list() {
    local line name schedule command persistent state

    while IFS='|' read -r name schedule command persistent; do
        [[ -n "${name}" ]] || continue
        [[ -n "${persistent}" ]] || persistent="true"

        if scheduler_task_enabled "${name}"; then
            state="[ATIVO]"
        else
            state="[inativo]"
        fi

        printf "  %-9s %-12s %-22s %-6s %s\n" "${state}" "${name}" "${schedule}" "pers=${persistent}" "${command}"
    done < <(scheduler_tasks)
}

#
# Lista as tarefas com estado e próxima execução (JSON — consumido pela API).
#
scheduler_list_json() {
    local line name schedule command persistent enabled next first=1

    printf '['
    while IFS='|' read -r name schedule command persistent; do
        [[ -n "${name}" ]] || continue
        [[ -n "${persistent}" ]] || persistent="true"

        if scheduler_task_enabled "${name}"; then
            enabled=true
        else
            enabled=false
        fi

        next="$(systemctl show "hs-task-${name}.timer" -p NextElapseUSecRealtime --value 2>/dev/null | sed 's/ *$//')"
        [[ -n "${next}" ]] || next=""

        [[ ${first} -eq 0 ]] && printf ','
        printf '\n  {"name":"%s","schedule":"%s","command":"%s","persistent":%s,"enabled":%s,"next":"%s"}' \
            "${name}" "${schedule}" "${command}" "${persistent}" "${enabled}" "${next}"
        first=0
    done < <(scheduler_tasks)
    printf '\n]\n'
}

#
# Ativa uma tarefa.
#
scheduler_enable() {
    _sdo systemctl enable --now "hs-task-$1.timer"
}

#
# Desativa uma tarefa.
#
scheduler_disable() {
    _sdo systemctl disable --now "hs-task-$1.timer" 2>/dev/null || true
}

#
# Executa uma tarefa imediatamente.
#
scheduler_run() {
    _sdo systemctl start "hs-task-$1.service"
}
