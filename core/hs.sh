#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: hs.sh
# Módulo.......: Interface
#
# Objetivo.....:
# Interface de linha de comando do HomeServer Core.
# Expõe as funções das camadas através de comandos
# resolvíveis, consumidos também pela API.
#
# Uso:
#   hs <comando> [argumentos...]
#
# Comandos:
#   system hostname|os|kernel|architecture|uptime|info
#   system memory|disk|cpu|load|services|backup|status
#   service list|enable|disable|start|stop|restart|status|update
#   status
#   user create <nome> [--password=...] [--gitea]
#   user rm <nome> [--remove-folder]
# ==========================================================

set -euo pipefail

HS_CORE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HS_PROJECT_ROOT="$(dirname "${HS_CORE_ROOT}")"

export HS_CORE_ROOT
export HS_PROJECT_ROOT

# shellcheck source=/dev/null
source "${HS_CORE_ROOT}/init.sh"

# Garante que o workspace do projeto exista.
initialize_workspace

_usage() {

    cat >&2 <<'EOF'
Uso: hs <comando> [argumentos...]

Comandos:
  system hostname|os|kernel|architecture|uptime|info
  system memory|disk|cpu|load|services|backup|status
  service list
  service enable|disable|start|stop|restart|status|update <serviço>
  status
  user create <nome> [--password=...] [--gitea]
  user list
  user info <nome>
  user password <nome> [--password=...]
  user rm <nome> [--remove-folder] [--gitea]
  device list|status|usb
  device mount <tipo> <rótulo> <dispositivo>
  device unmount <tipo> <rótulo>
  device eject <dispositivo>
  hardware status|temp|disks|disk_smart|net|usb
EOF
}

_command="${1:-}"

case "${_command}" in

    system)
        _subcommand="${2:-}"

        case "${_subcommand}" in
            hostname)       get_hostname ;;
            os)             get_os ;;
            kernel)         get_kernel ;;
            architecture)   get_architecture ;;
            uptime)         get_uptime ;;
            load)           get_load ;;
            memory)
                printf '{"total":%s,"used":%s,"available":%s,"percent":%s}\n' \
                    "$(get_memory_total)" "$(get_memory_used)" \
                    "$(get_memory_available)" "$(get_memory_percent)"
                ;;
            disk)
                printf '{"total":%s,"used":%s,"available":%s,"percent":%s}\n' \
                    "$(get_disk_total)" "$(get_disk_used)" \
                    "$(get_disk_available)" "$(get_disk_percent)"
                ;;
            cpu)
                printf '{"percent":%s,"load":"%s"}\n' \
                    "$(get_cpu_percent)" "$(get_load)"
                ;;
                        storage)
                case "${3:-status}" in
                    status) storage_status_json ;;
                    init) storage_init ;;
                    *) echo "Uso: hs system storage status|init" >&2; exit 1 ;;
                esac
                ;;
            services)       get_services_status_json; echo ;;
            backup)         printf '{"last":"%s"}\n' "$(get_backup_last)" ;;
            wol)
                case "${3:-status}" in
                    status) wol_status ;;
                    enable) wol_enable ;;
                    *) echo "Uso: hs system wol status|enable" >&2; exit 1 ;;
                esac
                ;;
            status)         system_status_json ;;
            info)           system_info_json ;;
            *)              _usage; exit 1 ;;
        esac
        ;;

    service)
        _subcommand="${2:-}"

        case "${_subcommand}" in
            list)
                _service=""
                echo "Serviços disponíveis:"
                while read -r _service; do
                    [[ -n "${_service}" ]] || continue
                    if service_enabled "${_service}"; then
                        _state="[ATIVO]"
                    else
                        _state="[inativo]"
                    fi
                    printf "  %s %s\n" "${_state}" "${_service}"
                done < <(available_services)
                ;;
            enable)   service_enable  "${3:?nome do serviço}" ;;
            disable)  service_disable "${3:?nome do serviço}" ;;
            start)    application_start   "${3:?nome do serviço}" ;;
            stop)     application_stop    "${3:?nome do serviço}" ;;
            restart)  application_restart "${3:?nome do serviço}" ;;
            status)   application_status  "${3:?nome do serviço}" ;;
            update)   application_update  "${3:?nome do serviço}" ;;
            *)        _usage; exit 1 ;;
        esac
        ;;

    user)
        _subcommand="${2:-}"

        case "${_subcommand}" in
            create)
                hs_user_create "${3:?nome do usuário}" "${@:4}"
                ;;
            list)
                hs_user_list
                ;;
            info)
                hs_user_info "${3:?nome do usuário}"
                ;;
            password)
                hs_user_password "${3:?nome do usuário}" "${@:4}"
                ;;
            rm)
                hs_user_rm "${3:?nome do usuário}" "${@:4}"
                ;;
            *)
                _usage
                exit 1
                ;;
        esac
        ;;

    device)
        _subcommand="${2:-}"

        case "${_subcommand}" in
            list)    device_list ;;
            status)  device_status ;;
            usb)     device_usb ;;
            mount)   mount_device "${3:?tipo}" "${4:?rótulo}" "${5:?dispositivo}" ;;
            unmount) unmount_device "${3:?tipo}" "${4:?rótulo}" ;;
            eject)   eject_device "${3:?dispositivo}" ;;
            *)       _usage; exit 1 ;;
        esac
        ;;

    hardware)
        _subcommand="${2:-}"

        case "${_subcommand}" in
            status) hw_status_json ;;
            temp)   hw_temperature_json ;;
            disks)  hw_disks_json ;;
            disk_smart) hw_disk_smart_json "${3:-sda}" ;;
            net)    hw_network_json ;;
            usb)    hw_usb_json ;;
            *)      _usage; exit 1 ;;
        esac
        ;;

    status)
        echo "=== HomeServer Status ==="
        echo "Hostname: $(get_hostname)"
        echo "Sistema : $(get_os)"
        echo "Uptime  : $(get_uptime)"
        echo
        echo "Serviços ativados:"
        _service=""
        while read -r _service; do
            [[ -n "${_service}" ]] || continue
            _state="$(docker inspect -f '{{.State.Status}}' "${_service}" 2>/dev/null || echo 'não encontrado')"
            printf "  %-15s %s\n" "${_service}" "${_state}"
        done < <(enabled_services)
        ;;

    *)
        _usage
        exit 1
        ;;
esac
