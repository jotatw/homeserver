#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CORE_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

source "${CORE_ROOT}/bootstrap.sh"

main() {

    info "=== Testando filesystem ==="

    if hs_fs_directory_exists "/tmp"; then
        success "hs_fs_directory_exists()"
    else
        error "hs_fs_directory_exists()"
    fi

    if hs_fs_file_exists "/etc/passwd"; then
        success "hs_fs_file_exists()"
    else
        error "hs_fs_file_exists()"
    fi

    if hs_fs_path_exists "/etc"; then
        success "hs_fs_path_exists()"
    else
        error "hs_fs_path_exists()"
    fi
}

main "$@"
