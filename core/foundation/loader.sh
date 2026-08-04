#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: loader.sh
# Módulo.......: Foundation
#
# Objetivo.....:
# Responsável pelo carregamento dos módulos que compõem as camadas do HomeServer Core.
#
# Responsabilidades:
#   - Carregar componentes da Foundation
#   - Carregar componentes da Infrastructure
#
# API Pública:
#   - _load_foundation
#   - _load_infrastructure
#
# API Interna:
#   _load_module
#   _load_layer
#
# Dependências:
#   - HS_CORE_ROOT
#
# ==========================================================

set -euo pipefail

# ----------------------------------------------------------
# API Interna
# ----------------------------------------------------------

#
# Carrega um componente do Core.
#

_load_module() {

    local module="$1"

    [[ -f "${module}" ]] || {
        echo "Erro: Módulo não encontrado."
        echo "Arquivo esperado: ${module}"
        return 1
    }

    # shellcheck source=/dev/null
    # Caminho resolvido dinamicamente em tempo de execução.
    source "${module}"
}

_load_layer() {

    local layer="$1"
    shift

    local module

    for module in "$@"; do
        _load_module "${HS_CORE_ROOT}/${layer}/${module}" || return 1
    done
}

# ----------------------------------------------------------
# API Pública
# ----------------------------------------------------------

#
# Carrega todos os módulos da camada Foundation.
#
_load_foundation() {

    _load_layer foundation \
        constants.sh \
        config.sh \
        output.sh \
        validation.sh \
        filesystem.sh \
        registry.sh
}
#
# Carrega os componentes da Infrastructure.
#
_load_infrastructure() {

    _load_layer infrastructure \
        filesystem.sh \
        environment.sh \
        docker.sh \
        compose.sh \
        service.sh \
        services_status.sh \
        users.sh \
        backup.sh \
        events.sh \
        storage.sh \
        devices.sh \
        mounts.sh \
        hardware.sh \
        automation.sh \
        scheduler.sh \
        power.sh \
        update.sh \
        system/architecture.sh \
        system/hostname.sh \
        system/kernel.sh \
        system/os.sh \
        system/uptime.sh \
        system/memory.sh \
        system/disk.sh \
        system/cpu.sh \
        system/wol.sh \
        system/status.sh \
        system/json.sh
}
#
# Carrega os adaptadores (integrações externas).
#
_load_adapters() {

    _load_layer adapters \
        filebrowser.sh
}
#
# Carrega os componentes da Applications.
#
_load_applications() {

    _load_layer applications \
        application.sh
}
