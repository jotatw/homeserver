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
    local line name schedule command

    while IFS='|' read -r name schedule command; do
        [[ -n "${name}" ]] || continue

        sudo tee "/etc/systemd/system/hs-task-${name}.service" >/dev/null <<EOF
[Unit]
Description=HomeServer Task: ${name}

[Service]
Type=oneshot
ExecStart=/bin/bash -c '${command}'
EOF

        sudo tee "/etc/systemd/system/hs-task-${name}.timer" >/dev/null <<EOF
[Unit]
Description=HomeServer Timer: ${name}

[Timer]
OnCalendar=${schedule}
Persistent=true

[Install]
WantedBy=timers.target
EOF
    done < <(scheduler_tasks)

    sudo systemctl daemon-reload
}

#
# Lista as tarefas com estado.
#
scheduler_list() {
    local line name schedule command state

    while IFS='|' read -r name schedule command; do
        [[ -n "${name}" ]] || continue

        if scheduler_task_enabled "${name}"; then
            state="[ATIVO]"
        else
            state="[inativo]"
        fi

        printf "  %-9s %-12s %-24s %s\n" "${state}" "${name}" "${schedule}" "${command}"
    done < <(scheduler_tasks)
}

#
# Ativa uma tarefa.
#
scheduler_enable() {
    sudo systemctl enable --now "hs-task-$1.timer"
}

#
# Desativa uma tarefa.
#
scheduler_disable() {
    sudo systemctl disable --now "hs-task-$1.timer" 2>/dev/null || true
}

#
# Executa uma tarefa imediatamente.
#
scheduler_run() {
    sudo systemctl start "hs-task-$1.service"
}
