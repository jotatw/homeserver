# ADR-0009 — Desacoplamento de Serviços e Preparação para Modularidade

## Status

Aceito

## Data

2026-08-12

## Decisão

O HomeServer adotará o **desacoplamento progressivo de serviços** como regra de
evolução e preparará a arquitetura para modularidade sem introduzir, neste
momento, um sistema oficial de plugins ou carregamento automático de módulos.

Um serviço ou componente novo deve possuir responsabilidade própria e evitar
conhecimento desnecessário sobre outros componentes.

Sempre que aplicável, deve declarar ou possuir de forma identificável:

- identidade;
- responsabilidade;
- configuração;
- dados persistentes;
- dependências explícitas;
- lifecycle;
- health ou estado;
- capacidades expostas;
- contrato de integração com a plataforma.

A Infrastructure permanece responsável por capacidades genéricas e não deve ser
alterada apenas para reconhecer cada novo serviço ou módulo individual.

A definição arquitetural atual de módulo permanece:

> Um módulo é um componente que pode evoluir de forma independente,
> reutilizando contratos da plataforma e sem exigir alterações arbitrárias na
> Foundation ou Infrastructure apenas para existir.

Esta decisão **não cria ainda** um contrato definitivo de manifest, descoberta,
instalação automática ou carregamento dinâmico de módulos. Esses mecanismos só
serão definidos quando houver requisitos reais e uma proposta arquitetural
validada.

---

## Contexto

O HomeServer reúne atualmente diferentes tipos de componentes: Core,
Infrastructure, Adapters, API, App e serviços externos.

A evolução futura prevê novas capacidades e possíveis módulos. Sem limites
claros, cada novo componente poderia exigir alterações distribuídas pelo Core,
nomes fixos em listas de serviços, regras especiais de configuração ou
acoplamentos entre componentes que não precisam se conhecer.

Isso criaria uma plataforma difícil de expandir e aumentaria o risco de que uma
nova funcionalidade afete componentes sem relação direta com sua
responsabilidade.

Ao mesmo tempo, criar antecipadamente um sistema completo de plugins,
manifests, hooks de carregamento e descoberta automática seria prematuro. O
projeto ainda precisa consolidar suas capacidades, contratos e padrões de
integração.

A decisão, portanto, busca preparar a arquitetura sem transformar uma hipótese
futura em complexidade permanente no presente.

---

## Consequências

### Positivas

- novos serviços podem ser avaliados por responsabilidades e contratos claros;
- reduz o conhecimento cruzado entre componentes;
- facilita testes e isolamento de falhas;
- torna dependências explícitas;
- favorece substituição ou remoção de serviços com menor impacto;
- prepara o caminho para módulos independentes;
- evita alterar Foundation ou Infrastructure apenas para cadastrar componentes
  específicos;
- permite que App e API evoluam sobre capacidades, e não sobre detalhes de
  implementação;
- reduz o risco de criar um sistema de modularidade maior do que as necessidades
  reais do projeto.

### Custos e limites

- o desacoplamento pode exigir contratos e documentação adicionais;
- componentes existentes podem precisar de auditoria antes de serem considerados
  adequadamente isolados;
- algumas dependências reais continuarão existindo e devem ser explicitamente
  documentadas;
- não haverá descoberta automática universal até que seu contrato seja definido;
- `modules/` não deve ser tratado automaticamente como um sistema de plugins
  apenas pela existência do diretório.

---

## Modelo arquitetural desejado

A plataforma deve evoluir preferencialmente por capacidades:

```text
Cliente
   │
   ▼
App / CLI / Integração
   │
   ▼
Contrato da Plataforma
   │
   ▼
Capacidade
   │
   ├── Infrastructure
   ├── Adapter
   └── Serviço ou componente responsável
```

O consumidor deve depender da capacidade e de seu contrato, e não de detalhes
como o nome do container ou a localização de um arquivo interno.

Quando um componente externo for integrado:

```text
Capacidade genérica
       │
       ▼
     Adapter
       │
       ▼
Serviço externo
```

A integração específica não deve contaminar a Foundation nem transformar uma
capacidade genérica em uma implementação dependente de um único serviço.

---

## Regras para novos serviços

Antes de integrar um novo serviço, deve ser possível responder:

1. Qual problema ele resolve?
2. Qual é sua responsabilidade única?
3. Quais dados ele possui e onde são persistidos?
4. Qual configuração é sua responsabilidade?
5. De quais componentes ele realmente depende?
6. Como ele inicia, para e reinicia?
7. Como seu estado ou health é identificado?
8. Qual capacidade ele fornece à plataforma?
9. Quem consome essa capacidade?
10. O consumidor depende de um contrato ou de detalhes internos?
11. O serviço pode falhar sem derrubar capacidades não relacionadas?
12. Como ele pode ser removido ou substituído?

Se essas respostas não estiverem claras, a integração deve ser tratada como
incompleta ou experimental.

---

## Regras para futura modularidade

Quando um sistema de módulos for efetivamente definido, ele deverá ser baseado
em contratos explícitos e não em convenções implícitas espalhadas pelo Core.

A proposta futura deverá definir, no mínimo:

- identidade e versão;
- compatibilidade com a plataforma;
- dependências;
- configuração;
- dados persistentes;
- capacidades fornecidas;
- lifecycle;
- health;
- instalação;
- atualização;
- remoção;
- isolamento de falhas;
- política de permissões e segurança.

A criação desses contratos exigirá nova decisão arquitetural antes de se tornar
uma interface oficial.

---

## Alternativas consideradas

### 1. Criar imediatamente um sistema completo de plugins

**Não adotada.**

Não existem requisitos suficientes para definir corretamente discovery,
manifests, carregamento, versionamento e compatibilidade. Implementar esse
sistema agora criaria abstrações sem uso comprovado.

---

### 2. Continuar adicionando serviços diretamente ao Core conforme necessário

**Não adotada.**

Essa abordagem aumenta progressivamente o conhecimento de componentes
específicos pela Infrastructure e cria acoplamento estrutural.

---

### 3. Definir apenas convenções de diretório e considerar isso modularidade

**Não adotada.**

Separação física de arquivos não garante independência arquitetural. Um
componente continua acoplado se depende de alterações arbitrárias em outras
camadas para existir.

---

### 4. Não preparar modularidade até existir um módulo concreto

**Não adotada.**

Isso reduziria trabalho imediato, mas não resolveria o risco atual de novos
serviços introduzirem acoplamentos que depois dificultariam a modularização.

A preparação adotada é deliberadamente mínima: responsabilidades, contratos e
dependências explícitas.

---

## Relação com outros documentos

Esta decisão concretiza e complementa:

- `docs/reference/PRINCIPLES.md` — responsabilidades, desacoplamento, serviços,
  modularidade, contratos e isolamento de falhas;
- `docs/reference/ARCHITECTURE.md` — fronteiras entre Infrastructure, Adapters, serviços
  e módulos;
- `docs/reference/architecture/adr/0008-app-api-platform-boundary.md` — clientes dependem
  de contratos da plataforma;
- `planning/strategy.md` — modularidade como etapa posterior à consolidação das
  capacidades;
- `planning/quality/user-quality-of-life.md` — qualidade da integração e uma
  fonte de verdade por capacidade.
