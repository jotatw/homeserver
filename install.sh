#!/usr/bin/env bash
# ==========================================================
# HomeServer Installer
#
# Assistente de instalação do HomeServer em um servidor Debian.
# Detecta a rede e o usuário, instala Docker (se necessário),
# gera o .env da API, implanta os módulos oficiais,
# inicializa o Core e executa o Health Check.
#
# Uso:
#   sudo bash install.sh
#   sudo bash install.sh --user=<usuario>
#   sudo bash install.sh --network=<rede/CIDR>
#   sudo bash install.sh --non-interactive --user=<usuario> --network=<rede/CIDR>
#
# Flags:
#   --modules=<lista>     Módulos separados por vírgula (padrão: config/services.conf)
#   --user=<usuario>      Usuário Linux existente usado pelo HomeServer
#   --network=<CIDR>      Rede local usada pelo firewall
#   --assume-yes          Responde "sim" a todas as perguntas
#   --non-interactive     Sem perguntas; falha se valores obrigatórios não forem detectados
#   --dry-run             Mostra o que seria feito sem executar deploys
#   --help                Mostra esta ajuda
# ==========================================================

set -euo pipefail

HS_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_ROOT="/srv/docker/compose"

ASSUME_YES=0
NON_INTERACTIVE=0
DRY_RUN=0
MODULES=""
HS_USER="${HS_USER:-}"
HS_NETWORK="${HS_NETWORK:-}"
HS_IP="${HS_IP:-}"

info()    { printf "[INFO] %s\n" "$*"; }
success() { printf "[OK]   %s\n" "$*"; }
warning() { printf "[WARN] %s\n" "$*"; }
error()   { printf "[ERRO] %s\n" "$*"; }

_step() { printf "\n[%s/%s] %s\n" "$1" "$2" "$3"; }

_run() {
    if [[ "${DRY_RUN}" -eq 1 ]]; then
        info "dry-run: $*"
        return 0
    fi
    "$@"
}

_yesno() {
    local prompt="$1" resposta
    if [[ "${ASSUME_YES}" -eq 1 || "${NON_INTERACTIVE}" -eq 1 ]]; then
        return 0
    fi
    printf "%s [S/n] " "${prompt}" >&2
    read -r resposta
    [[ -z "${resposta}" || "${resposta}" =~ ^[Ss] ]]
}

_require_root() {
    if [[ "$(id -u)" -ne 0 ]]; then
        error "Este script precisa ser executado como root."
        echo "  sudo bash install.sh"
        exit 1
    fi
}

_detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        info "Sistema operacional: ${PRETTY_NAME:-$ID}"
        if [[ "${ID:-}" != "debian" && "${ID_LIKE:-}" != *"debian"* ]]; then
            warning "Projeto validado em Debian. ${PRETTY_NAME:-este sistema} pode funcionar, mas não é oficial."
        fi
    fi
}

_detect_network() {
    local detected_ip detected_network

    if [[ -n "${HS_IP}" && -n "${HS_NETWORK}" ]]; then
        info "Rede configurada: ${HS_NETWORK} (IP ${HS_IP})"
        return 0
    fi

    detected_ip="$(ip -o -4 addr show scope global 2>/dev/null | awk '{split($4,a,"/"); print a[1]; exit}')"
    detected_network="$(ip -4 route show scope link 2>/dev/null | awk -v ip="${detected_ip}" '$0 ~ ("src " ip) {print $1; exit}')"

    if [[ -n "${HS_IP}" ]]; then
        detected_ip="${HS_IP}"
    fi
    if [[ -n "${detected_ip}" ]]; then
        HS_IP="${detected_ip}"
    fi
    if [[ -n "${detected_network}" ]]; then
        HS_NETWORK="${detected_network}"
    fi

    if [[ -z "${HS_IP}" || "${HS_IP}" == "127.0.0.1" ]]; then
        if [[ "${NON_INTERACTIVE}" -eq 1 || "${ASSUME_YES}" -eq 1 ]]; then
            error "Não foi possível detectar o endereço IPv4 da rede local."
            error "Use --network=<CIDR> e HS_IP=<IP> em uma instalação não-interativa."
            exit 1
        fi
        read -r -p "IP local do servidor: " HS_IP
    fi

    if [[ -z "${HS_NETWORK}" ]]; then
        if [[ "${NON_INTERACTIVE}" -eq 1 || "${ASSUME_YES}" -eq 1 ]]; then
            error "Não foi possível detectar a rede local."
            error "Use --network=<CIDR> em uma instalação não-interativa."
            exit 1
        fi
        read -r -p "Rede local em CIDR (ex.: 192.168.1.0/24): " HS_NETWORK
    fi

    if [[ ! "${HS_NETWORK}" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}/[0-9]{1,2}$ ]]; then
        error "Rede inválida: ${HS_NETWORK}"
        exit 1
    fi

    info "Rede local: ${HS_NETWORK} (IP ${HS_IP})"
}

_detect_user() {
    local detected_user="${SUDO_USER:-}"

    if [[ -z "${HS_USER}" ]]; then
        if [[ -n "${detected_user}" && "${detected_user}" != "root" ]]; then
            HS_USER="${detected_user}"
        elif [[ "${NON_INTERACTIVE}" -eq 1 || "${ASSUME_YES}" -eq 1 ]]; then
            error "Não foi possível determinar o usuário principal."
            error "Use --user=<usuario> em uma instalação não-interativa."
            exit 1
        else
            read -r -p "Usuário Linux principal existente: " HS_USER
        fi
    fi

    if [[ -z "${HS_USER}" || "${HS_USER}" == "root" ]]; then
        error "O usuário principal deve ser um usuário Linux comum."
        exit 1
    fi

    if ! id "${HS_USER}" >/dev/null 2>&1; then
        error "Usuário Linux não encontrado: ${HS_USER}"
        error "Crie o usuário ou informe um usuário existente com --user=<usuario>."
        exit 1
    fi

    info "Usuário principal: ${HS_USER}"
}

_install_docker() {
    if command -v docker >/dev/null 2>&1; then
        info "Docker já instalado."
        return 0
    fi
    if [[ "${DRY_RUN}" -eq 1 ]]; then
        info "dry-run: instalaria Docker (curl -fsSL https://get.docker.com | sh)"
        return 0
    fi
    error "Docker não encontrado."
    if ! _yesno "Instalar o Docker agora (script oficial)?"; then
        echo "  Instale manualmente e rode o instalador novamente:"
        echo "    curl -fsSL https://get.docker.com | sh"
        exit 1
    fi
    curl -fsSL https://get.docker.com | sh
    if ! command -v docker >/dev/null 2>&1; then
        error "Falha ao instalar o Docker."
        exit 1
    fi
    success "Docker instalado."
}

_check_prerequisites() {
    if [[ "${DRY_RUN}" -eq 1 ]]; then
        info "dry-run: verificaria Docker, Compose, OpenSSL e rede 'homeserver'."
        return 0
    fi

    command -v docker >/dev/null 2>&1 || { error "Docker não encontrado."; exit 1; }
    docker info >/dev/null 2>&1 || { error "Docker daemon não está rodando."; exit 1; }
    if ! command -v docker compose >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
        error "Docker Compose não encontrado (plugin v2)."
        exit 1
    fi
    command -v openssl >/dev/null 2>&1 || { error "OpenSSL não encontrado; ele é necessário para gerar credenciais seguras."; exit 1; }

    if ! docker network ls --format '{{.Name}}' | grep -qx homeserver; then
        _run docker network create homeserver
        success "Rede 'homeserver' criada."
    fi
}

_create_dirs() {
    if [[ "${DRY_RUN}" -eq 1 ]]; then
        info "dry-run: criaria a estrutura /srv (storage, services, backup, logs, scripts)"
        return 0
    fi
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
    success "Estrutura /srv criada."
}

_prepare_service_dirs() {
    if [[ "${DRY_RUN}" -eq 1 ]]; then
        info "dry-run: criaria as pastas de dados dos serviços e ajustaria o dono (UID 1000)"
        return 0
    fi
    mkdir -p \
        /srv/services/filebrowser/database \
        /srv/services/filebrowser/config \
        /srv/services/filebrowser/backups \
        /srv/services/gitea

    # O container roda como UID 1000 — dono padrão das pastas de serviço.
    chown -R 1000:1000 /srv/services 2>/dev/null || true
    chown -R 1000:1000 /srv/storage 2>/dev/null || true
    success "Diretórios de dados dos serviços preparados."
}

_ask_api_password() {
    if [[ "${NON_INTERACTIVE}" -eq 1 || "${ASSUME_YES}" -eq 1 ]]; then
        HS_FILEBROWSER_PASS="$(openssl rand -hex 16)"
        warning "Senha do FileBrowser gerada automaticamente (mostrada ao final)."
        return 0
    fi
    local p1 p2
    while true; do
        printf "Senha do FileBrowser para '%s': " "${HS_USER}" >&2
        read -rs p1
        printf "\nRepita a senha: " >&2
        read -rs p2
        printf "\n"
        if [[ -n "${p1}" && "${p1}" == "${p2}" ]]; then
            HS_FILEBROWSER_PASS="${p1}"
            return 0
        fi
        echo "  As senhas não conferem ou estão vazias. Tente novamente."
    done
}

_setup_api_env() {
    local env_example="${HS_ROOT}/api/.env.example"
    local env_target="${HS_ROOT}/api/.env"

    if [[ -f "${env_target}" ]]; then
        info "api/.env já existe — mantendo valores atuais."
        return 0
    fi

    if [[ ! -f "${env_example}" ]]; then
        error "api/.env.example não encontrado em ${env_example}"
        exit 1
    fi

    _ask_api_password

    if [[ "${DRY_RUN}" -eq 1 ]]; then
        info "dry-run: geraria ${env_target}"
        return 0
    fi

    local token ssh_key home_dir
    token="$(openssl rand -hex 31)"

    # Detecta a chave SSH do usuário principal (para o update via git).
    home_dir="$(getent passwd "${HS_USER}" | cut -d: -f6 || true)"
    ssh_key=""
    if [[ -n "${home_dir}" && -f "${home_dir}/.ssh/id_ed25519" ]]; then
        ssh_key="${home_dir}/.ssh/id_ed25519"
    fi

    sed -e "s|^FILEBROWSER_ADMIN_USER=.*|FILEBROWSER_ADMIN_USER=${HS_USER}|" \
        -e "s|^FILEBROWSER_ADMIN_PASS=.*|FILEBROWSER_ADMIN_PASS=${HS_FILEBROWSER_PASS}|" \
        -e "s|^HS_HOST_IP=.*|HS_HOST_IP=${HS_IP}|" \
        -e "s|^HS_SERVICE_TOKEN=.*|HS_SERVICE_TOKEN=${token}|" \
        -e "s|^HS_SSH_KEY=.*|HS_SSH_KEY=${ssh_key}|" \
        "${env_example}" > "${env_target}"

    chmod 600 "${env_target}"
    success "api/.env gerado."
}

_deploy_module() {
    local module="$1"
    local src="${HS_ROOT}/modules/${module}"
    local dst="${DEPLOY_ROOT}/${module}"
    local compose_file=""

    [[ -d "${src}" ]] || { warning "Módulo '${module}' não encontrado."; return 1; }

    _run rm -rf "${dst}"
    mkdir -p "${dst}"
    compose_file="$(ls "${src}"/compose.y*ml 2>/dev/null | head -n 1 || true)"
    if [[ -z "${compose_file}" ]]; then
        warning "Módulo '${module}' não possui compose."
        return 1
    fi

    _run cp -r "${src}/." "${dst}/"

    if [[ -f "${src}/.env" && -s "${src}/.env" ]]; then
        _run cp "${src}/.env" "${dst}/.env"
    elif [[ -f "${src}/.env.example" ]]; then
        _run cp "${src}/.env.example" "${dst}/.env"
        warning "Módulo '${module}': .env a partir do exemplo — revise os valores."
    fi

    _run docker compose --project-directory "${dst}" -f "${dst}/$(basename "${compose_file}")" up -d
    success "Módulo '${module}' implantado."
}

_deploy_api() {
    info "Implantando API..."
    _run docker compose -f "${HS_ROOT}/api/compose.yaml" --project-directory "${HS_ROOT}/api" up -d --build
    success "API implantada."
}

_setup_samba() {
    if ! command -v smbd >/dev/null 2>&1; then
        if [[ "${DRY_RUN}" -eq 1 ]]; then
            info "dry-run: instalaria samba"
            return 0
        fi
        DEBIAN_FRONTEND=noninteractive apt-get install -y samba
    fi

    if ! testparm -s 2>/dev/null | grep -q "^\[shared\]"; then
        cat >> /etc/samba/smb.conf <<SMBCONF

[shared]
   comment = Arquivos Compartilhados
   path = /srv/storage/shared
   browseable = yes
   read only = no
   valid users = ${HS_USER}
   create mask = 0664
   directory mask = 0775
   force user = ${HS_USER}
   force group = users

[media]
   comment = Mídia
   path = /srv/storage/media
   browseable = yes
   read only = no
   valid users = ${HS_USER}
   create mask = 0664
   directory mask = 0775
   force user = ${HS_USER}
   force group = users

[documents]
   comment = Documentos
   path = /srv/storage/documents
   browseable = yes
   read only = no
   valid users = ${HS_USER}
   create mask = 0664
   directory mask = 0775
   force user = ${HS_USER}
   force group = users
SMBCONF
        success "Samba: shares adicionados (usuário ${HS_USER})."
    fi

    _run systemctl enable --now smbd nmbd
    success "Samba iniciado."
}

_configure_firewall() {
    if ! command -v ufw >/dev/null 2>&1; then
        if [[ "${DRY_RUN}" -eq 1 ]]; then
            info "dry-run: instalaria ufw"
            return 0
        fi
        DEBIAN_FRONTEND=noninteractive apt-get install -y ufw
    fi

    if [[ "${DRY_RUN}" -eq 1 ]]; then
        info "dry-run: configuraria UFW para a rede ${HS_NETWORK}"
        return 0
    fi

    ufw default deny incoming
    ufw default allow outgoing
    ufw allow OpenSSH

    for port in 3000 3001 2222 8000 8080 139 445; do
        ufw allow proto tcp from "${HS_NETWORK}" to any port "${port}"
    done
    ufw allow proto udp from "${HS_NETWORK}" to any port 137:138

    ufw --force enable
    success "Firewall configurado (rede ${HS_NETWORK})."
}

_setup_backup() {
    mkdir -p /srv/scripts
    _run cp "${HS_ROOT}/scripts/backup.sh" /srv/scripts/backup.sh
    _run chmod +x /srv/scripts/backup.sh
    _run cp "${HS_ROOT}/scripts/homeserver-backup.service" /etc/systemd/system/
    _run cp "${HS_ROOT}/scripts/homeserver-backup.timer" /etc/systemd/system/
    _run systemctl daemon-reload
    _run systemctl enable --now homeserver-backup.timer
    success "Backup configurado (diário às 03h)."
}

_setup_power() {
    _run cp "${HS_ROOT}/scripts/power-schedule.sh" /srv/scripts/power-schedule.sh
    _run chmod +x /srv/scripts/power-schedule.sh
    _run cp "${HS_ROOT}/scripts/homeserver-night-off.service" /etc/systemd/system/
    _run cp "${HS_ROOT}/scripts/homeserver-night-off.timer" /etc/systemd/system/
    _run systemctl daemon-reload
    _run systemctl enable --now homeserver-night-off.timer
    success "Agendamento configurado (desliga 22h00, religa 07h00)."
}

_setup_core() {
    if [[ -f "${HS_ROOT}/core/hs.sh" ]]; then
        chmod +x "${HS_ROOT}/core/hs.sh" 2>/dev/null || true
    fi
    if [[ "${DRY_RUN}" -ne 1 && -x "${HS_ROOT}/core/hs.sh" ]]; then
        local version
        version="$(bash "${HS_ROOT}/core/hs.sh" version 2>/dev/null || true)"
        if [[ -n "${version}" ]]; then
            success "Core inicializado (${version})."
        else
            warning "Core presente, mas sem resposta do CLI."
        fi
    else
        info "Core verificado."
    fi
}

_health_check() {
    if [[ "${DRY_RUN}" -eq 1 ]]; then
        info "dry-run: executaria scripts/health-check.sh"
        return 0
    fi
    echo
    echo "------------------------------------------------------------"
    bash "${HS_ROOT}/scripts/health-check.sh"
}

_summary() {
    local ip="${HS_IP}"

    echo
    echo "============================================================"
    echo " HomeServer instalado com sucesso!"
    echo "============================================================"
    echo
    echo " Acesse:"
    echo "   Homepage      https://homeserver.local/"
    echo "   App           https://homeserver.local/app"
    echo "   Fallback      https://${ip}/"
    echo
    if [[ -n "${HS_FILEBROWSER_PASS:-}" && "${DRY_RUN}" -ne 1 ]]; then
        echo " Credenciais iniciais do armazenamento:"
        echo "   usuário: ${HS_USER}"
        echo "   senha  : ${HS_FILEBROWSER_PASS}"
        echo
    fi
    echo " Próximos passos: veja docs/FIRST_BOOT.md"
    echo "============================================================"
}

_usage() {
    sed -n 's/^# *//p' "$0" | tail -n +2 | sed -n '1,30p'
}

main() {
    local arg
    for arg in "$@"; do
        case "${arg}" in
            --modules=*) MODULES="${arg#*=}" ;;
            --user=*) HS_USER="${arg#*=}" ;;
            --network=*) HS_NETWORK="${arg#*=}" ;;
            --assume-yes) ASSUME_YES=1 ;;
            --non-interactive) NON_INTERACTIVE=1 ;;
            --dry-run) DRY_RUN=1 ;;
            --help|-h) _usage; exit 0 ;;
            *) error "Argumento desconhecido: ${arg}"; exit 1 ;;
        esac
    done

    echo "============================================================"
    echo " HomeServer Installer"
    echo "============================================================"
    echo

    _require_root
    _detect_os
    _install_docker
    _detect_network
    _detect_user
    _check_prerequisites

    if [[ -z "${MODULES}" && -f "${HS_ROOT}/config/services.conf" ]]; then
        MODULES="$(sed -e '/^[[:space:]]*#/d' -e '/^[[:space:]]*$/d' "${HS_ROOT}/config/services.conf" | tr '\n' ',')"
        info "Módulos ativos (config/services.conf): ${MODULES}"
    fi

    _step 1 8 "Criando diretórios"
    _create_dirs
    _prepare_service_dirs

    _step 2 8 "Gerando api/.env"
    _setup_api_env

    _step 3 8 "Implantando módulos"
    local m
    IFS=',' read -ra MODULE_LIST <<< "${MODULES}"
    for m in "${MODULE_LIST[@]}"; do
        case "${m}" in
            samba) _setup_samba ;;
            *)     _deploy_module "${m}" ;;
        esac
    done

    _step 4 8 "Implantando API"
    _deploy_api

    _step 5 8 "Inicializando Core (CLI)"
    _setup_core

    _step 6 8 "Configurando firewall"
    if _yesno "Configurar firewall UFW?"; then _configure_firewall; fi

    _step 7 8 "Automações (backup e energia)"
    if _yesno "Configurar backup automático (diário às 03h)?"; then _setup_backup; fi
    if _yesno "Configurar agendamento liga/desliga (22h00/07h00)?"; then _setup_power; fi

    _step 8 8 "Health Check"
    _health_check

    _summary
}

main "$@"
