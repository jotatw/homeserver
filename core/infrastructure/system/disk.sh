_disk_root() {
    if [[ -d "/host" ]]; then
        printf "/host"
    else
        printf "/"
    fi
}

get_disk_total() {
    df -P "$(_disk_root)" | awk 'NR==2 {printf "%.0f", $2 * 1024}'
}

get_disk_used() {
    df -P "$(_disk_root)" | awk 'NR==2 {printf "%.0f", $3 * 1024}'
}

get_disk_available() {
    df -P "$(_disk_root)" | awk 'NR==2 {printf "%.0f", $4 * 1024}'
}

get_disk_percent() {
    df -P "$(_disk_root)" | awk 'NR==2 {gsub("%", "", $5); print $5}'
}
