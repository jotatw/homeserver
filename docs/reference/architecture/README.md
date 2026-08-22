# Arquitetura técnica

Esta seção detalha a organização técnica do HomeServer e complementa a visão geral em [`../ARCHITECTURE.md`](../ARCHITECTURE.md).

## Camadas e contratos

- [`CORE.md`](CORE.md) — papel do Core e regras de organização.
- [`FOUNDATION.md`](FOUNDATION.md) — componentes reutilizáveis e contratos básicos.
- [`Infrastructure.md`](Infrastructure.md) — operações concretas do ambiente e integração com o sistema.
- [`API.md`](API.md) — papel arquitetural da API oficial.
- [`APPLICATION_API.md`](APPLICATION_API.md) — contrato entre aplicações e API.
- [`MODULES.md`](MODULES.md) — extensão modular e isolamento de responsabilidades.

## Decisões arquiteturais

- [`adr/`](adr/) — Architecture Decision Records.

## Relação entre documentos

```text
ARCHITECTURE.md
      │
      ├── visão geral da arquitetura atual
      │
architecture/
      ├── Core
      ├── Foundation
      ├── Infrastructure
      ├── API
      ├── Application API
      ├── Modules
      └── ADRs
```

Os documentos desta pasta descrevem responsabilidades e contratos técnicos. Planejamento de evolução futura permanece em [`planning/`](../../../planning/README.md).

Voltar para [`Referência técnica`](../README.md).