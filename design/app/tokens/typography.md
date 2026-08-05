# Tokens — Tipografia

> Herda `docs/design/typography.md` (v1.4) e expande para o App (display, data tables, dialogs).
> Família: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` (var `--hs-font-sans`).

## Família

| Token | Valor |
|---|---|
| `--hs-font-sans` | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |
| `--hs-font-mono` | `"SFMono-Regular", Consolas, "Liberation Mono", monospace` (código, caminhos, versão) |

## Escala (rem)

| Token | Tamanho | Peso | Uso |
|---|---|---|---|
| `--hs-display` | 1.5rem | 700 | Marca / título de tela (móvel) |
| `--hs-heading-lg` | 1.25rem | 700 | Título de tela (desktop) |
| `--hs-heading` | 1.05rem | 600 | Título de seção/card principal |
| `--hs-title` | 0.95rem | 600 | Título de grupo (Apps, Sistema) |
| `--hs-body` | 0.95rem | 400 | Texto padrão |
| `--hs-card-name` | 1.05rem | 600 | Nome do card de aplicação |
| `--hs-card-desc` | 0.82rem | 400 | Descrição de card |
| `--hs-label` | 0.8rem | 600 | Cabeçalho de tabela, labels de campo |
| `--hs-meta` | 0.75rem | 400 | Rodapé, versão, hints |
| `--hs-code` | 0.85rem | 400 | Paths, nomes de container (`mono`) |
| `--hs-button` | 0.9rem | 600 | Labels de botão |
| `--hs-input` | 1rem | 400 | Valor de input (≥16px p/ iOS focus, ref §2) |

## Uso por tela (derivado dos wireframes)

| Contexto | Tokens |
|---|---|
| Login | `--hs-display` (marca) + `--hs-body` (subtítulo) + `--hs-input` |
| Home | `--hs-heading` (seções) + `--hs-card-name`/`--hs-card-desc` (atalhos) |
| Apps | `--hs-card-name` (card) + `--hs-meta` (host) + `--hs-label` (colunas) |
| Storage | `--hs-heading` (seções) + `--hs-code` (paths/mount) + `--hs-meta` |
| System | `--hs-title` (grupos) + `--hs-code` (container) + `--hs-meta` |
| Admin | `--hs-label` (tabelas) + `--hs-body` (valores) + `--hs-meta` (datas) |
| Dialogs | `--hs-heading` (título) + `--hs-body` (corpo) + `--hs-button` |

## Regras

- Máximo **2 pesos por bloco visual** (v1.4) — um título + um corpo, sem variações soltas.
- Grupos técnicos (Sistema): `text-transform: uppercase` + `letter-spacing: 0.05em` (herança v1.4).
- Texto de erro: `--hs-text` cor `danger` + ícone; estados vazios: `--hs-text-muted` + ícone.
- Inputs nunca abaixo de 16px no mobile (evita zoom automático do iOS).
- `line-height`: 1.5 para body; 1.3 para títulos; 1.4 para cards.
- Datas/horas em `--hs-meta` com formato pt-br (`dd/mm hh:mm`) — paridade `locale: pt-br` do servidor.
