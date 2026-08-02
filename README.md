# HomeServer

> Dê uma nova vida ao seu computador antigo.

O HomeServer é uma plataforma modular que transforma computadores antigos em servidores domésticos leves, organizados e fáceis de manter.

## Estado atual

- [x] Debian 13 (Trixie)
- [x] SSH por chave
- [x] Firewall UFW
- [x] Docker + Docker Compose
- [x] Homepage (modos de exibição + resumo do servidor)
- [x] FileBrowser (pasta própria por usuário)
- [x] Gitea
- [x] API (`/api/v1/*`)
- [x] Samba
- [x] Backup diário
- [x] Agendamento liga/desliga
- [x] Perfis de usuários (Gitea + FileBrowser + pasta)
- [ ] Login OIDC na homepage (aguardando release do Homepage)
- [ ] Módulo Uptime Kuma (futuro)
- [ ] Módulo Jellyfin (futuro)

## Hardware

O hardware que foi testado e usado para a criação desse projeto:

- MSI MS-AA1511 · Intel Pentium T4500 · 3 GB RAM · 320 GB HDD

### Extra

Para esse projeto foi utilizado um roteador próprio para configurar as portas dos serviços.

## Serviços

| Serviço    | Porta | Descrição                |
|------------|-------|--------------------------|
| Homepage   | 3000  | Dashboard (modos)        |
| Gitea      | 3001  | Servidor Git (web)       |
| Gitea SSH  | 2222  | Servidor Git (SSH)       |
| FileBrowser| 8080  | Gerenciador de arquivos  |
| API        | 8000  | API do HomeServer        |
| Samba      | 445   | Compartilhamento         |
| Portainer  | 9443  | Módulo opcional          |

## Modos de exibição (Homepage)

A Homepage possui três modos de exibição, selecionáveis no canto superior direito.
A preferência é salva no navegador (localStorage).

| Modo | O que mostra |
|------|--------------|
| **Simples** | Apenas os serviços essenciais (Homepage, FileBrowser, Gitea, API) |
| **Admin** | Essenciais + Status do servidor + Administração (Portainer, Gitea SSH) |
| **Manutenção** | Tudo, incluindo serviços em execução, usuários e backup |

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
├── .github/        # CI/CD
└── install.sh      # Instalador
```

## Armazenamento

Os dados são organizados em `/srv`, separando arquivos de usuário, dados de
serviço e configuração:

```text
/srv/
├── storage/          # Dados de usuário (raiz do FileBrowser)
│   ├── users/        # Uma pasta por usuário
│   ├── shared/       # Compartilhamento entre usuários
│   ├── media/        # Mídia
│   └── documents/    # Documentos
├── services/         # Dados dos serviços (gitea, filebrowser)
├── docker/           # Stacks Docker
├── git/              # Repositório HomeServer
├── backup/           # Backups diários
└── scripts/          # Automações
```

O FileBrowser é montado com a raiz `/srv/storage`. O admin enxerga tudo;
cada usuário comum vê apenas a própria pasta (`/users/<nome>`).

## Wake-on-LAN

O servidor suporta e mantém o Wake-on-LAN habilitado (via
`homeserver-wol.service`). Verifique o estado:

```bash
bash core/hs.sh system wol status
```

**Limitação**: a Homepage roda no próprio servidor — quando ele está
desligado, o painel não é acessível. Para ligar o servidor remotamente,
use um aplicativo/ferramenta de magic packet em outro dispositivo da rede
(MAC: `40:61:86:ce:99:fe`), ou o agendamento RTC (23h30/07h00).

## Uso

```bash
# CLI
bash core/hs.sh system status        # resumo completo do servidor (JSON)
bash core/hs.sh service list
bash core/hs.sh service start <serviço>
bash core/hs.sh user list            # usuários do FileBrowser

# Instalação
sudo bash install.sh

# Testes
bash core/tests/run_all.sh

# API
cd api && docker compose up -d --build
curl http://192.168.1.10:8000/api/v1/status
```

## API

| Método | Rota                    | Descrição                          |
|--------|-------------------------|------------------------------------|
| GET    | `/api/v1/status`        | Resumo do servidor (JSON)          |
| GET    | `/api/v1/system`        | Hostname                           |
| GET    | `/api/v1/users`         | Lista usuários do FileBrowser      |
| POST   | `/api/v1/users`         | Cria usuário (pasta + FileBrowser) |
| DELETE | `/api/v1/users/:nome`   | Remove usuário (`?folder=1`)       |

Detalhes em `api/README.md`.

## Usuários

Criar um usuário (pasta própria + FileBrowser + Gitea):

```bash
bash core/hs.sh user create maria --gitea
```

Via API:

```bash
curl -X POST http://192.168.1.10:8000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"username":"maria","gitea":true}'
```

Cada usuário ganha `/srv/storage/users/<nome>` e acesso restrito a ela no FileBrowser.

## Login (OIDC via Gitea)

O login OIDC da homepage será habilitado quando a versão do Homepage
suportar (hoje só na branch `dev`). A configuração já está pronta em
`modules/homepage/.env.example` e o aplicativo OAuth2 foi criado no Gitea.
Ao atualizar o Homepage, basta ativar `HOMEPAGE_AUTH_ENABLED=true`.

## Módulos

Os módulos ficam em `modules/` e são ativados via `config/services.conf`:

```bash
bash core/hs.sh service enable portainer
bash core/hs.sh service start portainer
```

## Documentação

- `docs/` — arquitetura, decisões e desenvolvimento
- `CHANGELOG.md` — histórico de versões

## Licença

Distribuído sob a [Apache License 2.0](LICENSE).
