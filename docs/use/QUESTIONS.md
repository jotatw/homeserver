# Perguntas sobre o HomeServer

> Um mapa para encontrar respostas. Este documento não duplica explicações: ele aponta para o lugar onde cada assunto é explicado.

## Comece pelo caminho certo

| Quero saber... | Veja |
|---|---|
| O que é e como tudo funciona | [`HOW_IT_WORKS.md`](HOW_IT_WORKS.md) |
| Como instalar | [`QUICKSTART.md`](../install/QUICKSTART.md) |
| O que fazer depois de instalar | [`FIRST_BOOT.md`](../install/FIRST_BOOT.md) |
| Como usar Homepage e App | [`app.md`](app.md) |
| Acesso técnico avançado (opcional) | [`cli.md`](cli.md) |
| Dúvidas frequentes | [`FAQ.md`](FAQ.md) |

---

## Sobre o projeto

- [O que é o HomeServer?](FAQ.md#1-sobre-o-projeto)
- [Para quem ele foi criado?](FAQ.md#1-sobre-o-projeto)
- [Preciso saber programar para usar?](FAQ.md#1-sobre-o-projeto)
- [O HomeServer depende da internet?](FAQ.md#1-sobre-o-projeto)
- [Posso usar o projeto como base para outro servidor?](FAQ.md#1-sobre-o-projeto)

## Antes da instalação

- [Qual sistema operacional é suportado?](FAQ.md#3-instalação)
- [Qual hardware é necessário?](../install/INSTALLATION.md#pré-requisitos)
- [Preciso instalar Docker manualmente?](FAQ.md#3-instalação)
- [O que o instalador faz?](FAQ.md#3-instalação)
- [A instalação apaga meus dados?](FAQ.md#3-instalação)

## Primeiro uso

- [Como acesso o servidor depois da instalação?](FAQ.md#4-primeiro-uso)
- [O que é a Homepage?](app.md#homepage)
- [O que é o HomeServer App?](app.md#homeserver-app)
- [Como verifico se o servidor está funcionando?](FAQ.md#4-primeiro-uso)
- [Como funciona o acesso dos usuários?](FAQ.md#4-primeiro-uso)

Guia: [`FIRST_BOOT.md`](../install/FIRST_BOOT.md)

## Acesso e rede

- [Como acesso por `homeserver.local`?](../install/FIRST_BOOT.md#2-acesse-pelo-navegador)
- [Posso acessar pelo IP?](../install/FIRST_BOOT.md#2-acesse-pelo-navegador)
- [O que faz o Caddy?](FAQ.md#7-serviços)
- [O que acontece se o nome local não funcionar?](../install/FIRST_BOOT.md#2-acesse-pelo-navegador)
- [O HomeServer precisa ser exposto à internet?](FAQ.md#5-autenticação-e-segurança)

## Usuários e autenticação

- [Como funciona o login do App?](FAQ.md#5-autenticação-e-segurança)
- [Como funciona a sessão?](FAQ.md#5-autenticação-e-segurança)
- [Quanto tempo uma sessão permanece válida?](FAQ.md#5-autenticação-e-segurança)
- [O que acontece depois de reiniciar a API?](FAQ.md#5-autenticação-e-segurança)

## Arquivos e armazenamento

- [Onde ficam meus arquivos?](FAQ.md#6-armazenamento-e-dispositivos)
- [Onde ficam os backups?](FAQ.md#6-armazenamento-e-dispositivos)
- [Posso conectar um pendrive ou HD externo?](FAQ.md#6-armazenamento-e-dispositivos)
- [O HomeServer funciona sem um disco dedicado?](FAQ.md#6-armazenamento-e-dispositivos)

## Serviços e módulos

- [Qual a função do FileBrowser?](FAQ.md#7-serviços)
- [Qual a função do Gitea?](FAQ.md#7-serviços)
- [Qual a função do Caddy?](FAQ.md#7-serviços)
- [Por que o HomeServer usa serviços externos?](FAQ.md#7-serviços)
- [Posso substituir ou adicionar um serviço?](FAQ.md#7-serviços)

## API e integrações

- [Por que existe uma API própria?](FAQ.md#8-api)
- [O App acessa diretamente os serviços externos?](FAQ.md#8-api)
- [Posso criar outro aplicativo?](FAQ.md#8-api)
- [Posso integrar outro sistema?](FAQ.md#8-api)

Referência técnica: [`api/README.md`](../../api/README.md)

## Segurança

- [O HomeServer deve ser exposto diretamente à internet?](../../SECURITY.md)
- [Como reportar uma vulnerabilidade?](../../SECURITY.md)
- [Quais informações de segurança estão documentadas?](../reference/security/README.md)

## Desenvolvimento e personalização

- [Como modificar ou personalizar o HomeServer?](../contribute/CONTRIBUTING.md)
- [Como começar a desenvolver?](../contribute/DEVELOPMENT.md)
- [Como executar os testes?](../contribute/TESTING.md)
- [Quando uma alteração exige um ADR?](../contribute/DEVELOPMENT.md)

## Evolução do projeto

- [Qual é o roadmap atual?](../../planning/roadmap/evolution.md)
- [Como o projeto evolui e valida mudanças?](../../planning/foundations/evolution-and-validation.md)
- [Como funciona uma futura release?](../../planning/release/release-process.md)

## Como manter este documento

Quando surgir uma dúvida:

1. procure primeiro se a resposta já existe na documentação;
2. se existir, adicione ou atualize o link aqui;
3. se a resposta ainda não existir, documente o comportamento validado no local apropriado;
4. se a resposta representar uma decisão arquitetural, registre ou atualize o ADR correspondente;
5. evite transformar este arquivo em uma segunda FAQ.
