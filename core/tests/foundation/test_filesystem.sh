#!/usr/bin/env bash

source core/bootstrap.sh

main() {

    info "=== Testando filesystem ==="

    if directory_exists "/tmp"; then
        success "directory_exists()"
    else
        error "directory_exists()"
    fi

    if file_exists "/etc/passwd"; then
        success "file_exists()"
    else
        error "file_exists()"
    fi

    if path_exists "/etc"; then
        success "path_exists()"
    else
        error "path_exists()"
    fi
}

main "$@"