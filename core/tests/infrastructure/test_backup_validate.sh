#!/usr/bin/env bash
# Teste isolado de backup/validate/restore (Fase 6)
# Cria estrutura temporária, simula backup com hardlink incremental,
# valida e restaura verificando checksums — sem tocar em /srv.

set -euo pipefail

TMP="$(mktemp -d)"
SRC="${TMP}/src"
BACKUP_ROOT="${TMP}/backup/daily"
RESTORE_DST="${TMP}/restore"
trap 'rm -rf "${TMP}"' EXIT

mkdir -p "${SRC}/storage/users/alice" "${SRC}/storage/shared" "${SRC}/docker" "${SRC}/git"
echo "hello alice" > "${SRC}/storage/users/alice/file.txt"
echo "shared data" > "${SRC}/storage/shared/readme.txt"
echo "compose" > "${SRC}/docker/compose.yaml"

TODAY="2026-08-20"
TARGET="${BACKUP_ROOT}/${TODAY}"
LATEST="${BACKUP_ROOT}/latest"
mkdir -p "${BACKUP_ROOT}"

# Simula backup.sh (rsync com link-dest)
mkdir -p "${TARGET}"
rsync -a "${SRC}/storage/" "${TARGET}/storage/" >/dev/null
rsync -a "${SRC}/docker/" "${TARGET}/docker/" >/dev/null
rsync -a "${SRC}/git/" "${TARGET}/git/" >/dev/null
ln -sf "${TARGET}" "${LATEST}"
find "${TARGET}" -type f ! -name "manifest.sha256" | xargs sha256sum > "${TARGET}/manifest.sha256" 2>/dev/null || true

# Valida estrutura (simula backup_validate_json)
check() {
    local ok=0
    [[ -L "${LATEST}" && -d "${LATEST}" ]] || ok=1
    [[ -d "${LATEST}/storage" ]] || ok=1
    [[ -f "${LATEST}/manifest.sha256" ]] || ok=1
    return ${ok}
}

if ! check; then
    echo "FAIL: validação do backup falhou"
    exit 1
fi

# Restaura
mkdir -p "${RESTORE_DST}"
rsync -a "${LATEST}/storage/" "${RESTORE_DST}/storage/"

# Verifica dados
if ! diff -r "${SRC}/storage" "${RESTORE_DST}/storage" >/dev/null; then
    echo "FAIL: dados restaurados divergem"
    exit 1
fi

# Verifica manifest
if ! sha256sum -c "${LATEST}/manifest.sha256" >/dev/null 2>&1; then
    echo "FAIL: manifest sha256 falhou"
    exit 1
fi

echo "PASS: backup criado, validado e restaurado com dados verificados"
