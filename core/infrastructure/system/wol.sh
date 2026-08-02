WOL_IFACE="${WOL_IFACE:-enp7s0}"

WOL_MARKER="/host/srv/scripts/.wol-enabled"
[[ -f "${WOL_MARKER}" ]] || WOL_MARKER="/srv/scripts/.wol-enabled"

wol_status() {
    if command -v ethtool >/dev/null 2>&1 \
        && ethtool "${WOL_IFACE}" 2>/dev/null | grep -qi "Wake-on: g"; then
        printf "enabled"
        return 0
    fi

    if [[ -f "${WOL_MARKER}" ]]; then
        printf "enabled"
        return 0
    fi

    printf "disabled"
}

wol_enable() {
    if command -v ethtool >/dev/null 2>&1; then
        ethtool -s "${WOL_IFACE}" wol g 2>/dev/null || true
    fi

    mkdir -p "$(dirname "${WOL_MARKER}")" 2>/dev/null || true
    touch "${WOL_MARKER}" 2>/dev/null || true

    printf "enabled"
}
