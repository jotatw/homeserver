#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: power.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Configurar o agendamento automático de ligar/desligar.
#
# Desligamento: tarefa "night-off" no scheduler.conf.
# Religamento : WAKE_TIME no /srv/scripts/power-schedule.sh (RTC).
#
# Comandos:
#   hs power status
#   hs power enable|disable
#   hs power set <desliga HH:MM> <liga HH:MM>
#
# ==========================================================

HS_POWER_CONF="${HS_PROJECT_ROOT}/config/scheduler.conf"
HS_POWER_SCRIPT="/srv/scripts/power-schedule.sh"

if [[ -f "/host/srv/scripts/power-schedule.sh" ]]; then
    HS_POWER_SCRIPT="/host/srv/scripts/power-schedule.sh"
fi

#
# sudo apenas quando não-root (root = nsenter/API container).
#
_power_sdo() {
    if [[ "$(id -u)" -eq 0 ]]; then
        "$@"
    else
        sudo "$@"
    fi
}

#
# Horário de desligamento (HH:MM) do scheduler.conf.
#
power_shutdown_time() {
    grep -E '^night-off\|' "${HS_POWER_CONF}" 2>/dev/null \
        | cut -d'|' -f2 \
        | sed -E 's/^.* ([0-9]{2}:[0-9]{2}):00$/\1/' \
        || echo "23:30"
}

#
# Horário de religamento (HH:MM) do power-schedule.sh.
#
power_wake_time() {
    grep -E '^WAKE_TIME=' "${HS_POWER_SCRIPT}" 2>/dev/null \
        | head -1 | grep -oE '[0-9]{2}:[0-9]{2}' | head -1 \
        || echo "07:00"
}

#
# Verifica se o agendamento está ativo.
#
power_enabled() {
    if [[ -d "/host/etc/systemd/system/timers.target.wants" ]]; then
        [[ -L "/host/etc/systemd/system/timers.target.wants/hs-task-night-off.timer" ]]
    else
        scheduler_task_enabled "night-off"
    fi
}

#
# Estado do agendamento (JSON).
#
power_status_json() {
    printf '{"shutdown":"%s","wake":"%s","enabled":%s}' \
        "$(power_shutdown_time)" \
        "$(power_wake_time)" \
        "$(power_enabled && echo true || echo false)"
}

#
# Ativa o agendamento.
#
power_enable() {
    _power_sdo bash "${HS_PROJECT_ROOT}/core/hs.sh" scheduler enable night-off
}

#
# Desativa o agendamento.
#
power_disable() {
    _power_sdo bash "${HS_PROJECT_ROOT}/core/hs.sh" scheduler disable night-off
}

#
# Define horários de desligar/ligar.
#
# Uso: power_set <desliga HH:MM> <liga HH:MM>
#
power_set() {
    local shutdown="${1:?horário de desligar HH:MM}" wake="${2:?horário de ligar HH:MM}"
    local conf_tmp

    if [[ ! "${shutdown}" =~ ^[0-9]{2}:[0-9]{2}$ \
        || ! "${wake}" =~ ^[0-9]{2}:[0-9]{2}$ ]]; then
        echo "Formato inválido. Use HH:MM (ex.: 23:30 e 07:00)." >&2
        return 1
    fi

    # Atualiza o horário de desligamento no scheduler.conf
    conf_tmp="${HS_POWER_CONF}.tmp"
    awk -F'|' -v OFS='|' -v t="${shutdown}" \
        '$1 == "night-off" { $2 = "*-*-* " t ":00" } { print }' \
        "${HS_POWER_CONF}" > "${conf_tmp}" && mv "${conf_tmp}" "${HS_POWER_CONF}"

    # Atualiza o horário de religamento (WAKE_TIME) no power-schedule.sh
    if [[ "${HS_POWER_SCRIPT}" == /host/* ]]; then
        # No container não editamos o arquivo real; feito via nsenter no host.
        return 0
    fi

    sed -i "s#^WAKE_TIME=.*#WAKE_TIME=\"${wake}\"#" "${HS_POWER_SCRIPT}"

    # Regenera os units e ativa a tarefa
    _power_sdo bash "${HS_PROJECT_ROOT}/core/hs.sh" scheduler init
    _power_sdo bash "${HS_PROJECT_ROOT}/core/hs.sh" scheduler enable night-off

    power_status_json
}
