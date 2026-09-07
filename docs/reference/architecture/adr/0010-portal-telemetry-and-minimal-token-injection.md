# ADR-0010 — Telemetria do portal via widgets customapi e injeção mínima de token no Caddy

## Status

Aceito

## Data

2026-09-07

## Contexto

O portal (Homepage/gethomepage em `homeserver.local`) precisa exibir telemetria
do servidor (CPU, memória, disco, uptime, backups, agendamento de energia) que
reside na API Fastify (`:8000`), protegida por autenticação. O portal em si não
tem sessão de usuário.

Descobertas verificadas que moldaram a decisão:

- O widget `customapi` da Homepage faz o fetch **no servidor** (proxy interno
  `/api/services/proxy`), não no navegador. URLs relativas (`/api/v1/...`)
  falham (`TypeError: Invalid URL`); é preciso URL absoluta da rede Docker
  (`http://api:8000/...`).
- A Homepage resolve `{{HOMEPAGE_VAR_*}}` do env do container nos campos do
  widget — o token de serviço pode ir no `header` do widget sem ser versionado
  no git (`.env` do módulo é gitignored).
- O único consumidor de API **no navegador** é o modal de agendamento de
  energia (`custom.js`), que não tem sessão.
- O Caddy 2.11 derruba streams HTTP/2 concorrentes do navegador (requests
  paralelos fecham com status 0), independentemente desta decisão.

## Decisão

1. **Widgets de telemetria** usam `customapi` com URL absoluta (`http://api:8000`)
   e `Authorization: Bearer {{HOMEPAGE_VAR_API_TOKEN}}` no config do widget —
   o segredo vive só no `.env` do módulo (gitignored), nunca no `services.yaml`.
2. **Acesso anônimo do navegador** é limitado ao mínimo: o Caddy injeta o token
   de serviço **apenas** em `GET /api/v1/power/status` sem header
   `Authorization`. As demais rotas exigem autenticação normal.
3. **Escrita nunca é anônima**: `PUT /api/v1/power` permanece admin-only com
   sessão do App. O modal do portal é **somente-leitura** e orienta o usuário a
   editar pelo App.
4. O widget nativo de recursos da Homepage é ocultado via CSS; o card
   "Recursos" (customapi) é a fonte visual.

## Consequências

- Positivas: telemetria em tempo real no portal sem expor credenciais ao
  navegador; superfície anônima reduzida a uma rota GET de leitura; segredo
  fora do git.
- Negativas: a telemetria do portal fica disponível para qualquer dispositivo
  na LAN/tailnet (rota única, dados de agendamento de energia — considerado
  aceitável para uso doméstico); o refresh dos cards depende do
  `refreshInterval` do widget (30–60s), não de push; a URL absoluta acopla o
  `services.yaml` à topologia Docker (`api:8000`).

## Alternativas consideradas

- **Polling via `custom.js` no navegador** (implementado e removido): exigiria
  expor o token ao cliente ou abrir mais rotas anônimas — pior em segurança e
  duplicava o mecanismo nativo.
- **Endpoint público dedicado de telemetria na API**: mais uma superfície
  permanente de API para um dado já servido pelo proxy da Homepage.
- **Login no portal**: desalinhado com o propósito do portal (hub aberto na
  rede local).
