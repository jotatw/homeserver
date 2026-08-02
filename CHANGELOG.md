# Changelog

Todas as mudanças notáveis no HomeServer são documentadas neste arquivo.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Unreleased] — v1.1

### Fixed

- **Storage**: card exibia `NaN` (causa: `format: size` do customapi para números). Corrigido com contagens da API e `format: number`.
- **Bookmarks**: erro `URL constructor: undefined` (causa: bookmarks sem `description` disparam `new URL(href)`). Adicionadas descriptions.
- **Links/ícones**: revisão completa de hrefs e ícones.

### Changed

- Card **Storage** com contadores fixos (Usuários, Compartilhado, Mídia, Documentos).
- Card **Meus Arquivos** mostra espaço utilizado.
- Card **Dispositivos** (preview) no modo Sistema.

### Added

- `planning/` com roadmap (v1.1, v1.2, v2.0) e product backlog numerado.
- API `storage_status_json` com contagens e `total_size_human`.

## [1.0] — 2026-08-02

### Added

- **Storage**: módulo `storage.sh`, estrutura oficial em `/srv/storage`, campo no `/status`.
- **Users + Adapters**: camada `core/adapters/`; `hs user create/info/password/rm`; `PUT /users/:nome`.
- **Homepage**: modos **Usuário / Administrador / Sistema** (progressivos); `hideErrors`.
- **API**: `GET /storage`, `/services`, `POST /backup`, `PUT /users`, `GET /devices`.
- **Devices**: `devices.sh` + `mounts.sh`; **udev auto-mount** em `/srv/storage/devices/`.
- **Hardware**: `hardware.sh` (temperatura hwmon, smartctl, rede, USB); `GET /api/v1/hardware`.
- **Automation**: hooks extensíveis em `/srv/automation/hooks/<evento>/`.
- **Scheduler**: `scheduler.sh` com backend systemd timers; `config/scheduler.conf`.
- **Notifications**: estrutura de canais plugáveis (`core/adapters/notification/`).
- **CI/CD**: GitHub Actions (shellcheck + testes + typecheck + build); Publish automático.
- **Licença**: Apache 2.0.

### Changed

- Nova arquitetura em camadas: Foundation → Adapters → Infrastructure → Applications.
- Homepage reorganizada por modos de exibição.
- Gitea corrigido (ROOT_URL/DOMAIN → 192.168.0.10).
- Storage migrado para `/srv/storage` + `/srv/services`.

### Fixed

- Acesso da homepage ao docker.sock (PGID=989).
- `get_uptime` portátil (BusyBox).
- Shellcheck no CI (SC2010/2011/2120).
