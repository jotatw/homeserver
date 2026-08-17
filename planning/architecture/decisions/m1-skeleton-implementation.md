# M1 — Skeleton de Implementação (Module Core)

## Status

**Proposta aceita** (2026-08-16) como ponto de partida da implementação da
arquitetura modular. Complementa a [M1 consolidada](m1-foundation.md) e decide
pontos que a M1 deixou como pendências/ad iados.

A M1 continua sendo a referência conceitual; este documento registra as
**escolhas concretas mínimas** sem alterar os princípios da M1.

## Decisões

### D1 — M1-P01 · Localização do Module Core

- **Código (Core):** `core/infrastructure/modules.sh` (bash, prefixo `module_*`),
  na camada Infrastructure existente — sem nova camada física nesta etapa.
- **Catálogo de Definitions:** arquivos `modules/<id>/module.json` (versionados
  no repo; fonte declarativa).
- **Runtime (estado/instâncias):** `/srv/config/modules/` no host:
  `instances/`, `state/`, `journal/`, `definitions/` (snapshot do catálogo).

### D2 — Formato e identidade (adiado na M1 → escolhido)

- **Formato da Definition:** JSON (`module.json`), `contractVersion: 1`.
- **ID de módulo:** slug do diretório (`modules/<id>`), regex
  `[a-z0-9][a-z0-9-]*` (ex.: `caddy`, `filebrowser`, `gitea`, `homepage`, `portainer`).
- **ID de instância:** nome escolhido no registro, mesma regex (default: o ID).

### D3 — Schema mínimo da Definition (contractVersion 1)

```jsonc
{
  "id": "gitea",
  "contractVersion": 1,
  "version": "1.27.0",
  "title": "Gitea",
  "description": "…",
  "classification": "service",            // core|service|capability|automation
  "capabilities": ["git.hosting"],         // o que oferece (sem tecnologia)
  "dependencies": ["storage.persistent"],  // capacidades exigidas
  "resources": [ {"kind": "volume", "ref": "data", "path": "/srv/services/gitea"} ],
  "integrations": [ {"kind": "route", "path": "/git"} ],
  "operations": ["start","stop","restart","enable","disable","update","status"],
  "implementation": {
    "engine": "docker-compose",            // mecanismo de execução
    "path": "compose.yaml",
    "compatible": ["hs>=1.0.0"]
  },
  "health": {"kind":"http","port":3001,"path":"/"}
}
```

Regras (da M1, preservadas):
- Definition é **declarativa** e não depende de Instances.
- `capabilities`/`dependencies` são tokens de capacidade (ex. `storage.persistent`),
  não nomes de tecnologia.
- `operations` são as permitidas; o Core valida antes de executar.

### D4 — M1-P02 · Persistência mínima

| Caminho | Conteúdo |
|---|---|
| `modules/<id>/module.json` | Definition (repo) |
| `/srv/config/modules/definitions/` | snapshot do catálogo (id → arquivo) |
| `/srv/config/modules/instances/` | instâncias: id, definition ref, desired, config, bindings |
| `/srv/config/modules/state/` | observed state (snapshots por instância) |
| `/srv/config/modules/journal/` | Operation Journal (append-only) |

Acesso via runner nsenter (o container da API monta o host em `/host:ro`);
o CLI roda com `sudo` quando não-root (padrão `power`/`devices`).

### D5 — Operações iniciais

- `hs module definitions` · `hs module info <id>` · `hs module status <id>`.
- `hs module op <id> <op>` para `start|stop|restart|enable|disable|update` —
  inicialmente **delegando ao engine existente** (`service.sh`/`compose`),
  sem reimplementar; o Core valida contra `operations` da Definition, atualiza
  `desired`/`observed` e **registra no journal**.
- `status` → observed state (`get_service_status_json` por instância).

### D6 — Não mudado agora (permanece adiado)

Endpoints de API dedicados ao módulo, UI no App, migrações/versionamento por
dimensão, concorrência/lock, reconciliação automática — entram nas próximas
fases. O skeleton deve permitir adicioná-los sem quebrar o contrato.

## Próximos passos deste skeleton

1. Implementar `core/infrastructure/modules.sh` + comando `hs module`.
2. Criar `module.json` para os módulos atuais (caddy, filebrowser, gitea,
   homepage, portainer) a partir do [levantamento de serviços](../../review/levantamento-servicos.md).
3. Registrar piloto (candidato: **caddy** por menor superfície, ou **filebrowser**
   por EOL forçar a fronteira) como primeira instância.
4. Validar operações+journal no servidor.

> Fonte de verdade: este documento complementa, **não substitui**, a decisão M1
> consolidada. Qualquer divergência exige revisão arquitetural.