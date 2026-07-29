#!/usr/bin/env bash

#
# Foundation :: Filesystem
#
# Funções genéricas para manipulação e consulta do sistema de arquivos.
#

file_exists() {

    local file="$1"

    [[ -f "${file}" ]]
}

directory_exists() {

    local directory="$1"

    [[ -d "${directory}" ]]
}

path_exists() {

    local path="$1"

    [[ -e "${path}" ]]
}