# Security Hardening Plan

## Objetivo

Fortalecer a segurança do HomeServer antes de ampliar funcionalidades administrativas e continuar a reorganização do App.

## Escopo

Este plano separa correções imediatas de mudanças estruturais dependentes da arquitetura modular M1.

## S0 — Baseline e evidência

Status: concluído como baseline inicial.

Registrar requisitos, implementação, testes e evidências. Uma correção sem evidência não é considerada validada.

## S1 — Sanitização de erros

Prioridade: P0.

Problema: detalhes internos podem ser retornados diretamente ao cliente.

Objetivo:

- respostas públicas controladas;
- detalhes técnicos apenas em logs e, quando aplicável, no Journal;
- identificador de operação ou correlação quando houver operação relevante.

Critério de saída:

- respostas de erro não expõem stack trace, paths internos, comandos ou detalhes sensíveis;
- diagnóstico completo continua disponível para investigação autorizada;
- testes cobrem falhas representativas.

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

- `api/tests/executor.test.ts` — 22 testes cobrindo:
  - Rejeição de comandos/argumentos inválidos (injeção, path traversal, formatos inválidos).
  - Aceitação de comandos válidos (validação passa).
  - Cobertura de todos os comandos da allowlist.

**Critério de saída:**

- [x] polling não renova a sessão por si só;
- [x] inatividade expira conforme política definida;
- [x] nenhuma sessão permanece válida além do limite absoluto;
- [x] testes cobrem login, atividade, polling e expiração (`api/tests/session.test.ts`, 19/19 PASS).
- [x] allowlist bloqueia injeção de comando, path traversal, formatos inválidos (`api/tests/executor.test.ts`, 22/22 PASS).

## S4 — Defesa em profundidade para módulos

Status: implementado e validado (2026-08-21). Ver `planning/security/validation.md`.

### Objetivo

Defesa em profundidade para operações de módulos: validações em múltiplas camadas (API → Core → Engine) com máquina de estados, validação de dependências/capabilities, e locking para concorrência.

### Implementação (2026-08-21)

**1. Máquina de estados / transições permitidas (`_module_validate_transition`)**

- `start`: só se não running/starting
- `stop`: só se running
- `restart`: só se running/stopped
- `update`: só se não ocupado (starting/stopping/updating)
- `enable/disable`: sempre permitidas (administrativas)
- `status`: sempre permitido

**2. Validação de dependências e capabilities**

- `_module_validate_dependencies`: lê `dependencies` da Definition e verifica se satisfeitas (logging por enquanto)
- `_module_validate_capability`: verifica se módulo declara capability requerida

**3. Locking para concorrência (`_module_lock_acquire` / `_module_lock_release`)**

- Lock baseado em diretório (mkdir atômico) em `/srv/config/modules/locks/<id>.lock`
- Impede operações concorrentes no mesmo módulo
- Liberado automaticamente ao final (`_module_op_finalize`)

**3. Validações de entrada no Core**

- `_module_read_definition`: validação completa da Definition (campos obrigatórios, id consistente)
- `module_instance_add`: validação de slug para nome de instância (`^[a-z0-9][a-z0-9-]*$`)
- `module_op`: valida operação contra Definition (`operations` list)

**4. Validação de transições (`_module_validate_transition`)**

Máquina de estados com transições permitidas:
- `start`: só se estado ≠ running/starting
- `stop`: só se estado == running
- `restart`: só se running/stopped
- `update`: só se não ocupado (starting/stopping/updating)
- `enable/disable`: sempre permitidas

**5. Integração no fluxo `module_op`**

- `_module_validate_operation`: combina check de conflitos, lock, transição, dependências
- Lock adquirido antes da operação, liberado no final (`_module_op_finalize`)
- Journal e state atualizados após execução

**Critério de saída:**

- [x] existência do módulo/instância validada;
- [x] operação suportada validada contra Definition;
- [x] estado e transição permitidos (máquina de estados);
- [x] dependências e capabilities verificadas;
- [x] autorização (via middleware API + validação Core);
- [x] conflitos com operações em andamento prevenidos (locking).

## S5 — Sessão no frontend e XSS hardening

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

Toda melhoria deve seguir:

`Requirement → Implementation → Test → Result → Evidence`

A suíte de segurança deve crescer junto com o projeto. Regressões em autenticação, autorização, sessões e operações privilegiadas devem ser bloqueadas antes de ampliar funcionalidades administrativas.

## Ordem de execução

1. S1 — sanitização de erros;
2. S2 — política de sessões;
3. validação e regressão;
4. inventário completo de privilégios e operações;
5. S3/S4 — desenho e implementação gradual da fronteira de operações;
6. S5 — evolução de sessão/frontend;
7. validação contínua em todas as fases.
