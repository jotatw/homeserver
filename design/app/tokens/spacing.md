# Tokens — Espaçamento

> Herda `docs/design/spacing.md` (v1.4): escala múltiplos de 4px.
> Adiciona tokens de **layout** exigidos pelo App (alvos ≥48dp, sidebar, bottom nav — ref §2).

## Escala base

| Token | Valor | Uso |
|---|---|---|
| `--hs-space-1` | 0.25rem (4px) | Gap mínimo ícone↔texto |
| `--hs-space-2` | 0.5rem (8px) | Gap chips, padding pequeno |
| `--hs-space-3` | 0.75rem (12px) | Padding interno padrão de cards |
| `--hs-space-4` | 1rem (16px) | Padding de cards, gap de grids |
| `--hs-space-5` | 1.25rem (20px) | Gap entre seções relacionadas |
| `--hs-space-6` | 1.5rem (24px) | **Gap entre grupos** (v1.4) |
| `--hs-space-8` | 2rem (32px) | Margem antes de rodapé/telas |
| `--hs-space-10` | 2.5rem (40px) | Margem grande (v1.4) |
| `--hs-space-12` | 3rem (48px) | Alvo de toque / folgas de tela |

## Layout (metrics)

| Token | Valor | Uso |
|---|---|---|
| `--hs-touch` | 3rem (48px) | **Alvo mínimo de toque** (botões, tabs, itens) — ref §2 M3 |
| `--hs-touch-compact` | 2.5rem (40px) | Alvo secundário (chips, ícones de ação) |
| `--hs-sidebar-w` | 15rem (240px) | Sidebar desktop (ref §3 NN/g) |
| `--hs-sidebar-w-collapsed` | 3.75rem (60px) | Sidebar tablet colapsada |
| `--hs-bottomnav-h` | 3.5rem (56px) | Bottom nav mobile (ref §2) |
| `--hs-topbar-h` | 3.5rem (56px) | Top bar |
| `--hs-max-content` | 72rem (1152px) | Largura máxima de conteúdo (centraliza no desktop) |
| `--hs-gutter` | 1rem (16px) | Margem lateral padrão (móvel); desktop usa `--hs-space-6` |
| `--hs-card-gap` | 1rem (16px) | Gap do grid de cards (móvel 12px) |

## Grid responsivo

| Viewport | Colunas de cards | Gap |
|---|---|---|
| <480px (móvel) | 1-2 | 0.75rem |
| 480-768px (tablet) | 2-3 | 1rem |
| ≥1024px (desktop) | 4 | 1rem |
| ≥1440px (large) | 5 (max-content 72rem limita) | 1.25rem |

## Regras

- **Entre grupos**: `--hs-space-6` (separação de categorias — herança v1.4).
- **Dentro de cards**: `--hs-space-3` (compacto).
- Todo elemento clicável respeita `--hs-touch` (48dp) na área de toque, mesmo que visualmente menor (padding interno compensa).
- Bottom nav: itens com largura flexível, altura `--hs-bottomnav-h`.
- Não usar espaçamento "mágico" fora da escala (ex.: 13px proibido).
