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
- Recuperação automática de serviços por watchdog configurável.
- Validação diária do último backup.
- Scheduler integrado à API e à interface administrativa conforme a capacidade implementada.

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

As entradas abaixo preservam versões, sprints, correções e estados anteriores para rastreabilidade. Elas não definem o estado atual, o roadmap ativo ou suporte formal.

### v2.0.0-rc.1 (2026-08-05) — experimental

#### Fixed (acceptance tests)

- Tema e sair inacessíveis no desktop: sidebar sem scroll escondia os botões em telas baixas; corrigido com scroll e delegação de eventos.
- Bottom navigation mobile quebrada por seletor incompatível com a estrutura real; corrigida no container utilizado.
- Mobile recebeu drawer para ações de perfil, tema e sair.
- Aplicações receberam tratamento de nomes longos e melhoria de interação dos cards.
- Armazenamento passou a manter a seção de dispositivos visível e a exibir feedback para desmontagem.
- Cache dos estáticos do App foi ajustado para evitar versões antigas durante o desenvolvimento.

#### PWA instalável

- `manifest.json` com modo standalone, ícones e `theme_color`.
- App e login registravam manifest e service worker mínimo como base para evolução futura.

#### Polling (Meu espaço)

- Dashboard atualizava periodicamente e realizava refresh ao recuperar foco, conforme o comportamento daquele estado histórico.

#### Contrato App ↔ API

- O contrato entre interface e API passou a ser documentado explicitamente, com comunicação pela API oficial.

#### Known Issues daquele estado

- Navegação de arquivos não disponível diretamente no App; FileBrowser permanecia o ponto de acesso.
- Operações completas de serviços no App permaneciam pendentes.
- Histórico de métricas não estava disponível.
- Offline completo do App permanecia como evolução futura.

### Sprints 0-7 — histórico de implementação

#### Sprint 7 — Integrations

- API Tokens para integrações externas, com criação, listagem, revogação e permissões restritas.
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

### Histórico anterior

Versões e estados anteriores a essa consolidação permanecem disponíveis no histórico Git do repositório. O changelog atual preserva os principais marcos necessários para compreender a evolução, enquanto o Git continua sendo a fonte de rastreabilidade completa de cada alteração.
