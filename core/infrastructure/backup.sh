#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: backup.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Expor o estado do backup dos dados (diretório diário mais recente).
#
# Responsabilidades:
#   - Identificar o último backup em /srv/backup/daily/latest.
#
# Não Responsabilidades:
#   - Não executa Docker
#   - Não altera arquivos do Core
#
# ==========================================================

get_backup_last() {

    local latest="/srv/backup/daily/latest"

    if [[ -d "${latest}" ]]; then
        basename "$(readlink "${latest}")"
    else
        printf "nenhum"
    fi
}