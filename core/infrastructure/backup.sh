#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
#
# Arquivo......: backup.sh
# Módulo.......: Infrastructure
#
# Objetivo.....:
# Expor o estado do backup dos dados (diretório diário mais recente).
#
# Responsabilidades:
#   - Identificar o último backup em /srv/backup/daily/latest.
#
# Não Responsabilidades:
#   - Não executa Docker
#   - Não altera arquivos do Core
#
# ==========================================================

get_backup_last() {

    local latest="/srv/backup/daily/latest"

    if [[ -d "${latest}" ]]; then
        basename "$(readlink "${latest}")"
    else
        printf "nenhum"
    fi
}

#
# Valida o último backup (estrutura, symlink e conteúdo mínimo).
# Retorna JSON com status e lista de verificações.
#
backup_validate_json() {
    local root="/srv/backup/daily"
    local latest="${root}/latest"
    local target=""
    local ok=true
    local checks=""

    if [[ -L "${latest}" ]]; then
        target="$(readlink "${latest}" 2>/dev/null || true)"
        if [[ -d "${latest}" ]]; then
            checks="${checks} \"symlink\":\"ok\","
        else
            checks="${checks} \"symlink\":\"quebrado (${target})\","
            ok=false
        fi
    else
        checks="${checks} \"symlink\":\"ausente\","
        ok=false
    fi

    # Frescor: algum CONTEUDO do backup mais recente precisa ter sido
    # escrito hoje. O container da API usa BusyBox (find SEM -newermt) —
    # referencia via arquivo tocado + '-newer', portavel nos dois.
    local today_ref newer_content
    today_ref="$(mktemp /tmp/hs-backup-today.XXXXXX)"
    touch -t "$(date +%Y%m%d)0000" "${today_ref}" 2>/dev/null || true
    if [[ -n "${target}" ]]; then
        newer_content="$(find "${target}" -mindepth 2 -newer "${today_ref}" -print -quit 2>/dev/null)"
    else
        newer_content=""
    fi
    rm -f "${today_ref}"
    if [[ -n "${newer_content}" ]]; then
        checks="${checks} \"freshness\":\"ok\","
    else
        checks="${checks} \"freshness\":\"STALE (nao atualizado hoje)\","
        ok=false
    fi

    if [[ -d "${latest}/storage" ]]; then
        # -print -quit: para no primeiro arquivo (sem SIGPIPE com pipefail)
        local cnt
        cnt="$(find "${latest}/storage" -type f -print -quit 2>/dev/null | wc -l)"
        if [[ "${cnt}" -gt 0 ]]; then
            checks="${checks} \"storage\":\"ok\","
        else
            checks="${checks} \"storage\":\"vazio\","
            ok=false
        fi
    else
        checks="${checks} \"storage\":\"ausente\","
        ok=false
    fi

    if [[ -d "${latest}/docker" ]]; then
        checks="${checks} \"docker\":\"ok\","
    else
        checks="${checks} \"docker\":\"ausente\","
    fi

    if [[ -f "${latest}/manifest.sha256" ]]; then
        checks="${checks} \"manifest\":\"ok\","
    else
        checks="${checks} \"manifest\":\"ausente\","
    fi

    # Retenção: conta backups retidos
    local retained
    retained="$(find "${root}" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)"

    checks="${checks} \"retained\":${retained:-0},"
    checks="${checks%","}"

    printf '{"ok":%s,"latest":"%s","target":"%s",%s}\n' \
        "$([ "${ok}" = true ] && echo true || echo false)" \
        "$(basename "${target}" 2>/dev/null || echo "nenhum")" \
        "${target}" \
        "${checks}"
}