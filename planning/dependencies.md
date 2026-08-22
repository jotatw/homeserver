# HomeServer — Dependências

Registro de versões. Não atualizar "no escuro": toda atualização passa por revisão e teste antes de integrar.

> Estado verificado em **2026-08-16**.

## Runtime

| Dependência | Versão | Observação |
|-------------|--------|------------|
| Debian | 13 (trixie) — produção · 12 (bookworm) — base documentada/validada | sys para instalação: Debian 12 |
| Kernel | 6.12.101+deb13 | ativa no próximo boot real |
| Docker Engine | 29.7.2 | daemon |
| containerd | 2.3.3 | runtime de containers |
| Docker Compose (plugin) | 5.4.0 | `docker compose` |
| Node.js (imagem da API) | node:22-alpine | build da API |
| Bash | distro | CLI `hs` |
| OpenSSL | 3.5.6 | CA interna / TLS local |

## Serviços (containers)

| Serviço | Imagem (pinada) | Estado | Observação |
|---------|-----------------|--------|------------|
| Caddy | `caddy:2` | ✅ | proxy / acesso unificado |
| Homepage | `ghcr.io/gethomepage/homepage:v1.13.2` | ✅ | pinado |
| FileBrowser | `filebrowser/filebrowser:v2.63.23` | ⚠ | **EOL 2026-09-01** — pinado; plano de transição em `planning/security/filebrowser-eol.md` |
| Gitea | `gitea/gitea:1.27.0` | ✅ | registro oficial (migrado de `docker.gitea.com`) |
| Portainer | `portainer/portainer-ce:lts` | ✅ | gestão auxiliar |
| API | `api-api` (build local) | ✅ | |

## Pacotes npm (API)

| Pacote | Versão | Estado |
|--------|--------|--------|
| fastify | 5.12.0 | ✅ |
| @fastify/cors | 11.3.0 | ✅ |
| @fastify/static | 10.1.2 | ✅ |
| @fastify/helmet | 13.1.0 | ✅ |
| @fastify/rate-limit | 11.2.0 | ✅ |
| typescript | 5.9.3 | dev |
| tsx | 4.23.12 | dev |
| @types/node | 24.13.3 | dev |

`npm audit` e `npm outdated` executados em 2026-08-16: **0 vulnerabilidades** (`fast-uri` corrigido via bump do fastify).

## Pacotes apt (host)

| Pacote | Estado | Observação |
|--------|--------|------------|
| docker-ce / docker-compose-plugin / containerd.io | ✅ | atualizados 2026-08-16 |
| util-linux (rtcwake / findmnt) | ✅ | religamento S3 / dispositivos |
| openssl | ✅ | CA interna (TLS local) |
| avahi-daemon | ✅ | mDNS `homeserver.local` |
| systemd / udev | ✅ | timers + hotplug de dispositivos |
| shellcheck | ✅ | dev / Quality Gate |
| git / openssh-client | ✅ | auto-update |

## Pendências

- [ ] Avaliar sucessores do **FileBrowser** (EOL) — ver `planning/security/filebrowser-eol.md`.
- [ ] Validar **Zero Knowledge Test** e **upgrade/reboot real** quando forem aplicáveis ao próximo ciclo de consolidação ou a uma futura release oficial.
- [ ] Manter `npm audit`/`npm outdated` periódicos no Quality Gate.