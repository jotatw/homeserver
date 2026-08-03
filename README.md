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
- Homepage com modos de utilização
- Gerenciamento de usuários
- API REST
- FileBrowser integrado
- Gitea
- Samba
- Backup automático
- Wake-on-LAN
- Agendamento de inicialização e desligamento
- CLI administrativa (`hs`)

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

A Homepage é o ponto central do sistema.

Ela organiza todos os serviços do HomeServer em três níveis de utilização.

| Modo | Objetivo |
|------|----------|
| **Usuário** | Arquivos, projetos e conteúdo pessoal |
| **Administrador** | Administração dos serviços |
| **Sistema** | Informações completas do servidor |

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

## Instalação

```bash
sudo bash install.sh
```

## CLI

```bash
bash core/hs.sh system status

bash core/hs.sh service list

bash core/hs.sh user list
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

## v1.1

- Refinamento da Homepage
- Melhorias de UX
- Organização do projeto

## v1.2

- Gateway
- URLs amigáveis
- Reverse Proxy

## v2.0

- Device Service completo
- Hardware Service
- Aplicativo para Notebook
- Aplicativo para Celular

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
├── architecture/
├── development/
└── guide/

planning/      → para onde o projeto está evoluindo
├── VISION.md
├── ROADMAP.md
├── roadmap/
└── backlog/
```

- **API**: veja `api/README.md`.
- **CHANGELOG**: veja `CHANGELOG.md`.

---

# Licença

Este projeto é distribuído sob a licença MIT.
