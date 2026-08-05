# ADR-0004 — Nomenclatura por camada

- **Status**: Aceito
- **Data**: 2026-08-05 (v1.5.0)
- **Decisão**: Prefixos de função por camada, comunicando responsabilidade.

## Contexto

A base cresceu rápido e misturava padrões de nomenclatura:
`hs_*`, `modulo_*` e funções órfãs sem prefixo (ex.: `copy_file`, `create_directory`).

## Decisão

| Camada | Prefixo | Exemplos |
|--------|---------|----------|
| Foundation | `hs_*` | `hs_fs_*`, `hs_cfg_*`, `hs_val_*`, `hs_out_*`, `hs_const_*`, `hs_registry_*` |
| Infrastructure | prefixo do módulo | `storage_*`, `users_*`, `devices_*`, `hardware_*`, `backup_*`, `scheduler_*`, `power_*`, `compose_*`, `service_*` |
| Adapters | `filebrowser_*` | `filebrowser_login`, `filebrowser_create_user` |
| CLI | `hs <comando> <subcomando>` | `hs user create`, `hs system status` |

Funções órfãs sem prefixo foram migradas para `hs_fs_*` (Foundation).

## Consequências

- Positivas: leitura imediata da responsabilidade de cada função; arquitetura
  comunicada no nome.
- Negativas: renomeação exige atualização de consumidores (feita na v1.5);
  convenção deve ser mantida (CONTRIBUTING).

## Alternativas consideradas

- Unificar tudo para `hs_*`: rejeitado (perderia a identidade por módulo).
