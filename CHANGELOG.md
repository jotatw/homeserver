# Changelog

## 2026-08-02

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
