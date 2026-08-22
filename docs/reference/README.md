# Referência técnica

Esta área reúne documentos para **consulta técnica** sobre decisões, arquitetura, segurança e especificações do HomeServer.

Ela não substitui os guias de instalação ou uso. Se você quer apenas instalar ou utilizar o HomeServer, comece em [`docs/README.md`](../README.md).

## Onde encontrar cada assunto?

```text
Quero entender os princípios do projeto
        ↓
PRINCIPLES.md

Quero ter uma visão geral da arquitetura
        ↓
ARCHITECTURE.md

Quero consultar componentes, contratos ou decisões arquiteturais
        ↓
architecture/

Quero consultar regras e especificações de interface
        ↓
design/

Quero consultar segurança, riscos e auditorias
        ↓
security/

Quero consultar endpoints e contratos da API
        ↓
api/README.md
```

## Conteúdo principal

### Princípios

[`PRINCIPLES.md`](PRINCIPLES.md) reúne princípios de referência usados para orientar decisões que afetam o projeto de forma ampla.

Use quando precisar entender **por que determinadas decisões existem** ou avaliar uma mudança que pode afetar a direção do HomeServer.

### Arquitetura

[`ARCHITECTURE.md`](ARCHITECTURE.md) apresenta a visão geral das responsabilidades e da organização técnica da plataforma.

Use como ponto de partida antes de consultar detalhes específicos.

### Arquitetura detalhada

[`architecture/`](architecture/) reúne referências sobre componentes, fronteiras, contratos e decisões arquiteturais, incluindo ADRs.

Use quando a pergunta for mais específica que a visão geral da arquitetura.

### Design

[`design/`](design/) reúne o Design System e as especificações relacionadas às interfaces do HomeServer.

Essa área serve como referência para manter consistência ao evoluir Homepage, App e outras interfaces.

### Segurança

[`security/`](security/) reúne referências sobre modelo de ameaças, premissas, auditorias e outros aspectos de segurança.

Para reportar uma vulnerabilidade, consulte também [`SECURITY.md`](../../SECURITY.md).

### API

A documentação técnica da API fica em [`api/README.md`](../../api/README.md).

Ela deve ser consultada quando for necessário conhecer os contratos expostos pela plataforma ou desenvolver uma integração.

## Como usar esta documentação

O caminho recomendado é:

```text
Tenho uma dúvida técnica
        ↓
Consigo resolver pela visão geral?
        ├── sim → ARCHITECTURE.md ou PRINCIPLES.md
        └── não → consultar architecture/, design/, security/ ou API
```

Evite usar esta área como um segundo guia de instalação ou uso. Os documentos de referência devem explicar **o que precisa ser conhecido tecnicamente**, enquanto os guias operacionais explicam **o que fazer**.

Voltar ao [índice geral da documentação](../README.md).