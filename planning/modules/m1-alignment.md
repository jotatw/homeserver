# Alinhamento dos Módulos com a M1

Este documento define como os planejamentos específicos de módulos se relacionam com a arquitetura modular consolidada na M1.

## Regra principal

Os grupos organizam o planejamento funcional. Eles não substituem nem redefinem os contratos transversais da arquitetura.

Todo módulo deve, quando aplicável, declarar:

- identidade e responsabilidade;
- capacidades fornecidas e dependências;
- recursos utilizados e ownership;
- dados persistentes e política de remoção;
- integrações solicitadas;
- configuração e bindings da instância;
- desired state e observed state;
- implementação compatível;
- operações suportadas;
- compatibilidade e migrações;
- critérios de validação e recuperação.

## Fonte de verdade

As regras transversais permanecem em `planning/architecture/`. Os documentos dos grupos descrevem quais módulos existem, por que existem, como se relacionam e qual é sua evolução planejada.

## Critério de planejamento fechado

Um grupo é considerado planejado quando possui escopo, fronteiras, módulos previstos, dependências principais, dados/recursos relevantes, integrações e próximos passos identificados. Detalhes concretos de manifests, APIs, classes, schemas e implementação permanecem fora desta etapa.
