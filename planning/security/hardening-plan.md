# Security Hardening Plan

## Objetivo

Fortalecer a segurança do HomeServer antes de ampliar funcionalidades administrativas e continuar a reorganização do App.

## Escopo

Este plano separa correções imediatas de mudanças estruturais dependentes da arquitetura modular M1.

## S0 — Baseline e evidência

Status: concluído como baseline inicial.

Registrar requisitos, implementação, testes e evidências. Uma correção sem evidência não é considerada validada.

## S1 — Sanitização de erros

Status: 🟡 implementado; validação final em ambiente real pendente.

Prioridade: P0.

Problema: detalhes internos podem ser retornados diretamente ao cliente.

### Implementação atual

- `api/src/utils/respond.ts` centraliza respostas públicas com `sendOk()` e `sendError()`.
- `sendInternalError()` registra o erro original no logger da requisição e retorna uma mensagem pública controlada.
- As rotas administrativas revisadas utilizam o helper para falhas inesperadas.
- Erros esperados de validação, autenticação, autorização e recursos inexistentes continuam usando mensagens públicas específicas e status HTTP apropriados.

Objetivo:

- [x] respostas públicas controladas;
- [x] detalhes técnicos encaminhados para logs internos;
- [ ] identificador de operação/correlação para operações relevantes — depende da evolução do Journal.

Critério de saída:

- [x] respostas de erro não devem expor stack trace, paths internos, comandos ou detalhes sensíveis no fluxo sanitizado;
- [x] diagnóstico completo permanece disponível no logger interno;
- [ ] falhas representativas devem ser executadas e registradas como evidência final.

## S2 — Sessões

Status: implementado e validado (2026-08-20). Ver `planning/security/validation.md`.

### S2.1 Atividade real versus polling

Prioridade: P0/P1.

Polling e leituras automáticas não devem prolongar indefinidamente a sessão. Renovação deve depender de atividade explicitamente definida.

Implementação:

- `getSession(token, { renew })` em `api/src/sessions.ts`: renova `lastUserActivityAt` somente quando `renew: true`.
- `api/src/plugins/auth.ts` define `isPollingPath(url)`: GETs de leitura automática do App (status, events, services, storage, hardware, power, devices, print, update) **não renovam** a sessão.
- `auth/session` (boot do App) renova: é atividade explícita do usuário, não polling.

### S2.2 Limite absoluto

Prioridade: P1.

A sessão deve possuir limite absoluto independente de `lastUserActivityAt`.

Modelo implementado:

- `createdAt`;
- `lastUserActivityAt` (renovado por atividade real);
- `expiresAt = createdAt + HS_SESSION_ABSOLUTE_TTL_MS` (padrão 90 dias; independente de atividade).

Valores iniciais definidos e testados durante a implementação:

- inatividade: `HS_SESSION_TTL_MS` = 30 dias (padrão);
- absoluto: `HS_SESSION_ABSOLUTE_TTL_MS` = 90 dias (padrão).

Critério de saída:

- [x] polling não renova a sessão por si só;
- [x] inatividade expira conforme política definida;
- [x] nenhuma sessão permanece válida além do limite absoluto;
- [x] testes cobrem login, atividade, polling e expiração (`api/tests/session.test.ts`, 19/19 PASS).

## S3 — Operações privilegiadas

Status: implementado e validado (2026-08-21). Ver `planning/security/validation.md`.

### Objetivo

A principal superfície de risco identificada é a fronteira entre API e operações privilegiadas no host.

Objetivo imediato:

`API → validação/autorização → contrato de operação → executor limitado → host`

Não é permitido ampliar uma interface genérica de execução arbitrária. Cada operação deve possuir identidade, parâmetros esperados e regras explícitas.

### Implementação (2026-08-21)

**1. Executor centralizado (`api/src/utils/executor.ts`)**

- `runOnHost(args, options)` — único ponto de execução de comandos no host via `nsenter`.
- **Allowlist estrita** de comandos permitidos: `bash` (com scripts curados), `lp`, `lpstat`, `cancel`.
- **Validação rigorosa de argumentos** por regex:
  - `device`: type (usb|sdcard|external|temporary), label (`[a-zA-Z0-9_-]+`), device (`[a-zA-Z0-9]+`).
  - `module`: id slug (`[a-z0-9][a-z0-9-]*`), op (`start|stop|restart|enable|disable|update|status`).
  - `power`: `HH:MM` para horários, subcomandos restritos.
  - `update os`: apenas `check|apply`.
  - `lp`: impressora, opções `-o chave=valor`, arquivo restrito a `/srv/git/homeserver/api/data/`.
  - `cancel`: jobId no formato `<printer>-<número>`.
  - `lpstat`: apenas scripts compostos pré-definidos (`full` e `active`).
  - `backup`: script `/srv/scripts/backup.sh` sem argumentos.
- Rejeita qualquer comando/argumento fora da allowlist com `ExecutorError`.

**2. Validações no Core (defesa em profundidade)**

- `core/infrastructure/mounts.sh`: validações regex para `type` (usb|sdcard|external|temporary), `label` (`[a-zA-Z0-9_-]+`), `device` (`[a-zA-Z0-9]+`).
- `core/infrastructure/power.sh`: já validava `HH:MM` via regex `^[0-9]{2}:[0-9]{2}$`.
- `core/infrastructure/modules.sh`: valida ID de módulo (`slug`) e operação contra Definition.

**3. Refatoração dos Adaptadores**

Todos os adaptadores que invocam comandos no host (`backup.ts`, `devices.ts`, `modules.ts`, `power.ts`, `print.ts`, `update.ts`) agora usam o executor centralizado `api/src/utils/executor.ts` — elimina duplicação de código e superfície de ataque.

**4. Testes Automatizados**

- `api/tests/executor.test.ts` — 22 testes cobrindo rejeição de comandos/argumentos inválidos, aceitação de comandos válidos e cobertura da allowlist.

**Critério de saída:**

- [x] allowlist bloqueia execução arbitrária e formatos inválidos;
- [x] parâmetros críticos são validados antes da execução;
- [x] Core mantém validações próprias em operações relevantes;
- [x] adaptadores revisados usam o executor centralizado;
- [x] testes do executor cobrem os contratos de validação.

## S4 — Defesa em profundidade para módulos

Status: implementado e validado (2026-08-21). Ver `planning/security/validation.md`.

### Objetivo

Defesa em profundidade para operações de módulos: validações em múltiplas camadas (API → Core → Engine) com máquina de estados, validação de dependências/capabilities e locking para concorrência.

### Implementação (2026-08-21)

- máquina de estados para transições permitidas;
- validação de Definition e operações suportadas;
- validação de dependências e capabilities;
- locking atômico por módulo em `/srv/config/modules/locks/<id>.lock`;
- integração das validações no fluxo `module_op`;
- atualização de estado e Journal após a execução.

**Critério de saída:**

- [x] existência do módulo/instância validada;
- [x] operação suportada validada contra Definition;
- [x] estado e transição permitidos;
- [x] dependências e capabilities verificadas;
- [x] autorização aplicada antes da operação;
- [x] conflitos com operações em andamento prevenidos.

## S5 — Sessão no frontend e XSS hardening

Status: ⚪ planejamento futuro.

Prioridade: P2.

O uso atual de token no `localStorage` será tratado como risco arquitetural futuro, não como migração isolada.

A evolução deverá considerar em conjunto:

- cookies `HttpOnly`;
- `Secure` quando HTTPS estiver ativo;
- `SameSite`;
- estratégia CSRF;
- CSP e revisão de superfícies XSS;
- comportamento PWA.

## S6 — Validação contínua

Status: 🟢 automação ampliada; evidências de ambiente real permanecem necessárias.

Toda melhoria deve seguir:

`Requirement → Implementation → Test → Result → Evidence`

A suíte de segurança cresce junto com o projeto. A CI executa a suíte completa da API via `npm test`, incluindo testes de sessão, executor e segurança. Regressões automatizadas nessas áreas devem bloquear o pipeline.

## Próximos passos

1. executar a validação final de S1 com falhas representativas no ambiente real;
2. registrar resultados e evidências em `planning/security/validation.md`;
3. continuar a evolução de S5 junto da arquitetura de sessão/frontend, sem migração isolada;
4. manter novas operações administrativas dentro do contrato do executor centralizado e da validação em camadas.
