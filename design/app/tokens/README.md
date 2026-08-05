# Design Tokens — HomeServer App (v2.0)

> Derivados do Design System v1.4 (`docs/design/`) e das refs (`../references.md` §2: tokens centralizados, dark mode por classe).
> Toda a UI do App usa **apenas** estes tokens — proibido valor "hardcoded" de cor/espaçamento/tipografia.

## Como consumir

Tokens são definidos como **CSS custom properties** (`--hs-*`), entregues via `@theme` (Tailwind v4) ou CSS puro. O App define **2 conjuntos** por variável: `light` e `dark` (dark é o padrão, herança da v1.4).

```css
:root, [data-theme="dark"] {
  --hs-bg: #0f172a;
  --hs-surface: #1e293b;
  /* ... */
}
[data-theme="light"] {
  --hs-bg: #f8fafc;
  --hs-surface: #ffffff;
  /* ... */
}
```

- Tema selecionado em `document.documentElement.dataset.theme`; persistido + `prefers-color-scheme` como default (ref §3).
- Variável semântica (`--hs-bg`) mapeia a paleta; componentes nunca referenciam hex direto.

## Nomenclatura

`--hs-<grupo>-<papel>` em 5 grupos:

| Grupo | Exemplo | Uso |
|---|---|---|
| `color` | `--hs-color-ok` | cores de status e primária |
| `surface` | `--hs-surface-raised` | fundos de superfícies |
| `text` | `--hs-text-muted` | cores de texto |
| `space` | `--hs-space-4` | espaçamento |
| `radius` | `--hs-radius-md` | cantos |
| `shadow` | `--hs-shadow-md` | elevação |
| `motion` | `--hs-motion-fast` | duração |
| `typography` | `--hs-text-sm` / `--hs-font-sans` | texto |

## Regras de ouro

1. **Estado nunca só cor**: tokens de status acompanham ícone/texto (ref §3).
2. **Contraste**: texto sobre superfícies ≥ 4.5:1 (WCAG AA); sobre `ok/warn/danger` sempre superfície escura.
3. **Alvos de toque ≥ 48dp** (ref §2 M3) — definido em `spacing.md`/`components.md`.
4. **Dark mode é o padrão**; light é um modo completo, nunca "invertido de pressa".
5. Alterar um token **não** quebra componentes — é a API visual do App (ref §2 shadcn/Tailwind `@theme`).
6. Respeitar `prefers-reduced-motion` (ref §3).

## Documentos

| Token | Arquivo | Status |
|---|---|---|
| Cores (dark/light, estados) | `colors.md` | Draft v1 |
| Tipografia (escala, fontes) | `typography.md` | Draft v1 |
| Espaçamento (escala + layout) | `spacing.md` | Draft v1 |
| Cantos (radius) | `radius.md` | Draft v1 |
| Elevação (sombras) | `elevation.md` | Draft v1 |
| Movimento (duração/easing) | `motion.md` | Draft v1 |

## Origem (paridade com v1.4)

| Token v2.0 | Herda de (v1.4) | Mudança |
|---|---|---|
| `--hs-bg`, `--hs-surface` | `bg`, `surface` | + light mode, + superfícies adicionais |
| `--hs-color-ok/warn/danger` | `ok/warn/danger` | sem mudança (estabilidade de status) |
| `--hs-space-*` | `space-1..10` | + tokens de layout (tela/sidebar) |
| `--hs-radius-*` | raios de cards (12/10/8px) | formalizado em escala |
| Tipografia | escala do v1.4 | + display do App, + tabelas/dialogs |
