# HomeServer v2.0 — Notas da Release

> Notas voltadas ao **usuário** (não técnicas). Para detalhes técnicos, ver CHANGELOG.md.

## O que é o HomeServer v2.0

A v2.0 transforma o HomeServer em uma **plataforma com identidade própria**:
um App unificado (web, instalável) para acompanhar e administrar seu
servidor a partir de qualquer dispositivo da rede.

## O que mudou para você

- **HomeServer App** — um painel único em `/app`:
  - **Meu espaço**: visão geral do servidor (CPU, memória, disco) com
    atividades recentes.
  - **Aplicações**: seus serviços com status, busca e filtros.
  - **Armazenamento**: uso de disco, pastas e dispositivos conectados.
  - **Sistema**: monitoramento, agenda de energia e temperatura.
  - **Administração** (admin): usuários e tokens de API.
- **Sessão longa**: você fica conectado por até 30 dias de uso contínuo —
  sem precisar logar toda hora.
- **PWA instalável**: adicione o App à tela inicial do celular ou do desktop.
- **Tokens de API**: integrações externas com tokens próprios (revogáveis).
- **Dispositivos**: monte, desmonte e ejete dispositivos pelo App (admin).

## O que continua igual

- Homepage como portal de entrada.
- FileBrowser, Gitea e demais serviços como antes.

## Antes de instalar

- Debian 12 recomendado.
- Conectividade com `registry.npmjs.org` (para o build da API).

## Instalação

Siga o `QUICKSTART.md` (~10 min). Upgrade a partir da v1.5:

```bash
bash core/hs.sh update check
bash core/hs.sh update apply
```

## Problemas conhecidos

Veja "Known Issues" no CHANGELOG.md.
