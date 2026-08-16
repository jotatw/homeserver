# M1 — Fundação da Arquitetura Modular

## Status

**Consolidada.**

A M1 reúne a base arquitetural para a modularização do HomeServer. Ela estabelece princípios e contratos conceituais, mas não define ainda formatos concretos de persistência, manifests, APIs ou classes.

## Decisões fechadas

### Modelo

- Definition é declarativa.
- Definition não depende da existência ou quantidade de Instances.
- Instance representa configuração e associações concretas.
- Desired State permanece distinto de Observed State.
- Implementation realiza o módulo sem redefinir seu contrato.

### Dependências e lifecycle

- Dependências declaram necessidades; capacidades declaram funcionalidades fornecidas.
- Quando possível, dependências são expressas por capacidade, não por tecnologia concreta.
- O Core resolve e valida impacto antes das operações.
- `uninstall` não implica `purge`.

### Recursos e ownership

- Uso não implica ownership.
- Recursos compartilhados e externos são protegidos contra remoção implícita.
- Persistência e ownership são dimensões independentes.
- Dados do usuário não devem ser removidos automaticamente por lifecycle de módulos.

### Integrações

- Integration Request é separada de sua realização concreta.
- Integrações possuem lifecycle próprio.
- Mudança de estado do módulo não implica remoção automática de integração.

### Contract

- O contrato separa Definition, Instance, Desired State, Observed State e Implementation.
- Configuration, Binding e Observation possuem semânticas diferentes.
- Detalhes específicos de tecnologia não são campos universais do contrato.

### Evolução

- Toda versão possui proprietário e escopo explícitos.
- Compatibilidade é avaliada por regras, não por igualdade simples.
- Update e Migration são conceitos separados.
- Rollback não é presumido.
- Troca de implementação exige plano de transição.
- Compatibilidade declarada exige validação.

### Operações

- Operação é distinta de estado.
- Toda execução possui alvo, escopo e identidade.
- Operações passam pelo Core.
- Operações complexas possuem plano explícito.
- Sucesso exige verificação observável.
- Interrupção e incerteza são estados operacionais válidos.
- Recuperação começa pela reconciliação.
- Journal é distinto de logs técnicos.
- Operações compostas preservam progresso.
- Operações conflitantes devem ser controladas.
- Operações destrutivas possuem escopo explícito.

## Pendências arquiteturais

- **M1-P01:** localização física do Module Core na árvore.
- **M1-P02:** persistência de Definitions, Instances, State e metadados.
- **M1-P03:** fonte de verdade concreta entre Configuration, Binding e Observed State.
- **M1-P04:** política de versionamento por dimensão.
- **M1-P05:** catálogo e registro de Migrations.
- **M1-P06:** persistência do Operation Journal.
- **M1-P07:** mecanismo de concorrência operacional.
- **M1-P08:** critérios formais de verificação por tipo de operação.
- **M1-P09:** retenção e limpeza do Journal.
- **M1-P10:** modelo concreto de reconciliação e recovery.

## Adiado para implementação

```text
manifest format
schema YAML/JSON
exact directory layout
persistence mechanism
API endpoints
concrete classes/interfaces
lock vs queue vs lease
ID format
final version syntax
```

Essas escolhas devem respeitar a M1 consolidada e não alterar seus princípios sem nova revisão arquitetural.

## Referências

- [Fundamentos](../../modules/fundamentos.md)
- [Dependências e lifecycle](../dependencies-and-lifecycle.md)
- [Recursos e ownership](../resources-and-ownership.md)
- [Integrações](../integrations.md)
- [Module Contract](../module-contract.md)
- [Versionamento e compatibilidade](../versioning-and-compatibility.md)
- [Operações e recuperação](../operations-and-recovery.md)
