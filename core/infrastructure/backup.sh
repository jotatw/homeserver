get_backup_last() {
    local latest="/srv/backup/daily/latest"

    if [[ -d "${latest}" ]]; then
        basename "$(readlink "${latest}")"
    else
        printf "nenhum"
    fi
}
