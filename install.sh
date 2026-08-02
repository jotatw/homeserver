#!/usr/bin/env bash

# ==========================================================
# HomeServer Installer
#
# Objetivo:
# Instalar e configurar o HomeServer em um servidor Debian,
# implantando os módulos definidos em modules/.
#
# Uso:
#   sudo bash install.sh [--modules=filebrowser,gitea,homepage,samba]
#
# Por padrão, implanta os serviços ativos em config/services.conf.
#
# Flags:
#   --modules   Lista de módulos separados por vírgula (sobrescreve o padrão)
#   --help      Mostra esta ajuda
# ==========================================================

set -euo pipefail

HS_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_ROOT="/srv/docker/compose"

info()    { printf "[INFO] %s\n" "$*"; }
success() { printf "[OK]   %s\n" "$*"; }
warning() { printf "[WARN] %s\n" "$*"; }
error()   { printf "[ERRO] %s\n" "$*"; }

_require_root() {
    if [[ "$(id -u)" -ne 0 ]]; then
        error "Este script precisa ser executado como root."
        exit 1
    fi
}

_yesno() {
    local prompt="$1"
    local resposta
    printf "%s [S/n] " "${prompt}" >&2
    read -r resposta
    [[ -z "${resposta}" || "${resposta}" =~ ^[Ss] ]]
}

_network_exists() {
    docker network ls --format '{{.Name}}' | grep -qx homeserver
}

# ---- Pré-requisitos --------------------------------------

_check_prerequisites() {

    command -v docker >/dev/null 2>&1 || {
        error "Docker não encontrado. Instale-o primeiro."
        info "Debian: curl -fsSL https://get.docker.com | bash"
        exit 1
    }

    docker info >/dev/null 2>&1 || {
        error "Docker daemon não está rodando ou usuário não está no grupo docker."
        exit 1
    }

    command -v docker compose >/dev/null 2>&1 || {
        error "Docker Compose não encontrado."
        exit 1
    }

    if ! _network_exists; then
        docker network create homeserver
        info "Rede 'homeserver' criada."
    fi
}

_create_dirs() {
    mkdir -p "${DEPLOY_ROOT}" \
             /srv/docker/volumes \
             /srv/storage/users \
             /srv/storage/shared \
             /srv/storage/media \
             /srv/storage/documents \
             /srv/storage/devices/usb \
             /srv/storage/devices/sdcard \
             /srv/storage/devices/external \
             /srv/storage/devices/temporary \
             /srv/services \
             /srv/backup/daily \
             /srv/logs \
             /srv/scripts
}

# ---- Módulos ----------------------------------------------

_deploy_module() {

    local module="$1"
    local src="${HS_ROOT}/modules/${module}"
    local dst="${DEPLOY_ROOT}/${module}"
    local compose_file=""

    [[ -d "${src}" ]] || {
        warning "Módulo '${module}' não encontrado em modules/."
        return 1
    }

    mkdir -p "${dst}"

    compose_file="$(ls "${src}"/compose.y*ml 2>/dev/null | head -n 1 || true)"
    if [[ -z "${compose_file}" ]]; then
        warning "Módulo '${module}' não possui arquivo compose."
        return 1
    fi

    cp "${compose_file}" "${dst}/"

    if [[ -f "${src}/.env" && -s "${src}/.env" ]]; then
        cp "${src}/.env" "${dst}/.env"
    elif [[ -f "${src}/.env.example" ]]; then
        cp "${src}/.env.example" "${dst}/.env"
        warning "Módulo '${module}': .env criado a partir do exemplo. Revise os valores."
    fi

    if [[ -d "${src}/config" ]]; then
        mkdir -p "${dst}/config"
        cp -r "${src}/config/." "${dst}/config/"
    fi

    ( cd "${dst}" && docker compose up -d )
    success "Módulo '${module}' implantado."
}

# ---- Sistema (Samba) ---------------------------------------

_setup_samba() {

    if ! command -v smbd >/dev/null 2>&1; then
        DEBIAN_FRONTEND=noninteractive apt-get install -y samba
    fi

    if ! testparm -s 2>/dev/null | grep -q "^\[shared\]"; then
        cat >> /etc/samba/smb.conf <<'SMBCONF'

[shared]
   comment = Arquivos Compartilhados
   path = /srv/storage/shared
   browseable = yes
   read only = no
   valid users = joao
   create mask = 0664
   directory mask = 0775
   force user = joao
   force group = users

[media]
   comment = Mídia
   path = /srv/storage/media
   browseable = yes
   read only = no
   valid users = joao
   create mask = 0664
   directory mask = 0775
   force user = joao
   force group = users

[documents]
   comment = Documentos
   path = /srv/storage/documents
   browseable = yes
   read only = no
   valid users = joao
   create mask = 0664
   directory mask = 0775
   force user = joao
   force group = users
SMBCONF
        success "Samba: shares adicionados."
    fi

    systemctl enable --now smbd nmbd
    success "Samba iniciado."
}

# ---- Firewall ----------------------------------------------

_configure_firewall() {

    if ! command -v ufw >/dev/null 2>&1; then
        apt-get install -y ufw
    fi

    ufw default deny incoming
    ufw default allow outgoing
    ufw allow OpenSSH

    ufw allow proto tcp from 192.168.0.0/24 to any port 3000  # homepage
    ufw allow proto tcp from 192.168.0.0/24 to any port 3001  # gitea http
    ufw allow proto tcp from 192.168.0.0/24 to any port 2222  # gitea ssh
    ufw allow proto tcp from 192.168.0.0/24 to any port 8000  # api
    ufw allow proto tcp from 192.168.0.0/24 to any port 8080  # filebrowser
    ufw allow proto tcp from 192.168.0.0/24 to any port 139   # samba
    ufw allow proto tcp from 192.168.0.0/24 to any port 445   # samba
    ufw allow proto udp from 192.168.0.0/24 to any port 137:138  # samba

    ufw --force enable
    success "Firewall configurado."
}

# ---- Automações ----------------------------------------------

_setup_backup() {

    mkdir -p /srv/scripts

    cp "${HS_ROOT}/scripts/backup.sh" /srv/scripts/backup.sh
    chmod +x /srv/scripts/backup.sh

    cp "${HS_ROOT}/scripts/homeserver-backup.service" /etc/systemd/system/
    cp "${HS_ROOT}/scripts/homeserver-backup.timer" /etc/systemd/system/

    systemctl daemon-reload
    systemctl enable --now homeserver-backup.timer
    success "Backup configurado (diário às 03h)."
}

_setup_power() {

    cp "${HS_ROOT}/scripts/power-schedule.sh" /srv/scripts/power-schedule.sh
    chmod +x /srv/scripts/power-schedule.sh

    cp "${HS_ROOT}/scripts/homeserver-night-off.service" /etc/systemd/system/
    cp "${HS_ROOT}/scripts/homeserver-night-off.timer" /etc/systemd/system/

    systemctl daemon-reload
    systemctl enable --now homeserver-night-off.timer
    success "Agendamento configurado (desliga 23h30, religa 07h00)."
}

# ---- Main ----------------------------------------------------

_usage() {
    sed -n 's/^# *//p' "$0" | head -n 20
}

main() {

    local modules=""
    local arg
    local m

    for arg in "$@"; do
        case "${arg}" in
            --modules=*) modules="${arg#*=}" ;;
            --help|-h)   _usage; exit 0 ;;
            *)           error "Argumento desconhecido: ${arg}"; exit 1 ;;
        esac
    done

    if [[ -z "${modules}" && -f "${HS_ROOT}/config/services.conf" ]]; then
        modules="$(sed -e '/^[[:space:]]*#/d' -e '/^[[:space:]]*$/d' \
                    "${HS_ROOT}/config/services.conf" | tr '\n' ',')"
        info "Módulos ativos (config/services.conf): ${modules}"
    fi

    _require_root
    _check_prerequisites
    _create_dirs

    IFS=',' read -ra MODULE_LIST <<< "${modules}"
    for m in "${MODULE_LIST[@]}"; do
        case "${m}" in
            samba)    _setup_samba ;;
            *)        _deploy_module "${m}" ;;
        esac
    done

    if _yesno "Configurar firewall UFW?"; then
        _configure_firewall
    fi

    if _yesno "Configurar backup automático (diário às 03h)?"; then
        _setup_backup
    fi

    if _yesno "Configurar agendamento liga/desliga (23h30/07h00)?"; then
        _setup_power
    fi

    success "=== Instalação concluída ==="
    info "Dashboard: http://192.168.0.10:3000"
}

main "$@"
