# Componentes — Cards

> `AppCard`, `StatCard`, `ActionCard`, `FeedItem` — superfícies clicáveis do App.
> Tokens: `../tokens/colors.md`, `spacing.md`, `radius.md`, `elevation.md`, `typography.md`.

## AppCard

Card de aplicação/serviço com status embutido. Usado em `apps.md` e `dashboard.md`.

```
┌───────────────────────────────────────┐
│  🟢 · Gitea                [⋯ Ações]  │  <- StatusDot + título + menu
│      git.jotatw                        │  <- host (meta)
│      [ container: gitea ]              │  <- admin vê código (mono)
│                       ──────→          │  <- ícone abrir
└───────────────────────────────────────┘
```

### Tokens
- Superfície: `--hs-surface`; hover: `--hs-surface-hover`.
- Raio: `--hs-radius-lg`; sombra: `--hs-shadow-sm` (hover → `--hs-shadow-md`).
- Padding: `--hs-space-3`; gap interno: `--hs-space-2`.
- Título: `--hs-card-name`; host: `--hs-meta` `--hs-text-muted`; caminho: `--hs-code`.

### Estados
| Estado | Comportamento |
|---|---|
| default | superfície, sombra sm, cursor pointer |
| hover | `--hs-surface-hover`, sombra md (ref §2 feedback) |
| focus-visible | anel `--hs-shadow-focus` |
| pressed | `--hs-surface-active` |
| running | `StatusDot` ok + título normal |
| down (ausente) | `StatusDot` danger + título `--hs-text-muted` + badge "offline" |
| disabled (sem link) | opacidade 0.6, sem pointer, badge "sem link" |

### Anatomia/roles
- Card inteiro é um `<button>`/`<a>` (abrir serviço em nova aba).
- Menu "⋯ Ações" é um `Menu` (overlays.md) — não aninha link dentro de link (a11y).

### A11y
- `aria-label` = "Abrir Gitea"; status anunciado no label (ex.: "Gitea, online").
- Teclado: Enter abre, menu por tecla de contexto ou Tab focado.

---

## StatCard

Métrica numérica com barra/indicador. Usado no dashboard (Home) e sistema.

```
┌──────────────┐   ┌──────────────┐
│ CPU    12%   │   │ MEM    54%   │
│ ▓░░░░░░░░░░  │   │ ▓▓▓▓░░░░░░  │
│ ──────────── │   │ 8/16 GB      │
└──────────────┘   └──────────────┘
```

### Tokens
- Superfície: `--hs-surface`; raio: `--hs-radius-lg`; sombra: `--hs-shadow-sm`.
- Título: `--hs-label` `--hs-text-muted`; valor: `--hs-heading` (destaque).
- Barra: preenchimento `--hs-color-ok|warn|danger` (faixas), trilho `--hs-surface-hover`.

### Faixas de cor (paridade com o fluxo sistema)
| Faixa | Preenchimento |
|---|---|
| < 60% | `--hs-color-ok` |
| 60-85% | `--hs-color-warn` |
| > 85% | `--hs-color-danger` |
| temp ≥ 80°C | `--hs-color-danger` |

### A11y
- `role="progressbar"` + `aria-valuenow/min/max`; texto "12%" sempre visível (cor não é a única forma).
- Clique → navega para `/system` (se aplicável).

---

## ActionCard

Atalho de ação (acesso rápido no dashboard: Arquivos, Atualizar, Relatório).

```
┌───────────────┐
│  📁 Arquivos  │
└───────────────┘
```

### Tokens
- Superfície: `--hs-primary-soft` (destaque v1.4); hover: `--hs-primary-soft` + anel.
- Raio: `--hs-radius-xl` (destaque); sombra: `--hs-shadow-md`.
- Ícone: 32px; texto: `--hs-card-name`; gap: `--hs-space-2`.

### Estados
- Mesmo padrão do AppCard; **hidden por role** quando a ação não se aplica (ex.: backup só admin).

---

## FeedItem

Linha do feed de atividades (Home). Leitura — não clicável (exceto se actionável).

```
💾 Backup concluído · há 2h
🔌 Dispositivo conectado · há 1d
```

### Tokens
- Ícone: 20px por tipo (backup 💾 · device 🔌 · system ⚙️ · power 🔋).
- Texto: `--hs-body`; tempo: `--hs-meta` `--hs-text-faint`.
- Tipo de linha com cor: só quando `danger`/`warn` (ex.: backup falhou → `--hs-color-danger`).

### A11y
- Lista com `<ul>`/`<li>`; itens com `time` semântico (`<time>`).

---

## Checklist por card

- [ ] Usa apenas tokens (sem hex/rem hardcoded)
- [ ] Hover/focus/pressed definidos; focus ring visível
- [ ] Status com cor + texto/ícone
- [ ] Ações por role (hidden vs visível)
