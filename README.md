# HomeServer

> Uma plataforma modular para transformar um computador comum em um servidor doméstico simples, organizado e fácil de expandir.

O **HomeServer** nasceu para dar uma nova vida a computadores antigos e evoluiu para uma plataforma local capaz de integrar armazenamento, usuários, serviços, automações e aplicações em uma única experiência.

A proposta é manter a infraestrutura simples, modular e reutilizável: o HomeServer pode ser usado como servidor doméstico completo ou como base para novos projetos.

---

## Filosofia

- Simplicidade antes de complexidade.
- Evolução incremental.
- Uma responsabilidade por camada.
- Infraestrutura desacoplada dos serviços externos.
- Automação sempre que possível.
- Documentação acompanha o código.
- Funcionalidade local não deve depender de nuvem quando não for necessário.
- Arquitetura estável é mais importante que quantidade de funcionalidades.

O objetivo não é competir com soluções corporativas, mas oferecer uma plataforma doméstica organizada, intuitiva e fácil de manter.

---

## Estado atual

A linha **v2.0** introduz o HomeServer App como interface da plataforma. A versão atual está em preparação para release candidata.

O projeto possui:

- Homepage como portal de acesso;
- HomeServer App para gerenciamento;
- autenticação e sessões próprias;
- gerenciamento de usuários;
- API REST oficial;
- armazenamento centralizado;
- FileBrowser;
- Gitea;
- Samba;
- Caddy e acesso unificado na LAN;
- backup automático;
- agendamento de energia;
- descoberta e gerenciamento de dispositivos;
- CLI administrativa `hs`;
- auto-update por releases;
- testes automatizados e smoke tests;
- Quality Gate;
- Design System e documentação arquitetural.

---

## Para quem é

O uso cotidiano do HomeServer **não exige programação**.

A instalação oficial é orientada por um assistente e o objetivo do projeto é que uma pessoa nova consiga chegar de uma máquina Linux limpa a um servidor funcional usando apenas a documentação oficial.

Conhecimento de Linux, Docker e programação é necessário apenas para administração avançada, manutenção ou desenvolvimento do projeto.

---

## Arquitetura

```text
HomeServer
├── core/
│   ├── foundation/          # componentes reutilizáveis
│   ├── infrastructure/      # recursos internos
│   ├── adapters/            # integração com serviços externos
│   └── hs.sh                # CLI
│
├── api/                     # API oficial da plataforma
├── modules/                 # serviços implantáveis
├── automation/              # automações e hooks
├── scripts/                 # ferramentas auxiliares
├── docs/                    # documentação do sistema
├── planning/                # evolução e planejamento
└── install.sh               # instalação
```

### Foundation

Base reutilizável do projeto: filesystem, validação, configuração, saída, constantes e registry.

### Infrastructure

Implementa recursos internos do HomeServer, como storage, usuários, dispositivos, hardware, serviços, backup, scheduler e energia.

### Adapters

Isolam integrações com serviços externos. A Infrastructure não deve depender diretamente da implementação de um serviço externo.

### API

É a interface oficial da plataforma. O App é apenas um cliente da API e não acessa diretamente FileBrowser, Gitea ou outros serviços.

### Modules

Serviços implantados pelo HomeServer, como Homepage, FileBrowser, Gitea, Caddy e Portainer.

---

## Homepage e App

A **Homepage** é o portal rápido do servidor. Ela organiza as principais ações em quatro grupos:

| Grupo | Objetivo |
|---|---|
| **Meu espaço** | Arquivos, projetos, downloads e mídia |
| **Aplicações** | Serviços disponíveis e seus estados |
| **Administração** | Gestão do HomeServer |
| **Sistema** | Diagnóstico e informações técnicas |

O **HomeServer App** é a interface de gerenciamento da plataforma. Ele possui autenticação própria e adapta a navegação conforme o papel do usuário.

A Homepage continua sendo o ponto de entrada simples; o App concentra operações administrativas e recursos da plataforma.

---

## Acesso unificado

O Caddy fornece um único ponto de entrada na rede local:

```text
https://homeserver.local/
```

Rotas principais:

| Rota | Serviço |
|---|---|
| `/` | Homepage |
| `/app` | HomeServer App |
| `/files` | FileBrowser |
| `/git` | Gitea |
| `/api/v1` | API |

O mDNS/Avahi permite resolver `homeserver.local` na LAN quando disponível. O endereço IP continua sendo uma alternativa de acesso.

O objetivo é que o usuário não precise memorizar portas individuais.

> **Autonomia local:** o HomeServer foi projetado para ser utilizável dentro da rede local sem depender de serviços em nuvem.

---

## Armazenamento

A estrutura oficial fica em `/srv`:

```text
/srv
├── storage/
│   ├── users/
│   ├── shared/
│   ├── media/
│   ├── documents/
│   └── devices/
│       ├── usb/
│       ├── sdcard/
│       ├── external/
│       └── temporary/
│
├── backup/
├── docker/
├── git/
└── config/
```

Backups ficam fora de `/srv/storage`, em `/srv/backup`.

O FileBrowser utiliza `/srv/storage` como raiz:

- administradores podem gerenciar todo o armazenamento;
- usuários comuns ficam limitados ao próprio espaço.

---

## Autenticação

A identidade pertence ao HomeServer.

O fluxo principal é:

```text
App
 ↓
API /auth/login
 ↓
verify + is-admin
 ↓
sessão HomeServer
 ↓
request.user
 ↓
autorização
```

As sessões atuais ficam em memória e possuem TTL deslizante de 30 dias. Um reinício da API invalida as sessões existentes.

O App nunca depende diretamente da autenticação do FileBrowser.

---

## API

A API é a interface oficial da plataforma. As respostas seguem o contrato `ok/data` para sucesso e `ok/error` para erros.

Principais grupos de endpoints:

| Área | Exemplos |
|---|---|
| Auth | `/api/v1/auth/login`, `/auth/session`, `/auth/logout` |
| Sistema | `/api/v1/system`, `/status` |
| Storage | `/api/v1/storage` |
| Serviços | `/api/v1/services` |
| Usuários | `/api/v1/users` |
| Dispositivos | `/api/v1/devices` |
| Hardware | `/api/v1/hardware` |
| Eventos | `/api/v1/events` |
| Energia | `/api/v1/power` |
| Backup | `/api/v1/backup` |
| Tokens | `/api/v1/tokens` |
| Impressão | `/api/v1/print` |

O contrato detalhado está em [`api/README.md`](api/README.md).

---

## Instalação

### Requisitos

- Computador compatível com Linux;
- Debian 12 é a base atualmente validada;
- acesso root ou `sudo`;
- conexão com a internet durante a instalação.

### Instalação rápida

```bash
git clone https://github.com/usuario/homeserver.git
cd homeserver
sudo bash install.sh
```

O instalador funciona como um assistente: verifica o sistema, instala o Docker quando necessário, detecta a rede, configura o usuário principal, gera as configurações, implanta os serviços e executa o Health Check.

Para iniciantes, comece por [`QUICKSTART.md`](QUICKSTART.md).

Documentação detalhada:

- [`docs/INSTALLATION.md`](docs/INSTALLATION.md)
- [`docs/FIRST_BOOT.md`](docs/FIRST_BOOT.md)
- [`docs/FAQ.md`](docs/FAQ.md)

---

## CLI

A CLI `hs` fornece operações administrativas do HomeServer.

```bash
bash core/hs.sh version
bash core/hs.sh system status
bash core/hs.sh service list
bash core/hs.sh user list
bash core/hs.sh update check
```

---

## Atualizações

O projeto é versionado por tags Git (`vX.Y.Z`). Releases são publicadas no GitHub e no Gitea.

O HomeServer possui atualização integrada:

```bash
bash core/hs.sh update check
bash core/hs.sh update apply
```

Antes de atualizar, o sistema cria um ponto de recuperação. O processo pode reimplantar os módulos quando necessário ou utilizar `--no-redeploy` quando apropriado.

---

## Testes

A base possui testes de Foundation, Infrastructure, API, CLI, integração e smoke tests.

Exemplo:

```bash
bash core/tests/run_all.sh
bash scripts/health-check.sh
```

O Quality Gate é utilizado como critério para releases.

---

## Desenvolvimento

O HomeServer foi organizado para que novas funcionalidades reutilizem as camadas existentes.

Antes de alterar a arquitetura:

1. consulte os princípios;
2. procure uma decisão arquitetural existente;
3. reutilize a camada apropriada;
4. crie um ADR quando houver uma nova decisão estrutural;
5. atualize testes e documentação.

Consulte [`docs/FAQ.md`](docs/FAQ.md) para dúvidas comuns e a documentação de desenvolvimento para contribuir.

---

## Documentação

A documentação possui responsabilidades diferentes:

```text
docs/       → como o HomeServer funciona
planning/   → para onde o projeto está evoluindo
```

Principais pontos de entrada:

- `QUICKSTART.md` — instalação rápida;
- `docs/INSTALLATION.md` — instalação detalhada;
- `docs/FIRST_BOOT.md` — primeiro uso;
- `docs/FAQ.md` — perguntas frequentes;
- `docs/ARCHITECTURE.md` — arquitetura;
- `docs/PRINCIPLES.md` — princípios;
- `docs/architecture/adr/` — decisões arquiteturais;
- `docs/design/` — Design System;
- `planning/` — roadmap, qualidade e visão;
- `CHANGELOG.md` — histórico de versões.

---

## Roadmap

### Concluído

| Versão | Foco |
|---|---|
| **v1.1** | Refinamento e UX da Homepage |
| **v1.2** | Acesso unificado e Caddy |
| **v1.3** | Autenticação, App inicial e estabilidade |
| **v1.4** | Homepage como plataforma e Design System |
| **v1.5** | Qualidade, segurança, testes e Architecture Freeze |

### v2.0 — HomeServer App

A v2.0 transforma o HomeServer em uma plataforma com identidade própria e uma aplicação web/PWA para gerenciamento.

O escopo da release candidata inclui autenticação, navegação por papel, dashboard, armazenamento, usuários, sistema, energia, serviços, PWA e integração com a API oficial.

### Futuro

A visão de longo prazo inclui integração entre servidor, notebook e celular, automações, notificações, identidade e integrações externas. Esses recursos serão desenvolvidos incrementalmente após a consolidação da v2.0.

---

## Licença

O HomeServer é distribuído sob a **MIT License**.

Consulte [`LICENSE`](LICENSE) para os termos completos.

---

## Projeto

O HomeServer é uma base aberta para experimentação, aprendizado, reutilização e evolução de servidores domésticos.

A prioridade do projeto é continuar sendo simples o suficiente para usar, estruturado o suficiente para manter e aberto o suficiente para ser reaproveitado em outros projetos.
