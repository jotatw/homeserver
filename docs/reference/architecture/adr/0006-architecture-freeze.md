# ADR-0006 — Estabilidade e evolução da arquitetura

## Status

Aceito

Esta decisão substitui o conceito anterior de **architecture freeze** como uma estrutura fixa e imutável.

A arquitetura atual deve permanecer estável em seus princípios e fronteiras, mas pode evoluir quando houver necessidade comprovada.

## Data

2026-08-22

## Contexto

O HomeServer está em desenvolvimento contínuo e parte de suas capacidades ainda é validada no ambiente real.

A formulação anterior deste ADR tratava uma arquitetura específica como congelada e estabelecia uma cadeia rígida de camadas:

```text
Homepage / App → API → Adapters → Infrastructure → Foundation
```

Durante a evolução do projeto, tornou-se necessário distinguir entre:

- princípios arquiteturais duradouros;
- fronteiras e responsabilidades atuais;
- detalhes concretos de implementação;
- experimentos e capacidades ainda em avaliação.

Uma arquitetura completamente congelada dificultaria melhorias justificadas. Por outro lado, mudanças estruturais frequentes sem critérios tornariam o projeto difícil de compreender e manter.

## Decisão

O HomeServer adota **estabilidade com evolução controlada**.

Isso significa que a arquitetura não deve mudar por preferência ou abstração hipotética, mas também não é imutável.

A organização atual é descrita pelos documentos de arquitetura, especialmente:

```text
PRINCIPLES.md
→ fundamentos duradouros

ARCHITECTURE.md
→ fronteiras e organização atuais

architecture/
→ responsabilidades e contratos detalhados

adr/
→ contexto de decisões relevantes

planning/
→ direção e trabalho futuro
```

Mudanças podem ocorrer quando a experiência prática demonstrar uma necessidade real.

## Critérios para mudança arquitetural

Uma mudança relevante deve ser avaliada quando houver, por exemplo:

- responsabilidade mal definida;
- acoplamento que dificulta evolução ou manutenção;
- duplicação significativa entre capacidades;
- contrato compartilhado que precisa ser formalizado ou alterado;
- dependência estrutural difícil de remover;
- evidência prática de que a solução atual não atende ao projeto;
- oportunidade clara de simplificar sem reduzir capacidades necessárias.

Uma mudança deve justificar sua complexidade e considerar consequências para consumidores existentes.

## Processo preferencial

```text
Necessidade identificada
        ↓
Menor mudança adequada
        ↓
Implementação ou experimento
        ↓
Validação prática
        ↓
Evidência suficiente?
        ├── não → revisar, simplificar ou manter independente
        └── sim → consolidar quando necessário
```

Nem toda melhoria exige uma mudança arquitetural formal.

Um ADR deve ser considerado quando a decisão altera uma fronteira importante, estabelece um contrato compartilhado relevante ou cria consequências duradouras para a evolução da plataforma.

## Consequências

### Positivas

- princípios permanecem estáveis sem bloquear evolução;
- experimentos não precisam ser prematuramente consolidados;
- mudanças relevantes preservam contexto por meio de ADRs;
- detalhes internos podem evoluir sem alterar contratos desnecessariamente;
- a arquitetura pode ser corrigida com base em uso real.

### Custos e riscos

- exige disciplina para não justificar qualquer alteração como evolução;
- documentos atuais precisam ser mantidos alinhados quando uma fronteira muda;
- decisões experimentais podem exigir revisão antes da consolidação;
- avaliar mudanças pode exigir mais trabalho antes de alterar componentes centrais.

## Alternativas consideradas

### Congelar completamente a arquitetura atual

Rejeitada porque o projeto ainda está evoluindo e possui capacidades em validação prática.

### Permitir mudanças sem critérios formais

Rejeitada porque mudanças frequentes sem responsabilidades claras aumentariam inconsistência e acoplamento.

### Estabilidade com evolução controlada

Aceita porque preserva uma base compreensível e, ao mesmo tempo, permite corrigir decisões quando a prática demonstrar necessidade.

## Relação com outros documentos

- [`PRINCIPLES.md`](../../PRINCIPLES.md) — fundamentos duradouros;
- [`ARCHITECTURE.md`](../../ARCHITECTURE.md) — arquitetura atual;
- [`../README.md`](../README.md) — referência de arquitetura;
- [`README.md`](README.md) — índice de ADRs.
