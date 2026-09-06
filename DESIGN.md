---
version: alpha
name: HomeServer Minimal
description: Identidade visual oficial do ecossistema HomeServer — dark minimalista, superfícies por luminância, um acento por tema.
colors:
  bg: "#08090a"
  surface: "#101111"
  surface-raised: "#191a1b"
  border: "#23252a"
  text: "#f7f8f8"
  text-secondary: "#d0d6e0"
  text-muted: "#8a8f98"
  primary: "#5e6ad2"
  primary-hover: "#828fff"
  primary-active: "#4c58bd"
  accent: "#7170ff"
  accent-blue: "#55b3ff"
  accent-amber: "#E6A65D"
  ok: "#3fb968"
  warn: "#d9a53f"
  danger: "#e0565a"
typography:
  h1:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  h2:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  h3:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 500
    lineHeight: 1.35
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  sm: 7px
  md: 10px
  lg: 14px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: 10px 16px
  button-primary-hover:
    backgroundColor: "{colors.primary-active}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: 10px 16px
  button-secondary:
    backgroundColor: "#141516"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: 10px 16px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 16px
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: 10px 12px
  badge-ok:
    backgroundColor: "#14291c"
    textColor: "{colors.ok}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-danger:
    backgroundColor: "#261416"
    textColor: "{colors.danger}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  badge-warn:
    backgroundColor: "#291e10"
    textColor: "{colors.warn}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  nav-item-active:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.accent}"
    rounded: "{rounded.sm}"
    padding: 8px 12px
---

## Overview

Identidade **dark-first, minimalista, moderna e simples** para todo o
ecossistema HomeServer: App (`/app`), homepage (`/`) e futuras interfaces.
Baseada na linguagem do Linear — superfícies definidas por luminância
(rgba branco sobre quase-preto), bordas branco-translúcidas e **um único
acento cromático por tema**; as únicas outras cores são os estados
semânticos (ok/warn/danger).

A mesma especificação alimenta o portal (via `custom.css` do gethomepage)
e o App (via `--hs-*` em `design/app/tokens/` + `api/app/css/theme.css`).

## Colors

| Papel | Valor | Uso |
|---|---|---|
| `bg` | `#08090a` | Fundo da página (nunca preto puro) |
| `surface` | `#101111` | Cards e widgets |
| `surface-raised` | `#191a1b` | Dialogs, menus, inputs |
| `border` | `#23252a` | Bordas; equivalente translúcido: `rgba(255,255,255,.08)` |
| `text` | `#f7f8f8` | Texto primário (nunca `#ffffff`) |
| `text-secondary` | `#d0d6e0` | Corpo de texto |
| `text-muted` | `#8a8f98` | Rótulos, metadados |
| `primary` | `#5e6ad2` | Fundo de botão primário (contraste AA com branco) |
| `accent` | `#7170ff` | Acento interativo: aba ativa, ícones, links, foco |

Regras:

- Superfícies por luminância: em CSS prefira `rgba(255,255,255,.02 → .05)`
  sobre `bg`; os valores sólidos da tabela servem para contextos que não
  suportam transparência (ex.: YAML de temas, exports).
- **Um acento por tema.** Presets de personalização (preferência do
  usuário; o resto da UI não muda entre presets):

  | Preset | Acento | Hover |
  |---|---|---|
  | Violeta (padrão) | `#7170ff` | `#828fff` |
  | Azul | `#55b3ff` | `#7dc4ff` |
  | Âmbar | `#E6A65D` | `#f0b877` |

- Estados: ok `#3fb968`, warn `#d9a53f`, danger `#e0565a` — usados apenas
  em indicadores, badges e barras, nunca como cor decorativa.
- Tema claro segue os mesmos nomes de token com valores próprios
  (`--hs-*` em `theme.css`); o escuro é o padrão do produto.

## Typography

Inter em toda a interface (fallback `system-ui`). Pesos autorizados:
400 (leitura), 500 (ênfase/navegação), 600 (títulos/labels). Não usar
pesos acima de 600. Letter-spacing negativo apenas em títulos grandes;
labels em caixa-alta usam `+0.06em`.

## Layout

Base 8px: `4 · 8 · 16 · 24 · 32`. Containers de leitura até ~1140px.
Grades de cards: 4 colunas (desktop) → 2 (~900px) → 1 (≤560px).
Navegação: sidebar no desktop; bottom bar com 4 destinos + "Mais" no
mobile (ver `docs/design/screen-map.md`).

## Elevation & Depth

Em fundo escuro, elevação vem do **degrau de luminância**
(`bg → surface → surface-raised`) e do clareamento da borda no hover
(`rgba(255,255,255,.08 → .16)`) — não de sombras pesadas. Sombras
reservadas a elementos flutuantes (dialogs, popovers):
`0 8px 24px rgba(0,0,0,.5)`.

## Shapes

Raio: `sm 7px` (botões, inputs), `md 10px` (cards, widgets),
`lg 14px` (painéis), `pill 999px` (badges, chips). Ícones: stroke SVG
1.7px, 16–18px, herdando a cor do texto ou do acento; sem emoji.

## Components

- `button-primary`: único componente de alta ênfase por contexto.
- `button-secondary`: ações de apoio, fundo translúcido, sem borda forte.
- `card`: bloco padrão de conteúdo; título em 500, descrição em muted.
- `input`: fundo elevado, borda `rgba(255,255,255,.08)`, foco com acento.
- `badge-ok` / `badge-danger`: pílulas translúcidas sobre a cor de estado.

## Do's and Don'ts

**Do**

- Usar os presets de acento como preferência do usuário (persistida por
  dispositivo; sincronização por conta é evolução futura).
- Manter nomes de token estáveis (`--hs-*`): valores evoluem, nomes não.
- Testar contraste com a paleta antes de introduzir cor nova.

**Don't**

- Não usar preto puro (`#000`) nem branco puro (`#fff`) como fundo/texto.
- Não introduzir um segundo acento cromático no mesmo tema.
- Não usar sombra como principal indicador de elevação em superfícies.
- Não aplicar gradientes/glass fora de um tema experimental declarado
  (ex.: Frutiger Aero, planejado como variante, não como base).
