# Instalação

> Documento operacional de instalação. Para a versão rápida, veja [`QUICKSTART.md`](QUICKSTART.md).

## Pré-requisitos

| Requisito | Mínimo | Observação |
|---|---|---|
| Sistema | **Debian 12** (bookworm) | Base atualmente documentada e validada |
| Hardware | x86_64, 2+ GB RAM | Testado em Pentium T4500, 3 GB |
| Acesso | root (`sudo`) | O instalador exige root |
| Internet | sim | Apenas durante a instalação |
| Git | opcional | Necessário para `git clone` |

## O que o instalador faz

`install.sh` é um assistente que executa, nesta ordem:

1. **Detecta** o sistema operacional, a rede local e o usuário principal.
2. **Instala** o Docker se não estiver presente.
3. **Cria** a estrutura `/srv` (storage, backup, scripts).
4. **Gera** o `api/.env` (senha do FileBrowser + token de serviço).
5. **Implanta** os módulos ativos (`config/services.conf`):
   `files`, `gitea`, `homepage`, `caddy` (padrão).
6. **Implanta** a API (`api/compose.yaml`).
7. **Inicializa** o Core (`core/hs.sh`).
8. **Configura** firewall (UFW), backup (diário 03h) e agenda de energia
   (desliga 22h / liga 07h) conforme as opções confirmadas durante a instalação.
9. **Executa** o Health Check e mostra o resumo final.

## Instalando

```bash
# 1. Baixe
git clone https://github.com/jotatw/homeserver.git
cd homeserver

# 2. Instale
sudo bash install.sh
```

### Flags

| Flag | Efeito |
|---|---|
| `--modules=files,gitea` | Implanta só os módulos listados |
| `--assume-yes` | Responde "sim" a todas as perguntas |
| `--non-interactive` | Sem perguntas — usa valores detectados e senhas geradas |
| `--dry-run` | Mostra o que seria feito sem executar deploys |
| `--help` | Ajuda |

Exemplos:

```bash
# Instalação sem intervenção (CI/automação)
sudo bash install.sh --non-interactive

# Apenas homepage e api
sudo bash install.sh --modules=homepage,api
```

> Em `--non-interactive`, a senha do FileBrowser é gerada e exibida no resumo final. Guarde-a.

## O que é criado

| Caminho | Conteúdo |
|---|---|
| `/srv/docker/compose/<módulo>` | Compose de cada serviço implantado |
| `/srv/storage/` | Dados (`users`, `shared`, `media`, `documents`, `devices`) |
| `/srv/backup/daily/` | Backups |
| `/srv/scripts/` | Scripts de automação (backup, power-schedule) |
| `api/.env` | Configuração da API (não versionado) |

## Problemas comuns

### "Docker não encontrado"

O instalador oferece instalar o Docker. Se recusou, instale manualmente:

```bash
curl -fsSL https://get.docker.com | sh
sudo bash install.sh
```

### Portas ocupadas

Os serviços usam: `3000` (homepage), `3001` (gitea), `8080` (files),
`8000` (api), `2222` (gitea ssh). Verifique se estão livres antes de instalar.

### Rede diferente de `192.168.x.0/24`

O instalador detecta a rede automaticamente via `ip route`. Nenhum ajuste manual é necessário. Se algo não ficar acessível, veja [`FIRST_BOOT.md`](FIRST_BOOT.md).
