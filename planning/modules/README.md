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

O documento `fundamentos.md` preserva as decisões fechadas nas etapas M1.1 a M1.6:

1. informações mínimas que o Core precisa conhecer sobre um módulo;
2. separação entre serviço, módulo, capacidade e implementação;
3. descoberta, catálogo e registro conceitual;
4. dependências e validação pelo Core;
5. lifecycle administrativo, operacional e de operações;
6. propriedade, persistência e remoção segura de dados.

## Consolidação M1

As etapas seguintes foram organizadas em documentos transversais da arquitetura:

- [Arquitetura modular](../architecture/README.md)
- [Integrações](../architecture/integrations.md)
- [Module Contract](../architecture/module-contract.md)
- [Versionamento e compatibilidade](../architecture/versioning-and-compatibility.md)
- [Operações e recuperação](../architecture/operations-and-recovery.md)
- [Decisão consolidada M1](../architecture/decisions/m1-foundation.md)

## Regra de evolução

Documentos específicos de grupos ou módulos devem complementar esta base. Eles não devem redefinir unilateralmente os contratos transversais consolidados na M1.

As pendências concretas permanecem registradas na decisão consolidada e devem ser resolvidas antes ou durante a implementação do mecanismo correspondente.