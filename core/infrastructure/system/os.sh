get_os() {
    . /etc/os-release
    printf '%s\n' "$PRETTY_NAME"
}