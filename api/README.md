# HomeServer API

API do HomeServer, construída com Fastify (TypeScript).

## Execução

```bash
cd api
docker compose up -d --build
```

O container monta o repositório em `/workspace` e consome o CLI do core
(`/workspace/core/hs.sh`).

## Endpoints

### `GET /api/v1/system`

Hostname do servidor.

```json
{ "hostname": "homeserver" }
```

### `GET /api/v1/status`

Resumo completo do servidor.

```json
{
  "hostname": "homeserver",
  "os": "Debian GNU/Linux 13 (trixie)",
  "kernel": "6.12.100+deb13-amd64",
  "architecture": "x86_64",
  "uptime": "4 horas, 57 minutos",
  "load": "0.90",
  "cpu": { "percent": 4.8 },
  "memory": { "total": 2858778624, "used": 1866403840, "available": 992374784, "percent": 65.3 },
  "disk": { "total": 311001522176, "used": 9673580544, "available": 285455175680, "percent": 3 },
  "services": [
    { "name": "filebrowser", "status": "running" }
  ],
  "backup": "2026-08-02"
}
```

Tamanhos em bytes; percentuais de 0 a 100.

### `GET /api/v1/users`

Lista os usuários do FileBrowser.

### `POST /api/v1/users`

Cria um usuário: pasta própria + conta no FileBrowser (+ Gitea com `gitea: true`).

```json
{
  "username": "maria",
  "password": "opcional (gerada se ausente)",
  "email": "opcional",
  "gitea": true
}
```

### `DELETE /api/v1/users/:nome`

Remove um usuário. `?folder=1` remove também a pasta própria.

## Variáveis de ambiente

O arquivo `api/.env` (não versionado) define:

| Variável | Descrição |
|----------|-----------|
| `FILEBROWSER_URL` | URL da API do FileBrowser (ex.: `http://filebrowser:80`) |
| `FILEBROWSER_ADMIN_USER` | Admin do FileBrowser |
| `FILEBROWSER_ADMIN_PASS` | Senha do admin do FileBrowser |

## Rede

A API participa da rede `homeserver` (Docker), permitindo acesso por nome
(ex.: `http://api:8000`) a partir da Homepage.

## Segurança

A API atualmente só aceita requisições da rede local (UFW). A autenticação
por API key está planejada.
