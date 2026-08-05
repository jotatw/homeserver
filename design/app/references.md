# Referências de Design — HomeServer App (v2.0)

> Fase de pesquisa da branch `app-design`. Data de coleta: 2026-08-05.
> Fontes coletadas via pesquisa na internet. Este arquivo evolui conforme novas referências são adicionadas.

## Como usar

- Cada seção agrupa referências por tema (dashboards, design systems, PWA/mobile).
- Toda referência adicionada deve manter o formato: `nome | URL | pontos aplicáveis`.
- Após adicionar referências novas, atualizar a seção "Padrões que se repetem".

---

## 1. Dashboards self-hosted (referência de UI/UX)

| Nome | URL | Pontos de design destacados |
|---|---|---|
| **Homarr** | https://homarr.dev | Layout em grid com drag-and-drop; 20K+ ícones e 40+ integrações (widgets em tempo real via WebSocket); configuração sem YAML (tudo pela UI); dark mode nativo |
| **Heimdall** | https://heimdall.site | Simplicidade e elegância; tiles com cor de fundo + ícone; "Enhanced Apps" mostram info extra via API de cada serviço |
| **Dashy** | https://dashy.to | Muitos temas + editor de cores/CSS custom; indicadores de status/health por app e host; PWA offline e UI responsiva; views minimal e workspace; busca instantânea + atalhos de teclado |
| **Flame** | https://github.com/pawelmalak/flame | Editores GUI integrados (apps/bookmarks sem editar arquivos); widget de clima; 15 temas + criador de temas/CSS; auto-discovery Docker por labels |
| **Uptime Kuma** | https://uptime.kuma.pet | "Fancy, Reactive, Fast UI/UX"; dark + light mode; múltiplas status pages; ping charts e info de certificado; 90+ canais de notificação |
| **Immich** | https://immich.app | Virtual scroll e timeline fluida; scrollbar scrubbable/draggable; dark mode elegante; app mobile completo (Flutter) + web (Svelte); mapas e "Memories" |
| **n8n** | https://n8n.io | Canvas visual de nós com conexões; combina no-code com JS/Python; observabilidade full dos fluxos; design limpo focado no editor |
| **Homepage** | https://gethomepage.dev | Estático e ultrarrápido (build-time); 100+ widgets de serviço com status/stats de Docker; temas/layouts/CSS custom; 40+ idiomas |
| **Glance** | https://github.com/glanceapp/glance | Colunas com larguras ajustáveis; otimizado para mobile; temas custom (poucos números); leve (binário <20MB, JS vanilla mínimo) |
| **Gatus** | https://gatus.io | Dark mode default; endpoints em grupos com ordenação; badges de uptime/response-time; "announcements" de incidentes (outage/warning/operational); CSS custom |
| **Dash.** | https://getdashdot.com | Glassmorphism (visual moderno); dark/light mode polidos; stats de hardware em tempo real; estética "de produto" premium |
| **Beszel** | https://beszel.dev | UI web amigável com gráficos históricos de CPU/memória/rede; stats Docker por container; alertas; multi-usuário + OAuth |
| **Homer** | https://homer-demo.netlify.app | Estático e leve; smart cards; busca fuzzy; instalável como PWA; atalhos de teclado (`/` p/ busca); múltiplas páginas e agrupamento |
| **Organizr** | https://organizr.app | Tudo em abas numa única página (iframe); sidebar pinável; acesso rápido por URL (`/#Sonarr`); paleta por tema; suporte mobile |

### Padrões de UI/UX que se repetem (dashboards)

- Grid/cards agrupáveis com ícones (Homarr, Dashy, Flame, Homer)
- Dark mode + theming/CSS custom é padrão de qualquer dashboard moderno
- Indicadores de status/health embutidos no próprio card (Dashy, Homepage, Gatus)
- PWA / mobile-first como diferencial (Dashy, Homer, Glance, Immich)
- Config sem YAML via GUI drag-and-drop (Homarr, Flame) vs. YAML declarativo (Homepage, Glance, Dashy)
- Feedbacks visuais "fancy" e responsivos (Uptime Kuma, Dash.)

---

## 2. Design systems e bibliotecas de componentes

| Nome | URL | Princípios de design aplicáveis |
|---|---|---|
| **shadcn/ui** | https://ui.shadcn.com | Componentes copy-paste (sem lock-in, ideal p/ self-hosted); tokens via CSS variables + Tailwind; dark mode nativo por classe; baseado em Radix (acessibilidade WAI-ARIA); blocos prontos de dashboard (sidebar, stat cards, diálogos) |
| **Material Design 3 (M3)** | https://m3.material.io | Design tokens formais: tonal palettes + papéis de cor; 15 estilos de tipografia; shape scale (corner radii); dark mode via esquemas dinâmicos; Navigation Bar (bottom) + Drawer; alvos de toque ≥48dp; contraste 4.5:1 |
| **Apple HIG** | https://developer.apple.com/design/human-interface-guidelines/ | Adaptar ao Dark Mode/Dynamic Type; controles na área inferior/média (alcance do polegar); swipe para voltar; limitar controles na tela; hierarquia e consistência; acessibilidade profunda |
| **Flowbite** | https://flowbite.com | 600+ componentes sobre Tailwind com dashboards prontos; dark mode com `dark:`; Bottom Navigation e Drawer mobile; DataTables, toast, skeleton, speed-dial |
| **Tailwind CSS** | https://tailwindcss.com/blog | Tokens centralizados em `@theme` (v4); escala de spacing consistente; dark mode via `dark:` + class strategy; dynamic viewport units para mobile; kits de application layout |
| **Radix Primitives** | https://www.radix-ui.com/primitives | Unstyled (seu design system sem specificity wars); acessibilidade WAI-ARIA de fábrica (teclado, foco, RTL); APIs composáveis; pacotes independentes (adoção incremental) |
| **Headless UI** | https://headlessui.com | Unstyled + acessível; Dialog/Menu/Popover/Tabs/Disclosure/Transition; typeahead em combobox/listbox; design-agnóstico |
| **Mantine UI** | https://ui.mantine.dev | 123 componentes responsivos; light/dark theme por padrão; tokens de tema centralizados; categorias de dashboard: navbars, stats, tables, application cards; MIT self-hosted |
| **TOAST UI (NHN)** | https://ui.toast.com | Chart (line/bar/pie), Grid (edição, filtro, sort, paginação), Calendar; componentes difíceis de dashboard prontos; MIT |
| **Chakra UI** | https://chakra-ui.com | Design system tokenizado; dark mode via ColorModeProvider; acessibilidade embutida; Stat/Modal/Drawer/Tabs/Toast para admin + mobile |

### Padrões que se repetem (design systems)

- Tokens de cor/tipografia/spacing/radius centralizados (CSS variables) — dark mode nativo por classe
- Acessibilidade WAI-ARIA embutida (teclado, foco, contraste, alvos ≥48dp)
- Navegação: Navigation Bar bottom no mobile, Sidebar no desktop (nunca esconder nav no desktop)
- Componentes essenciais de dashboard: stat cards, data tables, charts, skeletons, toasts, dialogs

---

## 3. Padrões PWA / app mobile-first (self-hosted)

| Nome | URL | Pontos de padrão aplicáveis |
|---|---|---|
| **web.dev — Learn PWA** | https://web.dev/learn/pwa | Manifest, service worker, cache, offline (IndexedDB/Cache Storage/Persistent Storage), beforeinstallprompt, standalone window, splash screens, shortcuts, Window Controls Overlay; SPA vs MPA; Workbox |
| **web.dev — Install criteria** | https://web.dev/articles/install-criteria | HTTPS, manifest com name/short_name, ícones 192/512px, start_url, display standalone; prompt só após interação (≥30s na página); rich install UI com screenshots |
| **MDN — PWA** | https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps | Service Worker (Cache, FetchEvent, Clients), IndexedDB, Background Sync, Badging, Notifications, Web Share; theme_color/background_color p/ dark mode; screenshots e shortcuts |
| **web.dev — Offline UX guidelines** | https://web.dev/articles/offline-ux-design-guidelines | Informar estado (toasts ao perder/reconectar); "saved, will sync when online"; skeleton layouts; nunca usar só cor p/ estado (cor + rótulo + ícone); sincronizar ao voltar a conexão |
| **NN/g — Mobile First Is NOT Mobile Only** | https://www.nngroup.com/articles/mobile-first-not-mobile-only/ | Portar UI mobile p/ desktop degrada UX (hamburger escondido reduz uso); paridade de conteúdo, layout otimizado por plataforma (sidebar desktop, bottom nav mobile) |
| **NN/g — Content dispersion** | https://www.nngroup.com/articles/content-dispersion/ | Mobile-first cego causa "content dispersion" no desktop; cada breakpoint deve reorganizar a informação, não esticar |
| **web.dev — PWA checklist** | https://web.dev/articles/pwa-checklist | Inicia rápido (Core Web Vitals); responsivo a qualquer viewport; página offline customizada; instalável; acessibilidade WCAG; Pointer Events; sessões longas (2-cookie handoff) |
| **Patterns.dev** | https://www.patterns.dev | PRPL, code/route splitting, import on interaction, list virtualization (listas/tabelas grandes), tree shaking; rendering: static/streaming SSR, progressive hydration |
| **Awesome Selfhosted** | https://awesome-selfhosted.net | ~2.300 apps self-hosted — referência de mercado; tendência crescente de PWA/offline-first; categorias: Dashboards, Monitoring, Note-taking, File Transfer |

### Padrões que se repetem (PWA/mobile)

- Base PWA instalável: manifest + service worker + HTTPS + ícones 192/512px
- Offline-first com IndexedDB/sync e página offline própria
- Dark mode via `prefers-color-scheme` + `theme_color` no manifest
- Mobile-first como priorização de conteúdo, não port 1:1; bottom tab no mobile, sidebar no desktop
- Acessibilidade WCAG (contraste, não só cor para estado)
- Performance: code splitting + list virtualization para dashboard

---

## 4. Fontes já visitadas (coleta direta)

| Fonte | O que extrair |
|---|---|
| https://gethomepage.dev/widgets/ | Widgets de serviço (100+) e info (weather, time, search, glances) — referência do nosso Homepage v1.4 |
| https://ui.shadcn.com/docs/components/ | Catálogo completo de componentes (accordion, chart, data table, dialog, drawer, sidebar, sheet, toast...) |
| https://homarr.dev | Referência principal de dashboard self-hosted com drag-and-drop e widgets em tempo real |

---

## Status

- [x] 1. Dashboards self-hosted (14 refs)
- [x] 2. Design systems (10 refs)
- [x] 3. Padrões PWA/mobile (9 refs)
- [ ] 4. Fontes a explorar (pendente)
- [ ] 5. Extrair wireframes/flowboards para `wireframes/` e `flows/`
- [ ] 6. Propor tokens iniciais em `tokens/`

> Ao adicionar referência nova, incrementar o contador da seção e atualizar os "Padrões que se repetem".
