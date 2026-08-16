# Security Audit — v1.5 Sprint 2

> Resultado do mini security audit (2026-08-05).

## Usuários

| Item | Estado |
|------|--------|
| Senha mínima | ✅ (FileBrowser valida) |
| Hash | ✅ (FileBrowser gerencia; senhas não armazenadas em texto no core) |
| Validação de username | ✅ (`_validate_username` regex) |
| Permissões por escopo | ✅ (admin vs user na API) |

## API

| Item | Estado | Observação |
|------|--------|------------|
| CORS | ✅ | Origem restrita (homeserver.local + LAN) |
| HTTPS | ✅ | Caddy `tls internal` |
| Security headers | ✅ | Helmet (CSP, X-Frame-Options, nosniff, HSTS) |
| Rate limit global | ✅ | 300 req/min por IP |
| Rate limit login | ✅ | 5 req/min por IP (anti brute-force) |
| Autenticação | ✅ | Login/token TTL 24h; rotas protegidas |

## Docker

| Item | Estado |
|------|--------|
| Containers privileged | ✅ Nenhum |
| Volumes RW mínimos | ✅ (dados legítimos; demais :ro) |
| Secrets | ✅ fb-credentials.env (600, fora do git); nenhum `.env` no repo |
| Usuário de container | ✅ filebrowser usa `user`; homepage root (default da imagem) |

## Arquivos

| Caminho | Permissão | Estado |
|---------|-----------|--------|
| /srv | usuario:usuario 755 | ✅ |
| /srv/storage | usuario:usuario 755 | ✅ |
| /srv/backup | usuario:usuario 755 | ✅ |
| /srv/git | usuario:usuario 755 | ✅ |
| /srv/scripts/fb-credentials.env | usuario:usuario 600 | ✅ |

## Correções aplicadas nesta sprint

1. `@fastify/helmet` — security headers globais.
2. `@fastify/rate-limit` — global 300/min + login 5/min.
3. Documentação: Threat Model + Security Assumptions.

## Pendências registradas

- Pin de versões das imagens (Homepage, FileBrowser, Gitea) — v1.5 Sprint 1 (dependencies.md).
- Imagem do Gitea em registro não-oficial (`docker.gitea.com`) — migrar p/ `gitea/gitea`.
- Exposição externa (WAN) — somente planejada para v2.0+, com revisão de auth.
