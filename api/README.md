# HomeServer API

API do HomeServer, construída com Fastify (TypeScript).

## Execução

```bash
cd api
docker compose up -d --build
```

O container monta o repositório em `/workspace` e consome o CLI do core
(`/workspace/core/hs.sh`). Endpoints de leitura usam cache TTL para reduzir
chamadas ao core.

## Autenticação

> Toda a identidade pertence ao HomeServer. O App/consumidor interage
> apenas com a API — nunca diretamente com FileBrowser, Gitea ou outros
> serviços (ver ADR-0007).

### Authentication Flow

Dois fluxos distintos: **login** (obter a sessão) e **requisição
autenticada** (usar a sessão).

**Login**

```text
App → POST /api/v1/auth/login
            → verify()            (hs user verify — via core/adapter)
            → isAdmin()           (uma única vez, no login)
            → createSession()     (token + role)
            → Token
```

**Requisição autenticada**

```text
App → GET /api/v1/...  (Authorization: Bearer <token>)
            → authenticate()      (resolve a sessão → request.user)
            → authorize()         (role/permissão — hoje: admin)
            → Controller
```

### Sessão

- TTL **30 dias deslizante**: expira se ficar 30 dias sem uso; cada request
  válido renova. Adequado para LAN (sem logout por inatividade curta).
- Armazenada **em memória** na API (cai em restart; persistência no backlog).
- `tokenVersion`: reservado para revogação futura (troca de senha).
- Logout explícito via `POST /auth/logout` destrói a sessão.

### Endpoints de autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/auth/login` | Login (rate limit 5/min) → token + usuário |
| GET | `/api/v1/auth/session` | Sessão atual (usuário + role + expiração) |
| POST | `/api/v1/auth/logout` | Destrói a sessão |

**`POST /api/v1/auth/login`**

```json
{
  "ok": true,
  "data": {
    "token": "hex...",
    "user": { "username": "usuario", "admin": true },
    "expiresIn": 2592000
  }
}
```

- `expiresIn` em segundos (válido a partir do último uso — sliding).
- Erro de credenciais → `401` com mensagem neutra (sem revelar se o usuário existe).

**`GET /api/v1/auth/session`**

```json
{
  "ok": true,
  "data": {
    "user": { "username": "usuario", "admin": true },
    "expiresIn": 2592000
  }
}
```

- Base para montar a navegação do App (role `admin` decide a aba Administração).

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/system` | Hostname do servidor |
| GET | `/api/v1/status` | Resumo completo do servidor |
| GET | `/api/v1/storage` · `/storage/status` | Estado e contagens do storage |
| GET | `/api/v1/services` · `/services/status` | Serviços ativos + estado |
| GET | `/api/v1/hardware` | Sensores, discos, rede, USB |
| GET | `/api/v1/devices` | Dispositivos montados |
| GET | `/api/v1/events` | Eventos recentes (backup, dispositivo, boot) |
| GET | `/api/v1/users` | Lista usuários (admin) |
| POST | `/api/v1/users` | Cria usuário (admin) |
| PUT | `/api/v1/users/:nome` | Altera senha (admin) |
| DELETE | `/api/v1/users/:nome` | Remove usuário (admin, `?folder=1`) |
| GET | `/api/v1/power` | Agendamento liga/desliga (admin) |
| PUT | `/api/v1/power` | Define horários (admin) |
| POST | `/api/v1/backup` | Dispara backup manual (admin) |
| GET | `/api/v1/print` | Lista impressoras do CUPS (admin) |
| POST | `/api/v1/print` | Imprime texto (admin) |

### `GET /api/v1/status`

Resumo completo do servidor (hostname, OS, kernel, uptime, CPU, memória,
disco, serviços, backup). Tamanhos em bytes; percentuais de 0 a 100. Cache ~10s.

### `GET /api/v1/storage`

Estado do storage com contagens por diretório.

```json
{
  "root": "/srv/storage",
  "ready": true,
  "users": 2,
  "shared": 1,
  "media": 0,
  "documents": 0,
  "devices": 1,
  "users_size": 4096,
  "total_size": 16384,
  "total_size_human": "16.0 KB"
}
```

### `GET /api/v1/services`

Lista de serviços ativos com estado.

### `GET /api/v1/hardware`

Sensores de temperatura, discos, rede e USB.

### `GET /api/v1/events`

Eventos recentes lidos dos logs do sistema.

### `GET/POST/PUT/DELETE /api/v1/users`

- `POST` — cria usuário (pasta própria + FileBrowser; `gitea: true` cria no Gitea).
- `PUT /api/v1/users/:nome` — `{ "password": "nova" }` altera a senha.
- `DELETE /api/v1/users/:nome` — `?folder=1` remove também a pasta.

### `GET/PUT /api/v1/power`

Agendamento de ligar/desligar automático (ex.: `{ "shutdown": "22:00", "wake": "07:00", "enabled": true }`).
`{ "enabled": false }` desativa o agendamento.

### `POST /api/v1/backup`

Dispara o backup manual (executado no host via nsenter).

### `GET/POST /api/v1/print`

Impressão via CUPS do host (admin). Ver `docs/PRINTING.md`.

- `GET` — lista impressoras: `{ ok, data: { printers: ["MG3110"] } }`.
- `POST` — imprime texto:
  ```json
  { "text": "Olá, HomeServer!" }
  ```
  `printer` é opcional (padrão `MG3110`). Executado no host via nsenter.

---

## Variáveis de ambiente

O arquivo `api/.env` (não versionado) define:

| Variável | Descrição |
|----------|-----------|
| `FILEBROWSER_URL` | URL da API do FileBrowser (ex.: `http://filebrowser:80`) |
| `FILEBROWSER_ADMIN_USER` | Admin do FileBrowser |
| `FILEBROWSER_ADMIN_PASS` | Senha do admin do FileBrowser |
| `HS_HOST_IP` | IP do host (para o hardware service) |
| `HS_SERVICE_TOKEN` | Token de serviço para integrações internas (homepage) |
| `HS_SESSION_TTL_MS` | *(opcional)* TTL da sessão em ms (default 30 dias) — usado em testes |

## App ↔ API (contrato)

> **Toda comunicação entre o App e o HomeServer ocorre exclusivamente através
> da API oficial.** O App é apenas mais um cliente.

| View do App | Endpoints |
|---|---|
| Login | `POST /auth/login` |
| Boot (sessão) | `GET /auth/session` |
| Meu espaço (dashboard) | `GET /status` + `GET /events` (polling 30s + foco) |
| Aplicações | `GET /services` |
| Armazenamento | `GET /storage` + `GET /status` + `GET /devices` |
| Sistema | `GET /status` · admin: `GET /power` + `GET /hardware` |
| Administração | `GET /users` + `GET/POST/DELETE /tokens` |

- **Cache**: a API usa cache TTL ~10s nos endpoints de leitura (reduz
  subprocessos do core). O App usa polling de 30s no dashboard.
- **Autenticação**: Bearer token de sessão (usuário) ou token de API
  (integração). Service token para a homepage.

## Rede e segurança

- A API participa da rede `homeserver` (Docker), acessível por nome (`http://api:8000`).
- **CORS** habilitado para a origem da Homepage.
- **Helmet** (security headers) + **rate limit** (global 300/min, login 20/min).
- A API só aceita requisições da rede local (UFW).
- **Tokens de API** para integrações externas: `GET/POST/DELETE /api/v1/tokens`
  (admin) — ver Sprint 7.
