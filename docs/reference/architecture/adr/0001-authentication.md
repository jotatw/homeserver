# ADR-0001 — Autenticação na API

- **Status**: Aceito
- **Data**: 2026-08-04 (v1.3.0)
- **Decisão**: Autenticação por token de sessão em memória, validada contra o FileBrowser.

## Contexto

A API do HomeServer não tinha autenticação — todas as rotas estavam abertas na LAN.
Precisávamos proteger rotas sensíveis (users, power, hardware, backup) e permitir
login de usuários com escopo (admin vs user).

## Decisão

- Login valida credenciais contra o **FileBrowser** (fonte de verdade de usuários).
- Sucesso gera um token de sessão em memória (TTL 24h).
- Rotas protegidas por hooks `requireAuth` (login) e `requireAdmin` (admin).
- Token de serviço (`HS_SERVICE_TOKEN`) para integrações internas (ex.: homepage).

## Consequências

- Positivas: proteção de rotas sensíveis; escopo admin/user; App com login.
- Negativas: sessões em memória não persistem restart da API (aceitável para LAN);
  login depende do FileBrowser estar disponível.

## Alternativas consideradas

- Hash local de senha: rejeitado (duplicaria o gerenciamento de senha).
- JWT: não necessário para LAN (token em memória é suficiente).
