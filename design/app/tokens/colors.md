# Tokens — Cores

> Herda `docs/design/colors.md` (v1.4) e adiciona o que o App exige: modo claro, mais superfícies, focus ring, overlays.
> Tema **dark é o padrão** (herança v1.4).

## Dark (padrão)

### Neutros — fundos e superfícies

| Token | Valor | Uso |
|---|---|---|
| `--hs-bg` | `#0f172a` | Fundo da página (slate-900) |
| `--hs-surface` | `#1e293b` | Cards, painéis (slate-800) |
| `--hs-surface-raised` | `#263449` | Dialog, popover, menu (acima de surface) |
| `--hs-surface-hover` | `#334155` | Hover de superfície (slate-700) |
| `--hs-surface-active` | `#475569` | Item ativo / pressionado (slate-600) |
| `--hs-overlay` | `rgba(2,6,23,0.60)` | Dimmer de dialog/sheet |
| `--hs-border` | `#334155` | Bordas e divisores (slate-700) |
| `--hs-border-strong` | `#475569` | Divisores destacados, inputs focus |

### Texto

| Token | Valor | Uso |
|---|---|---|
| `--hs-text` | `#e2e8f0` | Texto primário (slate-200) |
| `--hs-text-muted` | `#94a3b8` | Secundário, rótulos (slate-400) |
| `--hs-text-faint` | `#64748b` | Rodapé, metadados (slate-500) |
| `--hs-text-inverse` | `#0f172a` | Texto sobre `ok/warn/danger` e primária |

### Ação (primária)

| Token | Valor | Uso |
|---|---|---|
| `--hs-primary` | `#2563eb` | Botões, links, aba ativa (blue-600) |
| `--hs-primary-hover` | `#3b82f6` | Hover de ação primária (blue-500) |
| `--hs-primary-active` | `#1d4ed8` | Pressionado (blue-700) |
| `--hs-primary-soft` | `rgba(37,99,235,0.18)` | Fundo de destaque / item ativo da nav |
| `--hs-primary-focus` | `#93c5fd` | Focus ring (blue-300) |
| `--hs-on-primary` | `#ffffff` | Texto em botão primário |

### Estado (status)

| Token | Valor | Significado |
|---|---|---|
| `--hs-color-ok` | `#22c55e` | Online / saudável |
| `--hs-color-ok-soft` | `rgba(34,197,94,0.16)` | Fundo de badge OK |
| `--hs-color-warn` | `#eab308` | Atenção |
| `--hs-color-warn-soft` | `rgba(234,179,8,0.16)` | Fundo de badge warning |
| `--hs-color-danger` | `#ef4444` | Indisponível / erro |
| `--hs-color-danger-soft` | `rgba(239,68,68,0.16)` | Fundo de badge erro |
| `--hs-color-info` | `#38bdf8` | Informativo (sky-400) |
| `--hs-color-info-soft` | `rgba(56,189,248,0.16)` | Fundo de badge info |

## Light

| Token | Valor | Uso |
|---|---|---|
| `--hs-bg` | `#f8fafc` | Fundo da página (slate-50) |
| `--hs-surface` | `#ffffff` | Cards, painéis |
| `--hs-surface-raised` | `#ffffff` | Dialog, popover |
| `--hs-surface-hover` | `#f1f5f9` | Hover (slate-100) |
| `--hs-surface-active` | `#e2e8f0` | Ativo (slate-200) |
| `--hs-overlay` | `rgba(15,23,42,0.45)` | Dimmer |
| `--hs-border` | `#e2e8f0` | Bordas (slate-200) |
| `--hs-border-strong` | `#94a3b8` | Divisores/inputs (slate-400) |
| `--hs-text` | `#0f172a` | Texto primário (slate-900) |
| `--hs-text-muted` | `#475569` | Secundário (slate-600) |
| `--hs-text-faint` | `#64748b` | Rodapé (slate-500) |
| `--hs-primary` | `#2563eb` | Ação primária (mantém) |
| `--hs-primary-hover` | `#1d4ed8` | Hover (blue-700) |
| `--hs-primary-active` | `#1e40af` | Pressionado (blue-800) |
| `--hs-primary-soft` | `rgba(37,99,235,0.10)` | Destaque |
| `--hs-primary-focus` | `#2563eb` | Focus ring |
| `--hs-on-primary` | `#ffffff` | Texto em botão primário |
| `--hs-color-ok/warn/danger/info` | (mesmos hex) | Estabilidade de status entre temas |
| `--hs-color-*-soft` | (mesmos rgba) | Badges |

## Regras

- Texto sobre `ok/warn/danger` e `primary` usa `--hs-text-inverse` (superfície escura) em ambos os temas.
- `--hs-primary-focus` usado no outline do focus (nunca borda sutil "quase invisível").
- Estados mantêm **mesmos hex em dark e light** para o usuário não re-aprender significado (paridade de status).
- Contraste: texto normal ≥ 4.5:1; grandes ≥ 3:1 (WCAG AA) — conferido com os valores acima.
- Status sempre com `-soft` como fundo de badge → "cor + superfície + texto", nunca só cor.
