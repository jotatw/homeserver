get_memory_total() {
    awk '/^MemTotal:/ {printf "%.0f", $2 * 1024}' /proc/meminfo
}

get_memory_available() {
    awk '/^MemAvailable:/ {printf "%.0f", $2 * 1024}' /proc/meminfo
}

get_memory_used() {
    awk '/^MemTotal:/ {t=$2} /^MemAvailable:/ {a=$2} END {printf "%.0f", (t - a) * 1024}' /proc/meminfo
}

get_memory_percent() {
    awk '/^MemTotal:/ {t=$2} /^MemAvailable:/ {a=$2} END {if (t > 0) printf "%.1f", ((t - a) / t) * 100}' /proc/meminfo
}
