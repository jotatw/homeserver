# ADR-0009 — Desacoplamento de capacidades e modularidade progressiva

## Status

Aceito

## Data

2026-08-12

## Decisão

O HomeServer adota o **desacoplamento progressivo de capacidades** e permite consolidar módulos quando existir necessidade prática, sem introduzir antecipadamente um sistema universal de plugins ou carregamento automático.

Uma nova capacidade deve possuir responsabilidade clara e evitar conhecimento desnecessário sobre componentes sem relação direta.

Quando aplicável, sua integração deve deixar identificáveis:

- responsabilidade;
- configuração sob seu controle;
- dados persistentes;
- dependências reais;
- ciclo de vida necessário;
- estado ou diagnóstico;
- capacidade exposta;
- contratos utilizados por consumidores.

A Infrastructure fornece capacidades internas da plataforma e não deve ser alterada apenas para reconhecer ou registrar cada componente específico.

Um módulo continua sendo uma capacidade opcional ou independente que amplia o HomeServer sem se tornar requisito do Core.

Esta decisão não define manifest, descoberta automática, instalação automática ou carregamento dinâmico como requisitos atuais. Esses mecanismos só devem ser considerados quando existirem requisitos concretos que justifiquem sua complexidade.

---

## Contexto

O HomeServer integra capacidades internas, interfaces consumidoras, serviços externos e componentes ainda em experimentação.

Sem fronteiras claras, uma nova integração pode exigir alterações distribuídas pelo Core, listas fixas de serviços, regras especiais de configuração ou conhecimento cruzado entre componentes que não precisam se conhecer.

Isso aumenta o acoplamento e dificulta testar, substituir ou remover capacidades.

Ao mesmo tempo, criar antecipadamente um sistema completo de plugins, manifests, hooks e descoberta automática transformaria possibilidades futuras em complexidade permanente antes de existir uso comprovado.

A decisão busca preservar uma preparação mínima: responsabilidades claras, contratos quando necessários e dependências explícitas.

---

## Modelo arquitetural

A evolução preferencial ocorre por capacidades:

```text
Cliente / Automação
        ↓
Interface consumidora
        ↓
Contrato apropriado
        ↓
Capacidade responsável
        ↓
Infrastructure / Foundation / Adapter
        ↓
Sistema ou serviço externo
```

Nem toda capacidade precisa atravessar todas essas fronteiras. O modelo representa responsabilidades, não uma cadeia obrigatória de execução.

O consumidor deve depender do contrato ou capacidade apropriada, e não de detalhes como nome de container, caminho interno ou ferramenta utilizada para implementar a operação.

Quando houver integração com um serviço externo:

```text
Capacidade
    ↓
Adapter, quando necessário
    ↓
Serviço externo
```

O isolamento deve ser proporcional ao acoplamento real. Criar uma camada adicional sem benefício comprovado não é um objetivo por si só.

---

## Consequências

### Positivas

- reduz conhecimento cruzado entre componentes;
- torna dependências mais explícitas;
- facilita testes e isolamento de falhas;
- favorece substituição ou remoção com menor impacto;
- permite consolidar módulos sem tornar todas as capacidades plugins;
- evita alterar Foundation ou Infrastructure apenas para acomodar detalhes específicos;
- permite que diferentes interfaces reutilizem capacidades e contratos;
- evita criar antecipadamente um sistema de modularidade maior que as necessidades atuais.

### Custos e limites

- fronteiras compartilhadas podem exigir contratos e documentação adicionais;
- componentes existentes podem precisar de revisão antes de serem considerados adequadamente isolados;
- dependências reais continuarão existindo e devem ser explicitadas;
- não existe descoberta automática universal;
- um diretório `modules/` não representa, por si só, modularidade;
- a remoção segura de uma capacidade depende de seu nível real de isolamento.

---

## Regras para novas capacidades e serviços

Antes de integrar uma nova capacidade, deve ser possível responder:

1. Qual problema ela resolve?
2. Qual é sua responsabilidade?
3. Ela pertence ao Core, Infrastructure, Adapter ou pode ser opcional?
4. Quais dados e configurações controla?
5. De quais componentes realmente depende?
6. Qual ciclo de vida é necessário?
7. Como seu estado ou falha pode ser identificado?
8. Qual capacidade fornece?
9. Quem consome essa capacidade?
10. O consumidor depende de um contrato ou de detalhes internos?
11. Uma falha compromete capacidades sem relação direta?
12. Ela pode ser removida ou substituída?

Se essas respostas não estiverem suficientemente claras, a integração pode permanecer experimental até que exista evidência para consolidá-la.

---

## Regras para modularidade

Um módulo deve ser tratado como opcional na prática, e não apenas pela localização de seus arquivos.

Preferencialmente:

```text
Instalar módulo
→ adiciona uma capacidade

Remover módulo
→ remove essa capacidade

Core
→ continua funcional
```

A modularidade futura deve continuar baseada em requisitos concretos. Caso mecanismos formais de descoberta, instalação ou compatibilidade sejam necessários, essa decisão deverá ser revisada ou complementada por um novo ADR.

---

## Alternativas consideradas

### 1. Criar imediatamente um sistema completo de plugins

**Não adotada.**

Não existem requisitos suficientes para definir discovery, manifests, carregamento, versionamento e compatibilidade. Implementar isso agora criaria abstrações sem uso comprovado.

### 2. Adicionar novas capacidades diretamente ao Core conforme necessário

**Não adotada.**

Essa abordagem aumenta o conhecimento de componentes específicos pelas partes centrais e pode criar dependências estruturais difíceis de remover.

### 3. Definir apenas convenções de diretório e considerar isso modularidade

**Não adotada.**

Separação física não garante independência arquitetural. Um componente continua acoplado se exige alterações arbitrárias em outras capacidades para existir.

### 4. Não estabelecer nenhum critério até existir um módulo concreto

**Não adotada.**

Isso reduziria o trabalho imediato, mas permitiria que integrações atuais acumulassem acoplamentos que depois dificultariam isolamento ou modularização.

A preparação adotada permanece mínima: responsabilidades claras, dependências explícitas e contratos quando necessários.

---

## Relação com outros documentos

- [`../../PRINCIPLES.md`](../../PRINCIPLES.md) — fundamentos de responsabilidade, desacoplamento e evolução;
- [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md) — fronteiras atuais;
- [`../MODULES.md`](../MODULES.md) — definição arquitetural de módulos;
- [`../APPLICATION_API.md`](../APPLICATION_API.md) — consumidores e contratos;
- [`../API.md`](../API.md) — papel arquitetural da API;
- [`0008-app-api-platform-boundary.md`](0008-app-api-platform-boundary.md) — fronteira entre interfaces e capacidades.
