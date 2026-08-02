# HomeServer

> Dê uma nova vida ao seu computador antigo.

O HomeServer é uma plataforma modular que transforma computadores antigos em servidores domésticos leves, organizados e fáceis de manter.

## Estado atual

- [x] Debian 13 (Trixie)
- [x] SSH por chave
- [x] Firewall UFW
- [x] Docker + Docker Compose
- [x] Homepage (dashboard)
- [x] FileBrowser
- [x] Gitea
- [x] API (`/api/v1/*`)
- [x] Samba
- [x] Backup diário
- [x] Agendamento liga/desliga
- [ ] Módulo Uptime Kuma (futuro)
- [ ] Módulo Jellyfin (futuro)

## Hardware

- MSI MS-AA1511 · Intel Pentium T4500 · 3 GB RAM · 320 GB HDD

## Serviços

| Serviço    | Porta | Descrição                |
|------------|-------|--------------------------|
| Homepage   | 3000  | Dashboard                |
| Gitea      | 3001  | Servidor Git (web)       |
| Gitea SSH  | 2222  | Servidor Git (SSH)       |
| FileBrowser| 8080  | Gerenciador de arquivos  |
| API        | 8000  | API do HomeServer        |
| Samba      | 445   | Compartilhamento         |
| Portainer  | 9443  | Módulo opcional          |

## Estrutura

```text
homeserver/
├── api/            # API Fastify (TypeScript)
├── core/           # Núcleo (bash): foundation, infrastructure, applications
│   ├── hs.sh       # CLI do HomeServer
│   └── tests/      # Suíte de testes
├── modules/        # Módulos (filebrowser, gitea, homepage, portainer)
├── config/         # Configuração (services.conf)
├── scripts/        # Automações (backup, liga/desliga)
├── docs/           # Documentação
└── install.sh      # Instalador
```

## Uso

```bash
# CLI
bash core/hs.sh system info
bash core/hs.sh service list
bash core/hs.sh service start <serviço>

# Instalação
sudo bash install.sh

# Testes
bash core/tests/run_all.sh

# API
cd api && docker compose up -d --build
curl http://192.168.0.10:8000/api/v1/system
```

## Módulos

Os módulos ficam em `modules/` e são ativados via `config/services.conf`:

```bash
bash core/hs.sh service enable portainer
bash core/hs.sh service start portainer
```

## Documentação

- `docs/` — arquitetura, decisões e desenvolvimento
- `CHANGELOG.md` — histórico de versões
