# Architecture Freeze

> Documento oficial do HomeServer.
> Marcado após a v1.5 (Stabilization).

A arquitetura principal do HomeServer é considerada **estável**.

## Regras

- Mudanças estruturais exigem **ADR** (`docs/architecture/adr/`).
- Novas funcionalidades devem reutilizar Foundation, Infrastructure,
  Adapters e API existentes.
- Exceções só podem ocorrer quando houver uma **justificativa arquitetural
  documentada** (ADR).

## Camadas congeladas

```text
Homepage / App
      │
     API
      │
  Adapters  ──  FileBrowser, Gitea
      │
Infrastructure  ── storage, users, devices, hardware, backup, scheduler, power
      │
  Foundation  ── hs_fs_*, hs_cfg_*, hs_val_*, hs_out_*, hs_const_*, hs_registry_*
```

## Nomenclatura congelada

- **Foundation**: `hs_*` (`hs_fs_*`, `hs_cfg_*`, ...).
- **Infrastructure**: prefixo do módulo (`storage_*`, `users_*`, ...).
- **Adapters**: `filebrowser_*`.
- **CLI**: `hs <comando> <subcomando>`.

## API congelada

- Respostas `{"ok":true,"data":{}}` ou `{"ok":false,"error":"..."}`.
- Pipeline `Request → Validação → Service → Resposta`.

---

Qualquer desvio destas regras só é aceito com ADR aprovado.
