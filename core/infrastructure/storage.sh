#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: storage.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Gerenciar o armazenamento centralizado do HomeServer.
#
# Responsabilidades:
#   - Criar a estrutura oficial de diretórios
#   - Manter permissões padrão
#   - Reportar estado, contagens e tamanhos
#
# Estrutura oficial:
#
#   /srv/storage/
#   ├── users/
#   ├── shared/
#   ├── media/
#   ├── documents/
#   └── devices/
#       ├── usb/
#       ├── sdcard/
#       ├── external/
#       └── temporary/
#
# Não faz:
#   - Não gerencia usuários
#   - Não monta dispositivos
#   - Não conhece serviços
#
# ==========================================================

HS_STORAGE_ROOT="${HS_STORAGE_ROOT:-/srv/storage}"

#
# Resolve o caminho legível do storage (container via /host ou host).
#
_storage_root_read() {
    if [[ -d "/host/srv/storage" ]]; then
        printf "/host/srv/storage"
    else
        printf "/srv/storage"
    fi
}

#
# Lista os diretórios oficiais do storage.
#
storage_directories() {
    printf '%s\n' \
        "${HS_STORAGE_ROOT}" \
        "${HS_STORAGE_ROOT}/users" \
        "${HS_STORAGE_ROOT}/shared" \
        "${HS_STORAGE_ROOT}/media" \
        "${HS_STORAGE_ROOT}/documents" \
        "${HS_STORAGE_ROOT}/devices" \
        "${HS_STORAGE_ROOT}/devices/usb" \
        "${HS_STORAGE_ROOT}/devices/sdcard" \
        "${HS_STORAGE_ROOT}/devices/external" \
        "${HS_STORAGE_ROOT}/devices/temporary"
}

#
# Cria a estrutura do storage (idempotente).
#
storage_init() {
    local dir

    for dir in $(storage_directories); do
        mkdir -p "${dir}" || return 1
    done

    chown -R 1000:1000 "${HS_STORAGE_ROOT}" 2>/dev/null || true

    chmod 755 "${HS_STORAGE_ROOT}" \
        "${HS_STORAGE_ROOT}/users" \
        "${HS_STORAGE_ROOT}/devices" \
        "${HS_STORAGE_ROOT}/devices/usb" \
        "${HS_STORAGE_ROOT}/devices/sdcard" \
        "${HS_STORAGE_ROOT}/devices/external" \
        "${HS_STORAGE_ROOT}/devices/temporary" 2>/dev/null || true

    chmod 775 "${HS_STORAGE_ROOT}/shared" \
        "${HS_STORAGE_ROOT}/media" \
        "${HS_STORAGE_ROOT}/documents" 2>/dev/null || true

    return 0
}

#
# Verifica se o storage está pronto.
#
storage_ready() {
    local root
    root="$(_storage_root_read)"

    [[ -d "${root}/users" ]] \
        && [[ -d "${root}/shared" ]] \
        && [[ -d "${root}/media" ]] \
        && [[ -d "${root}/devices" ]]
}

#
# Tamanho de um diretório (bytes).
#
storage_dir_size() {
    du -sb "$1" 2>/dev/null | awk '{print $1}'
}

#
# Conta entradas de primeiro nível em um diretório.
#
_storage_count() {
    find "$1" -mindepth 1 -maxdepth 1 2>/dev/null | wc -l
}

#
# Formata um tamanho em bytes para texto humano.
#
storage_human_size() {
    local bytes="$1"

    awk -v b="${bytes}" 'BEGIN {
        if (b >= 1073741824) printf "%.1f GB", b / 1073741824
        else if (b >= 1048576) printf "%.1f MB", b / 1048576
        else if (b >= 1024) printf "%.1f KB", b / 1024
        else printf "%d B", b
    }'
}

#
# Estado do storage em JSON (contagens + tamanhos).
#
storage_status_json() {
    local root users shared media documents devices
    local users_size shared_size media_size documents_size total_size total_human

    root="$(_storage_root_read)"

    users=$(_storage_count "${root}/users")
    shared=$(_storage_count "${root}/shared")
    media=$(_storage_count "${root}/media")
    documents=$(_storage_count "${root}/documents")
    devices=$(find "${root}/devices" -mindepth 2 -maxdepth 2 -type d 2>/dev/null | wc -l)

    users_size=$(storage_dir_size "${root}/users")
    shared_size=$(storage_dir_size "${root}/shared")
    media_size=$(storage_dir_size "${root}/media")
    documents_size=$(storage_dir_size "${root}/documents")
    total_size=$((users_size + shared_size + media_size + documents_size))
    total_human="$(storage_human_size "${total_size:-0}")"

    printf '{\n'
    printf '  "root": "%s",\n' "${HS_STORAGE_ROOT}"
    printf '  "ready": %s,\n' "$(storage_ready && echo true || echo false)"
    printf '  "users": %s,\n' "${users:-0}"
    printf '  "shared": %s,\n' "${shared:-0}"
    printf '  "media": %s,\n' "${media:-0}"
    printf '  "documents": %s,\n' "${documents:-0}"
    printf '  "devices": %s,\n' "${devices:-0}"
    printf '  "users_size": %s,\n' "${users_size:-0}"
    printf '  "total_size": %s,\n' "${total_size:-0}"
    printf '  "total_size_human": "%s"\n' "${total_human}"
    printf '}\n'
}
