# FAQ — HomeServer

Perguntas frequentes sobre instalação, uso, arquitetura, segurança e desenvolvimento do HomeServer.

Este documento é uma base viva. Dúvidas recorrentes devem ser avaliadas para inclusão aqui. Quando uma resposta representar uma decisão arquitetural, ela deve apontar para o ADR correspondente.

---

## 1. Sobre o projeto

### O que é o HomeServer?

O HomeServer é uma plataforma modular para transformar um computador comum em um servidor doméstico simples, organizado e fácil de expandir.

### Para quem o HomeServer foi criado?

Para uso doméstico e pessoal, especialmente para quem quer reaproveitar um computador e centralizar arquivos, serviços, usuários e automações em uma única plataforma.

### Preciso saber programar para usar o HomeServer?

Não. A instalação e o uso normal devem ser possíveis sem conhecimento de programação. Conhecimentos de Linux são úteis para administração e desenvolvimento, mas não são necessários para o uso cotidiano.

### O HomeServer é uma distribuição Linux?

Não. Ele é uma plataforma executada sobre um sistema Linux suportado.

### O HomeServer depende da internet?

O objetivo do projeto é manter as funções principais utilizáveis na rede local sem depender de serviços em nuvem. A internet pode ser necessária para instalação, atualizações e algumas integrações externas.

### Posso reutilizar o HomeServer como base para outro projeto?

Sim. O projeto é distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para os termos completos.

---

## 2. Arquitetura

### O que é o `core/`?

É o núcleo do HomeServer. Ele contém Foundation, Infrastructure, Adapters e a CLI `hs`.

### O que é a API?

A API é a interface oficial entre o HomeServer App e os recursos da plataforma.

### O App acessa diretamente o FileBrowser ou o Gitea?

Não. O App utiliza a API oficial do HomeServer. Serviços externos são acessados pela camada de integração apropriada.

### O que são os `modules/`?

São componentes de serviço implantados pelo HomeServer, como Homepage, FileBrowser, Gitea e Caddy.

### O que são Adapters?

São a camada responsável por integrar o HomeServer com serviços externos. A Infrastructure não deve depender diretamente da implementação desses serviços.

### Posso criar meu próprio módulo?

A arquitetura foi projetada para ser extensível. Consulte a documentação de desenvolvimento antes de adicionar um novo componente.

---

## 3. Instalação

### Qual sistema é usado como base?

O fluxo oficial atual é validado em Debian 12.

### Preciso instalar Docker manualmente?

Não. O instalador verifica se o Docker está disponível e pode instalá-lo quando necessário.

### O que o `install.sh` faz?

Ele prepara o sistema, configura a infraestrutura, gera configurações necessárias, implanta os serviços e executa uma validação final.

### Posso executar o instalador novamente?

O instalador foi projetado para permitir reimplantação sobre um estado existente. Antes de repetir uma instalação em um servidor com dados importantes, siga a documentação de instalação e confirme o comportamento da versão utilizada.

### A instalação precisa de internet?

Sim, normalmente durante a instalação, pois dependências, imagens e pacotes podem precisar ser obtidos de repositórios externos.

### O instalador apaga meus arquivos?

O instalador não deve ser tratado como ferramenta de formatação. Dados existentes devem ser avaliados antes de qualquer reimplantação ou migração.

---

## 4. Primeiro uso

### Como acesso o HomeServer?

O acesso principal é feito pela Homepage através do endereço local configurado pelo Caddy. Quando o mDNS estiver disponível, use `https://homeserver.local/`.

### Como funciona o acesso dos usuários?

O HomeServer possui uma identidade própria na API. Usuários e administradores recebem permissões diferentes conforme seu papel.

### Onde ficam meus arquivos?

Os dados principais ficam em `/srv/storage`. Usuários comuns utilizam seu próprio espaço dentro de `/srv/storage/users/`.

### Como verifico se o servidor está funcionando?

Use o Health Check ou a CLI `hs` para verificar o estado dos componentes.

---

## 5. Autenticação e segurança

### Como funciona o login do App?

O App autentica através da API do HomeServer. Após o login, a API mantém uma sessão associada ao usuário e ao seu papel.

### Quanto tempo dura uma sessão?

A sessão utiliza TTL de 30 dias com renovação por uso. A sessão expira após 30 dias sem utilização.

### As sessões sobrevivem a um reinício do servidor?

Não. As sessões atuais ficam em memória e são invalidadas quando a API é reiniciada.

### O HomeServer precisa ser exposto à internet?

Não. O uso principal é local. Exposição externa é uma decisão futura e deve ser tratada separadamente da configuração LAN padrão.

### O HomeServer criptografa meus arquivos?

O HTTPS protege a comunicação quando configurado pelo Caddy, mas isso não significa que os arquivos armazenados estejam criptografados em repouso. Criptografia de armazenamento deve ser tratada separadamente.

---

## 6. Armazenamento e dispositivos

### O que é `/srv/storage`?

É a área oficial de armazenamento de dados do HomeServer.

### Onde ficam os backups?

Backups ficam fora de `/srv/storage`, em `/srv/backup/daily/<AAAA-MM-DD>` com symlink `latest`. Retenção: 14 dias (automático em `scripts/backup.sh`). Cada backup gera `manifest.sha256` para validação (`hs system backup validate`). Restauração: `sudo bash scripts/restore.sh [data|latest]` — ver `scripts/restore.sh` (para em `docker stop` antes de restaurar `docker/services`).

### Posso conectar um pendrive ou HD externo?

O HomeServer possui suporte para descoberta e montagem de dispositivos, conforme a configuração da infraestrutura e do sistema operacional.

### O HomeServer funciona sem um disco dedicado?

Pode funcionar usando o armazenamento disponível no computador, desde que haja espaço suficiente para os serviços e dados.

---

## 7. Serviços

### Por que o HomeServer usa serviços externos?

O projeto evita reimplementar funcionalidades maduras. Serviços especializados podem ser integrados através das camadas do HomeServer, enquanto a plataforma fornece uma experiência unificada.

### Posso substituir um serviço?

A arquitetura desacoplada facilita substituições, mas cada serviço precisa ser avaliado individualmente quanto ao adapter, configuração, API e integração com a Homepage/App.

### O que é o Caddy?

É o componente utilizado como ponto de entrada HTTP/HTTPS e reverse proxy do ambiente local.

### O que é o FileBrowser?

É o serviço de gerenciamento de arquivos integrado ao armazenamento do HomeServer.

### O que é o Gitea?

É o serviço Git integrado ao ambiente do HomeServer.

---

## 8. API

### Por que existe uma API própria?

Para fornecer uma interface estável para o HomeServer App e futuras integrações, mantendo os serviços internos desacoplados da interface do usuário.

### O App é apenas mais um cliente da API?

Sim. O App não deve depender diretamente da implementação interna dos serviços.

### Posso criar outro aplicativo para o HomeServer?

Sim. A API é a interface oficial para clientes que precisam interagir com a plataforma.

### Posso integrar outro sistema usando a API?

Sim. A API possui tokens próprios para integrações externas, respeitando as permissões definidas pela plataforma.

### Qual formato a API utiliza?

As respostas seguem o contrato padronizado da API, utilizando `ok/data` para operações bem-sucedidas e `ok/error` para erros.

---

## 9. App

### Qual é a diferença entre Homepage e App?

A Homepage é o portal rápido de acesso aos serviços. O App é a interface da plataforma para operações e gerenciamento mais completos.

### O App funciona no celular?

A interface web é preparada para uso em dispositivos móveis e possui suporte PWA na linha v2.0.

### O App funciona offline?

O PWA possui uma base mínima para instalação. Funcionalidades offline completas são uma evolução futura.

### Como o App sabe o que um usuário pode acessar?

A API fornece a identidade e o papel da sessão. A interface usa essas informações para adaptar a navegação.

---

## 10. Desenvolvimento

### Onde devo colocar uma nova funcionalidade?

Primeiro determine a responsabilidade da funcionalidade. Foundation, Infrastructure, Adapters, API, Modules e App possuem responsabilidades diferentes.

### Quando devo criar um Adapter?

Quando uma parte do HomeServer precisa integrar ou abstrair um serviço externo.

### Quando devo criar um ADR?

Quando uma alteração representa uma decisão arquitetural importante, especialmente se mudar responsabilidades, dependências ou padrões permanentes do projeto.

### Como funciona o Quality Gate?

O Quality Gate verifica arquitetura, segurança, consistência, performance, documentação, testes e release antes de uma versão ser considerada pronta.

### Como contribuo?

Consulte a documentação de desenvolvimento e as regras de contribuição antes de modificar a arquitetura ou criar novos componentes.

---

## 11. Decisões do projeto

Perguntas sobre decisões arquiteturais devem ser respondidas junto aos respectivos ADRs quando existirem.

Exemplos de decisões que devem permanecer documentadas:

- Por que usar Docker?
- Por que manter uma API própria?
- Por que separar App e Homepage?
- Por que serviços externos são integrados por adapters?
- Por que as sessões atuais são mantidas em memória?
- Por que o armazenamento oficial fica em `/srv`?

---

## 12. Ainda não respondido

Esta seção registra dúvidas que surgirem e ainda precisarem de uma decisão ou investigação.

- [ ] Política oficial de suporte entre versões.
- [ ] Processo definitivo de restauração de backup.
- [ ] Estratégia de persistência de sessões.
- [ ] Sistema de permissões granulares.
- [ ] Estratégia oficial para acesso externo por VPN.

> Uma pergunta recorrente deve ser transformada em resposta documentada. Uma decisão arquitetural deve, quando apropriado, gerar ou atualizar um ADR.
