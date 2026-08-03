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
| GET | `/api/v1/users` | Lista usuários |
| POST | `/api/v1/users` | Cria usuário |
| PUT | `/api/v1/users/:nome` | Altera senha |
| DELETE | `/api/v1/users/:nome` | Remove usuário (`?folder=1`) |
| GET | `/api/v1/power` | Agendamento liga/desliga |
| PUT | `/api/v1/power` | Define horários (`enabled: true`) ou desativa |
| POST | `/api/v1/backup` | Dispara backup manual |

---

### `GET /api/v1/system`

Hostname do servidor.

```json
{ "hostname": "homeserver" }
```

### `GET /api/v1/status`

Resumo completo do servidor (hostname, OS, kernel, uptime, CPU, memória,
disco, serviços, backup, WoL, storage e hardware). Tamanhos em bytes;
percentuais de 0 a 100. Cache ~10s.

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

Lista de serviços ativos com estado (via `enabled_services` do core).

### `GET /api/v1/hardware`

Sensores de temperatura (hwmon), discos (lsblk + smartctl), rede (hostname/IP)
e USB (lsusb).

### `GET /api/v1/devices`

Dispositivos montados em `/srv/storage/devices/<tipo>/<rótulo>`.

### `GET /api/v1/events`

Eventos recentes lidos dos logs do sistema:

```json
[
  { "time": "2026-08-02 18:17:15", "type": "device", "action": "Dispositivo conectado" },
  { "time": "2026-08-02 18:50:40", "type": "system", "action": "Servidor iniciado" }
]
```

### `GET/POST/PUT/DELETE /api/v1/users`

- `POST` — cria usuário (pasta própria + FileBrowser; `gitea: true` cria no Gitea).
- `PUT /api/v1/users/:nome` — `{ "password": "nova" }` altera a senha.
- `DELETE /api/v1/users/:nome` — `?folder=1` remove também a pasta.

### `GET/PUT /api/v1/power`

Agendamento de ligar/desligar automático.

```json
{ "shutdown": "23:30", "wake": "07:00", "enabled": true }
```

- `PUT` com `{ "shutdown": "22:00", "wake": "08:00", "enabled": true }` ativa.
- `PUT` com `{ "enabled": false }` desativa o agendamento.

### `POST /api/v1/backup`

Dispara o backup manual (executado no host via nsenter).

---

## Variáveis de ambiente

O arquivo `api/.env` (não versionado) define:

| Variável | Descrição |
|----------|-----------|
| `FILEBROWSER_URL` | URL da API do FileBrowser (ex.: `http://filebrowser:80`) |
| `FILEBROWSER_ADMIN_USER` | Admin do FileBrowser |
| `FILEBROWSER_ADMIN_PASS` | Senha do admin do FileBrowser |
| `HS_HOST_IP` | IP do host (para o hardware service) |

## Rede e segurança

- A API participa da rede `homeserver` (Docker), acessível por nome (`http://api:8000`).
- **CORS** habilitado para a origem da Homepage.
- A API só aceita requisições da rede local (UFW). Autenticação por API key está planejada.
