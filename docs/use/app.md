# Homepage e HomeServer App

## Homepage

A **Homepage** é o portal rápido do HomeServer. Ela funciona como ponto central para abrir os serviços disponíveis e visualizar seus estados.

As áreas apresentadas podem incluir:

| Área | Objetivo |
|---|---|
| **Meu espaço** | Acesso rápido a arquivos, projetos, downloads e mídia quando os serviços correspondentes estiverem disponíveis |
| **Aplicações** | Serviços instalados e seus estados |
| **Administração** | Atalhos para funções administrativas disponíveis ao usuário autorizado |
| **Sistema** | Diagnóstico e informações técnicas expostas pelos serviços configurados |

A Homepage não substitui o App nem define sozinha as permissões administrativas.

## HomeServer App

O **App**, disponível em `/app`, é a interface de gerenciamento do HomeServer. A disponibilidade das telas e operações depende da implementação ativa, das permissões do usuário e das capacidades dos módulos instalados.

As áreas atuais podem incluir:

- **Meu espaço** — informações, atividades e dispositivos quando suportados.
- **Aplicações** — serviços, status e operações expostas pelo App.
- **Armazenamento** — informações de disco, pastas e dispositivos para usuários autorizados.
- **Sistema** — monitoramento e controles de energia ou hardware quando disponíveis.
- **Administração** — usuários, tokens, atualizações e outras operações administrativas implementadas.
- **Impressão** — status, fila e operações de impressão conforme a capacidade disponível.

O App utiliza autenticação e autorização próprias através da API. Ele não deve acessar diretamente os dados ou APIs internas de cada serviço fora dos contratos definidos pelo HomeServer.

## PWA e HTTPS local

O App possui base para instalação como PWA. O comportamento offline e outras capacidades dependem da implementação ativa e não devem ser presumidos como suporte completo.

O acesso local utiliza HTTPS. Após instalar a CA local conforme o guia de [TLS local](../install/tls-local.md), dispositivos confiáveis da rede podem acessar o HomeServer sem avisos de certificado.

## Acesso

```text
https://homeserver.local/
```

Se necessário, o IP local do servidor também pode ser utilizado quando estiver coberto pelo certificado configurado.

| Rota | Serviço |
|---|---|
| `/` | Homepage |
| `/app` | HomeServer App |
| `/files/` | FileBrowser, quando instalado |
| `/git/` | Gitea, quando instalado |
| `/api/v1/` | API do HomeServer |

As rotas disponíveis dependem dos módulos e serviços ativos.

> **Autonomia local:** o HomeServer foi planejado para permanecer utilizável dentro da rede local sem depender de serviços externos para suas funções locais essenciais.
