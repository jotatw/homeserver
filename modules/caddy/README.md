# Caddy — Unified Access

## Descrição

Reverse proxy que esconde a infraestrutura do HomeServer atrás de um único
ponto de entrada: `homeserver.local`.

## Objetivo

> Um único ponto de entrada para todo o HomeServer.

O usuário nunca vê portas nem endereços IP.

## Rotas

| Caminho | Backend |
|---------|---------|
| `/` | Homepage (:3000) |
| `/files` | FileBrowser (:80) |
| `/git` | Gitea (:3000) |
| `/api/v1` | API (:8000) |

Path-based (sem subdomínios) para reforçar a identidade de um único sistema.

## Instalação

```bash
cd modules/caddy
docker compose up -d
```

## Dependências

- Rede `homeserver` (Docker)
- mDNS/Avahi no host (`homeserver.local`)
- Backends: homepage, filebrowser, gitea, api

## Atualização

```bash
docker compose pull && docker compose up -d
```

## Backup

Backup do volume `caddy_data` (certificados/estado).
