# Levantamento de Serviços — Base para a Modularização

> Documento de trabalho. Mapeia os **serviços atuais** do HomeServer e como eles
> se relacionam com a [Arquitetura Modular (M1)](../architecture/README.md) e com
> os [grupos de módulos](../modules/README.md).
> Data: 2026-08-16 · Estado real levantado no servidor de produção.

## 1. Objetivo

Ter uma visão única e verificada de **quais serviços existem, como estão
implantados, como se integram e onde cada um encaixa no modelo modular**, para
servir de ponto de partida da implementação (que seguirá a M1).

## 2. Inventário de deploy (estado real)

| Serviço | Imagem/versão | Portas | Volumes / dados | Segurança | Health |
|---|---|---|---|---|---|
| **Caddy** | `caddy:2` | 80 · 443 | `caddy_data`/`caddy_config` (volumes) · `Caddyfile` · `/srv/config/tls:/etc/tls` | — | n/a |
| **FileBrowser** | `filebrowser:v2.63.23` ⚠️ EOL | 8080→80 | `/srv/services/filebrowser/{config,database}` · `/srv/storage:/srv` | `no-new-privileges` | healthy |
| **Gitea** | `gitea:1.27.0` | 3001→3000 · 2222→22 | `/srv/services/gitea:/data` | `no-new-privileges` | n/a |
| **Homepage** | `ghcr.io/gethomepage/homepage:v1.13.2` | 3000→3000 | `config:/app/config` · `/:/host` (ro) · `docker.sock` (ro) | `no-new-privileges` · user `${PUID}:${PGID}` | healthy |
| **Portainer** | `portainer-ce:lts` | 9443 | `/srv/docker/volumes/portainer:/data` · `docker.sock` | `no-new-privileges` | — (módulo no repo, **não implantado**) |
| **API** | build local (`node:22-alpine`) | 8000 | bind `/srv/git/homeserver:/workspace` · `/:/host` (ro) · `/srv/storage`/`backup` (ro) · docker.sock | cap `SYS_RAWIO` | — |

Ativação: `config/services.conf` → `filebrowser`, `gitea`, `homepage`, `caddy`.

## 3. Configuração (contrato atual)

- **Ativação de serviços**: `config/services.conf`.
- **API**: `api/.env.example` (`HS_HOST_IP`, admin, `TZ`, …). `HS_HOST_IP` também usado por Caddy/TLS.
- **Caddy**: `modules/caddy/.env.example` (único módulo com exemplo) — `HOMESERVER_DOMAIN`, `HS_HOST_IP`, portas.
- **Scheduler**: `config/scheduler.conf` — `backup` (03h), `night-off` (22h), `tls-renew` (dom 04h).
- ⚠️ **Gap — contrato env por módulo**: `filebrowser`, `gitea`, `homepage` e `portainer` **não possuem `.env.example`** (usam `${FILEBROWSER_PORT}`, `${GITEA_HTTP_PORT}`, `${GITEA_SSH_PORT}`, `${PORTAINER_PORT}`, `${PUID}`, `${PGID}`, `${TZ}`, `HOMEPAGE_*`).

## 4. Integrações atuais (fronteiras)

| Origem | Integração | Observação |
|---|---|---|
| **Caddy** | Rotas path-based: `/`→homepage, `/files`→filebrowser, `/git`→gitea, `/app`+`/api/v1`→api | TLC com CA interna (`hs tls`) |
| **Homepage** | `config/services.yaml` (cards/grupos) · `docker.yaml` (via `docker.sock`) · widgets `customapi` → API (`/status`, `/hardware`, `/devices`, `/storage`, `/events`) | ⚠️ **Bearer token hardcoded no config (6 ocorrências)**; config **diverge do repo** no deploy |
| **FileBrowser** | `core/adapters/filebrowser.sh` (único adapter: login/CRUD/senha) · mount `/srv/storage` · `users.sh` | Fronteira correta (adapter) |
| **Gitea** | `users.sh::hs_user_create_gitea` via `docker exec -u git gitea …` | ⚠️ **container name hardcoded fora de adapter** |
| **API** | `/api/v1/services` → `hs system services` (`get_service_status_json`) · serve o App em `/app` | observed state mínimo |
| **CLI** | `hs service enable|disable|start|stop|restart|update` | ops existem, mas sem validação central "Core" (M1) |
| **Automation** | `automation/hooks/{usb,sdcard,startup,shutdown,users}` (exemplos) → `/srv/automation/hooks` | poucos hooks ativos |
| **Storage** | `/srv/storage` compartilhado (FileBrowser é a raiz) · `/srv/backup` fora do storage | — |

## 5. Mapa para o modelo M1

Para cada serviço: **grupo de módulos** (do `planning/modules/`) + papel conceitual
(Definition / Instance / Desired / Observed / Implementation).

| Serviço | Grupo M1 | Capacidades (Definition) | Implementation (hoje) | Instância/Desired | Observação |
|---|---|---|---|---|---|
| Caddy | **Access and Network** | roteamento, exposição controlada, HTTPS | container `caddy:2` | rotas + `tls` files | menor superfície; bom candidato a piloto |
| FileBrowser | **Storage and Data** + **Application Services** (arquivos) | acesso/gestão de arquivos | container `filebrowser` | mount `/srv/storage` | **EOL** — obriga fronteira de capacidade |
| Gitea | **Application Services** (git/dev) | git self-hosted | container `gitea` | `/srv/services/gitea` | integração de usuários hoje via `docker exec` |
| Homepage | **Application Services** (hub) + **Integrações** (M1) | portal/entrada, widgets | container `homepage` | `services.yaml`/`docker.yaml` | config é hoje a "integração" (rotas/menu) |
| Portainer | **Optional and Specialized** | UI de gestão Docker | módulo não implantado | — | não ativo |
| API | **Core Platform** + **Application Services** (App) | contratos, operações, App | processo node (`api-api`) | `/app` + REST | o futuro "Module Core" surge daqui |
| backup/scheduler/tls/device | **Automation and Operations** · **Security and Resilience** · **Observability and Maintenance** | tarefas, energia, TLS, dispositivos | scripts/scheduler systemd | `/srv/scripts`, `scheduler.conf` | operações ≠ serviços; entram no contrato de operações |

## 6. Achados / gaps (priorizados)

- **S1 — Segredo no repositório** ✅ *resolvido 2026-08-16*: token (que era o
  `HS_SERVICE_TOKEN`) removido do config e substituído por `{{HOMEPAGE_VAR_API_TOKEN}}`;
  **rotacionado** no servidor (antigo revogado, novo em `.env`).
- **S2 — Contrato env** ✅ *resolvido 2026-08-16*: adicionados `.env.example` para
  filebrowser, gitea, homepage e portainer.
- **S3 — Desacoplamento**: `docker exec gitea` direto em `users.sh` (FileBrowser já tem adapter). Contra a M1 ("implementações acessadas por adapters").
- **S4 — Fronteira de integração**: config da Homepage diverge no deploy; widgets apontam para a API; rotas/menu como integração (M1: module ≠ rota/menu) ainda não têm contrato.
- **S5 — Estado**: `get_service_status_json` = observed state mínimo; faltam desired state/health/validação (M1: operação ≠ estado; execução ≠ sucesso).
- **S6 — Pendências M1**: localização do Module Core (M1-P01), persistência de Definitions/Instances (M1-P02/P03), versionamento (M1-P04), catálogo de migrations (M1-P05), Operation Journal (M1-P06/P09), concorrência (M1-P07), verificação por operação (M1-P08), reconciliation (M1-P10).
- **S7 — FileBrowser EOL**: risco documentado (`planning/security/filebrowser-eol.md`); reforça a necessidade da fronteira de capacidade de arquivos.

## 7. Próximos passos (ordem sugerida — a confirmar)

1. **Limpeza imediata (S1/S2)**: remover token do config da Homepage; adicionar `.env.example` por módulo (contrato env).
2. **Esqueleto da modularização (S6)**: decidir o **formato mínimo da Definition** (schema) e **onde vive o Module Core** (M1-P01/P02) — sem implementar tudo, só o contrato mínimo.
3. **Piloto por grupo (S3/S4)**: escolher 1 módulo piloto. Candidatos: **Caddy** (menor, Access and Network) ou **FileBrowser** (maior acoplamento + EOL força a fronteira).
4. **Modelo de operações (S5)**: mapear as ops atuais (CLI/API) para Desired/Observed + journal.
5. **Integrações como contrato (S4)**: rotas/menu da Homepage → contracto de integração (M1).

> Regra da M1 respeitada: documentar é planejar; **não** definir ainda schemas/APIs/classes concretas sem a revisão adequada — mas o passo 2 (contrato mínimo) é o gatilho para começar a implementar de verdade.