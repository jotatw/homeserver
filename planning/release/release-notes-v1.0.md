# HomeServer v1.0.0 — Release Notes

> **Status:** publicada (2026-08-25). Tag anotada `v1.0.0` disponível no
> GitHub, apontando para `61f4ac4`. Este documento resume a release para o
> usuário; o detalhe técnico completo fica no `CHANGELOG.md` (seção
> "Histórico") e na documentação oficial.

## O que é o HomeServer

Plataforma local para reutilizar um computador comum como servidor doméstico,
com foco em simplicidade, controle, manutenção e evolução modular.

## O que está incluído na v1.0.0

| Área | Capacidade |
|---|---|
| HomeServer App | Dashboard, Aplicações, Armazenamento, Sistema, Administração, Impressão — Design System unificado em desktop e mobile |
| API | Fastify com autenticação por sessão e token, executor privilegiado com allowlist, rate limit, CSP/HSTS |
| Core CLI (`hs`) | Status, usuários, dispositivos (montar/ejetar), módulos, energia, scheduler, TLS, update |
| Arquivos | FileBrowser (Quantum) com escopos por usuário e pasta compartilhada |
| Homepage | Painel inicial com widgets e atalhos |
| HTTPS | CA local (`hs tls`) com renovação automática, redireção para HTTPS |
| Atualização | `hs update check/apply` via git (fast-forward seguro) + pacotes do sistema (`hs update os`) |
| Energia | Night-off agendado (S3 + RTC), Wake-on-LAN, economia automática |
| Backup | Diário com manifest SHA256 e verificação |

## Instalação

Ver [`docs/install/INSTALLATION.md`](../../docs/install/INSTALLATION.md) e o
[QUICKSTART](../../docs/install/QUICKSTART.md).

## Limitações e Known Issues

- Sensor de temperatura da GPU (`nouveau`) reporta valores irreais neste
  host — leituras usam apenas `coretemp` (ver
  [`docs/reference/hardware.md`](../../docs/reference/hardware.md)).
- Usuários do FileBrowser criados antes da v1.0.0 não recebem o escopo
  `/shared` automaticamente (limitação da API do Quantum; usuários novos
  já nascem com ele).
- Validações de instalação limpa/repetida da
  [pre-release-test-matrix](../quality/pre-release-test-matrix.md) seguem
  como trabalho contínuo pós-release.
