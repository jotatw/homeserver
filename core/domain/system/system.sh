#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/lib/hostname.sh"
source "$SCRIPT_DIR/lib/os.sh"
source "$SCRIPT_DIR/lib/kernel.sh"
source "$SCRIPT_DIR/lib/architecture.sh"
source "$SCRIPT_DIR/lib/uptime.sh"
source "$SCRIPT_DIR/lib/json.sh"

declare -F


case "${1:-}" in

    hostname)
        get_hostname
        ;;

    os)
        get_os
        ;;

    kernel)
        get_kernel
        ;;

    architecture)
        get_architecture
        ;;

    uptime)
        get_uptime
        ;;

    info)
        system_info_json
        ;;

    *)
        echo "Usage:"
        echo " system.sh hostname"
        echo " system.sh os"
        echo " system.sh kernel"
        echo " system.sh architecture"
        echo " system.sh uptime"
        echo " system.sh info"
        exit 1
        ;;
esac