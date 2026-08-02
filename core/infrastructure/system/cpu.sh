get_load() {
    awk '{print $1}' /proc/loadavg
}

get_cpu_percent() {
    local line1 line2 t1 d1 t2 d2 dt dd

    line1="$(awk 'NR==1 {s=0; for (i=2; i<=NF; i++) s+=$i; print s, $5 + $6}' /proc/stat)"
    sleep 0.2
    line2="$(awk 'NR==1 {s=0; for (i=2; i<=NF; i++) s+=$i; print s, $5 + $6}' /proc/stat)"

    t1="${line1% *}"
    d1="${line1#* }"
    t2="${line2% *}"
    d2="${line2#* }"

    dt=$((t2 - t1))
    dd=$((d2 - d1))

    if [[ ${dt} -gt 0 ]]; then
        awk -v dt="${dt}" -v dd="${dd}" 'BEGIN {printf "%.1f", ((dt - dd) / dt) * 100}'
    else
        printf "0"
    fi
}
