#!/usr/bin/env bash

########################################
# Public API
########################################

# Query

hs_fs_file_exists() {

    local file="$1"

    [[ -f "${file}" ]]
}

hs_fs_directory_exists() {

    local directory="$1"

    [[ -d "${directory}" ]]
}

hs_fs_path_exists() {

    local path="$1"

    [[ -e "${path}" ]]
}

# Create

hs_fs_create_directory() {

    local directory="$1"

    mkdir -p "${directory}"
}

hs_fs_create_file() {

    local file="$1"

    touch "${file}"
}

# Remove

hs_fs_remove_directory() {

    local directory="$1"

    rm -rf "${directory}"
}

hs_fs_remove_file() {

    local file="$1"

    rm -f "${file}"
}

########################################
# Private
########################################