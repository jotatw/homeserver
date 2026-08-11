get_service_status_json() {
    local service state first=1

    if ! command -v docker >/dev/null 2>&1; then
        printf "[]"
        return 0
    fi

    printf "["
    while read -r service; do
        [[ -n "${service}" ]] || continue
        state="$(docker inspect -f '{{.State.Status}}' "${service}" 2>/dev/null || echo "not_found")"
        [[ ${first} -eq 0 ]] && printf ","
        printf '\n  {"name":"%s","status":"%s"}' "${service}" "${state}"
        first=0
    done < <(enabled_services)
    printf "\n]"
}
