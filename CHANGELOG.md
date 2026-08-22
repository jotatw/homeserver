# Changelog

Todas as mudanças notáveis no HomeServer são documentadas neste arquivo.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## Em desenvolvimento — evolução contínua

> Esta seção registra mudanças do estado atual do projeto após o Baseline v0.1.0. Ela não representa uma release, uma tag ou uma promessa automática de versão.

O Baseline v0.1.0 é a referência conceitual do estado inicial da consolidação. A evolução atual é organizada por `planning/roadmap/evolution.md` e validada por testes, documentação, uso real e outras evidências aplicáveis.

### Adicionado

- HTTPS local com CA interna: `hs tls` gera CA e certificados em `/srv/config/tls`, com SANs para `homeserver.local` e IP; Caddy utiliza o certificado gerado; renovação automática por tarefa `tls-renew`; guia `docs/install/tls-local.md`.
- Atualização de pacotes do sistema: `hs update os check|apply`, API `GET/POST /api/v1/update/os` e fluxo correspondente no App; execução via `systemd-run` para reduzir impacto de reinicializações de serviços durante atualizações.
- Executor centralizado para operações privilegiadas com allowlist e validação de argumentos.
- Defesa adicional para operações de módulos, incluindo validação de transições, locking e validação de dependências/capabilities declaradas.
- Tokens de API para integrações externas, com persistência de hash e revogação.
- Funcionalidades de impressão, incluindo fila, cancelamento, qualidade, status e pré-visualização conforme a capacidade implementada.
- Health Check ampliado para incluir load, memória e temperatura.
- Documentação organizada por objetivo em `docs/install/`, `docs/use/`, `docs/contribute/` e `docs/reference/`.
- Fundamentos de evolução e validação, critérios de qualidade, planejamento de interfaces e arquitetura modular documentados.
- Recuperação automática de serviços: `scripts/service-watchdog.sh` verifica os serviços habilitados a cada 15 min e reinicia os que não estiverem `running`, registrando no feed de eventos; desabilitável sem quebrar o núcleo.
- Validação diária de backup: `scripts/backup-check.sh` às 05:30 valida o último backup (`hs system backup validate`), registrando OK/INVÁLIDO no log que alimenta o feed.
- Scheduler no App (API+UI): `hs scheduler status`, executor com allowlist para `scheduler`, endpoints `GET /api/v1/scheduler` e `POST /api/v1/scheduler/:name/{enable,disable,run}` (admin) e seção "Tarefas agendadas" na Administração.

### Alterado

- Imagens e dependências foram revisadas e pinadas conforme o estado registrado no projeto; dependências EOL ou futuras substituições continuam sujeitas à evolução e validação.
- Autenticação e sessões passaram a distinguir atividade real de polling, com TTL de inatividade e limite absoluto independentes.
- Adapters e operações privilegiadas foram centralizados em contratos e validações adicionais.
- Agendamento de backup e energia foi consolidado no scheduler canônico após identificação de conflito com timers legados.
- A documentação passou a utilizar evolução contínua em vez de um caminho obrigatório por versões intermediárias.
- O roadmap ativo passou a ser `planning/roadmap/evolution.md`.
- O modelo de interfaces passou a distinguir Desktop como interface principal, Mobile como acesso rápido e CLI como interface avançada.
- Tags e Releases deixaram de ser utilizadas apenas para marcar etapas intermediárias de desenvolvimento.

### Segurança e privacidade

- Histórico Git revisado para remover dados pessoais identificados no projeto.
- Dry-run do instalador validado para evitar criação de diretórios ou credenciais durante simulação.
- Containers revisados para evitar `privileged` quando não necessário; serviços aplicáveis utilizam execução não-root e políticas de restart adequadas.
- Autorização administrativa validada nas rotas protegidas.
- Secrets permanecem fora do repositório.

### Validação registrada

A seção de desenvolvimento registra evidências históricas de execução, incluindo suites de infraestrutura, API, sessões, smoke tests, CLI e testes específicos de segurança. A validade atual dessas evidências deve ser confirmada novamente quando uma mudança relevante afetar o estado correspondente.

---

## Histórico

As seções abaixo preservam mudanças e versões anteriores para rastreabilidade. Elas não definem o estado atual nem representam suporte ativo.

### v2.0.0-rc.1 (2026-08-05) — experimental

### Fixed (acceptance tests)

- **Tema/sair inacessíveis** no desktop: sidebar sem scroll escondia os botões em telas baixas → `overflow-y: auto` + **event delegation global** (funciona mesmo se um render falhar).
- **Bottom nav mobile quebrada**: o CSS esperava `<nav>` interno, mas o HTML usa `<nav class="bottomnav">` → `display: flex` nunca aplicava (itens inacessíveis). Corrigido com `display: flex` no container real.
- **Mobile**: drawer `＋` (bottom sheet) com perfil, tema e sair — acesso completo no mobile.
- **Aplicações**: app-card com ellipsis no nome (sem quebrar caixas) + hover com elevação.
- **Armazenamento**: seção dispositivos sempre visível (vazia → "nenhum"); botão desmontar com loading e erro real.
- **Cache**: `Cache-Control: no-cache` nos estáticos do App durante o desenvolvimento.

### Release Process (histórico)

- `planning/release/`: processos e checklists de release registrados para evolução posterior.
- `planning/support/support-policy.md`: política de suporte atualizada posteriormente para um modelo baseado em releases oficiais.

### PWA instalável

- `manifest.json` com modo standalone, ícones e `theme_color`.
- App e login registram manifest e service worker mínimo como base para evolução futura.

### Polling (Meu espaço)

- Dashboard atualiza periodicamente e realiza refresh ao recuperar foco, conforme o comportamento registrado naquele momento.

### Contrato App ↔ API

- `api/README.md` documenta o contrato entre interface e API e a regra de comunicação pela API oficial.

### Known Issues

- Navegação de arquivos não disponível diretamente no App naquele estado; o FileBrowser permanecia o ponto de acesso ao fluxo de arquivos.
- Operações completas de serviços no App permaneciam pendentes naquele estado.
- Histórico de métricas não estava disponível.
- Offline completo do App permanecia como evolução futura.

### Sprints 0-7 (histórico)

#### Sprint 7 — Integrations

- API Tokens para integrações externas: listagem, criação com exibição única, revogação e autenticação de integração com permissões restritas.
- Persistência baseada em hash SHA-256 do token.
- Integração administrativa no App conforme o estado daquele sprint.

#### Sprint 6 — Devices

- Device Service para montagem, desmontagem e ejeção de dispositivos.
- Operações executadas no host com validação e autorização administrativa.
- Integração parcial na área de armazenamento do App.

#### Sprint 5 — System Experience

- Área Sistema ampliada com indicadores de CPU, memória, disco, uptime, checks de serviço, energia, rede e temperatura conforme o estado daquele sprint.

#### Sprint 4 — Services Experience

- Área Aplicações ampliada com busca, filtros, ordenação, status e estados vazios.

#### Sprint 3 — Storage Experience

- Área Armazenamento ampliada com informações de disco, estrutura de dados e dispositivos.
- CTA para FileBrowser enquanto a navegação de arquivos não era exposta pela API.

#### Sprint 2 — Workspace

- Design tokens aplicados ao App.
- Login e sessão por role.
- Navegação responsiva entre desktop e mobile.
- Dashboard inicial com status, estatísticas, atalhos e eventos.

#### Sprint 1 — Identity & Authentication

- Sessão com identidade e role.
- Separação entre autenticação e autorização.
- Validação de body e testes de sessão.
- ADR de identidade e autenticação.

---

> Outras entradas históricas permanecem preservadas abaixo desta seção no arquivo original quando aplicável. O histórico não redefine a documentação, o roadmap ou o suporte atuais.
