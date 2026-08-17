# Piloto — FileBrowser como primeiro módulo

> **Objetivo:** provar o ciclo do Module Core (M1) sobre um serviço real antes
> de generalizar. A escolha pelo FileBrowser é intencional: o serviço está em
> **fim de vida** ([`planning/security/filebrowser-eol.md`](../security/filebrowser-eol.md))
> e será substituído — o piloto valida exatamente a capacidade de trocar a
> **Implementation** sem alterar Definition/consumidores.
> Data: 2026-08-16

## O que o piloto demonstra

1. **Definition** declarada (`modules/filebrowser/module.json`): capacidades
   (`files.access`, `files.manage`), dependências (`storage.persistent`),
   recursos (config/database/storage), integração (`/files`), operações,
   implementation (`docker-compose`), health.
2. **Instance** registrada no Module Core (`/srv/config/modules/instances/`):
   desired state, bindings e metadados.
3. **Operações reais via Core**: `hs module op filebrowser <start|stop|restart|enable|disable|update|status>`
   — validadas contra a Definition, registradas no **journal**, com
   desired/observed em `state/`.
4. **Ciclo de vida completo** (instalar→habilitar→rodar→parar) delegando ao
   engine existente, sem reescrever o engine.

## Critérios de aceite

- [x] `hs module definitions` inclui `filebrowser` com capabilities corretas.
- [x] `hs module instance add filebrowser` cria instância persistida.
- [x] `hs module op filebrowser restart` executa e registra no journal.
- [x] `hs module status filebrowser` reflete observed após a operação.
- [x] Serviço continua saudável e `/files` respondendo após o ciclo.
- [ ] *Futuro:* substituição da implementation (novo serviço) sem alterar os
      consumidores (Core/API/App) — aceite final do piloto.

## Sequência executada (servidor)

```bash
hs module instance add filebrowser
hs module instances
hs module op filebrowser status
hs module op filebrowser restart
hs module status filebrowser
```

## Observação para a substituição

A troca do FileBrowser (EOL) deve seguir o plano de transição do
`planning/security/filebrowser-eol.md` (avaliar sucessor → novo adapter →
nova implementation → remover dependência). O piloto garante que a **fronteira
de capacidade de arquivos** já é administrada pelo Module Core — o que facilita
essa troca futura.