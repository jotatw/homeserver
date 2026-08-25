# Primeiro Boot

> O que esperar depois da instalação e como validar que tudo está funcionando.

## 1. Valide o Health Check

```bash
cd ~/homeserver
bash scripts/health-check.sh
```

O resultado esperado é que os componentes essenciais apareçam como `PASS` e o resumo indique que o HomeServer está operacional.

Se algo falhar, consulte a seção [Solução de problemas](#solução-de-problemas).

## 2. Acesse pelo navegador

O endereço principal é:

```text
https://homeserver.local/
```

Se o nome local ainda não estiver disponível no seu dispositivo, use o endereço IP mostrado pelo instalador:

```text
https://<IP_DO_SERVIDOR>/
```

| Caminho | O que é |
|---|---|
| `/` | Homepage — portal principal |
| `/app` | HomeServer App — painel de administração |
| `/files/` | FileBrowser — gerenciamento de arquivos |
| `/git/` | Gitea — repositórios Git |

A API é destinada ao App e a integrações:

```text
/api/v1/*
```

> O Caddy fornece o acesso HTTPS local. Para evitar avisos de certificado, siga o guia de [`TLS local`](tls-local.md) no dispositivo que acessará o servidor.

## 3. Primeiro acesso ao App

O usuário principal é definido durante a instalação (o instalador pergunta nome e senha). Não é necessário usar o terminal.

Para administrar usuários, abra **App → Administração** (`/app`): lá é possível
criar e remover usuários, trocar senhas e gerenciar tokens de API.

O HomeServer App utiliza a API para autenticação e gerenciamento. O App não acessa o FileBrowser diretamente.

## 4. Verifique os serviços

Acompanhe e controle os serviços pela interface: **App → Sistema** mostra o estado geral, e **App → Administração** permite iniciar, parar e reiniciar cada serviço.

## 5. Operações comuns

Todas as operações abaixo são feitas pelo App, sem terminal:

| Operação | Onde no App |
|---|---|
| Criar / remover usuário | Administração → Usuários |
| Trocar senha | Administração → Usuários → Senha |
| Iniciar / parar / reiniciar serviço | Administração → Serviços |
| Verificar atualização do sistema | Administração → Atualização |
| Atualizar pacotes (apt) | Administração → Pacotes do sistema |
| Montar / ejetar dispositivos | Armazenamento |

A CLI `hs` permanece disponível para automação e diagnóstico avançado — veja [`cli.md`](../use/cli.md).

## 6. Atualizações

As atualizações do HomeServer e dos pacotes do sistema são verificadas e aplicadas pelo App (**Administração → Atualização** / **Pacotes do sistema**).

Antes de uma atualização importante, mantenha uma cópia do backup disponível.

## Solução de problemas

| Sintoma | O que fazer pelo App |
|---|---|
| Homepage não abre | Administração → Serviços: reinicie `homepage`; se persistir, reinicie `caddy` |
| API não responde | Administração → Serviços: reinicie a API (módulo `api`) |
| FileBrowser recusa login | Use o usuário e a senha definidos na instalação; troque em Administração → Usuários |
| Serviço em reinício contínuo | Administração → Módulos → Status mostra o último erro registrado |

Para diagnóstico avançado (logs de container, firewall), consulte [`cli.md`](../use/cli.md), [`INSTALLATION.md`](INSTALLATION.md) e [`FAQ.md`](../use/FAQ.md).
