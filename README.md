# HomeServer

> Uma plataforma modular para transformar um computador comum em um servidor doméstico simples, organizado e fácil de expandir.

[![CI](https://img.shields.io/github/actions/workflow/status/jotatw/homeserver/ci.yml?branch=main&label=CI)](https://github.com/jotatw/homeserver/actions/workflows/ci.yml)
![Release](https://img.shields.io/github/v/release/jotatw/homeserver)
[![Licença](https://img.shields.io/github/license/jotatw/homeserver)](LICENSE)

O **HomeServer** nasceu para dar uma nova vida a computadores antigos e evoluiu para uma plataforma local capaz de integrar armazenamento, usuários, serviços, automações e aplicações em uma única experiência.

A proposta é manter a infraestrutura simples, modular e reutilizável: o HomeServer pode ser usado como servidor doméstico completo ou como base para novos projetos.

---

## Filosofia

- Simplicidade antes de complexidade.
- Evolução incremental e validação contínua.
- Uma responsabilidade por camada.
- Infraestrutura desacoplada dos serviços externos.
- Interfaces adequadas ao contexto.
- Automação quando gera benefício real.
- Documentação acompanha o código e as decisões.
- Funcionalidade local não deve depender de nuvem quando não for necessário.
- Arquitetura estável é mais importante que quantidade de funcionalidades.

O objetivo não é competir com soluções corporativas, mas oferecer uma plataforma doméstica organizada, intuitiva e fácil de manter.

---

## Estado atual

**v1.0.0** — primeira release estável, publicada em 2026-08-25.

O projeto passou por consolidação completa: migração do FileBrowser para o
Quantum (módulo `files`), Core modular operável pelo App, instalação guiada
validada ponta a ponta e administração do dia a dia 100% pela interface web —
sem necessidade de terminal após a instalação.

O projeto atualmente possui, entre outras capacidades:

- Homepage como portal de acesso;
- HomeServer App para gerenciamento completo (usuários, serviços, módulos,
  dispositivos, energia, atualizações e impressão);
- autenticação e sessões próprias;
- gerenciamento de usuários com escopos isolados;
- API REST oficial;
- armazenamento centralizado com upload/download validados acima de 1 GB;
- FileBrowser Quantum (módulo `files`) com backup diário do banco;
- Gitea;
- Caddy e acesso unificado HTTPS na LAN;
- backup automático com verificação de integridade;
- agendamento de energia;
- descoberta e gerenciamento de dispositivos (USB/SD);
- CLI administrativa `hs` (opcional, para automação e diagnóstico avançado);
- testes automatizados, smoke tests, integração e CI;
- executor centralizado para operações privilegiadas;
- validação em camadas para operações de módulos;
- documentação de arquitetura, segurança e planejamento;
- direção inicial para Design System e interfaces Desktop/Mobile.

### Referências de evolução

- [Baseline](planning/release/baseline-v0.1.0.md)
- [Roadmap de Evolução](planning/roadmap/evolution.md)
- [Fundamentos](planning/foundations/README.md)
- [Planejamento do App](planning/app/README.md)
- [Critérios de Release](planning/release/README.md)

---

## Para quem é

O uso cotidiano do HomeServer **não exige programação nem terminal**: usuários,
serviços, arquivos, dispositivos, energia e atualizações são administrados pelo
App (`/app`) e pelos serviços acessíveis pela Homepage.

A instalação é um procedimento técnico único e guiado (assistente), documentado
para que uma pessoa nova consiga chegar de uma máquina Linux limpa a um servidor
funcional seguindo a documentação oficial.

Conhecimento de Linux, Docker e programação continua útil para diagnóstico
avançado, manutenção, recuperação, automação ou desenvolvimento.

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
├── modules/                 # componentes e serviços extensíveis
├── automation/              # automações e hooks
├── scripts/                 # ferramentas auxiliares
├── docs/                    # documentação do sistema
├── planning/                # fundamentos e evolução
└── install.sh               # instalação
```

### Foundation

Base reutilizável do projeto: filesystem, validação, configuração, saída, constantes e registry.

### Infrastructure

Implementa recursos internos do HomeServer, como storage, usuários, dispositivos, hardware, serviços, backup, scheduler e energia.

### Adapters

Isolam integrações com serviços externos. A Infrastructure não deve depender diretamente da implementação de um serviço externo.

### API

É a interface oficial da plataforma. As interfaces utilizam capacidades por contratos apropriados e não devem depender diretamente de detalhes internos dos serviços.

### Modules

Componentes opcionais ou independentes podem ampliar capacidades do HomeServer seguindo os contratos arquiteturais do projeto. A instalação ou remoção de um módulo não deve comprometer o Core ou dados fora de sua responsabilidade.

---

## Interfaces

O HomeServer utiliza interfaces com papéis diferentes conforme o contexto.

### Desktop

É a interface principal para gerenciamento e operações que exigem mais contexto, configuração, visualização ou controle.

### Mobile

Prioriza acesso rápido às ações frequentes. Não precisa reproduzir automaticamente todas as funcionalidades do Desktop.

### CLI

Opcional para o dia a dia (o App cobre toda a administração), mas continua
importante para automação, testes, diagnóstico, recuperação e manutenção
técnica avançada.

A direção detalhada das interfaces está em [`planning/app/`](planning/app/README.md).

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
| `/files/` | Arquivos (FileBrowser Quantum) |
| `/git/` | Gitea |
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

> Guia passo a passo completo: [`docs/install/QUICKSTART.md`](docs/install/QUICKSTART.md)

### Depois de instalar

Ao final da instalação, acesse `https://homeserver.local/`:

1. **Homepage** (`/`) — portal para abrir os serviços;
2. **App** (`/app`) — administração completa (usuários, serviços, atualizações);
3. **Arquivos** (`/files/`) — armazenamento com escopos por usuário.

Nenhuma operação do dia a dia exige terminal. O guia do primeiro acesso está em [`docs/install/FIRST_BOOT.md`](docs/install/FIRST_BOOT.md).
