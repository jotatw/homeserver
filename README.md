# HomeServer

> Uma plataforma modular para transformar um computador comum em um servidor doméstico simples, organizado e fácil de expandir.

O **HomeServer** nasceu com um objetivo simples: dar uma nova vida a computadores antigos.

Com o tempo, o projeto evoluiu para uma plataforma capaz de integrar armazenamento, gerenciamento de usuários, serviços e automações em uma única interface, mantendo uma arquitetura modular e preparada para crescer sem perder a simplicidade.

---

# Filosofia

O HomeServer segue alguns princípios desde o início do projeto:

- Simplicidade antes de complexidade.
- Evolução incremental.
- Um módulo, uma responsabilidade.
- Infraestrutura desacoplada dos serviços.
- Automação sempre que possível.
- Documentação acompanha o código.

O objetivo não é competir com soluções corporativas, mas oferecer uma plataforma doméstica organizada, intuitiva e fácil de manter.

---

# Recursos implementados

Atualmente o HomeServer oferece:

- Gerenciamento centralizado de armazenamento
- Homepage com modos de utilização (Usuário / Administrador / Sistema)
- Gerenciamento de usuários
- API REST (respostas padronizadas `ok/data`)
- Autenticação com token (TTL 24h) e proteção de rotas por escopo
- FileBrowser integrado
- Gitea
- Samba
- Backup automático
- Wake-on-LAN
- Agendamento de inicialização e desligamento (religamento via suspend S3)
- CLI administrativa (`hs`)
- Auto-update por releases (`hs update check|apply`)
- Security headers e rate limit na API
- Testes de integração (`smoke-test.sh`, `test-cli.sh`, `test-api.sh`, `run-integration.sh`)
- ADRs (`docs/architecture/adr/`) e Architecture Freeze
- Design System (`docs/design/`) e App Design da v2.0 (`design/app/`)

---

# Próximos módulos

Planejados para versões futuras:

- Login OIDC
- Uptime Kuma
- Jellyfin
- Gateway (Reverse Proxy)
- Integração com dispositivos USB e SD Card
- Aplicativo para notebook
- Aplicativo para celular

---

# Arquitetura

O HomeServer é organizado em camadas independentes.

```text
HomeServer
├── core/
│   ├── foundation/
│   ├── infrastructure/
│   ├── adapters/
│   └── hs.sh
│
├── api/
│
├── modules/
│
├── automation/
│   └── hooks/
│
└── install.sh
```

## Foundation

Bibliotecas reutilizáveis.

- filesystem
- validation
- output
- config
- constants
- registry

## Infrastructure

Serviços internos do HomeServer.

- storage
- users
- devices
- mount
- hardware
- services
- backup
- scheduler

## Adapters

Integração com serviços externos.

Atualmente:

- FileBrowser

Futuramente:

- Telegram
- Email
- WhatsApp
- GitHub
- Outros módulos

---

# Homepage

A Homepage é o ponto central do sistema (v1.4 — portal orientado às tarefas).

Ela organiza os serviços em quatro grupos:

| Grupo | Objetivo |
|-------|----------|
| **Meu espaço** | Arquivos, projetos, downloads e mídia |
| **Aplicações** | Serviços com status (Homepage, FileBrowser, Gitea, App) |
| **Administração** | Gestão para administradores |
| **Sistema** | Informações técnicas do servidor |

O objetivo é que o usuário nunca precise acessar diretamente cada serviço individualmente.

---

# Armazenamento

Toda a estrutura do HomeServer é organizada dentro de `/srv`.

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

O FileBrowser utiliza `/srv/storage` como raiz.

- Administradores possuem acesso completo.
- Usuários comuns acessam apenas `/users/<nome>`.

---

# Serviços

| Serviço | Porta | Acesso unificado |
|----------|------:|------------------|
| Homepage | 3000 | `homeserver.local/` |
| Gitea | 3001 | `homeserver.local/git` |
| Gitea SSH | 2222 | `git@homeserver.local:2222` |
| FileBrowser | 8080 | `homeserver.local/files` |
| API | 8000 | `homeserver.local/api/v1` |
| Samba | 445 | via rede |
| Portainer | 9443 | módulo opcional |

## Acesso unificado

Todos os serviços são acessíveis por um **único ponto de entrada**:
`https://homeserver.local` (resolvido via mDNS/Avahi na rede local; HTTP
redireciona para HTTPS — certificado auto-assinado).

- `/` → Homepage
- `/files` → FileBrowser
- `/git` → Gitea
- `/app` → HomeServer App (administração)
- `/api/v1` → API

O usuário nunca precisa conhecer portas ou endereços IP. O proxy (Caddy) é o
módulo `modules/caddy/`.

> **Autonomia local**: o HomeServer é totalmente utilizável dentro da rede
> local, sem depender de serviços em nuvem.

---

# API

A API é a interface oficial do HomeServer.

| Método | Endpoint |
|---------|----------|
| GET | `/api/v1/status` |
| GET | `/api/v1/storage` |
| GET | `/api/v1/services` |
| GET | `/api/v1/users` |
| GET | `/api/v1/devices` |
| GET | `/api/v1/hardware` |
| POST | `/api/v1/users` |
| PUT | `/api/v1/users/:nome` |
| DELETE | `/api/v1/users/:nome` |
| GET | `/api/v1/events` |
| GET | `/api/v1/power` |
| PUT | `/api/v1/power` |
| POST | `/api/v1/backup` |

Mais detalhes em `api/README.md`.

---

# Uso

## Instalação rápida

> Para iniciantes: siga o [`QUICKSTART.md`](QUICKSTART.md) (~10 minutos, sem programação).
> Detalhes e flags: [`docs/INSTALLATION.md`](docs/INSTALLATION.md).

```bash
git clone https://github.com/usuario/homeserver.git
cd homeserver
sudo bash install.sh
```

O instalador é um **assistente**: detecta sua rede, pergunta o usuário
principal, gera as senhas e configura tudo. Ao final, executa um **Health
Check** automático e mostra o endereço de acesso.

> Primeiro acesso e configuração inicial: [`docs/FIRST_BOOT.md`](docs/FIRST_BOOT.md).

## Releases e atualização automática

O projeto é versionado por **tags git** (`vX.Y.Z`). Cada implementação é
lançada como uma release publicada no GitHub e no Gitea.

O HomeServer tem um sistema de **auto-update** integrado ao CLI:

```bash
# Versão atual instalada
bash core/hs.sh version

# Verifica se há release mais recente disponível
bash core/hs.sh update check
# => {"current":"v1.5.0","latest":"v1.5.0","update":false}

# Aplica a atualização para a release mais recente
bash core/hs.sh update apply
```

O `update apply`:

1. Faz backup do estado atual (tag `pre-update-<versão>`).
2. Atualiza o código via `git pull --ff-only origin main`.
3. Reimplanta os módulos (`install.sh`) quando necessário.

Para atualizar **sem reimplantar** módulos:

```bash
bash core/hs.sh update apply --no-redeploy
```

> O servidor acompanha a branch `main`, que contém todas as releases.
> As tags servem de marcador de release e ponto de rollback.

## CLI

```bash
bash core/hs.sh system status

bash core/hs.sh service list

bash core/hs.sh user list

bash core/hs.sh version

bash core/hs.sh update check
```

## Testes

```bash
bash core/tests/run_all.sh
```

## API

```bash
curl http://homeserver.local/api/v1/status
```

> Atualmente o acesso ainda pode utilizar o endereço IP do servidor. A adoção de `homeserver.local` faz parte da evolução planejada do projeto.

---

# Hardware utilizado

Projeto desenvolvido e validado em hardware modesto.

- MSI MS-AA1511
- Intel Pentium T4500
- 3 GB RAM
- HDD 320 GB

O objetivo é permitir reutilizar computadores antigos como servidores domésticos.

---

# Roadmap

## Lançado

| Versão | Conteúdo |
|--------|----------|
| **v1.1** | Homepage refinada, melhorias de UX, organização do projeto |
| **v1.2** | Gateway, URLs amigáveis, reverse proxy (Caddy, `homeserver.local`) |
| **v1.3** | Autenticação com token, proteção de rotas, App com login, auto-update, fix religamento S3 |
| **v1.4** | UX: Homepage como portal (4 grupos), cards como ações, Design System |
| **v1.5** | Stable Foundation: code review, segurança, ADRs, testes de integração, Quality Gate |

## v2.0 — HomeServer App

O App unificado (web + mobile) está em fase de **design** na branch `app-design`
(`design/app/`): referências, wireframes, fluxos por role, tokens e componentes.

- Design system do App (tokens `--hs-*`, dark/light)
- 6 telas: Login, Meu espaço, Aplicações, Armazenamento, Sistema, Administração
- Navegação por role (sidebar desktop / bottom nav mobile)
- Aplicativo para notebook e celular

## Futuro

O objetivo de longo prazo é transformar o HomeServer em um ecossistema pessoal.

Servidor, notebook e celular compartilharão arquivos, usuários, notificações e automações através de uma única plataforma.

---

# Documentação

A documentação está organizada em duas áreas:

```text
docs/          → como o HomeServer funciona
├── PRINCIPLES.md
├── ARCHITECTURE.md
├── architecture/    (camadas, ADRs)
├── design/          (Design System v1.4)
├── development/
├── foundation/
├── guide/
└── security/        (threat model, auditoria v1.5)

planning/      → para onde o projeto está evoluindo
├── vision.md
├── strategy.md
├── roadmap/         (planos por versão)
├── quality/         (Quality Gate, review checklist)
├── health/          (baselines de performance)
└── backlog/         (product backlog por área)
```

- **API**: veja `api/README.md`.
- **App Design (v2.0)**: veja `design/app/` na branch `app-design`.
- **CHANGELOG**: veja `CHANGELOG.md`.

---

# Licença

Este projeto é distribuído sob a licença MIT.
