# HomeServer

<p align="center">
  <img alt="License" src="https://img.shields.io/github/license/jotatw/homeserver">
  <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/jotatw/homeserver/ci.yml?branch=main">
  <img alt="Language" src="https://img.shields.io/github/languages/top/jotatw/homeserver">
  <img alt="Version" src="https://img.shields.io/github/v/release/jotatw/homeserver?include_prereleases&label=latest">
</p>

> Uma plataforma modular para transformar um computador comum em um servidor doméstico simples, organizado e fácil de expandir.

O HomeServer transforma um computador Linux em uma plataforma local para armazenamento, serviços, usuários, automações e aplicações, administrada principalmente por uma interface web.

O projeto prioriza simplicidade, modularidade, autonomia local e facilidade de manutenção.

---

## Sobre

O HomeServer transforma um computador Linux em uma plataforma local para armazenamento, serviços, usuários, automações e aplicações, administrada principalmente por uma interface web.

O projeto prioriza simplicidade, modularidade, autonomia local e facilidade de manutenção.

---

## Objetivo

O HomeServer existe para transformar um computador comum num servidor doméstico completo e autônomo. Ele consolida serviços como armazenamento, automação, monitoramento e mais numa única plataforma web-friendly, eliminando a necessidade de múltiplos serviços separados e reduzindo a complexidade operacional.

---

## Principais Funcionalidades

- **HomeServer App** — administração completa do servidor através de uma interface web intuitiva
- **Arquivos** — armazenamento e compartilhamento de arquivos com acesso através de `/files/`
- **Usuários e Autenticação** — sistema de autenticação próprio integrado
- **Gerenciamento de Serviços e Módulos** — administração centralizada de todos os serviços e componentes
- **Backup Automático** — backup agendado e恢复 automático
- **Agendamento de Energia** — controle de energia do servidor e gerenciamento de suspensão
- **Gerenciamento de Dispositivos** — descoberta e administração de dispositivos conectados
- **API REST Oficial** — API RESTful para integração e automação
- **HTTPS Local** — acesso unificado através de `https://homeserver.local/`
- **CLI** — linha de comando para automação, diagnóstico e manutenção avançada
- **Testes Automatizados e CI** — testes completos e integração contínua

---

## Tecnologias

| Área | Stack |
|------|-------|
| **Sistema Operacional** | Linux (Debian 12 validado) |
| **API** | Node.js + Fastify (cors, helmet, rate-limit) |
| **Gerenciamento de Serviços** | Docker + Docker Compose (por módulo) |
| **Proxy / TLS** | Caddy (HTTPS local, roteamento) |
| **Módulos de serviços** | Gitea, Portainer, FileBrowser (`files`), Homepage |
| **Interface de administração** | HomeServer App (web, `/app`) + Homepage (`/`) |
| **Automação e manutenção** | Shell scripts (`scripts/`) |
| **Energia** | Scripts power-save / power-restore / auto-suspend, systemd timers |
| **CI/CD** | GitHub Actions |
| **Segurança** | HTTPS, autenticação própria, rate-limit, firewall |

---

## Estrutura do Projeto

```
homeserver/
├── core/              # Núcleo do sistema (usuários, autenticação, API)
├── modules/           # Contêineres de serviços independentes (Caddy, Gitea, etc.)
├── services/          # Serviços do sistema (arquivo, git, monitoramento)
├── api/               # API REST oficial
├── scripts/           # Instalador, restore, backup e utilitários
├── config/            # Configurações do sistema (nginx, TLS, etc.)
├── docs/              # Documentação completa (install, use, reference)
├── planning/          # Planejamento, roadmap e decisões
├── design/            # Design do App e protótipos
├── data/              # Dados persistentes
├── logs/              # Logs estruturados e métricas
├── automation/        # Automações e scripts de manutenção
├── templates/         # Templates de configuração
├── backup/            # Scripts e dados de backup
├── .github/           # Workflows de CI/CD
├── install.sh         # Script de instalação
├── CHANGELOG.md       # Histórico de versões
├── CONTRIBUTING.md    # Guia de contribuição
├── SECURITY.md        # Política de segurança
└── README.md          # Este arquivo
```

**Módulos principais:**
- `core/` — Núcleo do sistema: usuários, autenticação JWT, permissões, API REST
- `modules/` — Serviços Docker independentes (Caddy, Gitea, Portainer, files, homepage)
- `services/` — Serviços integrados (arquivo, git, monitoramento, energia)
- `scripts/` — Scripts de instalação, backup, restauração, manutenção e CI
- `api/` — API REST oficial para integração e automação externa
- `config/` — Configurações do sistema: Caddyfile, TLS, env vars
- `docs/` — Documentação técnica: guias, arquitetura, referência

---

## Instalação

**Requisitos:**
- Linux (Debian 12 validado)
- `sudo` ou acesso root
- Conexão com a internet (para instalar dependências)

**Instalação rápida:**

```bash
git clone https://github.com/jotatw/homeserver.git
cd homeserver
sudo bash install.sh
```

O script de instalação:
1. Verifica o sistema e instala dependências
2. Configura o ambiente
3. Implanta os serviços
4. Executa verificações
5. Inicia o servidor

**Documentação completa:** [`docs/install/QUICKSTART.md`](docs/install/QUICKSTART.md)

---

## Documentação

- **Documentação Principal:** [`docs/`](docs/) — guias de uso, instalação, referência
- **Arquitetura:** [`docs/reference/architecture/`](docs/reference/architecture/) — design do sistema
- **API:** [`api/README.md`](api/README.md) — documentação REST
- **Planejamento:** [`planning/`](planning/) — roadmap e prioridades
- **Design do App:** [`design/app/`](design/app/) — protótipos e design system
- **Guia de Instalação:** [`docs/install/QUICKSTART.md`](docs/install/QUICKSTART.md) — passo a passo

---

## Status

**v1.0.0** — Primeira release estável (25/08/2026). Plataforma madura com fluxo de trabalho completo de dev-to-prod.

**Próximos passos:** Consolidação de recursos beta, adição de dashboard aprimorado de métricas.

---

## Licença

HomeServer é lançado sob a [Licença MIT](LICENSE).