# Changelog

Todas as mudanças notáveis no HomeServer são documentadas neste arquivo.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## Em desenvolvimento (baseline v0.1.0 → roadmap v1.0)

> O trabalho a seguir pertence ao **baseline v0.1.0** e ao roadmap de evolução
> até a **v1.0.0**. As versões v1.x/v2.x são histórico (abaixo).

### Organização e evolução

- **Baseline v0.1.0** (auditoria, arquitetura, problemas, limitações, Quality
  Gate) em `planning/release/baseline-v0.1.0.md`.
- **Roadmap por FASEs (0-10)** em `planning/roadmap/v1.0.md`. FASEs 0-3
  concluídas; FASE 4 em andamento.
- **Mapa CLI→App** em `planning/review/mapa-cli-app.md` (tudo operável pelo App).
- **Objetivo central** (mínimo funcional, hardware de vida útil longa) em
  `planning/review/simplicidade-app.md`.
- **Hardening de segurança**: dados pessoais removidos do histórico Git;
  dry-run real; autorização verificada (403); secrets fora do repositório.
- **App**: usuários (criar, trocar senha, excluir com pasta), tokens de API,
  atualização (verificar/aplicar), discos, navegação por role, PWA instalável.
- **Testes**: infra 7/7 · API 31/31 · session 12/12 · smoke 7/7 · cli 6/6.

### Impressão

- **Fila de impressão**: `GET /print/jobs` (ativos + concluídos) e
  `DELETE /print/jobs/:id` (cancelar). Card **Fila** na tela.
- **Modos de qualidade**: `economico` (300dpi + P&B), `normal`, `alta` (600dpi+).
- **Status da impressora** (`GET /print`): state/accepting/activeJobs/lastJob
  (1 docker run; parse do formato nsenter). Badge 🟢/🟡/🔴 + última impressão.
- **Tela em 3 blocos**: impressora+config · conteúdo (texto/arquivo) · ações.
- **Pré-visualização**: texto `<pre>`, imagem `<img>`, PDF `<iframe>`.
- **Validações**: offline desabilita; sem conteúdo bloqueado; arquivo >20 MB
  confirmado; backend 400; `bodyLimit` 30 MB (base64).
- Docs `PRINTING.md` e `api/README.md`.

### Segurança e privacidade

- Histórico Git reescrito sem dados pessoais; backup preservado fora do repo.
- Dry-run do instalador real (não cria dirs/credenciais).
- Containers sem `privileged`; homepage non-root; restart `unless-stopped`.
- Autorização: usuário comum → 403 em rotas admin.

### Servidor (saúde / hardware)

- Timers de backup e desligamento noturno reativados (22h → 07h).
- Health Check ampliado: load, memória e temperatura (alerta >70 °C).

## Histórico (v1.x / v2.x — não fazem parte da linha atual)

### v2.0.0-rc.1 (2026-08-05) — experimental

### Fixed (acceptance tests)

- **Tema/sair inacessíveis** no desktop: sidebar sem scroll escondia os botões
  em telas baixas → `overflow-y: auto` + **event delegation global** (funciona
  mesmo se um render falhar).
- **Bottom nav mobile quebrada**: o CSS esperava `<nav>` interno, mas o HTML usa
  `<nav class="bottomnav">` → `display: flex` nunca aplicava (itens inacessíveis).
  Corrigido com `display: flex` no container real.
- **Mobile**: drawer `＋` (bottom sheet) com perfil, tema e sair (design
  navigation.md) — acesso completo no mobile.
- **Aplicações**: app-card com ellipsis no nome (sem quebrar caixas) + hover com
  elevação.
- **Armazenamento**: seção dispositivos sempre visível (vazia → "nenhum");
  botão desmontar com loading e erro real.
- **Cache**: `Cache-Control: no-cache` nos estáticos do App (browser não
  cacheia versão antiga durante o desenvolvimento).

### Release Process (permanente)

- `planning/release/`: release-process, definition-of-ready-for-release,
  v2.0-checklist, release-notes.
- `planning/support/support-policy.md`: política de suporte por versão.

### PWA instalável

- `manifest.json` (standalone, ícones 192/512, theme_color), ícones PNG,
  service worker mínimo (fetch pass-through — base para offline na v2.1).
- App e login registram manifest + SW.

### Polling (Meu espaço)

- Dashboard atualiza a cada 30s + refresh ao focar a aba (sem polling
  duplicado; timer limpo ao navegar).

### Contrato App ↔ API

- `api/README.md`: seção "App ↔ API" — mapa views→endpoints, cache (10s)
  vs polling (30s), regra de comunicação exclusiva via API oficial.

### Known Issues

- **Navegação de arquivos não disponível** no App (a API não expõe
  listagem/upload — gap G1; use o FileBrowser em `/files/`).
- **Iniciar/parar serviços pelo App** não disponível (gap G3 — sem endpoint).
- **Histórico de métricas** (gráficos 24h/7d) não disponível (gap G5).
- **Offline completo** do App (service worker com cache) fica para a v2.1.

### Sprints 0-7 (histórico)

### Sprint 7 — Integrations

#### Added

- **API Tokens** para integrações externas (gap do `admin.md` resolvido):
  - `GET /api/v1/tokens` — lista tokens (nome, prefixo, criado em, último uso).
  - `POST /api/v1/tokens` `{name}` — cria token `hs_token_*` (retornado 1x).
  - `DELETE /api/v1/tokens/:id` — revoga (invalida na hora).
  - Tokens autenticam como integração (leitura, **não-admin** → 403 em rotas admin).
  - Persistência em `api/data/tokens.json` (não versionado); **apenas SHA-256**
    do token é armazenado (vazamento do arquivo não expõe tokens).
  - **App — Administração**: seção Tokens de API (listar, criar com exibição
    única do token, revogar com confirmação).
- Testes: 7 casos em `test-api.sh` (29 total).

### Sprint 6 — Devices

#### Added

- **Device Service** (API + App):
  - `POST /api/v1/devices/mount` (type, label, device) — monta no host.
  - `POST /api/v1/devices/unmount` (type, label) — desmonta.
  - `POST /api/v1/devices/eject` (device) — ejeta.
  - Ações de hardware rodam no **host via nsenter** (sudo/systemd existem lá —
    padrão do backup); admin-only; validação de body (400).
  - **App — Armazenamento**: seção de dispositivos com ação **Desmontar** (admin)
    e dialog **Montar dispositivo** (tipo/rótulo/dispositivo).
- Testes: 3 casos de validação em `test-api.sh` (22 total).

### Sprint 5 — System Experience

#### Added

- **Sistema** aprimorada seguindo `design/app/flows/system.md` (seções por role):
  - Gauges: CPU/Mem/Disco (barra por faixa de cor) + Uptime.
  - Checks de serviço com badges (estilo status page).
  - **Admin**: Energia — agenda liga/desliga (`/power`) com **dialog de edição**
    (inputs HH:MM + ativar/desativar, `PUT /power`, com confirmação por toast).
  - **Admin**: Rede (IP) e Temperatura (`/hardware`) com **alerta ≥80°C**.

### Sprint 4 — Services Experience

#### Added

- **Aplicações** aprimorada seguindo `design/app/flows/apps.md`:
  - **Busca** (campo com filtro em tempo real por título/nome).
  - **Chips de filtro**: Todos · Ativos · Offline.
  - Ordenação: ativos primeiro.
  - Card com status (cor + ponto + texto) e abertura do serviço em nova aba.
  - Estado vazio com ação "Limpar busca".

### Sprint 3 — Storage Experience

#### Added

- **Armazenamento (Fase 1)**: tela completa seguindo `design/app/flows/storage.md`.
  - Disco principal: % + barra + usado/disponível/total (via `/status.disk`).
  - Dados: raiz de armazenamento, total e estado (via `/storage`).
  - Pastas por usuário: usuários, compartilhado, mídia, documentos, dispositivos.
  - Dispositivos conectados (via `/devices`) com tipo.
  - CTA honesto para o FileBrowser (gap G1 — API não navega arquivos nesta versão).

### Sprint 2 — Workspace

#### Added

- **Design tokens aplicados** no App (`api/app/theme.css`): `--hs-*` com tema
  escuro (padrão) e claro, derivados de `design/app/tokens/`.
- **Login** (`/app/login.html` + `login.js`): nova tela no padrão do wireframe,
  integrada ao novo contrato (`data.user` + `expiresIn`).
- **Sessão e role no boot**: `GET /auth/session` carrega `username`/`admin`;
  a navegação é montada por role (user: 4 áreas · admin: + Administração).
- **Navegação por role** (`app.js`): sidebar (desktop ≥1024px) + bottom nav
  (mobile) com o 5º slot de overflow; roteamento por hash (`#/...`).
- **Dashboard "Meu espaço"**: banner de status (cores + texto), stat cards
  (CPU/Mem/Disco/Uptime com barras), atalhos e feed de atividades (`/events`).
- **Views** básicas de Aplicações (grid com status no card), Armazenamento
  (painel de uso + dispositivos) e Sistema (gauges + checks).
- **`routes/app.ts`**: serve estáticos de `api/app/` de forma genérica e
  segura (sem path traversal); novos arquivos (`theme.css`, `login.js`).

#### Changed

- `api/app/*` reescrito seguindo `design/app/` (wireframes, flows, tokens, components).

### Sprint 1 — Identity & Authentication

#### Added

- **Sessão com role**: `POST /auth/login` e `GET /auth/session` retornam
  `data.user = {username, admin}` + `data.expiresIn` (segundos). A role é
  resolvida **uma única vez no login** — sem `is-admin` por request.
- **Sessão longa**: TTL **30 dias deslizante** (expira se ficar 30 dias sem
  uso; cada request válido renova). Sessão em memória (Map token→Session).
- **`authenticate()`/`authorize()`** separados no plugin de auth;
  `request.user = {username, admin, authenticated, role}`.
- **Validação de body** nas rotas de autenticação (pipeline da v1.5).
- **Testes**: `scripts/test-session.sh` (unitário: expiração, sliding, role,
  tokenVersion) — 12 casos; `scripts/test-api.sh` ampliado para 19 casos.
- **ADR-0007** — Identity & Authentication (identidade pertence ao HomeServer;
  App nunca interage com FileBrowser/Gitea).
- `docs/architecture/API.md` e `api/README.md`: seção Authentication Flow
  (login e requisição autenticada) + novo contrato de auth.

#### Changed

- Rate limit do login: 5 → 20/min (proteção mantida; acomoda a suíte de testes).

#### Fixed

- Sessão antiga (TTL 24h) não carregava a role — App não sabia se era admin.


## [1.5.0] — 2026-08-05

### Added

- **Code Review** (Sprint 1):
  - Nomenclatura padronizada por camada (Foundation `hs_*`, Infrastructure
    `modulo_*`, Adapters `filebrowser_*`); funções órfãs migradas para `hs_fs_*`.
  - API padronizada `{ok,data}` / `{ok,error}` via `utils/respond.ts`.
  - `planning/dependencies.md` — registro de versões.
  - `planning/quality/review-checklist.md` — Quality Gate.
- **Segurança** (Sprint 2):
  - Security headers (Helmet) + rate limit (global 300/min, login 5/min).
  - `docs/security/`: threat-model, security-assumptions, audit-v1.5.
- **Consistência** (Sprint 3):
  - CONTRIBUTING com nomenclatura oficial e formato de logs.
- **Performance** (Sprint 4):
  - Baseline em `planning/health/v1.5.md` (Homepage ~10ms, API ~3.5ms).
- **Arquitetura** (Sprint 5):
  - ADRs 0001-0006 em `docs/architecture/adr/`.
  - `planning/architecture-freeze.md` e `planning/v2-readiness.md`.
- **Testes** (Sprint 6):
  - `scripts/smoke-test.sh` (7), `scripts/test-cli.sh` (6),
    `scripts/test-api.sh` (13), `scripts/run-integration.sh`.
  - `run_ci.sh` inclui shellcheck + suite + integração.

### Fixed

- **Religamento automático**: o servidor acordava imediatamente ao entrar
  em S3 por wakes USB/NIC. `power-schedule.sh` agora desabilita wakes antes
  de suspender e restaura após o resume. Validado: suspend 90s → resume ~91s.
- Runners de teste incluíam apenas parte dos testes (agora 9/9 na suite).
- API sem security headers e sem rate limit no login.
- `example-log.sh` (hooks) com formato de log divergente.
- README com exemplo de `update check` desatualizado.

### Quality Gate

- Architecture ✅ · Security ✅ · Consistency ✅ · Performance ✅ ·
  Documentation ✅ · Testing ✅ · Release ✅

## [1.4.5] — 2026-08-04

### Added

- **Design System** (`docs/design/`): base visual compartilhada entre
  Homepage e HomeServer App.
  - `principles.md` — princípios de design funcional.
  - `colors.md` — paleta (neutros, ação, estados).
  - `typography.md` — escala e pesos por papel.
  - `spacing.md` — tokens de espaçamento e dimensões de cards.
  - `icons.md` — ícones por conceito e indicadores de estado.
  - `components.md` — cards de ação/serviço/técnico, modos, botões,
    estados de carregamento/vazio/erro, rodapé.

## [1.4.4] — 2026-08-04

### Added

- **Polimento no HomeServer App**:
  - Loader com spinner ao carregar cada view.
  - Estados vazios amigáveis (📭) e mensagens de erro (⚠️) por view.
  - Animação `fade-in` na renderização do dashboard.
- Homepage: grupo "Links" (bookmarks) desativado — não expõe mais
  conteúdo quebrado.

### Changed

- `api/app/app.js`: helpers `loader()`, `emptyMsg()`, `errorMsg()`.
- `api/app/style.css`: v1.4.4 — loader, fade-in, estados vazios/erro.

## [1.4.3] — 2026-08-04

### Added

- **App como destaque**: card do HomeServer App com destaque visual
  (borda azul, sombra) no grupo Aplicações.
- **Atalho "Abrir App**" no seletor de modos — reduz cliques
  para acessar a administração via App.

### Changed

- `custom.js`: `highlightApp()` adiciona classe `.hs-app-cta` ao
  card do App; `buildAppShortcut()` adiciona atalho "Abrir App"
  no seletor de modos (link direto `/app`).
- `custom.css`: `.hs-app-cta` (borda azul, sombra) + `.hs-app-shortcut`
  (botão destacado no seletor de modos).

## [1.4.2] — 2026-08-04


### Added

- **Hierarquia visual** na Homepage: grupos com classes de destaque —
  Meu espaço (principal), Aplicações/Administração (secundário),
  Sistema (terciário/compacto).
- **Cards como ações**: descrições orientadas à tarefa ("Gerenciar arquivos",
  "Abrir Gitea", "Assistir e ouvir", etc.) — o software vira detalhe.
- Estados de status (online/atenção/indisponível) com cores distintas.

### Changed

- `custom.js`: aplica classes de hierarquia por grupo ao trocar de modo.
- `custom.css`: v1.4.2 — tamanhos e pesos de fonte por hierarquia; cards
  principais com mais destaque; grupo Sistema compacto.

## [1.4.1] — 2026-08-04

### Added

- **Header compacto**: greeting pequeno, recursos e data/hora em linha única.
- **Rodapé** da Homepage: versão do HomeServer, data e "Servidor online".
- `GET /api/v1/version` agora é público (apenas string de versão), usado
  pelo rodapé sem expor token.

### Changed

- Espaçamento da Homepage: menos altura nos cards, mais espaço entre grupos.
- `custom.css` e `custom.js` reorganizados por versão (v1.4.1).
- Rota `version` movida de `updateRoutes` para `systemRoutes`.

## [1.4.0] — 2026-08-04

### Added

- **Roadmap de UX oficial** (`planning/roadmap/v1.4-ux.md`): Homepage como
  portal de entrada; critérios para novos cards; design principles.
- Homepage reorganizada em 4 grupos: **Meu espaço**, **Aplicações**,
  **Administração** e **Sistema**.
- Modos atualizados: Usuário (Meu espaço + Aplicações), Administrador
  (+ Administração), Sistema (+ Sistema).
- Removidos os grupos "Favoritos" e "Links" (redundância/conteúdo quebrado).

### Changed

- Widgets técnicos (storage, events, status, devices, hardware, power) movidos
  exclusivamente para o grupo **Sistema** — eliminada a redundância de
  CPU/Memória/Rede nos cards de aplicações.
- Cards de aplicações agora exibem apenas status (● Online/Offline).

## [1.3] — 2026-08-04

### Added

- **Auto-update**: `hs version`, `hs update check` e `hs update apply`
  (pull fast-forward + backup via tag `pre-update-*` + reimplante opcional).
- `update.sh` registrado no core; comandos expostos no CLI `hs`.
- **Autenticação**: login/logout/sessão com token (TTL 24h) na API.
- Validação de credenciais via FileBrowser (fonte de verdade de usuários).
- Proteção de rotas: admin (users, power, hardware, backup) e login (storage,
  services, devices, events, system).
- HomeServer App com página de login e redirecionamento automático.
- Token de serviço (`HS_SERVICE_TOKEN`) para integrações internas (homepage).
- `hs user verify` e `hs user is-admin` no CLI.

### Fixed

- **Religamento automático**: `power-schedule.sh` agora usa `rtcwake -m mem`
  (suspend-to-RAM) em vez de `-m off` (poweroff). O RTC deste hardware não
  gera IRQ de alarme para acordar do S5, mas funciona do S3.
  Obs.: o rtcwake exibe o wake time em UTC (+3h local); o epoch está correto.
- `hs_user_is_admin` não dependia mais de python3 (indisponível no container).

## [1.2] — 2026-08-03

### Added

- **Unified Access**: módulo Caddy (reverse proxy) com um único ponto de
  entrada `homeserver.local`.
- **mDNS/Avahi**: `homeserver.local` resolve na LAN (validado em desktop e mobile).
- Rotas path-based: `/` (Homepage), `/files` (FileBrowser), `/git` (Gitea),
  `/api/v1` (API).
- FileBrowser com `baseURL=/files` e Gitea com `ROOT_URL=/git`.
- Homepage com hrefs relativos; API com CORS para `homeserver.local`.

### Changed

- O usuário não precisa mais conhecer portas ou endereços IP.

## [1.1] — 2026-08-03
### Fixed

- **Storage**: card exibia `NaN` (causa: `format: size` do customapi para números). Corrigido com contagens da API e `format: number`.
- **Bookmarks**: erro `URL constructor: undefined` (causa: bookmarks sem `description` disparam `new URL(href)`). Adicionadas descriptions.
- **Links/ícones**: revisão completa de hrefs e ícones.
- **Agendamento liga/desliga**: CORS na API (preflight 404), botão ⚡ com timing correto, `Persistent=false` no timer `night-off` (evita catch-up) e `restart: unless-stopped` no container da API.

### Changed

- **Navegação**: hover, feedback de clique e responsividade.
- Card **Storage** com contadores fixos (Usuários, Compartilhado, Mídia, Documentos).
- Card **Meus Arquivos** mostra espaço utilizado.
- Card **Dispositivos** (preview) no modo Sistema.
- **Documentação**: reorganizada em `docs/` (técnica) e `planning/` (evolução).

### Added

- **Painel "Hoje"**: `GET /api/v1/events` (backup, dispositivo, boot) + card no modo Sistema.
- **Favoritos**: grupo de acesso rápido configurável.
- **Agendamento na Homepage**: `GET/PUT /api/v1/power` + modal ⚡ para configurar horários.
- **Cache TTL** na API (status ~10s; chamadas repetidas ~160x mais rápidas).
- **Planejamento**: `planning/vision.md`, `planning/strategy.md`, `planning/roadmap/`, `planning/backlog/`.
- **PRINCIPLES.md**: regras de maturidade e definição oficial de Módulo.

## [1.0] — 2026-08-02

### Added

- **Storage**: módulo `storage.sh`, estrutura oficial em `/srv/storage`, campo no `/status`.
- **Users + Adapters**: camada `core/adapters/`; `hs user create/info/password/rm`; `PUT /users/:nome`.
- **Homepage**: modos **Usuário / Administrador / Sistema** (progressivos); `hideErrors`.
- **API**: `GET /storage`, `/services`, `POST /backup`, `PUT /users`, `GET /devices`.
- **Devices**: `devices.sh` + `mounts.sh`; **udev auto-mount** em `/srv/storage/devices/`.
- **Hardware**: `hardware.sh` (temperatura hwmon, smartctl, rede, USB); `GET /api/v1/hardware`.
- **Automation**: hooks extensíveis em `/srv/automation/hooks/<evento>/`.
- **Scheduler**: `scheduler.sh` com backend systemd timers; `config/scheduler.conf`.
- **Notifications**: estrutura de canais plugáveis (`core/adapters/notification/`).
- **CI/CD**: GitHub Actions (shellcheck + testes + typecheck + build); Publish automático.
- **Licença**: Apache 2.0.

### Changed

- Nova arquitetura em camadas: Foundation → Adapters → Infrastructure → Applications.
- Homepage reorganizada por modos de exibição.
- Gitea corrigido (ROOT_URL/DOMAIN → 192.168.1.10).
- Storage migrado para `/srv/storage` + `/srv/services`.

### Fixed

- Acesso da homepage ao docker.sock (PGID=989).
- `get_uptime` portátil (BusyBox).
- Shellcheck no CI (SC2010/2011/2120).
