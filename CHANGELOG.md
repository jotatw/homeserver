# Changelog

## 2026-08-02 — MVP + Milestones (v1.0)

### MVP (Sprints 1-5)

- **Storage**: módulo `storage.sh`, estrutura oficial em `/srv/storage`, campo no `/status`.
- **Users + Adapters**: camada `core/adapters/`; `hs user create/info/password/rm`; `PUT /users/:nome`.
- **Homepage**: modos **Usuário / Administrador / Sistema** (progressivos); `hideErrors`.
- **API**: `GET /storage`, `/services`, `POST /backup`, `PUT /users`, `GET /devices`.
- **Devices**: `devices.sh` + `mounts.sh`; **udev auto-mount** em `/srv/storage/devices/`.

### Milestone 2 — Hardware

- `hardware.sh`: temperatura (hwmon), discos (lsblk + smartctl), rede, USB.
- `GET /api/v1/hardware`; card "Sensores" na Homepage.

### Milestone 3 — Automation

- `automation.sh` com hooks extensíveis em `/srv/automation/hooks/<evento>/`.
- Eventos: usb, sdcard, backup, startup, shutdown, users, services.
- Hooks conectados ao udev, user e service lifecycle.

### Milestone 4 — Scheduler

- `scheduler.sh` com backend systemd timers (`hs-task-<nome>`).
- `config/scheduler.conf`: backup (03h) e night-off (23h30).
- `hs scheduler init|list|enable|disable|run`.

### Milestone 5 — Notifications (escopo)

- `notification.sh` + `core/adapters/notification/` (canais plugáveis).
- `config/notifications.conf` para ativação de canais.

# Changelog

## 2026-08-02 — Storage por usuário + Wake-on-LAN

### Storage

- Nova estrutura em `/srv`: `storage/{users,shared,media,documents}` + `services/`.
- Dados de serviço (gitea, filebrowser) movidos para `/srv/services`.
- Samba e script de backup atualizados para os novos caminhos.
- `install.sh` e core alinhados (sem referências a `/srv/data`).
- Limpeza do cruft em `/srv/git`.

### FileBrowser

- Raiz = `/srv/storage`; admin (`joao`) com escopo `/` (acesso total).
- Cada usuário comum vê apenas `/users/<nome>` (pasta criada automaticamente).
- Modelo `createUserDir`/`MakeUserDir` nativo aproveitado.

### Homepage

- Grupo "Sistema" refinado (removidos links para JSON cru).
- Card "Server" agora exibe o estado do Wake-on-LAN.

### Wake-on-LAN

- WoL habilitado e persistido (`homeserver-wol.service`).
- Core: `hs system wol status|enable`.
- Campo `wol` em `/api/v1/status`.

# Changelog

## v1.0.0-rc.1 — Preparação para lançamento

### Limpeza

- Removidos 46 arquivos vazios do versionamento (adapters, plugins, docs de planejamento).
- Removidos diretórios órfãos (`assets/`, `tools/`, `homepage/`).
- `.gitignore` corrigido: `config/services.conf` agora é versionado; pastas de runtime ignoradas.
- Removidos docs duplicados (`docs/DEVELOPMENT.md`, `docs/ROADMAP.md`, `docs/VISION.md`).

### Homepage

- Modos de exibição via `custom.js`: **Simples**, **Admin** e **Manutenção**.
- Grupos reorganizados: Essenciais, Status, Administração e Sistema.
- Seletor de modo persistente (localStorage) com MutationObserver.

### Licença e documentação

- Adicionada licença **Apache 2.0** (`LICENSE`).
- Índice de documentação atualizado (`docs/README.md`).
- Módulo Portainer com `.env.example`.

### CI/CD

- `core/tests/run_ci.sh` implementado (lint + suíte).
- `.github/workflows/ci.yml` (shellcheck + testes core + typecheck/build API).
- `.github/workflows/publish.yml` (imagem Docker da API para GHCR em tags `v*`).
- `api/package-lock.json` adicionado para builds reprodutíveis.
- `.shellcheckrc` criado.

## 2026-08-02 — Homepage como hub + usuários

### Homepage

- Layout em abas: Visão Geral / Serviços / Links.
- Tema escuro fixo (slate), full width, statusStyle dot, showStats.
- Card "Server" com resumo em tempo real via `/api/v1/status` (widget Custom API).
- Widget resources com disco real do host (`/host`).
- Acesso do container ao docker.sock corrigido (PGID=989).
- Config canônica em `modules/homepage/config`.

### Core

- Novos comandos: `system memory|disk|cpu|services|backup|status`.
- Novo módulo de usuários (`core/infrastructure/users.sh`): `user create|list|rm`.
- Gitea corrigido: `ROOT_URL`/`DOMAIN`/`SSH_DOMAIN` → `192.168.0.10`.

### API

- `/api/v1/status` — resumo completo do servidor (CPU, memória, disco, serviços, backup).
- `/api/v1/users` — GET/POST/DELETE para gestão de usuários.
- Container com docker.sock + `docker-cli`, `curl`, `openssl`.
- API na rede `homeserver`.

### Usuários

- Pasta própria `/srv/data/users/<nome>`.
- Usuário FileBrowser com escopo restrito à própria pasta.
- Perfil opcional no Gitea (`--gitea`).
- Gestão via CLI (`hs user`) e API.

### Login (pendente)

- OIDC configurado e pronto, mas aguardando release do Homepage que
  inclua autenticação (hoje só na branch `dev`).

## 2026-08-02 — Base do servidor

### API

- Corrigido o caminho do compose (renomeação para `homeserver/`).
- API rodando em `0.0.0.0:8000`.
- Adapter de sistema consumindo o CLI do Core (`core/hs.sh system hostname`).
- Container agora reporta dados reais do host (hostname, OS).

### Core

- Corrigido o carregamento da Infrastructure no `loader.sh`.
- Corrigido `core/init.sh` (caminhos inexistentes removidos).
- Criado CLI `core/hs.sh` com comandos `system`, `service` e `status`.
- Criado registry de módulos (`core/foundation/registry.sh`).
- Adicionadas operações `compose_status`, `compose_check` e `compose_info`.
- Suíte de testes passando (Foundation 4/4, Infrastructure 2/2).

### Serviços

- Portainer parado e transformado em módulo opcional.
- Módulo portainer criado em `modules/portainer`.
- Homepage configurado com acesso ao socket do Docker.
- Dashboard atualizado com a API.

### Infraestrutura

- Samba instalado e configurado (shares: shared, media, documents).
- Backup diário às 03h em `/srv/backup` (rsync incremental).
- Agendamento liga/desliga (23h30/07h00) via RTC.
- Firewall UFW liberado apenas para a rede local.

## v0.2.0 - Gitea

### Added

- Servidor Git privado.
- Banco SQLite persistente.
- Repositório HomeServer.
- Integração com Homepage.

## 2026-07-21

### Added

- Estrutura inicial do HomeServer.
- Homepage.
- Gitea.
- Integração Git.
- Documentação inicial.

## v0.1.0

### Infraestrutura

- Debian 13
- Docker
- Docker Compose
- Portainer
- Homepage

### Organização

- Estrutura inicial do repositório
- Documentação
- Roadmap
