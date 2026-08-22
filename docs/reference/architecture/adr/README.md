# ADR — Architecture Decision Records

Esta área registra **decisões arquiteturais relevantes** tomadas para o HomeServer.

Um ADR preserva o contexto de uma decisão: qual problema existia, o que foi decidido, quais consequências foram aceitas e quais alternativas foram consideradas.

ADRs não substituem documentação de arquitetura, planejamento ou guias operacionais.

## Quando consultar um ADR?

```text
Quero saber como a arquitetura funciona hoje
→ ARCHITECTURE.md

Quero saber uma regra ou responsabilidade específica
→ documentos de architecture/

Quero saber por que uma decisão importante foi tomada
→ ADR

Quero saber o que ainda será feito
→ planning/
```

## Status

Os ADRs podem possuir estados como:

- **Aceito** — decisão adotada e válida;
- **Substituído** — uma decisão posterior assumiu seu lugar;
- **Depreciado** — a decisão não deve mais orientar novas mudanças;
- **Proposto** — ainda está sendo avaliado.

Um ADR aceito continua sendo um registro histórico mesmo quando posteriormente substituído. O status deve indicar sua validade atual.

## Índice

| ID | Decisão | Status |
|----|---------|--------|
| [ADR-0001](0001-authentication.md) | Autenticação na API | Aceito |
| [ADR-0002](0002-autoupdate.md) | Sistema de auto-update | Aceito |
| [ADR-0003](0003-religamento-s3.md) | Religamento via suspend S3 | Aceito |
| [ADR-0004](0004-nomenclatura.md) | Nomenclatura por camada | Aceito |
| [ADR-0005](0005-api-response.md) | Padronização da resposta da API | Aceito |
| [ADR-0006](0006-architecture-freeze.md) | Estabilidade e evolução da arquitetura | Requer revisão |
| [ADR-0007](0007-identity-authentication.md) | Identity & Authentication | Aceito |
| [ADR-0008](0008-app-api-platform-boundary.md) | App e API como fronteira da plataforma | Aceito |
| [ADR-0009](0009-service-decoupling-and-modularity.md) | Desacoplamento de serviços e preparação para modularidade | Aceito |

## Regras para novos ADRs

Crie um ADR quando uma decisão:

- altera uma fronteira arquitetural importante;
- estabelece um contrato compartilhado relevante;
- introduz uma dependência estrutural difícil de remover;
- define uma estratégia com consequências duradouras;
- substitui uma decisão arquitetural anterior;
- precisa preservar o contexto para futuras revisões.

Não é necessário criar um ADR para cada alteração de código, correção ou detalhe operacional.

## Formato recomendado

```text
# ADR-NNNN — Título

## Status

## Data

## Decisão

## Contexto

## Consequências

## Alternativas consideradas
```

Se uma decisão for substituída, o ADR antigo deve permanecer no histórico e indicar a decisão que o substituiu.

## Relação com a documentação

```text
PRINCIPLES.md
→ fundamentos duradouros

ARCHITECTURE.md
→ arquitetura e fronteiras atuais

architecture/
→ detalhes técnicos e contratos

adr/
→ por que decisões relevantes foram tomadas

planning/
→ direção e trabalho futuro
```

Voltar para [Referência de arquitetura](../README.md).