# Tokens — Movimento

> Transições curtas e funcionais. Respeitar `prefers-reduced-motion` (ref §3).
> Refs: `../references.md` §2 (M3 motion orientado por tokens); §3 (a11y, redução de movimento).

## Duração

| Token | Valor | Uso |
|---|---|---|
| `--hs-motion-instant` | 0ms | Troca de estado sem animação (mudanças discretas) |
| `--hs-motion-fast` | 120ms | Hover, focus, pressed (micro-interações) |
| `--hs-motion-base` | 200ms | Aparecer/desaparecer de toasts, badges, skeletons fade |
| `--hs-motion-slow` | 300ms | Dialog/sheet/menu (entrada), navegação entre telas |
| `--hs-motion-slower` | 400ms | Transições de tela maiores, alertas persistentes |

## Easing

| Token | Valor | Uso |
|---|---|---|
| `--hs-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Entradas/saídas padrão |
| `--hs-ease-emphasized` | `cubic-bezier(0.3, 0, 0, 1)` | Dialog/sheet (M3 emphasized) |
| `--hs-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Feedback de pressão (opcional) |

## Regras

- **Hover/focus/pressed**: `fast` (120ms) — imediatos.
- **Dialog/sheet**: `slow` (300ms) com `--hs-ease-emphasized`; backdrop fade `base`.
- **Toast**: entra `slow`, sai `fast` (saída rápida, não demora).
- **Reduced motion**: se `prefers-reduced-motion: reduce` → usar `instant` para entrada/saída (sem slide), manter fade mínimo de 120ms no máximo.
- Movimento é **funcional** (orienta mudança), nunca decorativo (princípio do v1.4).
- Spinner/loading: contínuo mas leve (3s loop de skeleton shimmer, respeitando reduce).
