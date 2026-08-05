# Fluxo 4 — Aplicações

> Tela: `../wireframes/apps.md` · API: `GET /services`, `GET /services/status` · Core: `hs service list`
> Refs: `../references.md` §1 (status no card, busca fuzzy), §3 (list virtualization)
> Este fluxo descreve como o App lista, filtra e abre os serviços.

## 1. Fontes de dados (reais, v1.5)

| Dado | Endpoint / comando | Payload real |
|---|---|---|
| Lista de serviços | `GET /api/v1/services` | `[{name, status}]` com `status: "running"` |
| Estado detalhado | `GET /api/v1/services/status` | idem (alias) |
| Serviços disponíveis (admin) | `hs service list` | `[ATIVO] caddy, filebrowser, gitea, homepage` · `[inativo] portainer` |
| Mapa serviço → URL | fonte estática no App (ver §2) | — |

> Os serviços reportados são os **containers gerenciados** (filebrowser, gitea, homepage, caddy, api).

## 2. Mapa serviço → URL (fonte única no App)

Derivado da v1.4 (`modules/homepage/config/services.yaml`):

| Serviço (container) | Título | URL (relativa ao host) | Ícone |
|---|---|---|---|
| `homepage` | Homepage | `/` | mdi-home |
| `api` | HomeServer App | `/app` | mdi-monitor-dashboard |
| `filebrowser` | FileBrowser | `/files/` | mdi-folder-open |
| `gitea` | Gitea | `/git/` | mdi-code-tags |
| `caddy` | Proxy | — (infra, sem UI) | mdi-shield |
| `portainer` | Portainer | — (inativo) | mdi-docker |

Regra: **desconhecido não quebra**. Se um container aparecer em `/services` sem entrada no mapa, o card aparece com nome cru + sem link (badge "sem link").

## 3. Fluxo de listagem

```
[rota /apps]
    │
    ├─ 1. GET /services  →  apps[] = [{name, status}]
    ├─ 2. enriquece cada app com o mapa (título, URL, ícone)
    ├─ 3. ordena: running primeiro, depois alfabético
    ├─ 4. renderiza cards (grid) OU lista (admin)
    └─ 5. falha → empty state + retry
```

## 4. Card de aplicação

```
┌──────────────────────────────┐
│ 🟢 Gitea            ●  Ativo │   <- status: cor + ponto + texto
│     git.usuario                │   <- host derivado da URL
│     [ Ações ▾ ]          →   │   <- abrir (nova aba) / ações
└──────────────────────────────┘
```

- **Clique no card / seta →** abre `https://<host><URL>` em nova aba (`target=_blank`).
- **Estado**: `running` → 🟢 Ativo · ausente do `/services` → 🔴 Offline.
- **Admin**: menu "Ações ▾" mostra [Iniciar/Parar/Reiniciar] **desabilitados com tooltip** — o endpoint não existe na v1.5 (G3); quando existir, habilita.

## 5. Busca e filtros

| Controle | Comportamento |
|---|---|
| Busca (ícone 🔍 ou tecla `/`) | Filtra por nome/título em tempo real (fuzzy, ref §1 Homer) |
| Chips de filtro | Todos · 🟢 Ativos · 🔴 Offline |
| Ordenação (desktop) | Ativos primeiro · Alfabética (toggle) |
| Empty state | "Nenhum app encontrado para '<termo>'" + botão limpar |

## 6. Comportamento por role

| Ação | user | admin |
|---|---|---|
| Abrir serviço | ✅ | ✅ |
| Ver status/health | ✅ | ✅ |
| Buscar/filtrar | ✅ | ✅ |
| Ver lista técnica (container, porta) | oculta | ✅ (data table) |
| Iniciar/parar/reiniciar | oculto | ❌ desabilitado (G3 — sem endpoint) |
| Instalar novo app | oculto | ❌ desabilitado (G4 — sem endpoint) |

## 7. Estados

| Estado | Comportamento |
|---|---|
| Carregando | Cards skeleton |
| `/services` falha | Empty state "Não foi possível listar serviços" + retry |
| App sumiu da lista | Card vira 🔴 Offline (mantém histórico com badge) |
| Offline PWA | Último estado cacheado + badge "cacheado" |
| 401/403 | Fluxo global (navigation.md §5) |

## 8. Checklist de validação

- [ ] Lista vem de `GET /services` + mapa estático (nunca hardcode de nome em dois lugares)
- [ ] Ordenação ativos primeiro; desconhecido não quebra (card cru)
- [ ] Card abre serviço em nova aba; estado nunca só por cor
- [ ] Busca fuzzy + chips de filtro funcionam sem recarregar
- [ ] Admin vê coluna técnica (container/porta); ações de start/stop desabilitadas com tooltip (G3)
- [ ] Empty state e falha com retry
