# Como usar o HomeServer

Esta é a porta de entrada para quem já instalou o HomeServer e quer entender **o que cada parte faz e qual caminho usar**.

## Comece por aqui

Se é a primeira vez usando o HomeServer:

1. Leia [`Como funciona`](HOW_IT_WORKS.md) para entender a organização geral.
2. Siga [`Primeiro Boot`](../install/FIRST_BOOT.md) para validar o servidor.
3. Acesse a [`Homepage e o App`](app.md) para começar a utilizar os serviços.

## O que usar em cada situação

| Situação | Use |
|---|---|
| Quero entender o funcionamento geral | [`HOW_IT_WORKS.md`](HOW_IT_WORKS.md) |
| Quero acessar e gerenciar pelo navegador | [`app.md`](app.md) |
| Preciso administrar pelo terminal | [`cli.md`](cli.md) |
| Quero imprimir ou acompanhar impressões | [`PRINTING.md`](PRINTING.md) |
| Tenho uma dúvida comum | [`FAQ.md`](FAQ.md) |
| Não sei onde encontrar uma resposta | [`QUESTIONS.md`](QUESTIONS.md) |

## Os três caminhos principais

### 1. Homepage — acesso rápido

Use a **Homepage** para abrir rapidamente os serviços disponíveis no servidor.

```text
https://homeserver.local/
```

Ela funciona como um portal. Seu objetivo principal é facilitar o acesso, não substituir as ferramentas de gerenciamento.

### 2. HomeServer App — gerenciamento

Use o **App** em `/app` para as operações que o HomeServer expõe através de sua própria interface, respeitando o usuário, as permissões e as capacidades implementadas.

```text
https://homeserver.local/app
```

### 3. CLI `hs` — administração técnica

Use a CLI quando precisar diagnosticar, automatizar, recuperar ou executar operações administrativas mais avançadas.

```bash
bash core/hs.sh --help
```

A referência completa está em [`cli.md`](cli.md).

## Regra simples

```text
Abrir um serviço rapidamente? → Homepage
Gerenciar o HomeServer?       → App
Administrar ou diagnosticar?  → CLI
```

## Precisa de mais detalhes?

- [`FAQ.md`](FAQ.md) responde dúvidas frequentes.
- [`QUESTIONS.md`](QUESTIONS.md) funciona como índice de perguntas por assunto.
- [`docs/install/`](../install/) contém os guias de instalação e primeiro boot.
- [`docs/reference/`](../reference/) contém a documentação técnica.

Voltar ao [índice da documentação](../README.md).
