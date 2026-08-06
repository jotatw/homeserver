# Componentes — HomeServer App (v2.0)

> Especificação dos componentes citados nos wireframes e fluxos.
> Todo componente usa **apenas** os tokens de `../tokens/` (proibido valor hardcoded).
> Refs: `../references.md` §2 (shadcn/Radix/M3/Flowbite), §3 (a11y WCAG).

## Princípios

1. **Base acessível**: overlays/menus baseados em Radix ou equivalente (focus trap, teclado, ARIA) — ref §2.
2. **Estado nunca só cor**: cor + ícone + texto (ref §3).
3. **Alvos de toque ≥48dp** (`--hs-touch`).
4. **Um componente = um arquivo de spec**; variações como estados, não como componentes novos.
5. **Skeleton no load**, toast para feedback global, inline para formulários (regra dos fluxos).
6. Componente só existe se responder a uma ação, um estado importante, ou acesso frequente (princípio v1.4).

## Índice de componentes

| Família | Arquivo | Componentes |
|---|---|---|
| Status | `status.md` | StatusDot, StatusBadge, StatusBanner |
| Cards | `cards.md` | AppCard, StatCard, ActionCard, FeedItem |
| Feedback | `feedback.md` | Toast, Skeleton, EmptyState, Spinner |
| Overlays | `overlays.md` | Dialog, ConfirmDialog, Menu (Ações ▾), Sheet |
| Dados | `data.md` | DataTable, FilterChip, SearchField, SegmentedControl |
| Navegação | `navigation.md` | Sidebar, BottomNav, TopBar, Tabs |
| Formulários | `forms.md` | Input, Checkbox, Toggle, Button, Select |

## Formato de spec (padrão)

Cada componente documenta:

```
- Anatomia (ASCII)
- Tokens usados
- Estados (default, hover, active, disabled, loading, focus)
- Comportamento por role (quando aplicável)
- A11y (ARIA, foco, teclado)
- Referências cruzadas (wireframe/fluxo que o usa)
```

## Regra de integração

O design só fica READY quando todo componente citado nos wireframes tiver spec
aqui e referência a token (checklist em `../wireframes/README.md`).
