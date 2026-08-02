get_hostname() {
    if [[ -f /etc/hostname ]]; then
        cat /etc/hostname
    else
        hostname
    fi
}
