# Perguntas frequentes — HomeServer

Respostas rápidas sobre **o que é, o que faz e como usar** o HomeServer.

Para entender o funcionamento geral antes de entrar nos detalhes, leia [`HOW_IT_WORKS.md`](HOW_IT_WORKS.md).

---

## 1. Sobre o projeto

### O que é o HomeServer?

O HomeServer transforma um computador comum em uma plataforma para centralizar recursos da sua casa ou uso pessoal, como arquivos, serviços, usuários e automações.

Ele organiza esses recursos em um único ambiente, mas não tenta substituir o sistema operacional nem recriar todos os serviços do zero.

### Para quem ele foi criado?

Principalmente para uso doméstico e pessoal, incluindo quem quer reaproveitar um computador antigo e ter mais controle sobre arquivos e serviços locais.

### Preciso saber programar para usar?

Não para o uso normal. A ideia é que instalação e tarefas cotidianas possam ser feitas pela documentação e pelas interfaces disponíveis.

Conhecimentos de Linux ajudam na administração avançada e são úteis para personalizar ou desenvolver o projeto.

### O HomeServer é uma distribuição Linux?

Não. Ele é instalado sobre um sistema Linux suportado.

### O HomeServer depende da internet?

As funções locais essenciais foram planejadas para funcionar dentro da rede local sem depender continuamente de serviços em nuvem.

A internet pode ser necessária para instalar dependências, obter atualizações ou usar integrações externas.

### Posso usar o projeto como base para outro servidor?

Sim. O projeto utiliza a licença MIT. Consulte [`LICENSE`](../../LICENSE).

---

## 2. Como o HomeServer funciona?

### Quais são as partes principais?

A forma mais simples de entender é:

```text
Computador
   ↓
HomeServer organiza o ambiente
   ├── Core       → regras e operações do sistema
   ├── API        → comunicação oficial com as interfaces
   ├── Módulos    → serviços e capacidades adicionais
   ├── Homepage   → acesso rápido aos serviços
   ├── App        → gerenciamento pelo navegador
   └── CLI        → administração técnica pelo terminal
```

### O que é o `core/`?

É o núcleo responsável pelas operações e regras internas do HomeServer. Ele também fornece a CLI `hs`.

### O que é a API?

É a interface oficial usada pelo App e por integrações para solicitar operações ao HomeServer.

Isso evita que cada interface precise conhecer diretamente como os serviços internos funcionam.

### O App acessa diretamente o FileBrowser ou o Gitea?

Não como regra arquitetural. O App usa os contratos da API do HomeServer para as operações que a plataforma oferece.

### O que são módulos?

São componentes que adicionam capacidades ao ambiente. Um módulo pode ser instalado ou removido sem transformar automaticamente todos os outros componentes em dependentes dele.

### Posso criar meu próprio módulo?

A arquitetura foi planejada para permitir expansão. Para modificar ou criar componentes, consulte [`CONTRIBUTING.md`](../contribute/CONTRIBUTING.md) e [`DEVELOPMENT.md`](../contribute/DEVELOPMENT.md).

---

## 3. Instalação

### Qual sistema é usado como base?

O fluxo oficialmente documentado e validado utiliza **Debian 12** como base.

### Preciso instalar Docker manualmente?

Normalmente não. O instalador verifica o ambiente e pode instalar o Docker quando necessário.

### O que o `install.sh` faz?

Em termos simples, ele prepara o ambiente, configura a infraestrutura necessária, gera configurações, implanta os componentes selecionados e executa uma validação final.

A sequência detalhada está em [`INSTALLATION.md`](../install/INSTALLATION.md).

### Posso executar o instalador novamente?

O instalador foi projetado para permitir reimplantação sobre um estado existente, mas antes de repetir uma instalação em um servidor com dados importantes, faça backup e confirme o comportamento documentado para o fluxo que será utilizado.

### A instalação precisa de internet?

Normalmente sim, porque pacotes e imagens podem precisar ser obtidos durante a instalação.

### A instalação apaga meus arquivos?

O instalador não deve ser usado como ferramenta de formatação. Mesmo assim, faça backup de dados importantes antes de reinstalar, migrar ou alterar o armazenamento.

---

## 4. Primeiro uso

### Como acesso o HomeServer?

O acesso principal é feito pelo navegador:

```text
https://homeserver.local/
```

Se o nome local não estiver disponível, use o endereço IP mostrado pelo instalador. Veja [`FIRST_BOOT.md`](../install/FIRST_BOOT.md).

### O que devo usar no dia a dia?

A regra simples é:

```text
Abrir um serviço rapidamente? → Homepage
Gerenciar o HomeServer?       → App
Administrar ou diagnosticar?  → CLI
```

Veja também o [guia de uso](README.md).

### Onde ficam meus arquivos?

A área principal de dados do HomeServer fica em:

```text
/srv/storage
```

### Como verifico se o servidor está funcionando?

Use o Health Check ou:

```bash
bash core/hs.sh system status
```

---

## 5. Login e segurança

### Como funciona o login do App?

O App autentica o usuário através da API do HomeServer. A API usa essa identidade para aplicar as permissões disponíveis para aquele usuário.

### Quanto tempo dura uma sessão?

A implementação atual utiliza TTL de 30 dias com renovação por uso. A sessão expira após 30 dias sem utilização.

### As sessões sobrevivem ao reinício da API?

Não. As sessões atuais ficam em memória e são invalidadas quando a API é reiniciada.

### O HomeServer precisa ser exposto à internet?

Não. O foco atual é o uso dentro da rede local. Qualquer acesso externo deve ser tratado separadamente e não deve ser assumido como parte da configuração LAN padrão.

### O HTTPS criptografa meus arquivos armazenados?

Não necessariamente. HTTPS protege a comunicação entre o dispositivo e o servidor. Isso é diferente de criptografar os arquivos armazenados no disco.

---

## 6. Arquivos, armazenamento e dispositivos

### O que é `/srv/storage`?

É a área oficial onde o HomeServer organiza os dados armazenados.

### Onde ficam os backups?

Os backups ficam separados dos dados principais em:

```text
/srv/backup/daily/
```

A documentação e os comandos de manutenção devem ser usados como referência para validar ou restaurar backups.

### Posso conectar um pendrive ou HD externo?

O HomeServer possui suporte para descoberta e operações de montagem de dispositivos, conforme a infraestrutura e a configuração disponíveis no sistema.

### Preciso de um disco dedicado?

Não obrigatoriamente. O HomeServer pode utilizar o armazenamento disponível no computador, desde que exista espaço suficiente para o sistema, serviços e dados.

---

## 7. Serviços e módulos

### Por que usar serviços externos?

O HomeServer não precisa recriar funcionalidades que já existem em ferramentas especializadas. Ele pode integrar serviços e organizá-los dentro de uma experiência mais unificada.

### Posso substituir um serviço?

Em muitos casos, a arquitetura busca permitir substituições. Porém, a troca depende da integração necessária, da configuração e dos contratos utilizados pelo componente.

### O que é o Caddy?

É o ponto de entrada HTTP/HTTPS do ambiente local e atua como reverse proxy para os serviços configurados.

### O que é o FileBrowser?

É um serviço utilizado para gerenciamento de arquivos quando esse módulo está instalado.

### O que é o Gitea?

É um serviço Git integrado ao ambiente quando esse módulo está instalado.

---

## 8. API e integrações

### Por que existe uma API própria?

Para que o App e futuras integrações usem uma interface estável da plataforma, sem depender diretamente da implementação interna de cada serviço.

### Posso criar outro aplicativo para o HomeServer?

Sim. Clientes podem usar os contratos públicos disponibilizados pela API, respeitando autenticação e permissões.

### Posso integrar outro sistema?

A plataforma possui suporte a tokens para integrações externas conforme os contratos e permissões implementados.

### Onde encontro a referência da API?

Consulte [`api/README.md`](../../api/README.md).

---

## 9. Homepage e App

### Qual é a diferença?

A **Homepage** serve principalmente para abrir rapidamente os serviços disponíveis.

O **HomeServer App** é a interface de gerenciamento da plataforma.

### O App funciona no celular?

A interface é preparada para uso em dispositivos móveis. O suporte disponível depende da implementação atual.

### Posso instalar o App como PWA?

O App possui base para instalação como PWA. Isso não significa, por si só, suporte completo para funcionamento offline.

### Como o App sabe o que posso acessar?

A API fornece a identidade e o papel associados à sessão. A interface usa essas informações para disponibilizar as áreas e operações permitidas.

---

## 10. Desenvolvimento e personalização

### Onde coloco uma nova funcionalidade?

Primeiro identifique sua responsabilidade. Core, API, módulos, integrações e App possuem papéis diferentes.

### Quando devo criar um Adapter?

Quando for necessário integrar ou abstrair um serviço externo sem espalhar essa dependência pelo restante da arquitetura.

### Quando devo criar um ADR?

Quando uma mudança representar uma decisão arquitetural importante ou permanente, especialmente se alterar responsabilidades, dependências ou padrões do projeto.

### Como funcionam os testes?

Consulte [`TESTING.md`](../contribute/TESTING.md).

### Como modifico ou personalizo o projeto?

Comece por [`CONTRIBUTING.md`](../contribute/CONTRIBUTING.md).

---

## 11. O que ainda está em evolução?

Algumas áreas ainda dependem de decisões, testes ou implementação adicional. Exemplos atuais incluem:

- política oficial de suporte entre futuras releases;
- processo completo de restauração de backup em uma instalação limpa;
- estratégia futura para persistência de sessões;
- permissões mais granulares;
- estratégia oficial para acesso externo por VPN.

Esses pontos não devem ser interpretados como funcionalidades prontas.

Para acompanhar a evolução, consulte [`planning/README.md`](../../planning/README.md).

> Se uma dúvida não estiver respondida aqui, consulte [`QUESTIONS.md`](QUESTIONS.md) para encontrar o documento mais adequado ou identificar uma lacuna de documentação.
