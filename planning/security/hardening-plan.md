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

### S2.1 Atividade real versus polling

Prioridade: P0/P1.

Polling e leituras automáticas não devem prolongar indefinidamente a sessão. Renovação deve depender de atividade explicitamente definida.

### S2.2 Limite absoluto

Prioridade: P1.

A sessão deve possuir limite absoluto independente de `lastUserActivityAt`.

Modelo alvo:

- `createdAt`;
- `lastUserActivityAt`;
- `expiresAt`.

Valores iniciais serão definidos e testados durante a implementação; não ficam fixados neste documento antes da validação do comportamento real.

Critério de saída:

- polling não renova a sessão por si só;
- inatividade expira conforme política definida;
- nenhuma sessão permanece válida além do limite absoluto;
- testes cobrem login, atividade, polling e expiração.

## S3 — Operações privilegiadas

Prioridade: P0 arquitetural.

A principal superfície de risco identificada é a fronteira entre API e operações privilegiadas no host.

Objetivo imediato:

`API → validação/autorização → contrato de operação → executor limitado → host`

Não é permitido ampliar uma interface genérica de execução arbitrária. Cada operação deve possuir identidade, parâmetros esperados e regras explícitas.

Planejamento estrutural:

- inventariar todas as operações atuais;
- identificar chamador, autorização, alvo e privilégio;
- definir allowlist por operação;
- validar novamente no Core, sem confiar exclusivamente na API;
- reduzir capacidades genéricas do executor;
- integrar execução, resultado e falhas ao Operation Journal planejado na M1.

## S4 — Defesa em profundidade para módulos

Prioridade: P1.

Fluxo alvo:

`App → API validation → Core validation → Operation validation → Adapter/Executor`

O Core deve validar, quando aplicável:

- existência do módulo/instância;
- operação suportada;
- estado e transição permitidos;
- dependências e capabilities;
- autorização;
- conflitos com operações em andamento.

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
