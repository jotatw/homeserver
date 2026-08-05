# Tokens — Cantos (Radius)

> Formaliza os raios da v1.4 (12/10/8px) numa escala.
> Refs: `../references.md` §2 (shape scale do M3).

## Escala

| Token | Valor | Uso |
|---|---|---|
| `--hs-radius-sm` | 0.25rem (4px) | Chips, badges, inputs pequenos |
| `--hs-radius-md` | 0.5rem (8px) | Cards técnicos (Sistema), tabelas |
| `--hs-radius-lg` | 0.625rem (10px) | Cards padrão (Aplicações, Admin) |
| `--hs-radius-xl` | 0.75rem (12px) | Cards de destaque (Meu espaço), dialogs |
| `--hs-radius-full` | 9999px | Dots de status, avatares, chips de filtro |

## Hierarquia visual por superfície (herança v1.4)

| Superfície | Raio | Sombra |
|---|---|---|
| Meu espaço (principal) | `xl` | sim (destaque) |
| Aplicações / Administração | `lg` | leve |
| Sistema (técnico) | `md` | nenhuma |
| Dialog / Sheet / Popover | `xl` | elevada |
| Bottom nav / Top bar | `none` (fundo inteiro) | sutil na barra |

## Regras

- O raio **reforça a hierarquia**: superfície mais importante = canto maior + sombra.
- Dots de status: `--hs-radius-full` (círculo de 8px — v1.4).
- Não misturar mais de 3 raios por tela.
- Cards clicáveis mantêm raio + `:hover` elevando sombra (feedback, ref §2).
