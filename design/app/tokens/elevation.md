# Tokens — Elevação (Sombras)

> Hierarquia por elevação (dark mode favorece borda + sombra sutil; light mode usa sombra mais forte).
> Refs: `../references.md` §2 (elevation por tokens, dark mode).

## Escala (dark)

| Token | Sombra | Uso |
|---|---|---|
| `--hs-shadow-none` | `none` | Cards técnicos (Sistema) |
| `--hs-shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Cards padrão, chips |
| `--hs-shadow-md` | `0 2px 8px rgba(0,0,0,0.35)` | Cards de destaque (Meu espaço) |
| `--hs-shadow-lg` | `0 8px 24px rgba(0,0,0,0.45)` | Dialog, sheet, popover |
| `--hs-shadow-focus` | `0 0 0 3px var(--hs-primary-focus)` | Focus ring (outline, não sombra de caixa) |

## Escala (light)

| Token | Sombra | Uso |
|---|---|---|
| `--hs-shadow-none` | `none` | idem |
| `--hs-shadow-sm` | `0 1px 3px rgba(15,23,42,0.10)` | Cards padrão |
| `--hs-shadow-md` | `0 4px 12px rgba(15,23,42,0.12)` | Cards de destaque |
| `--hs-shadow-lg` | `0 10px 30px rgba(15,23,42,0.18)` | Dialog, sheet |

## Regras

- **Dark mode**: preferir borda (`--hs-border`) + sombra sutil; luz forte derruba a estética.
- **Light mode**: sombra mais presente (sem borda pesada).
- Overlay de dialog: `--hs-overlay` (tokens de cor) — não é sombra.
- Focus: sempre `--hs-shadow-focus` (anel visível, a11y — ref §2) e **nunca** remover sem alternativa.
- Elevação nunca "flutua" elemento que não é interativo.
