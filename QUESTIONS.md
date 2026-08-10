# Questions — HomeServer

> Índice das principais dúvidas que podem surgir antes, durante ou depois de instalar o HomeServer.

Este documento funciona como um mapa de perguntas. As respostas detalhadas ficam na documentação correspondente, evitando duplicação entre os documentos do projeto.

---

## 1. Sobre o projeto

- [O que é o HomeServer?](docs/FAQ.md#sobre-o-projeto)
- [Para quem ele foi criado?](docs/FAQ.md#sobre-o-projeto)
- [Preciso saber programar para usar?](docs/FAQ.md#sobre-o-projeto)
- [O HomeServer depende da internet?](docs/FAQ.md#sobre-o-projeto)
- [Posso usar o projeto como base para outro servidor?](docs/FAQ.md#sobre-o-projeto)

## 2. Antes da instalação

- [Qual hardware é necessário?](docs/FAQ.md#instalação)
- [Qual sistema operacional é suportado?](docs/FAQ.md#instalação)
- [Preciso instalar Docker manualmente?](docs/FAQ.md#instalação)
- [O instalador altera o quê no sistema?](docs/FAQ.md#instalação)
- [A instalação apaga meus dados?](docs/FAQ.md#instalação)

Guia principal: [`QUICKSTART.md`](QUICKSTART.md)

Guia detalhado: [`docs/INSTALLATION.md`](docs/INSTALLATION.md)

## 3. Primeiro uso

- [Como acesso o servidor depois da instalação?](docs/FAQ.md#primeiro-uso)
- [O que é a Homepage?](docs/FAQ.md#primeiro-uso)
- [O que é o HomeServer App?](docs/FAQ.md#app)
- [Como crio usuários?](docs/FAQ.md#primeiro-uso)
- [Como verifico se o servidor está funcionando?](docs/FAQ.md#primeiro-uso)

Guia: [`docs/FIRST_BOOT.md`](docs/FIRST_BOOT.md)

## 4. Acesso e rede

- [Por que usar `homeserver.local`?](docs/FAQ.md#serviços)
- [Posso acessar pelo IP?](docs/FAQ.md#serviços)
- [O que faz o Caddy?](docs/FAQ.md#serviços)
- [O que acontece se o mDNS não funcionar?](docs/FAQ.md#serviços)
- [O HomeServer precisa ser exposto à internet?](docs/FAQ.md#segurança)

## 5. Usuários e autenticação

- [Como funciona o administrador?](docs/FAQ.md#segurança)
- [Como funciona a sessão do App?](docs/FAQ.md#segurança)
- [Quanto tempo uma sessão permanece válida?](docs/FAQ.md#segurança)
- [O que acontece depois de reiniciar a API?](docs/FAQ.md#segurança)
- [Qual a diferença entre usuário do HomeServer e usuário do FileBrowser?](docs/FAQ.md#segurança)

Referência: [`docs/architecture/API.md`](docs/architecture/API.md)

## 6. Arquivos e armazenamento

- [Onde ficam meus arquivos?](docs/FAQ.md#dados-e-armazenamento)
- [Qual a diferença entre `users`, `shared`, `media` e `documents`?](docs/FAQ.md#dados-e-armazenamento)
- [Como funcionam dispositivos USB e SD Card?](docs/FAQ.md#dados-e-armazenamento)
- [Onde ficam os backups?](docs/FAQ.md#dados-e-armazenamento)
- [O que acontece se o armazenamento ficar cheio?](docs/FAQ.md#dados-e-armazenamento)

## 7. Serviços

- [Qual a função do FileBrowser?](docs/FAQ.md#serviços)
- [Qual a função do Gitea?](docs/FAQ.md#serviços)
- [Qual a função do Caddy?](docs/FAQ.md#serviços)
- [Posso adicionar outros serviços?](docs/FAQ.md#serviços)
- [Posso substituir um módulo?](docs/FAQ.md#serviços)

## 8. API e integrações

- [Por que o HomeServer possui uma API própria?](docs/FAQ.md#api)
- [O App acessa diretamente os serviços externos?](docs/FAQ.md#api)
- [Como funciona a autenticação da API?](docs/FAQ.md#api)
- [Posso criar outro cliente para o HomeServer?](docs/FAQ.md#api)
- [Posso integrar outro sistema usando a API?](docs/FAQ.md#api)

Referência: [`api/README.md`](api/README.md)

## 9. App

- [Qual a diferença entre Homepage e App?](docs/FAQ.md#app)
- [O App funciona em celulares?](docs/FAQ.md#app)
- [O App pode ser instalado como PWA?](docs/FAQ.md#app)
- [O App funciona offline?](docs/FAQ.md#app)
- [Como a interface muda conforme o usuário?](docs/FAQ.md#app)

## 10. Segurança

- [O HomeServer é seguro para exposição direta na internet?](docs/FAQ.md#segurança)
- [Onde ficam os tokens?](docs/FAQ.md#segurança)
- [Como reportar uma vulnerabilidade?](SECURITY.md)
- [Quais versões recebem correções de segurança?](SECURITY.md)

Referências:

- [`SECURITY.md`](SECURITY.md)
- [`docs/security/`](docs/security/)
- [`docs/architecture/adr/`](docs/architecture/adr/)

## 11. Desenvolvimento

- [Como começo a desenvolver para o HomeServer?](CONTRIBUTING.md)
- [Onde devo colocar uma nova funcionalidade?](CONTRIBUTING.md)
- [Quando devo criar um Adapter?](CONTRIBUTING.md)
- [Quando uma alteração exige um ADR?](CONTRIBUTING.md)
- [Como executar os testes?](CONTRIBUTING.md)
- [Como funciona o Quality Gate?](CONTRIBUTING.md)

## 12. Decisões arquiteturais

Perguntas sobre **por que** uma decisão foi tomada devem ser respondidas pelos ADRs sempre que a decisão for estrutural.

- [Por que existe uma API própria?](docs/architecture/adr/0007-identity-authentication.md)
- [Por que o App não acessa FileBrowser diretamente?](docs/architecture/adr/0007-identity-authentication.md)
- [Quais decisões definem a arquitetura estável?](docs/architecture/adr/)

## 13. Evolução do projeto

- [O que está sendo desenvolvido na v1.6?](planning/roadmap/)
- [Qual é o objetivo da v2.0?](planning/roadmap/v2.0.md)
- [O que fica para v2.1+?](planning/roadmap/v2.0.md)
- [Como funciona o processo de release?](planning/release/)

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
