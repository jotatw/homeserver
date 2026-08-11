# Quick Start

> Instale o HomeServer em aproximadamente 10 minutos. Não é necessário saber programar.

## O que você precisa

- Um computador com **Debian 12** instalado.
- Acesso de **root** ou um usuário com `sudo`.
- Conexão com a internet durante a instalação.
- Uma máquina na mesma rede local para acessar o HomeServer.

Antes de começar, consulte [`QUESTIONS.md`](QUESTIONS.md) se quiser entender os requisitos e as dúvidas mais comuns.

## Passo a passo

### 1. Baixe o HomeServer

```bash
git clone https://github.com/usuario/homeserver.git
cd homeserver
```

> Se o `git` não estiver instalado, instale-o com `apt install -y git`.

### 2. Instale

```bash
sudo bash install.sh
```

O instalador funciona como um assistente. Ele verifica o sistema, instala o Docker quando necessário, detecta a rede, pergunta o usuário principal, gera as configurações e implanta os serviços.

Responda às perguntas apresentadas e aguarde o Health Check final.

### 3. Acesse

Ao terminar, o instalador mostra o endereço de acesso.

Abra no navegador:

```text
https://homeserver.local/
```

Se o nome local ainda não estiver disponível no seu dispositivo, use o endereço IP mostrado pelo instalador:

```text
https://<IP_DO_SERVIDOR>/
```

### 4. Primeiro acesso

- **Homepage**: portal principal para acessar os serviços.
- **App** (`/app`): interface do HomeServer para administração e gerenciamento.

Siga também o guia de [Primeiro Boot](docs/FIRST_BOOT.md) para conhecer o ambiente inicial.

### 5. Verifique a instalação

O instalador executa um Health Check automaticamente. Para executar novamente:

```bash
bash scripts/health-check.sh
```

Os componentes principais devem aparecer como saudáveis.

## Próximos passos

- [Perguntas](QUESTIONS.md)
- [Instalação detalhada](docs/INSTALLATION.md)
- [Primeiro Boot](docs/FIRST_BOOT.md)
- [FAQ detalhado](docs/FAQ.md)
- [README](README.md)

> **Critério de qualidade da v2.0:** uma pessoa nova deve conseguir instalar e utilizar o HomeServer seguindo apenas a documentação oficial, sem precisar consultar o código-fonte.
