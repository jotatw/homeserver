# Componentes — Status

> `StatusDot`, `StatusBadge`, `StatusBanner` — a família de status **sempre comunica por cor + ícone + texto** (ref §3).
> Tokens: `../tokens/colors.md` (`--hs-color-*`, `--hs-color-*-soft`).

## StatusDot

Dot circular pequeno que marca estado em cards/listas.

```
       ●                     🟢 🟡 🔴
       ●
```

### Tokens
- Forma: círculo 8px (`--hs-radius-full`).
- Cor de fundo: `--hs-color-ok` | `--hs-color-warn` | `--hs-color-danger` | `--hs-text-faint` (unknown).
- Acessório opcional: pulse animado (slow, 1.5s loop) só em `warn`/`danger` (alerta).

### Estados
| Estado | Cor | Pulse |
|---|---|---|
| ok | `--hs-color-ok` | não |
| warn | `--hs-color-warn` | sim |
| danger | `--hs-color-danger` | sim |
| unknown (sem dado) | `--hs-text-faint` | não |

### A11y
- `aria-label` com texto ("Online", "Atenção", "Indisponível") — cor **nunca** é a única forma de comunicação.

### Usos
- Cards de aplicação (`apps.md`).
- Lista de checks (`flows/system.md` §4).
- Itens da sidebar/bottom nav não tem dot (são navegação, não estado).

---

## StatusBadge

Pequeno rótulo com fundo colorido + ícone + texto. Complementa o dot em listas.

```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ 🟢  Ativo      │  │ 🟡  Atenção    │  │ 🔴  Offline    │
└────────────────┘  └────────────────┘  └────────────────┘
   bg: ok-soft       bg: warn-soft        bg: danger-soft
   fg: ok            fg: warn             fg: danger
```

### Tokens
- Fundo: `--hs-color-*-soft` (translúcido, garante contraste com a `surface`).
- Texto: `--hs-color-*` (cor cheia) + `--hs-text-inverse` se sobre fundo cheio (não usar soft nesse caso).
- Padding: `--hs-space-1 --hs-space-2`; raio: `--hs-radius-full`; tipografia: `--hs-meta` (0.75rem).

### Variantes
| Variante | Fundo | Texto |
|---|---|---|
| ok | `--hs-color-ok-soft` | `--hs-color-ok` |
| warn | `--hs-color-warn-soft` | `--hs-color-warn` |
| danger | `--hs-color-danger-soft` | `--hs-color-danger` |
| info | `--hs-color-info-soft` | `--hs-color-info` |
| neutral | `--hs-surface-hover` | `--hs-text-muted` |

### A11y
- Texto sempre presente (cor nunca é a única forma).
- Não interativo: `role="status"` quando usado para anunciar uma mudança discreta.

### Usos
- "ADMIN ⭐" no avatar do top bar.
- Badge "cacheado" em dados offline.
- Tag "sem link" para apps desconhecidos.

---

## StatusBanner

Faixa horizontal no topo de uma tela mostrando estado global.

```
┌──────────────────────────────────────────────────────┐
│ 🟢 Servidor OK · 5 apps em execução                  │  ← banner Home
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ ⚠ Servidor em modo de economia · dados de 07:01      │  ← banner sleep
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ ⚠ Sem conexão · dados de <hora>                       │  ← banner offline
└──────────────────────────────────────────────────────┘
```

### Tokens
- Fundo: `--hs-color-*-soft` correspondente; texto: `--hs-color-*` (ou `--hs-text` para neutro).
- Padding: `--hs-space-3 --hs-space-4`; raio: `--hs-radius-md`; tipografia: `--hs-meta` (peso 600).

### Variantes (do `flows/dashboard.md` §4)
- `ok`: todos os serviços running.
- `warn`: alguns serviços com problema (clica → `/apps`).
- `danger`: nenhum serviço reportando.
- `info`: info neutra (sleep, offline, atualização pendente).
- `offline`: dados cacheados.

### A11y
- `role="status"` ou `role="alert"` (este último só se requer ação imediata).
- Ícone + texto sempre; cor nunca sozinha.

### Usos
- Topo da Home (`flows/dashboard.md`).
- Topo de qualquer tela quando há info global (modo sleep, offline).
