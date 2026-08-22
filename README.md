# HomeServer

> Uma plataforma modular para transformar um computador comum em um servidor doméstico simples, organizado e fácil de expandir.

[![CI](https://img.shields.io/github/actions/workflow/status/jotatw/homeserver/ci.yml?branch=main&label=CI)](https://github.com/jotatw/homeserver/actions/workflows/ci.yml)
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

O projeto está em **evolução contínua**, usando o **Baseline v0.1.0** como referência para comparar o estado observado, limitações, correções e melhorias futuras.

O baseline não é uma tag nem uma release distribuída. Ele registra o ponto de partida da consolidação atual.

A evolução é organizada por prioridades, implementação, testes, uso real e novas evidências. Uma solução pode ser consolidada, melhorada, refatorada, permanecer experimental ou ser removida conforme seus resultados.

Tags e Releases não são utilizadas apenas para marcar etapas intermediárias. A primeira publicação oficial planejada é `v1.0.0`, mas será considerada somente após uma decisão explícita e o atendimento dos critérios aplicáveis de release.

O projeto atualmente possui, entre outras capacidades:

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
- testes automatizados, smoke tests e CI;
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

O uso cotidiano do HomeServer não deve exigir programação.

A instalação oficial é um procedimento técnico documentado, e o objetivo do projeto é que uma pessoa nova consiga chegar de uma máquina Linux limpa a um servidor funcional seguindo a documentação oficial.

Conhecimento de Linux, Docker e programação continua útil para diagnóstico avançado, manutenção, recuperação, automação ou desenvolvimento.

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

Continua importante para instalação, automação, testes, diagnóstico, recuperação e manutenção técnica avançada.

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
