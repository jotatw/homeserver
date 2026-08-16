# HomeServer v1.0 — Notas da Release

> Notas voltadas ao **usuário** (não técnicas). Detalhes técnicos: `CHANGELOG.md`.

## O que é esta versão

A **v1.0.0** é a primeira release estável da linha atual do HomeServer: uma
plataforma local para dar vida nova a um computador comum como servidor
doméstico — simples de instalar, organizar e manter.

## O que mudou nesta preparação

- **Acesso HTTPS sem "página não segura"**: uma CA interna gera os
  certificados de `https://homeserver.local` e `https://<ip>`. Depois de
  instalar a CA uma vez por dispositivo (guia `docs/install/tls-local.md`),
  os navegadores param de bloquear as páginas.
- **Atualização dos pacotes do sistema**: agora dá para verificar e atualizar
  os pacotes (apt) pelo App (Administração → Atualização) ou pelo terminal
  (`hs update os check|apply`).
- **Dependências auditadas e versões fixadas**: nada de "latest" por acaso —
  FileBrowser, Gitea e Homepage em versões específicas e validadas.
- **Documentação organizada por objetivo**: instalar, usar, contribuir e
  referência técnica — tudo com um índice em `docs/README.md`.

## Como atualizar

```bash
bash core/hs.sh update check
bash core/hs.sh update apply
```

## Problemas conhecidos

- O **FileBrowser** entrou em **fim de vida** (EOL em 2026-09-01). Está pinado
  na última versão; um sucessor será avaliado em fases futuras
  (`planning/security/filebrowser-eol.md`).
- O kernel atualizado entra em vigor no próximo reinício real (o desligamento
  noturno é suspensão, não reinicialização).