# Cores

Paleta base para Homepage e HomeServer App (tema escuro).

## Neutros (fundo e superfícies)

| Token | Hex | Uso |
|-------|-----|-----|
| `bg` | `#0f172a` | Fundo da página |
| `surface` | `#1e293b` | Cartões, painéis |
| `surface-hover` | `#263449` | Hover de superfícies |
| `border` | `#334155` | Bordas e divisores |
| `text` | `#e2e8f0` | Texto primário |
| `text-muted` | `#94a3b8` | Texto secundário, rótulos |
| `text-faint` | `#64748b` | Rodapé, metadados |

## Ação (primária)

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#2563eb` | Botões, links, destaque ativo |
| `primary-hover` | `#1d4ed8` | Hover de ação primária |
| `primary-soft` | `rgba(37,99,235,0.18)` | Fundo de destaque (App, atalhos) |

## Estado (status)

| Token | Hex | Significado |
|-------|-----|-------------|
| `ok` | `#22c55e` | Online / saudável |
| `warn` | `#eab308` | Atenção |
| `danger` | `#ef4444` | Indisponível / erro |
| `danger-text` | `#f87171` | Texto de erro |

## Semanticas

- Só use cor para comunicar **estado ou ação**, nunca como decoração.
- Texto sobre `ok`/`warn`/`danger` usa sempre a superfície escura.
- Mantenha o contraste mínimo WCAG AA (4.5:1 para texto).
