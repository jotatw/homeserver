# HomeServer API

## Objetivo

A API é a interface oficial entre clientes do HomeServer — incluindo o HomeServer App — e o Core.

O App não acessa FileBrowser, Gitea ou outros serviços externos diretamente.

```text
Cliente
   │
   ▼
API
   │
   ▼
Core
   │
   ├── Infrastructure
   └── Adapters
           │
           ▼
      Serviços externos
```

## Contratos

As respostas seguem o padrão definido para a API:

```json
{ "ok": true, "data": {} }
```

ou:

```json
{ "ok": false, "error": "mensagem" }
```

A autenticação utiliza sessões da API para usuários e tokens específicos para integrações.

## Documentação principal

A referência operacional dos endpoints, autenticação, sessões, variáveis de ambiente e contrato App ↔ API está em [`api/README.md`](../../../api/README.md).

As decisões arquiteturais relacionadas à API estão em [`adr/`](adr/).

## Princípios

- clientes utilizam a API oficial;
- serviços externos ficam atrás de Adapters;
- autenticação e autorização são responsabilidade da API;
- contratos HTTP devem permanecer previsíveis;
- mudanças estruturais relevantes exigem ADR.
