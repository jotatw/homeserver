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
#   system hostname       Hostname do sistema
#   system os             Sistema operacional
#   system kernel         Versão do kernel
#   system architecture   Arquitetura da CPU
#   system uptime         Tempo de atividade
#   system info           Informações do sistema (JSON)
#   service list          Lista serviços (ativos/inativos)
#   service enable <s>    Ativa um serviço
#   service disable <s>   Desativa um serviço
#   service start <s>     Inicia um serviço
#   service stop <s>      Para um serviço
#   service restart <s>   Reinicia um serviço
#   service status <s>    Status de um serviço
#   service update <s>    Atualiza um serviço
#   status                Resumo do servidor
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
  service list
  service enable|disable|start|stop|restart|status|update <serviço>
  status
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
