# Changelog

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
