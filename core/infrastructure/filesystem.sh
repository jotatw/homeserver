#!/usr/bin/env bash

# ==========================================================
# Biblioteca FileSystem
# Responsável pelas operações de arquivos e diretórios.
# ==========================================================

#
# Cria um diretório caso ele não exista.
#
create_directory() {

    local directory="$1"

    mkdir -p "$directory"
}
#
# Cria múltiplos diretórios.
#
create_directories() {

    mkdir -p "$@"
}
#
# Remove um diretório recursivamente.
#
remove_directory() {

    local directory="$1"

    rm -rf "$directory"
}
#
# Copia um arquivo preservando atributos.
#
copy_file() {

    local source="$1"
    local destination="$2"

    cp -a "$source" "$destination"
}
#
# Copia um diretório preservando atributos.
#
copy_directory() {

    local source="$1"
    local destination="$2"

    cp -a "$source" "$destination"
}
#
# Define permissões.
#
set_permissions() {

    chmod "$1" "$2"
}
#
# Define proprietário.
#
set_owner() {

    chown -R "$1":"$2" "$3"
}
