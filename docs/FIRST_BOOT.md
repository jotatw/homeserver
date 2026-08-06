# Primeiro Boot

> O que esperar depois da instalação e como validar que tudo está funcionando.

## 1. Valide o Health Check

```bash
cd ~/homeserver
bash scripts/health-check.sh
```

Esperado — todos os itens com ✔:

```
== HomeServer Health Check ==
  ✔ docker
  ✔ docker daemon
  ✔ homepage       http://localhost:3000/
  ✔ api            http://localhost:8000/api/v1/version
  ✔ filebrowser    http://localhost:8080/
  ✔ gitea          http://localhost:3001/
  ✔ hs version     v1.5.0

== Resumo ==
  PASS : 7
  FAIL : 0

  HomeServer operacional.
```

Se algo falhar, vá para a seção [Solução de problemas](#soluções-de-problemas).

## 2. Acesse pelo navegador

Abra `https://<IP_DO_SERVIDOR>/` (use o IP mostrado na instalação).

| URL | O que é |
|---|---|
| `/` | Homepage — portal com aplicações e atalhos |
| `/app` | HomeServer App — painel de administração (login) |
| `/files/` | FileBrowser — seus arquivos |
| `/git/` | Gitea — seus repositórios |
| `/api/v1/status` | API (resposta JSON `{ok:true,...}`) |

> O navegador pode mostrar aviso de certificado auto-assinado. É esperado em
> rede local; prossiga normalmente.

## 3. Primeiras configurações

### Criar o usuário administrador do App

```bash
cd ~/homeserver
sudo bash core/hs.sh user create joao --password=SuaSenha
sudo bash core/hs.sh user is-admin joao   # deve retornar 0
```

> Use o mesmo nome de usuário que você informou na instalação (padrão: `joao`).

### Configurar o FileBrowser

As credenciais do FileBrowser foram definidas na instalação
(prompt ou geradas em `--non-interactive`). No primeiro acesso a `/files/`,
use esse usuário/senha.

## 4. Comandos úteis do CLI

```bash
sudo bash core/hs.sh version          # versão atual
sudo bash core/hs.sh system status    # status do servidor
sudo bash core/hs.sh service list     # serviços e estados
sudo bash core/hs.sh user list        # usuários
sudo bash core/hs.sh update check     # há atualização?
sudo bash core/hs.sh update apply     # aplica atualização
```

## 5. Atualizações

O HomeServer é atualizado por releases:

```bash
sudo bash core/hs.sh update check
sudo bash core/hs.sh update apply
```

O `update apply` faz backup do estado atual, puxa o código da release mais
recente e reimplanta. O servidor acompanha a branch `main`.

## Soluções de problemas

| Sintoma | Causa provável | Solução |
|---|---|---|
| Homepage não abre | Caddy/porta 3000 parado | `docker ps` · `docker compose -f /srv/docker/compose/caddy/compose.yaml up -d` |
| API não responde | `api/.env` ausente ou build falhou | `cd api && docker compose up -d --build` |
| Acesso bloqueado | Firewall com rede errada | `sudo ufw status` · verifique se a rede detectada confere |
| FileBrowser recusa login | Senha errada | Reconfigure via `hs user` ou instale novamente |
| `hs: command not found` | Core não inicializado | `sudo bash core/hs.sh version` (use o caminho completo) |
