#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: filesystem.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Fornecer uma API para manipulação de arquivos,
# diretórios e links simbólicos.
#
# Responsabilidades:
#   - Criar diretórios
#   - Manipular arquivos
#   - Criar links simbólicos
#   - Inicializar o workspace
#
# Não faz:
#   - Não imprime mensagens
#   - Não encerra scripts
#   - Não executa Docker
#
# ==========================================================

#
# Verifica se um diretório existe.
#
# Uso:
#   directory_exists "/caminho"
#
# Retorno:
#   0 -> Existe
#   1 -> Não existe
#
directory_exists() {

    local directory="$1"

    [[ -d "${directory}" ]]

}
#
# Cria um diretório.
#
# Uso:
#   create_directory "/caminho"
#
# Retorno:
#   0 -> Criado com sucesso
#   1 -> Erro
#
create_directory() {

    local directory="$1"

    mkdir -p "${directory}"

}
#
# Remove um diretório vazio.
#
# Uso:
#   remove_directory "/caminho"
#
# Retorno:
#   0 -> Removido
#   1 -> Erro
#
remove_directory() {

    local directory="$1"

    rmdir "${directory}"

}

#
# Verifica se um arquivo existe.
#
# Uso:
#   file_exists "/etc/hosts"
#
# Retorno:
#   0 -> Existe
#   1 -> Não existe
#
file_exists() {

    local file="$1"

    [[ -f "${file}" ]]

}
#
# Cria um arquivo vazio.
#
# Uso:
#   create_file "/tmp/test.txt"
#
# Retorno:
#   0 -> Sucesso
#   1 -> Erro
#
create_file() {

    local file="$1"

    touch "${file}"

}
#
# Remove um arquivo.
#
# Uso:
#   remove_file "/tmp/test.txt"
#
remove_file() {

    local file="$1"

    rm -f "${file}"

}
#
# Copia um arquivo.
#
copy_file() {

    local source="$1"
    local destination="$2"

    cp "${source}" "${destination}"

}
#
# Move um arquivo.
#
move_file() {

    local source="$1"
    local destination="$2"

    mv "${source}" "${destination}"

}