# Quick Start

> Instale o HomeServer em ~10 minutos. Não é necessário saber programar.

## O que você precisa

- Um computador com **Debian 12** instalado (pode ser um PC antigo).
- Acesso de **root** (usuário `root` ou `sudo`).
- Conexão com a internet (só durante a instalação).

## Passo a passo

### 1. Instale o Docker

```bash
curl -fsSL https://get.docker.com | sh
```

### 2. Baixe o HomeServer

```bash
git clone https://github.com/usuario/homeserver.git
cd homeserver
```

> Sem `git`? Instale: `apt install -y git`

### 3. Instale

```bash
sudo bash install.sh
```

O instalador é um **assistente**: ele detecta sua rede, pergunta o usuário
principal, gera as senhas e configura tudo. Responda as perguntas e aguarde.

### 4. Acesse

Ao final, o instalador mostra o endereço. Abra no navegador:

```
https://<IP_DO_SERVIDOR>/
```

- **Homepage**: portal com aplicações e atalhos
- **App** (`/app`): painel de administração

### 5. Verifique se está tudo certo

```bash
bash scripts/health-check.sh
```

Todos os itens devem aparecer como ✔.

---

## Precisa de ajuda?

- Guia detalhado de instalação: [`docs/INSTALLATION.md`](docs/INSTALLATION.md)
- Primeiro uso: [`docs/FIRST_BOOT.md`](docs/FIRST_BOOT.md)
- O que o HomeServer oferece: [`README.md`](README.md)

---

> **Critério de qualidade (v2.0)**: se você conseguiu instalar seguindo apenas
> este guia, sem consultar o código-fonte, o projeto está pronto. Essa é a
> definição oficial de "pronto para a v2.0".
