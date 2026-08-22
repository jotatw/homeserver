# Planejamento do HomeServer

Este diretório organiza a evolução do projeto. A documentação aqui descreve princípios gerais, decisões, baseline, roadmap, qualidade, segurança, interfaces e planejamento arquitetural.

## Ponto de entrada atual

O estado de referência do projeto é o [Baseline v0.1.0](release/baseline-v0.1.0.md).

O caminho operacional até a primeira release estável está no [Roadmap v1.0](roadmap/v1.0.md).

A base arquitetural para a evolução modular está consolidada em [Arquitetura Modular](architecture/README.md).

Os princípios gerais de evolução e validação estão em [Fundamentos Gerais](foundations/README.md).

A direção inicial das interfaces está em [Planejamento do App](app/README.md).

## Organização

```text
planning/
├── README.md                 # índice desta área
├── foundations/              # princípios gerais e critérios de decisão
├── app/                      # direção das interfaces e prioridades de uso
├── release/                  # baseline e processos de release
├── roadmap/                  # evolução até v1.0 e histórico
├── architecture/             # arquitetura modular consolidada
├── modules/                  # fundamentos e planejamento de módulos
├── security/                 # políticas e planejamento de segurança
├── quality/                  # qualidade e critérios de validação
├── health/                   # histórico e evidências de saúde
├── backlog/                  # itens de trabalho
├── review/                   # revisões planejadas
│   └── levantamento-servicos.md   # estado atual dos serviços → base da modularização
├── support/                  # políticas de suporte
└── archive/                  # documentação histórica
```

## Arquitetura modular — M1

A M1 está arquiteturalmente consolidada. A referência única para os princípios transversais é:

- [Decisão consolidada M1](architecture/decisions/m1-foundation.md)

Os documentos detalhados permanecem separados por domínio:

- [Fundamentos da modularização](modules/fundamentos.md)
- [Dependências e lifecycle](architecture/dependencies-and-lifecycle.md)
- [Recursos e ownership](architecture/resources-and-ownership.md)
- [Integrações](architecture/integrations.md)
- [Module Contract](architecture/module-contract.md)
- [Versionamento e compatibilidade](architecture/versioning-and-compatibility.md)
- [Operações e recuperação](architecture/operations-and-recovery.md)

A M1 define contratos e princípios. Formatos concretos, schemas, persistência, APIs e mecanismos internos continuam separados como decisões de implementação ou pendências explicitamente registradas.

## Fonte de verdade

Para evitar duplicação:

- `foundations/` define princípios gerais relativamente estáveis;
- `app/` define direção e prioridades das interfaces, sem substituir especificações técnicas;
- documentos de domínio definem regras detalhadas;
- documentos de decisão consolidam decisões fechadas e pendências;
- o roadmap organiza a sequência de evolução;
- o baseline registra o estado observado;
- o histórico permanece em `archive/` e não redefine o estado atual.

Documentação nova deve complementar essa estrutura, sem duplicar ou redefinir silenciosamente contratos já consolidados.