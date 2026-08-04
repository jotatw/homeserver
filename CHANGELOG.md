# Changelog

Todas as mudanças notáveis no HomeServer são documentadas neste arquivo.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [1.3] — 2026-08-04

### Added

- **Autenticação**: login/logout/sessão com token (TTL 24h) na API.
- Validação de credenciais via FileBrowser (fonte de verdade de usuários).
- Proteção de rotas: admin (users, power, hardware, backup) e login (storage,
  services, devices, events, system).
- HomeServer App com página de login e redirecionamento automático.
- Token de serviço (`HS_SERVICE_TOKEN`) para integrações internas (homepage).
- `hs user verify` e `hs user is-admin` no CLI.

### Fixed

- `hs_user_is_admin` não dependia mais de python3 (indisponível no container).

## [1.2] — 2026-08-03


### Added

- **Unified Access**: módulo Caddy (reverse proxy) com um único ponto de
  entrada `homeserver.local`.
- **mDNS/Avahi**: `homeserver.local` resolve na LAN (validado em desktop e mobile).
- Rotas path-based: `/` (Homepage), `/files` (FileBrowser), `/git` (Gitea),
  `/api/v1` (API).
- FileBrowser com `baseURL=/files` e Gitea com `ROOT_URL=/git`.
- Homepage com hrefs relativos; API com CORS para `homeserver.local`.

### Changed

- O usuário não precisa mais conhecer portas ou endereços IP.

## [1.1] — 2026-08-03
### Fixed

- **Storage**: card exibia `NaN` (causa: `format: size` do customapi para números). Corrigido com contagens da API e `format: number`.
- **Bookmarks**: erro `URL constructor: undefined` (causa: bookmarks sem `description` disparam `new URL(href)`). Adicionadas descriptions.
- **Links/ícones**: revisão completa de hrefs e ícones.
- **Agendamento liga/desliga**: CORS na API (preflight 404), botão ⚡ com timing correto, `Persistent=false` no timer `night-off` (evita catch-up) e `restart: unless-stopped` no container da API.

### Changed

- **Navegação**: hover, feedback de clique e responsividade.
- Card **Storage** com contadores fixos (Usuários, Compartilhado, Mídia, Documentos).
- Card **Meus Arquivos** mostra espaço utilizado.
- Card **Dispositivos** (preview) no modo Sistema.
- **Documentação**: reorganizada em `docs/` (técnica) e `planning/` (evolução).

### Added

- **Painel "Hoje"**: `GET /api/v1/events` (backup, dispositivo, boot) + card no modo Sistema.
- **Favoritos**: grupo de acesso rápido configurável.
- **Agendamento na Homepage**: `GET/PUT /api/v1/power` + modal ⚡ para configurar horários.
- **Cache TTL** na API (status ~10s; chamadas repetidas ~160x mais rápidas).
- **Planejamento**: `planning/vision.md`, `planning/strategy.md`, `planning/roadmap/`, `planning/backlog/`.
- **PRINCIPLES.md**: regras de maturidade e definição oficial de Módulo.

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
