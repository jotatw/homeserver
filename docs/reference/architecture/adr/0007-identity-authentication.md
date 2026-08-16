# ADR-0007 — Identity & Authentication

- **Status**: Aceito
- **Data**: 2026-08-06 (v2.0.0 — Sprint 1)
- **Decisão**: A autenticação oficial do HomeServer passa a ser realizada
  exclusivamente pela API. Serviços externos permanecem desacoplados por
  adapters. O App nunca interage diretamente com FileBrowser, Gitea ou
  qualquer outro serviço externo.

## Contexto

O App (v2.0) precisa saber **quem é o usuário** (identity) e **como ele
entra** (authentication) para montar a navegação por role. Até a v1.5, o
login da API delegava ao FileBrowser via core, e a sessão (em memória,
TTL 24h) não carregava a role — `GET /auth/session` retornava apenas
`{username}`, e rotas admin consultavam `hs user is-admin` por request.

Com o App, ficou claro que a identidade pertence ao HomeServer: FileBrowser,
Gitea e demais componentes deixam de ser sistemas visíveis e passam a ser
implementação interna atrás da camada de adapters.

## Decisão

- **Identidade**: sessão carrega a role (`admin`) resolvida **uma única vez
  no login** (`createSession(username, admin)`).
- **Autenticação**: sessão longa (TTL 30 dias deslizante) — expira se ficar
  30 dias sem uso; cada request válido renova. Em memória (Map
  token→Session); persistência no backlog.
- **Autorização**: `authenticate()` (resolve `request.user`) e `authorize()`
  (decide permissão) separados no plugin de auth. `request.user` carrega
  `{username, admin, authenticated, role}`. Nenhuma rota chama `verify()` ou
  `isAdmin()` diretamente — usa `request.user`.
- **Contrato**: login e session respondem no padrão `{ok,data}` com
  `data.user = {username, admin}` e `data.expiresIn` (segundos).
- **Arquitetura**: `App → API → Core → Adapter → FileBrowser`. O App nunca
  conhece o FileBrowser.

## Consequências

- Positivas:
  - App monta a navegação por role sem chamadas extras (role na sessão).
  - Sem subprocesso `is-admin` por request (1x no login).
  - Serviços externos viram implementação interna (camada de adapters).
  - `expiresIn`/`createdAt`/`tokenVersion` preparam o futuro sem complexidade.
- Negativas:
  - Sessões em memória caem no restart da API (`update apply`) — usuário
    reloga (aceito para v2.0).
  - Mudança de role do usuário só vale após re-login (aceito).

## Alternativas consideradas

- Criar módulo `identity` no core: rejeitado — duplicaria a responsabilidade
  e violaria o princípio de simplicidade; a API já centraliza a autenticação.
- Sessão persistente (arquivo/DB): adiado para quando houver necessidade
  real (PWA sempre logado). Registrado no backlog (`Identity`).
- TTL curto com logout por inatividade: rejeitado — inadequado para LAN
  (self-hosted), onde inatividade curta é comum.
