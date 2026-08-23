#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: devices.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Descoberta de dispositivos físicos (USB, SD, externos).
#
# Responsabilidades:
#   - Listar dispositivos de bloco (lsblk)
#   - Listar dispositivos USB (lsusb)
#   - Reportar dispositivos montados em /srv/storage/devices
#
# Não faz:
#   - Não monta/desmonta (ver mounts.sh)
#   - Não gerencia usuários
#
# ==========================================================

HS_DEVICES_ROOT="${HS_DEVICES_ROOT:-/srv/storage/devices}"

#
# Resolve o caminho legível dos dispositivos (container via /host).
#
_devices_root_read() {
    if [[ -d "/host/srv/storage/devices" ]]; then
        printf "/host/srv/storage/devices"
    else
        printf "/srv/storage/devices"
    fi
}

#
# Lista dispositivos de bloco (JSON via lsblk).
#
device_list() {
    lsblk -J -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,LABEL,TRAN 2>/dev/null \
        || echo '{"blockdevices":[]}'
}

#
# Descoberta de dispositivos removíveis conectados (JSON).
#
# Lista partições de dispositivos removíveis (pendrive, SD, HD externo)
# com tudo que o App precisa para montar com 1 clique:
#   device  -> sdb1            (para hs device mount)
#   type    -> usb|sdcard|external (sugestão pela origem do transporte)
#   label   -> rótulo sugerido (LABEL do fs, senão nome da partição)
#   mounted -> já está montado?
#   size/fstype/transport/model -> contexto para o usuário decidir
#
device_available_json() {
    python3 - <<'PY' || echo '[]'
import json, subprocess

try:
    out = subprocess.run(
        ["lsblk", "-J", "-o",
         "NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,LABEL,TRAN,RM,MODEL"],
        capture_output=True, text=True, timeout=10
    ).stdout
    data = json.loads(out or "{}")
except Exception:
    print("[]")
    raise SystemExit(0)

TRAN_TYPE = {"usb": "usb", "mmc": "sdcard"}
results = []

def walk(devs, parent_tran="", parent_model=""):
    for b in devs:
        removable = bool(b.get("rm"))
        children = b.get("children") or []
        tran = (b.get("tran") or parent_tran or "").lower()
        model = (b.get("model") or parent_model or "").strip()

        # Disco removível SEM tabela de partição (fs direto no disco,
        # ex.: mídia óptica UDF, alguns pendrives formatados inteiros)
        if b.get("type") == "disk" and removable and b.get("fstype"):
            name = b["name"]
            mountpoint = b.get("mountpoint")
            dtype = TRAN_TYPE.get(tran, "external")
            label = (b.get("label") or "").strip().replace(" ", "-").lower()[:32]
            if not label or not all(c.isalnum() or c in "_-" for c in label):
                label = name
            results.append({
                "device": name,
                "type": dtype,
                "label": label,
                "size": b.get("size", ""),
                "fstype": (b.get("fstype") or "").lower(),
                "mounted": bool(mountpoint),
                "mountpoint": mountpoint,
                "transport": tran or "unknown",
                "model": model,
            })

        # Partição em disco removível
        if b.get("type") == "part" and removable:
            name = b["name"]
            fstype = (b.get("fstype") or "").lower()
            mountpoint = b.get("mountpoint")

            if tran in TRAN_TYPE:
                dtype = TRAN_TYPE[tran]
            else:
                dtype = "external"

            label = (b.get("label") or "").strip().replace(" ", "-").lower()[:32]
            if not label or not all(c.isalnum() or c in "_-" for c in label):
                label = name

            results.append({
                "device": name,
                "type": dtype,
                "label": label,
                "size": b.get("size", ""),
                "fstype": fstype,
                "mounted": bool(mountpoint),
                "mountpoint": mountpoint,
                "transport": tran or "unknown",
                "model": model,
            })

        walk(children, tran, model)

walk(data.get("blockdevices", []))
print(json.dumps(results, ensure_ascii=False))
PY
}

#
# Lista dispositivos USB (lsusb).
#
device_usb() {
    lsusb 2>/dev/null || true
}

#
# Verifica se o diretório é um ponto de montagem real (evita "fantasmas":
# diretórios órfãos deixados por unmount/eject/desplugue).
# Compara o device id do diretório com o do pai — funciona no host e no
# container (caminhos /host/...).
#
_devices_is_mountpoint() {
    local dir="$1" parent
    dir="${dir%/}"          # remove a barra final (dir vem do glob "*/")
    parent="${dir%/*}"
    [[ -e "${parent}" ]] || return 1
    [[ "$(stat -c %d "${dir}" 2>/dev/null)" != "$(stat -c %d "${parent}" 2>/dev/null)" ]]
}

#
# Lista os dispositivos montados em /srv/storage/devices (JSON).
# Apenas pontos de montagem reais são reportados.
#
device_mounted_json() {
    local root type dir label mountpoint size first=1

    root="$(_devices_root_read)"

    printf '['
    for type in usb sdcard external temporary; do
        for dir in "${root}/${type}"/*/; do
            [[ -d "${dir}" ]] || continue
            _devices_is_mountpoint "${dir}" || continue

            label="$(basename "${dir}")"
            mountpoint="${HS_DEVICES_ROOT}/${type}/${label}"
            size="$(df -B1 "${dir}" 2>/dev/null | awk 'NR==2 {print $3}')"

            [[ ${first} -eq 0 ]] && printf ','
            printf '\n  {"type":"%s","label":"%s","mountpoint":"%s","size":%s}' \
                "${type}" "${label}" "${mountpoint}" "${size:-0}"
            first=0
        done
    done
    printf '\n]'
}

#
# Estado dos dispositivos montados (JSON).
#
device_status() {
    device_mounted_json
}
