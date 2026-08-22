# ADR-0001 — Autenticação inicial da API

## Status

Substituído por [ADR-0007 — Identity & Authentication](0007-identity-authentication.md).

## Data

2026-08-04

## Decisão

A primeira implementação de autenticação da API utilizou token de sessão em memória, com credenciais validadas pelo FileBrowser, então utilizado como fonte de verdade dos usuários.

## Contexto

A API do HomeServer inicialmente não possuía autenticação e rotas sensíveis estavam acessíveis na rede local.

Era necessário proteger operações como gerenciamento de usuários, energia, hardware e backup, além de diferenciar permissões administrativas de usuários comuns.

## Decisão adotada na época

- Login validava credenciais contra o FileBrowser.
- Uma sessão em memória era criada após autenticação.
- A sessão possuía TTL de 24 horas.
- Rotas utilizavam controles de autenticação e autorização.
- Um token de serviço era utilizado por integrações internas quando necessário.

## Consequências

### Positivas

- rotas sensíveis passaram a exigir autenticação;
- permissões administrativas puderam ser diferenciadas;
- interfaces passaram a possuir uma sessão própria da API.

### Limites identificados

- o modelo mantinha o FileBrowser como fonte de verdade para o login;
- a identidade não estava completamente consolidada no contrato da API;
- sessões eram perdidas após reinicialização da API;
- a evolução das interfaces exigiu separar com maior clareza identidade, autenticação e autorização.

Esses limites levaram à revisão registrada no ADR-0007.

## Alternativas consideradas

### Hash local de senha

Rejeitada na implementação inicial porque duplicaria o gerenciamento de credenciais.

### JWT

Não adotado naquele momento porque uma sessão em memória era suficiente para o escopo inicial validado na rede local.

## Relação com a decisão atual

Este ADR permanece como registro histórico da primeira solução adotada.

A decisão atualmente válida sobre identidade e autenticação é o [ADR-0007](0007-identity-authentication.md).

A arquitetura atual também deve seguir as responsabilidades descritas em [`../API.md`](../API.md) e na documentação de segurança aplicável.
