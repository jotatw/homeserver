#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: tls.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# CA interna + certificados TLS locais (openssl), agnóstica de
# serviço: apenas gera/valida/renova certificados para a rede
# local. A integração com um proxy (ex.: Caddy) é configuração
# externa que consome os arquivos gerados aqui.
#
# Diretório...: /srv/config/tls (criado; pode ser sobrescrito
#               via HS_TLS_DIR). Requer contexto root (sudo ou
#               runner nsenter) para escrever.
#
# Arquivos:
#   ca.pem / ca.key     — CA local (10 anos)
#   server.pem/server.key — certificado servidor (SANs locais)
#
# Comandos:
#   hs tls init|renew|status|info
#
# ==========================================================

HS_TLS_DIR="${HS_TLS_DIR:-/srv/config/tls}"
HS_TLS_DAYS="${HS_TLS_DAYS:-825}"
HS_TLS_RENEW_DAYS="${HS_TLS_RENEW_DAYS:-30}"
HS_TLS_LOG="${HS_TLS_LOG:-/var/log/homeserver-tls.log}"

#
# sudo apenas quando não-root (host). Em container/root executa direto.
#
_sdo() {
    if [[ "$(id -u)" -eq 0 ]]; then
        "$@"
    else
        sudo "$@"
    fi
}

_tls_log() {
    local now
    now="$(date '+%F %T')"
    _sdo bash -c "mkdir -p \"\$(dirname '${HS_TLS_LOG}')\"; echo '[${now}] $*' >> '${HS_TLS_LOG}'" 2>/dev/null || true
}

#
# IP da LAN para incluir no SAN (prefere 192.168/16, depois 10/8,
# depois RFC1918 fora das faixas Docker 172.16-31).
#
tls_lan_ip() {
    [[ -n "${HS_HOST_IP:-}" ]] && printf '%s' "${HS_HOST_IP}" && return 0

    local ip
    for ip in $(hostname -I 2>/dev/null); do
        case "${ip}" in
            192.168.*) printf '%s' "${ip}"; return 0 ;;
        esac
    done
    for ip in $(hostname -I 2>/dev/null); do
        case "${ip}" in
            10.*) printf '%s' "${ip}"; return 0 ;;
        esac
    done
    for ip in $(hostname -I 2>/dev/null); do
        case "${ip}" in
            172.1[6-9].*|172.2[0-9].*|172.3[01].*) continue ;;
            127.*) continue ;;
            172.*|192.168.*|10.*) printf '%s' "${ip}"; return 0 ;;
        esac
    done
    return 0
}

#
# SANs completas do certificado servidor.
#
tls_sans() {
    local ip
    ip="$(tls_lan_ip)"
    printf "homeserver.local,localhost,127.0.0.1"
    [[ -n "${ip}" ]] && printf ",%s" "${ip}"
    printf '\n'
}

#
# SANs tipadas para o openssl (DNS:/IP:).
#
_tls_san_ext() {
    local item out=""
    for item in $(printf '%s' "$(tls_sans)" | tr ',' '\n'); do
        case "${item}" in
            *[0-9].*) out="${out}IP:${item}," ;;
            *)        out="${out}DNS:${item}," ;;
        esac
    done
    printf '%s' "${out%,}"
}

tls_ca_file()     { printf '%s/ca.pem' "${HS_TLS_DIR}"; }
tls_ca_key_file() { printf '%s/ca.key' "${HS_TLS_DIR}"; }
tls_cert_file()   { printf '%s/server.pem' "${HS_TLS_DIR}"; }
tls_key_file()    { printf '%s/server.key' "${HS_TLS_DIR}"; }

#
# SANs atuais do certificado emitido (normalizadas).
#
_tls_current_sans() {
    openssl x509 -in "$(tls_cert_file)" -noout -text 2>/dev/null \
        | grep -A1 'Subject Alternative Name' \
        | tail -1 | tr ',' '\n' | sed 's/^ *//; s/ *$//' \
        | sed 's/^DNS://; s/^IP Address://; s/^IP://'
}

#
# Converte "homeserver.local,localhost,127.0.0.1,192.168.0.10" em lista
# normalizada (uma SAN por linha).
#
_tls_norm_sans() {
    printf '%s' "${1}" | tr ',' '\n' | sed 's/^ *//; s/ *$//'
}

#
# Verifica se o certificado servidor expira dentro de HS_TLS_RENEW_DAYS.
# Saída: 0 = precisa renovar.
#
_tls_leaf_expiring() {
    local secs="$((HS_TLS_RENEW_DAYS * 86400))"
    openssl x509 -checkend "${secs}" -in "$(tls_cert_file)" >/dev/null 2>&1 \
        && return 1 || return 0
}

#
# Verifica se a CA existe e é válida.
# Saída: 0 = ok, 1 = ausente/fraca.
#
_tls_ca_ok() {
    [[ -f "$(tls_ca_file)" && -f "$(tls_ca_key_file)" ]] || return 1
    openssl x509 -in "$(tls_ca_file)" -noout 2>/dev/null || return 1
    return 0
}

#
# Gera (ou garante) a CA local.
#
_tls_ensure_ca() {
    local dir tmp_ca_pem tmp_ca_key
    dir="$(dirname "$(tls_ca_file)")"

    _sdo mkdir -p "${dir}"

    _tls_ca_ok && return 0

    tmp_ca_key="$(mktemp "${dir}/ca.key.XXXXXX")"
    tmp_ca_pem="$(mktemp "${dir}/ca.pem.XXXXXX")"

    _sdo openssl req -x509 -newkey rsa:3072 -sha256 -days 3650 -nodes \
        -keyout "${tmp_ca_key}" -out "${tmp_ca_pem}" \
        -subj "/CN=HomeServer Local CA" \
        -addext "basicConstraints=critical,CA:TRUE" \
        -addext "keyUsage=critical,keyCertSign,cRLSign,digitalSignature" \
        -addext "subjectKeyIdentifier=hash" || {
            _sdo rm -f "${tmp_ca_key}" "${tmp_ca_pem}"
            _tls_log "erro criando CA"
            return 1
        }

    _sdo chmod 600 "${tmp_ca_key}"
    _sdo chmod 644 "${tmp_ca_pem}"
    _sdo mv -f "${tmp_ca_key}" "$(tls_ca_key_file)"
    _sdo mv -f "${tmp_ca_pem}" "$(tls_ca_file)"
    _sdo chmod 600 "$(tls_ca_key_file)"

    _tls_log "CA criada/rotacionada"
    return 0
}

#
# Emite o certificado servidor (com SANs locais).
#
_tls_issue_leaf() {
    local dir sans tmp_key tmp_csr tmp_cert
    dir="$(dirname "$(tls_cert_file)")"
    sans="$(tls_sans)"

    tmp_key="$(mktemp "${dir}/server.key.XXXXXX")"
    tmp_csr="$(mktemp "${dir}/server.csr.XXXXXX")"
    tmp_cert="$(mktemp "${dir}/server.pem.XXXXXX")"

    _sdo openssl genrsa -out "${tmp_key}" 3072 2>/dev/null || {
        _sdo rm -f "${tmp_key}" "${tmp_csr}" "${tmp_cert}"
        _tls_log "erro gerando chave servidor"
        return 1
    }
    _sdo openssl req -new -key "${tmp_key}" -out "${tmp_csr}" \
        -subj "/CN=homeserver.local" || {
            _sdo rm -f "${tmp_key}" "${tmp_csr}" "${tmp_cert}"
            _tls_log "erro gerando CSR"
            return 1
        }
    _sdo openssl x509 -req -in "${tmp_csr}" \
        -CA "$(tls_ca_file)" -CAkey "$(tls_ca_key_file)" -CAcreateserial \
        -out "${tmp_cert}" -days "${HS_TLS_DAYS}" -sha256 \
        -extfile <(printf 'subjectAltName=%s\nbasicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature,keyEncipherment\nextendedKeyUsage=serverAuth\n' "$(_tls_san_ext)") || {
            _sdo rm -f "${tmp_key}" "${tmp_csr}" "${tmp_cert}"
            _tls_log "erro emitindo certificado"
            return 1
        }

    _sdo chmod 600 "${tmp_key}"
    _sdo chmod 644 "${tmp_cert}"
    _sdo mv -f "${tmp_key}" "$(tls_key_file)"
    _sdo mv -f "${tmp_cert}" "$(tls_cert_file)"
    _sdo chmod 600 "$(tls_key_file)"
    _sdo rm -f "${tmp_csr}"

    _tls_log "certificado servidor emitido (${sans})"
    return 0
}

#
# Recarrega o proxy local (não-fatal; apenas se disponível).
#
_tls_reload_proxy() {
    local cfg
    for cfg in /etc/caddy/Caddyfile /etc/Caddyfile; do
        if docker exec caddy caddy reload --config "${cfg}" --adapter caddyfile >/dev/null 2>&1; then
            _tls_log "proxy recarregado (${cfg})"
            return 0
        fi
    done
    return 0
}

#
# Garante CA + certificado servidor válidos (idempotente).
# Não rotaciona a CA se já existir — só emite o leaf quando necessário.
#
tls_init() {
    _tls_ensure_ca || return 1

    local sans current_sans renewed=0
    sans="$(tls_sans)"
    current_sans=""

    if [[ -f "$(tls_cert_file)" && -f "$(tls_key_file)" ]]; then
        current_sans="$(_tls_current_sans)"
    fi

    if [[ -z "${current_sans}" ]] \
        || [[ "$(_tls_norm_sans "${sans}" | sort)" != "$(_tls_norm_sans "${current_sans}" | sort)" ]] \
        || _tls_leaf_expiring; then
        _tls_issue_leaf || return 1
        renewed=1
    fi

    tls_status
    [[ "${renewed}" -eq 1 ]] && _tls_reload_proxy
    return 0
}

#
# Renova certificados se necessário.
#
tls_renew() {
    local before released
    if ! _tls_ca_ok; then
        _tls_log "renew: CA ausente, chamando init"
        tls_init
        return $?
    fi

    before="$(date '+%s')"
    tls_init
    released=$(( $(date '+%s') - before ))
    _tls_log "renew concluído em ${released}s"
    return 0
}

#
# Estado legível.
#
tls_status() {
    echo "TLS local: ${HS_TLS_DIR}"
    echo "  CA ......... $(_tls_ca_ok && echo 'ok' || echo 'ausente')"

    if [[ -f "$(tls_cert_file)" ]]; then
        echo "  Certificado: $(openssl x509 -in "$(tls_cert_file)" -noout -dates -subject 2>/dev/null | tr '\n' ' ')"
        echo "  SANs ....... $(_tls_current_sans | tr '\n' ',')"
    else
        echo "  Certificado: ausente"
    fi
}

#
# Resumo JSON (útil para a API).
#
tls_info() {
    local ca_exp server_exp sans
    ca_exp="$(openssl x509 -in "$(tls_ca_file)" -enddate -noout 2>/dev/null | cut -d= -f2- || echo '')"
    server_exp="$(openssl x509 -in "$(tls_cert_file)" -enddate -noout 2>/dev/null | cut -d= -f2- || echo '')"
    sans="$(_tls_current_sans | paste -sd, 2>/dev/null || echo '')"

    printf '{"dir":"%s","ca":"%s","ca_expires":"%s","server_expires":"%s","sans":"%s"}\n' \
        "${HS_TLS_DIR}" \
        "$(_tls_ca_ok && echo present || echo missing)" \
        "${ca_exp}" "${server_exp}" "${sans}"
}