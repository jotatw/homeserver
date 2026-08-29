# ADR-004 — Design System aplicado a todas as telas do App

## Status
Aceito

## Data
2026-08-29

## Decisão
Aplicar o Design System (tokens + componentes base) a **todas as telas** do HomeServer App (`/app`): Dashboard, Aplicações, Armazenamento, Sistema, Administração e Impressão.

## Contexto
Antes desta decisão, o App usava estilos ad-hoc por tela:
- Cores hardcoded
- Espaçamento inconsistente
- Botões, cards e formulários reimplementados em cada view
- Sem hierarquia tipográfica definida
- Mobile era apenas "desktop encolhido" (CSS básico)

O Design System foi definido em `docs/reference/design/` (principles, colors, typography, spacing, icons, components) e implementado via:
- `api/app/css/theme.css` — tokens CSS custom properties
- `api/app/css/style.css` — componentes base (Button, Badge, StatCard, FeedRow, ActionCard, SectionTitle, EmptyState)
- `api/app/js/components.js` — helpers `el()` para criar componentes consistentemente
- `api/app/css/responsive.css` — breakpoints mobile/tablet/desktop

## Consequências

### Positivas
- **Consistência visual**: todas as telas usam mesma paleta, espaçamento, tipografia
- **Manutenibilidade**: mudança de cor/raio/borda = 1 linha no `theme.css`
- **Acessibilidade**: contraste garantido pelos tokens, ARIA nos componentes
- **Mobile nativo**: sidebar overlay, touch targets 44px, grid 1-col, tabs scroll horizontal, diálogos full-width
- **Velocidade**: novas telas usam componentes prontos (`SectionTitle`, `StatCard`, `FeedItem`, `Button`)

### Negativas/Trade-offs
- **Migração incremental**: telas antigas precisaram ser reescritas (Apps, Storage, System, Admin, Print)
- **Curva de aprendizado**: equipe precisa conhecer `components.js` e tokens
- **Overhead inicial**: criar componentes base antes de usá-los

## Alternativas consideradas
1. **Manter estilos por tela** — descartado: dívida técnica crescente, inconsistência, mobile ruim
2. **Adotar framework UI externo (MUI, Ant Design, etc.)** — descartado: bundle size, dependência externa, over-engineering para app interno
3. **CSS Modules / Styled Components** — descartado: build step extra, complexidade desnecessária para vanilla JS

## Implementação
Commits relacionados (todos em `349b542`):
- `theme.css` — tokens de cor, tipografia, espaçamento, raios, sombras, motion
- `style.css` — componentes: `.btn`, `.badge`, `.stat-card`, `.feed-item`, `.app-card`, `.section`, `.empty`, `.chip`, `.admin-tabs`, `.dashboard-grid`, `.widget-*`
- `components.js` — factory `el()` + helpers `icon()`, `statusDot()`, `badge()`, `button()`, `statCard()`, `feedRow()`, `actionCard()`, `sectionTitle()`, `emptyState()`
- `responsive.css` — breakpoints ≥1024px, 768–1023px, ≤767px, ≤380px; sidebar overlay mobile; dashboard 1-col; touch targets 44px
- `app.js` — todas as `render*()` reescritas usando componentes; `setupMobileSidebar()` para hamburger menu

## Referências
- `docs/reference/design/principles.md`
- `docs/reference/design/colors.md`
- `docs/reference/design/typography.md`
- `docs/reference/design/spacing.md`
- `docs/reference/design/icons.md`
- `docs/reference/design/components.md`
- `docs/design/screen-map.md` — diagnóstico de duplicações e plano de refactor