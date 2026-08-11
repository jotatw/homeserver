# Tokens — Espaçamento

> Escala baseada em múltiplos de 4px. Os tokens de layout definem as dimensões estruturais do App e devem funcionar tanto no mobile quanto no desktop.

## Escala base

| Token | Valor | Uso |
|---|---:|---|
| `--hs-space-1` | 0.25rem (4px) | Gap mínimo ícone↔texto |
| `--hs-space-2` | 0.5rem (8px) | Gap pequeno, chips, controles compactos |
| `--hs-space-3` | 0.75rem (12px) | Padding interno compacto |
| `--hs-space-4` | 1rem (16px) | Padding e gaps padrão |
| `--hs-space-5` | 1.25rem (20px) | Separação entre elementos relacionados |
| `--hs-space-6` | 1.5rem (24px) | Separação entre grupos |
| `--hs-space-8` | 2rem (32px) | Espaçamento grande |
| `--hs-space-10` | 2.5rem (40px) | Margem grande |
| `--hs-space-12` | 3rem (48px) | Folga de tela / alvo estrutural |

## Layout

| Token | Valor | Uso |
|---|---:|---|
| `--hs-touch` | 3rem (48px) | Alvo mínimo de toque |
| `--hs-touch-compact` | 2.5rem (40px) | Ação secundária compacta |
| `--hs-sidebar-w` | 15rem (240px) | Sidebar desktop expandida |
| `--hs-sidebar-w-collapsed` | 3.75rem (60px) | Sidebar desktop recolhida |
| `--hs-drawer-w` | min(20rem, 86vw) | Drawer mobile |
| `--hs-topbar-h` | 3.5rem (56px) | Cabeçalho mobile / barra superior |
| `--hs-max-content` | 72rem (1152px) | Largura máxima de conteúdo |
| `--hs-gutter` | 1rem (16px) | Margem lateral mobile |
| `--hs-gutter-desktop` | 1.5rem (24px) | Margem lateral desktop |
| `--hs-card-gap` | 1rem (16px) | Gap padrão de componentes |

## Grid responsivo

| Viewport | Organização padrão | Gap |
|---|---|---:|
| <480px | 1 coluna; 2 apenas quando o conteúdo comportar | 12px |
| 480–767px | 1–2 colunas | 16px |
| 768–1023px | 2–3 colunas | 16px |
| ≥1024px | 2–4 colunas conforme a tela | 16px |
| ≥1440px | limitar pela largura máxima de conteúdo | 20px |

Os breakpoints são referências de composição, não regras para todos os componentes. Cada componente deve quebrar quando seu conteúdo deixar de caber confortavelmente.

## Regras

- Usar somente valores da escala para espaçamento visual comum.
- Todo elemento clicável respeita `--hs-touch` na área de toque quando possível.
- O tamanho visual do ícone pode ser menor que 48px; a área interativa não.
- Mobile prioriza espaço vertical e leitura linear.
- Desktop aproveita espaço horizontal sem aumentar artificialmente a quantidade de informação.
- Não usar espaçamento "mágico" fora da escala sem justificativa documentada.
- A navegação mobile usa drawer; não existe token de altura para bottom navigation nesta versão do design.
