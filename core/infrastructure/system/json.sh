system_info_json() {
    echo "{"
    echo "  \"hostname\": \"$(get_hostname)\","
    echo "  \"os\": \"$(get_os)\","
    echo "  \"kernel\": \"$(get_kernel)\","
    echo "  \"architecture\": \"$(get_architecture)\","
    echo "  \"uptime\": \"$(get_uptime)\""
    echo "}"
}