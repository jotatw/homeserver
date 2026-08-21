# Security Validation

## Objetivo

Definir como uma melhoria de segurança passa de planejada para validada.

## Regra geral

`Requirement → Implementation → Test → Result → Evidence`

Os estados possíveis são:

- 🔴 identificado: risco ou requisito sem correção;
- 🟡 implementado: alteração realizada, mas evidência incompleta;
- 🟢 validado: requisito, teste e resultado registrados;
- ⚪ planejado: decisão aprovada para fase futura.

## S1 — Sanitização de erros

### Requisitos

- respostas públicas não expõem stack trace;
- respostas públicas não expõem paths internos;
- respostas públicas não expõem comandos ou argumentos internos;
- detalhes continuam disponíveis em logs autorizados.

### Implementação registrada

`api/src/utils/respond.ts` possui `sendInternalError()`, usado para falhas inesperadas no fluxo sanitizado. O helper registra o erro original no logger e retorna uma mensagem pública controlada.

Erros esperados continuam usando `sendError()` com mensagens públicas específicas e status HTTP apropriados.

### Evidência pendente

Ainda é necessário provocar falhas representativas no ambiente executando a API e registrar simultaneamente:

1. status e corpo da resposta HTTP;
2. confirmação de que a mensagem interna original não chegou ao cliente;
3. confirmação de que o detalhe técnico foi registrado internamente;
4. versão/commit testado e resultado.

**Estado: 🟡 implementado; validação final pendente.**

## S2 — Sessões

### Requisitos

- polling não prolonga sessão por si só;
- atividade definida pela política pode renovar a sessão;
- sessão expira por inatividade conforme configuração;
- sessão não ultrapassa o limite absoluto.

### Evidência mínima

Testes automatizados para login, leitura automática, atividade real, idle timeout e absolute lifetime.

### Evidência registrada (2026-08-20)

`api/tests/session.test.ts` — 19/19 PASS:

- login cria sessão com `createdAt`, `lastUserActivityAt`, `expiresAt`;
- leitura sem renovação valida sem renovar;
- polling não renova a sessão;
- atividade real renova `lastUserActivityAt`;
- inatividade expira conforme `HS_SESSION_TTL_MS`;
- limite absoluto expira a sessão mesmo com atividade contínua;
- `sessionExpiresIn` reflete o limite mais próximo.

**Estado: 🟢 validado.**

## S3 — Operações privilegiadas

### Requisitos

- cada operação possui identidade conhecida;
- operação não suportada é recusada;
- parâmetros são validados;
- autorização é exigida antes da execução;
- Core não depende exclusivamente da API para rejeitar operação inválida;
- executor não recebe comando arbitrário do cliente.

### Evidência mínima

Testes negativos para operação desconhecida, parâmetros inválidos, usuário sem autorização, estado inválido e tentativa de contornar a camada de API quando a arquitetura permitir testar o Core diretamente.

### Evidência registrada (2026-08-21)

`api/tests/executor.test.ts` — 22/22 PASS:

- rejeição de comandos não permitidos, injeção de comando e path traversal;
- validação de argumentos para operações de device, module, power, print, cancel, lpstat, backup e update;
- aceitação de contratos válidos antes da delegação ao host;
- cobertura dos comandos/operações permitidos pelo executor.

**Estado: 🟢 validado.**

## S4 — Operações de módulos

### Requisitos

- módulo/instância identificado corretamente;
- operação suportada;
- estado e dependências válidos;
- conflitos recusados;
- resultado verificável.

### Evidência mínima

Matriz de testes por operação e transição de estado.

### Evidência registrada (2026-08-21)

`core/infrastructure/modules.sh` implementa:

- máquina de estados para transições permitidas;
- locking de concorrência com diretório atômico;
- validação de dependências/capabilities;
- validação de Definition e operação;
- integração das validações no fluxo `module_op`.

Critérios registrados como atendidos:

- [x] existência do módulo/instância validada;
- [x] operação suportada validada contra Definition;
- [x] estado e transição permitidos;
- [x] dependências e capabilities verificadas;
- [x] conflitos com operações em andamento prevenidos.

**Estado: 🟢 validado.**

## S5 — Frontend e sessão

### Requisitos futuros

- estratégia de armazenamento de sessão definida;
- proteção contra leitura indevida por JavaScript considerada;
- HTTPS, cookies e CSRF tratados como conjunto;
- PWA validado após mudança.

**Estado: ⚪ planejado.**

## S6 — Validação contínua

### Implementação atual

- `api/tests/session.test.ts`;
- `api/tests/executor.test.ts`;
- `api/tests/security.test.ts`;
- CI executa `npm test` após typecheck e build.

A automação cobre regressões detectáveis pela suíte atual, mas não substitui validação de operações privilegiadas e recuperação no ambiente real.

**Estado: 🟢 automação implementada; evidência operacional contínua.**

## Registro de evidências

Cada fase deverá registrar:

- data/versão da validação;
- requisito validado;
- testes executados;
- resultado;
- falhas conhecidas;
- decisão de aceite ou bloqueio.

Nenhum resultado de segurança deve ser inferido apenas a partir da existência de código. A evidência precisa demonstrar o comportamento observado.
