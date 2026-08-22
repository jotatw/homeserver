# Arquitetura técnica

Esta seção reúne a referência detalhada da arquitetura atual do HomeServer.

Antes de entrar nos documentos desta pasta, consulte [`../ARCHITECTURE.md`](../ARCHITECTURE.md) para uma visão geral. Os arquivos aqui aprofundam responsabilidades, fronteiras e contratos específicos.

## Qual documento devo consultar?

```text
Quero entender o papel do núcleo
        ↓
CORE.md

Quero entender a base reutilizável
        ↓
FOUNDATION.md

Quero entender operações da plataforma e do sistema
        ↓
Infrastructure.md

Quero entender a fronteira HTTP da plataforma
        ↓
API.md
        ↓
api/README.md para endpoints e contratos concretos

Quero entender a relação entre aplicações e capacidades internas
        ↓
APPLICATION_API.md

Quero entender extensões e componentes opcionais
        ↓
MODULES.md

Quero saber por que uma decisão arquitetural foi tomada
        ↓
adr/
```

## Estrutura

```text
ARCHITECTURE.md
      │
      └── visão geral da arquitetura atual

architecture/
      ├── CORE.md
      ├── FOUNDATION.md
      ├── Infrastructure.md
      ├── API.md
      ├── APPLICATION_API.md
      ├── MODULES.md
      └── adr/
```

## Como os documentos se relacionam

Os documentos desta pasta não devem repetir o mesmo conteúdo com nomes diferentes.

| Documento | Pergunta principal |
|---|---|
| `CORE.md` | Qual é o papel do núcleo da plataforma? |
| `FOUNDATION.md` | Quais recursos reutilizáveis formam a base das demais camadas? |
| `Infrastructure.md` | Como capacidades concretas interagem com o sistema e a infraestrutura? |
| `API.md` | Qual é o papel arquitetural da API? |
| `APPLICATION_API.md` | Como aplicações e interfaces acessam capacidades internas sem depender de detalhes físicos? |
| `MODULES.md` | Como extensões opcionais se encaixam na arquitetura? |
| `adr/` | Por que decisões arquiteturais específicas foram tomadas? |

## O que não pertence aqui?

Esta pasta descreve a arquitetura atual e seus detalhes técnicos.

Outros assuntos possuem seus próprios locais:

```text
Princípios duradouros        → ../PRINCIPLES.md
Planejamento e evolução      → ../../../planning/
Endpoints concretos da API   → ../../../api/README.md
Instalação e operação        → ../../install/ e ../../use/
Personalização e contribuição→ ../../contribute/
```

Evite registrar uma ideia futura como se já fosse comportamento arquitetural atual. Quando algo ainda estiver em planejamento ou experimentação, a documentação deve deixar isso explícito.

Voltar para [`Referência técnica`](../README.md).