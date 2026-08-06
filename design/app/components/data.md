# Componentes — Dados

> `DataTable`, `FilterChip`, `SearchField`, `SegmentedControl` — apresentação e filtro de dados (ref §2: TOAST UI Grid / shadcn Data Table).
> Tokens: `../tokens/typography.md`, `colors.md`, `spacing.md`.

## DataTable

Tabela para listas técnicas (users, apps-admin, devices, tokens).

```
┌──────────────────────────────────────────────┐
│ Nome      Role      Criado         Status  ⋯ │  <- header (label)
│ usuario      ADMIN     05/08/2026     Ativo   ⋯ │
│ convidado padrão    05/08/2026     Ativo   ⋯ │
└──────────────────────────────────────────────┘
```

### Tokens
- Header: `--hs-label` `--hs-text-muted`, fundo `--hs-surface-hover`.
- Linha: `--hs-body`; separador: `--hs-border`; hover da linha: `--hs-surface-hover`.
- Célula código/path: `--hs-code` (mono); datas: `--hs-meta`.
- Padding: `--hs-space-2 --hs-space-3`; raio: `--hs-radius-md`.

### Estados
| Estado | Comportamento |
|---|---|
| default | linhas com separador sutil |
| hover linha | `--hs-surface-hover` |
| selecionado | `--hs-primary-soft` + check |
| empty | EmptyState (feedback.md) |

### A11y
- `<table>` semântico com `<th scope="col">`; ordenação por `<button>` no header com `aria-sort`.
- Virtualização obrigatória para listas longas (ref §3 Patterns.dev).

---

## FilterChip

Filtro de status (Todos · Ativos · Offline) — seleção única.

```
[ Todos ]  [ 🟢 Ativos ]  [ 🔴 Offline ]
```

### Tokens
- Default: `--hs-surface`, borda `--hs-border`, texto `--hs-text-muted`.
- Ativo: `--hs-primary-soft` + texto `--hs-primary` + anel `--hs-primary-focus`.
- Raio: `--hs-radius-full`; padding: `--hs-space-2 --hs-space-3`; altura ≥ `--hs-touch-compact`.

### A11y
- Grupo com `role="radiogroup"` (seleção única); cada chip `aria-checked`.

---

## SearchField

Campo de busca (apps, users). Disparado por ícone 🔍 ou tecla `/`.

```
┌──────────────────────────────────┐
│ 🔍  Buscar app…            ⌫    │
└──────────────────────────────────┘
```

### Tokens
- Input: `--hs-input`; fundo `--hs-surface`; borda `--hs-border`; focus: borda `--hs-border-strong` + anel `--hs-shadow-focus`.
- Raio: `--hs-radius-md`; altura: `--hs-touch`.

### Comportamento
- Busca **fuzzy** no client (lista pequena) com debounce 150ms (ref §1 Homer).
- Clear (⌫) visível quando há texto; Esc limpa.
- `role="searchbox"` + label visível; atalho `/` foca o campo.

---

## SegmentedControl

Alternância de seções dentro de uma tela (admin: Usuários/Tokens/Config).

```
[ Usuários ] [ Tokens ] [ Config ]
```

### Tokens
- Container: `--hs-surface-hover` (trilho); segmento ativo: `--hs-surface` + sombra sm + texto `--hs-text`.
- Inativo: `--hs-text-muted`; altura: `--hs-touch-compact`.

### A11y
- `role="tablist"` + `aria-selected`; navegação por setas esquerda/direita.
