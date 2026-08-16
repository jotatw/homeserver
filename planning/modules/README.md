# Planejamento de Módulos

Este diretório registra a visão conceitual dos módulos do HomeServer.

O planejamento separa deliberadamente módulo, capacidade, implementação e serviço. O objetivo é permitir que funcionalidades sejam administradas como unidades independentes, com contratos explícitos para dependências, recursos, integrações, lifecycle, implementação e operações.

O objetivo de longo prazo é que o usuário final controle os serviços pela experiência da plataforma, sem depender do terminal para operações cotidianas.

## Modelo

```text
MODULE DEFINITION
        ↓ instantiated as
MODULE INSTANCE
        ├── desired state
        ├── configuration
        ├── resource bindings
        ├── integrations
        └── implementation
                ↓ observed through
           OBSERVED STATE
```

## Fundamentos

- [Fundamentos da modularização](fundamentos.md)
- [Alinhamento dos módulos com a M1](m1-alignment.md)

O documento `fundamentos.md` preserva as decisões fechadas nas etapas M1.1 a M1.6. As decisões transversais restantes permanecem consolidadas em `planning/architecture/`.

## Grupos planejados

- [Core Platform](core-platform/README.md)
- [Storage and Data](storage-data/README.md)
- [Application Services](application-services/README.md)
- [Media and Entertainment](media-entertainment/README.md)
- [Access and Network](access-network/README.md)
- [Automation and Operations](automation-operations/README.md)
- [Observability and Maintenance](observability-maintenance/README.md)
- [Security and Resilience](security-resilience/README.md)
- [Optional and Specialized](optional-specialized/README.md)

Os grupos são uma organização funcional do planejamento. Eles não representam fronteiras obrigatórias de acoplamento técnico.

## Consolidação M1

- [Arquitetura modular](../architecture/README.md)
- [Integrações](../architecture/integrations.md)
- [Module Contract](../architecture/module-contract.md)
- [Versionamento e compatibilidade](../architecture/versioning-and-compatibility.md)
- [Operações e recuperação](../architecture/operations-and-recovery.md)
- [Decisão consolidada M1](../architecture/decisions/m1-foundation.md)

## Regra de evolução

Documentos específicos de grupos ou módulos devem complementar esta base. Eles não devem redefinir unilateralmente os contratos transversais consolidados na M1.

O planejamento de grupo é considerado fechado quando seu escopo e fronteiras estão definidos. Detalhes concretos de implementação permanecem para as fases correspondentes do roadmap.