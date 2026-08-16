# Questions — HomeServer

> Índice das principais dúvidas que podem surgir antes, durante ou depois de instalar o HomeServer.

Este documento funciona como um mapa de perguntas. As respostas detalhadas ficam na documentação correspondente, evitando duplicação entre os documentos do projeto.

---

## 1. Sobre o projeto

- [O que é o HomeServer?](FAQ.md#1-sobre-o-projeto)
- [Para quem ele foi criado?](FAQ.md#1-sobre-o-projeto)
- [Preciso saber programar para usar?](FAQ.md#1-sobre-o-projeto)
- [O HomeServer depende da internet?](FAQ.md#1-sobre-o-projeto)
- [Posso usar o projeto como base para outro servidor?](FAQ.md#1-sobre-o-projeto)

## 2. Antes da instalação

- [Qual hardware é necessário?](FAQ.md#3-instalação)
- [Qual sistema operacional é suportado?](FAQ.md#3-instalação)
- [Preciso instalar Docker manualmente?](FAQ.md#3-instalação)
- [O instalador altera o quê no sistema?](FAQ.md#3-instalação)
- [A instalação apaga meus dados?](FAQ.md#3-instalação)

Guia principal: [`QUICKSTART.md`](../install/QUICKSTART.md)

Guia detalhado: [`docs/INSTALLATION.md`](../install/INSTALLATION.md)

## 3. Primeiro uso

- [Como acesso o servidor depois da instalação?](FAQ.md#4-primeiro-uso)
- [O que é a Homepage?](FAQ.md#9-app)
- [O que é o HomeServer App?](FAQ.md#9-app)
- [Como crio usuários?](FAQ.md#4-primeiro-uso)
- [Como verifico se o servidor está funcionando?](FAQ.md#4-primeiro-uso)

Guia: [`docs/FIRST_BOOT.md`](../install/FIRST_BOOT.md)

## 4. Acesso e rede

- [Por que usar `homeserver.local`?](FAQ.md#7-serviços)
- [Posso acessar pelo IP?](FAQ.md#7-serviços)
- [O que faz o Caddy?](FAQ.md#7-serviços)
- [O que acontece se o mDNS não funcionar?](FAQ.md#7-serviços)
- [O HomeServer precisa ser exposto à internet?](FAQ.md#5-autenticação-e-segurança)

## 5. Usuários e autenticação

- [Como funciona o administrador?](FAQ.md#5-autenticação-e-segurança)
- [Como funciona a sessão do App?](FAQ.md#5-autenticação-e-segurança)
- [Quanto tempo uma sessão permanece válida?](FAQ.md#5-autenticação-e-segurança)
- [O que acontece depois de reiniciar a API?](FAQ.md#5-autenticação-e-segurança)
- [Qual a diferença entre usuário do HomeServer e usuário do FileBrowser?](FAQ.md#5-autenticação-e-segurança)

Referência: [`docs/architecture/API.md`](../reference/architecture/API.md)

## 6. Arquivos e armazenamento

- [Onde ficam meus arquivos?](FAQ.md#6-armazenamento-e-dispositivos)
- [Qual a diferença entre `users`, `shared`, `media` e `documents`?](FAQ.md#6-armazenamento-e-dispositivos)
- [Como funcionam dispositivos USB e SD Card?](FAQ.md#6-armazenamento-e-dispositivos)
- [Onde ficam os backups?](FAQ.md#6-armazenamento-e-dispositivos)
- [O que acontece se o armazenamento ficar cheio?](FAQ.md#6-armazenamento-e-dispositivos)

## 7. Serviços

- [Qual a função do FileBrowser?](FAQ.md#7-serviços)
- [Qual a função do Gitea?](FAQ.md#7-serviços)
- [Qual a função do Caddy?](FAQ.md#7-serviços)
- [Posso adicionar outros serviços?](FAQ.md#7-serviços)
- [Posso substituir um módulo?](FAQ.md#7-serviços)

## 8. API e integrações

- [Por que o HomeServer possui uma API própria?](FAQ.md#8-api)
- [O App acessa diretamente os serviços externos?](FAQ.md#8-api)
- [Como funciona a autenticação da API?](FAQ.md#8-api)
- [Posso criar outro cliente para o HomeServer?](FAQ.md#8-api)
- [Posso integrar outro sistema usando a API?](FAQ.md#8-api)

Referência: [`api/README.md`](../../api/README.md)

## 9. App

- [Qual a diferença entre Homepage e App?](FAQ.md#9-app)
- [O App funciona em celulares?](FAQ.md#9-app)
- [O App pode ser instalado como PWA?](FAQ.md#9-app)
- [O App funciona offline?](FAQ.md#9-app)
- [Como a interface muda conforme o usuário?](FAQ.md#9-app)

## 10. Segurança

- [O HomeServer é seguro para exposição direta na internet?](../../SECURITY.md)
- [Onde ficam os tokens?](FAQ.md#5-autenticação-e-segurança)
- [Como reportar uma vulnerabilidade?](../../SECURITY.md)
- [Quais versões recebem correções de segurança?](../../SECURITY.md)

Referências:

- [`SECURITY.md`](../../SECURITY.md)
- [`docs/security/`](../reference/security/)
- [`docs/architecture/adr/`](../reference/architecture/adr/)

## 11. Desenvolvimento

- [Como começo a desenvolver para o HomeServer?](../../CONTRIBUTING.md)
- [Onde devo colocar uma nova funcionalidade?](../../CONTRIBUTING.md)
- [Quando devo criar um Adapter?](../../CONTRIBUTING.md)
- [Quando uma alteração exige um ADR?](../../CONTRIBUTING.md)
- [Como executar os testes?](../../CONTRIBUTING.md)
- [Como funciona o Quality Gate?](../../CONTRIBUTING.md)

## 12. Decisões arquiteturais

Perguntas sobre **por que** uma decisão foi tomada devem ser respondidas pelos ADRs sempre que a decisão for estrutural.

- [Por que existe uma API própria?](../reference/architecture/adr/0007-identity-authentication.md)
- [Por que o App não acessa FileBrowser diretamente?](../reference/architecture/adr/0007-identity-authentication.md)
- [Quais decisões definem a arquitetura estável?](../reference/architecture/adr/)

## 13. Evolução do projeto

- [O que está sendo desenvolvido na v1.6?](../../planning/roadmap/v1.0.md)
- [Qual é o objetivo da v2.0?](../../planning/archive/roadmap/v2.0.md)
- [O que fica para v2.1+?](../../planning/archive/roadmap/v2.0.md)
- [Como funciona o processo de release?](../../planning/release/release-process.md)

## 14. Dúvidas ainda não respondidas

Quando uma dúvida recorrente não possuir documentação suficiente, ela deve ser registrada aqui antes de receber uma resposta definitiva.

- [ ] Como restaurar completamente um backup em uma instalação limpa?
- [ ] Como migrar o HomeServer para outro disco sem reinstalar?
- [ ] Como adicionar um novo módulo seguindo o padrão oficial?
- [ ] Como criar uma integração externa usando API Tokens?

Essas perguntas permanecem como backlog documental até que exista uma resposta validada e documentada.

---

## Como manter este documento

`QUESTIONS.md` é um índice, não uma segunda documentação completa.

Quando uma pergunta tiver uma resposta estável:

1. documente a resposta no documento técnico apropriado;
2. adicione ou atualize o link nesta lista;
3. se a resposta representar uma decisão arquitetural, registre também um ADR;
4. evite duplicar a explicação completa aqui.
