# Arquitetura Modular

## Status

Esta área organiza as decisões transversais da arquitetura modular do HomeServer.

A consolidação M1 estabelece contratos e princípios arquiteturais. Ela não define ainda schemas, formatos de manifests, banco de dados, endpoints ou classes concretas.

## Modelo fundamental

```text
MODULE DEFINITION
        ≠
MODULE INSTANCE
        ≠
DESIRED STATE
        ≠
OBSERVED STATE
        ≠
IMPLEMENTATION
```

| Elemento | Responsabilidade |
|---|---|
| Definition | Identidade e regras declaradas |
| Instance | Configuração e associações concretas |
| Desired State | Intenção administrativa |
| Observed State | Situação efetivamente observada |
| Implementation | Realização técnica concreta |

## Documentos

- [Fundamentos da modularização](../modules/fundamentos.md)
- [Dependências e lifecycle](dependencies-and-lifecycle.md)
- [Recursos e ownership](resources-and-ownership.md)
- [Integrações](integrations.md)
- [Module Contract](module-contract.md)
- [Versionamento e compatibilidade](versioning-and-compatibility.md)
- [Operações e recuperação](operations-and-recovery.md)
- [Decisão consolidada M1](decisions/m1-foundation.md)
- [Skeleton de implementação (Module Core)](decisions/m1-skeleton-implementation.md) — escolhas concretas de layout/formato/persistência

## Regra de organização

Os documentos detalhados são a referência por domínio. O documento de decisão M1 consolida decisões fechadas, pendências e itens deliberadamente adiados para implementação.
