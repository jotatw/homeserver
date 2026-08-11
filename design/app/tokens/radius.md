# Tokens — Cantos (Radius)

> Escala pequena e consistente. O raio deve reforçar a hierarquia sem transformar cada elemento em um cartão arredondado.

## Escala

| Token | Valor | Uso |
|---|---:|---|
| `--hs-radius-sm` | 0.25rem (4px) | Chips, badges, controles pequenos |
| `--hs-radius-md` | 0.5rem (8px) | Tabelas, componentes técnicos, inputs |
| `--hs-radius-lg` | 0.625rem (10px) | Cards e superfícies padrão |
| `--hs-radius-xl` | 0.75rem (12px) | Destaques, dialogs, drawer |
| `--hs-radius-full` | 9999px | Status dots, avatares, chips |

## Hierarquia

| Superfície | Raio | Diretriz |
|---|---|---|
| Conteúdo técnico | `md` | discreto |
| Card padrão | `lg` | identidade principal |
| Destaque / ação importante | `xl` | usar com moderação |
| Dialog / drawer / popover | `xl` | superfície elevada |
| Barra superior / sidebar | `none` | parte estrutural da aplicação |

## Regras

- Não usar mais de 3 raios diferentes em uma mesma tela.
- Nem todo bloco precisa de borda arredondada; listas e áreas de conteúdo podem usar divisores.
- Componentes interativos mantêm o raio durante hover/focus/active.
- O raio não deve ser usado para criar hierarquia sozinho; combinar com espaçamento, tipografia e superfície.
