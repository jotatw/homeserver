# Homepage e HomeServer App

## Homepage

A **Homepage** é o portal rápido do HomeServer. Organiza as ações em quatro
grupos:

| Grupo | Objetivo |
|---|---|
| **Meu espaço** | Arquivos, projetos, downloads e mídia |
| **Aplicações** | Serviços disponíveis e seus estados |
| **Administração** | Gestão do HomeServer |
| **Sistema** | Diagnóstico e informações técnicas |

## HomeServer App

O **App** é a interface de gerenciamento da plataforma em `/app`. Possui
autenticação própria (sessões longas) e adapta a navegação pelo papel do
usuário:

- **Meu espaço** — status, atividades e dispositivos conectados.
- **Aplicações** — serviços com status e busca.
- **Armazenamento** — uso de disco, pastas e dispositivos (admin).
- **Sistema** — monitoramento, agenda de energia e temperatura (admin).
- **Administração** — usuários, tokens e atualização (admin).
- **Impressão** — fila e envio (admin).

O App é **PWA instalável** (adicionar à tela inicial). Após instalar a CA
local ([TLS local](../install/tls-local.md)), o acesso é totalmente sobre
HTTPS sem avisos.

## Acesso

```text
https://homeserver.local/
```

| Rota | Serviço |
|---|---|
| `/` | Homepage |
| `/app` | HomeServer App |
| `/files` | FileBrowser |
| `/git` | Gitea |
| `/api/v1` | API |

O IP da LAN (`https://<ip>`) também funciona (presente no certificado).

> **Autonomia local:** o HomeServer é utilizável dentro da rede local sem
> depender de serviços na nuvem.