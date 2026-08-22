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

O usuário principal é definido durante a instalação. Não é necessário assumir um nome específico.

Para verificar os usuários existentes pelo CLI:

```bash
sudo bash core/hs.sh user list
```

Se precisar criar ou administrar um usuário:

```bash
sudo bash core/hs.sh user create <usuario> --password=<senha>
sudo bash core/hs.sh user is-admin <usuario>
```

O HomeServer App utiliza a API para autenticação e gerenciamento. O App não acessa o FileBrowser diretamente.

## 4. Verifique os serviços

```bash
sudo bash core/hs.sh system status
sudo bash core/hs.sh service list
```

Também é possível verificar os containers diretamente:

```bash
docker ps
```

## 5. Comandos úteis do CLI

```bash
sudo bash core/hs.sh version
sudo bash core/hs.sh system status
sudo bash core/hs.sh service list
sudo bash core/hs.sh user list
sudo bash core/hs.sh update check
```

Para aplicar uma atualização:

```bash
sudo bash core/hs.sh update apply
```

## 6. Atualizações

As atualizações devem ser avaliadas e aplicadas conforme o fluxo atualmente implementado e documentado pelo projeto. O comando `update check` verifica o estado de atualização disponível e `update apply` executa o fluxo suportado.

Antes de uma atualização importante, mantenha uma cópia do backup disponível.

## Solução de problemas

| Sintoma | Verificação inicial |
|---|---|
| Homepage não abre | `docker ps` e `docker logs caddy` |
| API não responde | `docker ps` e `docker logs api` |
| Acesso bloqueado | `sudo ufw status` e verifique a rede detectada durante a instalação |
| FileBrowser recusa login | Verifique o usuário e a senha configurados durante a instalação |
| `hs` não é encontrado | Use `sudo bash core/hs.sh ...` a partir do diretório do projeto |
| Serviço em reinício contínuo | `docker ps` e `docker logs <container>` |

Para um diagnóstico mais completo, consulte [`INSTALLATION.md`](INSTALLATION.md), [`FAQ.md`](../use/FAQ.md) e [`QUESTIONS.md`](../use/QUESTIONS.md).
