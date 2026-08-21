# HomeServer

> Uma plataforma modular para transformar um computador comum em um servidor doméstico simples, organizado e fácil de expandir.

[![CI](https://img.shields.io/github/actions/workflow/status/jotatw/homeserver/ci.yml?branch=main&label=CI)](https://github.com/jotatw/homeserver/actions/workflows/ci.yml)
[![Licença](https://img.shields.io/github/license/jotatw/homeserver)](LICENSE)

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

O projeto possui histórico de versões v1.x e preparação conceitual para uma futura v2.0. O desenvolvimento atual está na etapa de **consolidação após o baseline**, com arquitetura modular planejada, hardening principal implementado e foco nas próximas evoluções de App, UX e validação operacional.

O **Baseline v0.1.0 é conceitual**: ele registra um marco de referência sem apagar ou substituir as tags e versões históricas existentes.

A linha v1.6.x permanece como histórico de manutenção e pequenas melhorias. A evolução posterior ao baseline é organizada pelo roadmap conceitual até uma primeira release estável v1.0.0.

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
- backup automático e validação de integridade implementada;
- agendamento de energia;
- descoberta e gerenciamento de dispositivos;
- CLI administrativa `hs`;
- auto-update por releases;
- testes automatizados, smoke tests e CI;
- executor centralizado para operações privilegiadas;
- validação em camadas para operações de módulos;
- Design System e documentação arquitetural.

### Baseline

O estado de referência é documentado em [`planning/release/baseline-v0.1.0.md`](planning/release/baseline-v0.1.0.md).

Esse documento funciona como referência para comparar correções, regressões e evolução futura. O status operacional das fases posteriores é mantido no roadmap e nas evidências específicas de cada área.

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

As sessões atuais ficam em memória e possuem duas políticas independentes:

- **inatividade:** 30 dias por padrão (`HS_SESSION_TTL_MS`);
- **limite absoluto:** 90 dias por padrão (`HS_SESSION_ABSOLUTE_TTL_MS`).

Leituras classificadas como polling não renovam a sessão por si só; atividade definida pela política de autenticação pode renovar `lastUserActivityAt`. Um reinício da API invalida as sessões existentes porque o armazenamento atual é em memória.

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
git clone https://github.com/jotatw/homeserver.git
cd homeserver
sudo bash install.sh
```

O instalador funciona como um assistente: verifica o sistema, instala o Docker quando necessário, detecta a rede, configura o usuário principal, gera as configurações, implanta os serviços e executa o Health Check.
