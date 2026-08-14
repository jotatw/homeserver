# HomeServer — Dependências

Registro de versões. Não atualizar "no escuro": toda atualização passa por
revisão e teste antes de integrar.

## Runtime

| Dependência | Versão | Imagem/Tag | Estado | Observação |
|-------------|--------|-----------|--------|------------|
| Docker Engine | 29.7.1 | — | ✅ | |
| Docker Compose | v5.3.1 | — | ✅ | |
| Node.js (API) | v22.23.2 | node:22-alpine | ✅ | |
| Debian | 12 (bookworm) validado · produção 13 (trixie) | — | ✅ | Base documentada/validada = 12; produção atual em 13 |
| Bash | distro | — | ✅ | |

## Serviços (containers)

| Serviço | Imagem | Estado | Observação |
|---------|--------|--------|------------|
| Caddy | caddy:2 | ✅ | |
| Homepage | ghcr.io/gethomepage/homepage:latest | ⚠ | pin versão recomendado |
| FileBrowser | filebrowser/filebrowser:latest | ⚠ | pin versão recomendado |
| Gitea | docker.gitea.com/gitea:latest | ⚠ | registro não-oficial — migrar p/ gitea/gitea |
| API | api-api (local) | ✅ | build local |

## Pacotes npm (API)

| Pacote | Versão | Estado |
|--------|--------|--------|
| fastify | ^5 | ✅ |
| @fastify/cors | ^11.3.0 | ✅ |
| @fastify/static | ^10.1.2 | ✅ |
| typescript | ^5 | dev |
| tsx | ^4 | dev |
| @types/node | ^24 | dev |

## Pacotes apt (host)

| Pacote | Estado | Observação |
|--------|--------|------------|
| docker-ce | ✅ | |
| docker-compose-plugin | ✅ | |
| util-linux (rtcwake) | ✅ | religamento S3 |
| shellcheck | ✅ | dev |
| git / openssh-client | ✅ | auto-update |

## Pendências

- [ ] Pin versões de Homepage, FileBrowser e Gitea.
- [ ] Corrigir registro da imagem do Gitea (`gitea/gitea`).
