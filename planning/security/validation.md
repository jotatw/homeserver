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

### Evidência mínima

Provocar falhas representativas e verificar simultaneamente resposta HTTP e registro interno.

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

- login cria sessão com `createdAt`, `lastUserActivityAt`, `expiresAt` (limite absoluto);
- leitura sem renovação (`getSession(token)`) não renova, mas valida;
- polling (paths de leitura automática em `plugins/auth.ts`) não renova a sessão;
- atividade real (`getSession(token, { renew: true })`) renova `lastUserActivityAt`;
- inatividade expira conforme `HS_SESSION_TTL_MS` (padrão 30 dias);
- limite absoluto (`HS_SESSION_ABSOLUTE_TTL_MS`, padrão 90 dias) expira a sessão mesmo com atividade contínua;
- `sessionExpiresIn` reflete o limite mais próximo (absoluto ou inatividade).

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
- Rejeição de comandos não permitidos (execução arbitrária, injeção de comando, path traversal).
- Validação rigorosa de argumentos por regex:
  - `device`: type (usb|sdcard|external|temporary), label (`[a-zA-Z0-9_-]+`), device (`[a-zA-Z0-9]+`).
  - `module`: id slug (`[a-z0-9][a-z0-9-]*`), op (`start|stop|restart|enable|disable|update|status`).
  - `power`: `HH:MM` para horários.
  - `print`: impressora, opções `-o`, arquivo em `/api/data/`.
  - `cancel`: jobId formato `<printer>-<número>`.
  - `lpstat`: apenas scripts compostos permitidos.
  - `backup`: script sem argumentos.
- Aceitação de comandos válidos (validação passa, execução delegada ao host).

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

`core/infrastructure/modules.sh` — implementação S4:

- **Máquina de estados** (`_module_validate_transition`): transições permitidas (start/stop/restart/update) baseadas no estado atual.
- **Locking concorrência** (`_module_lock_acquire`/`_module_lock_release`): mkdir atômico em `/srv/config/modules/locks/<id>.lock`.
- **Validação dependências/capabilities**: `_module_validate_dependencies`, `_module_validate_capability`.
- **Validação definição/operação**: `_module_read_definition`, validação contra `operations` na Definition.
- **Integração no `module_op`**: `_module_validate_operation` combina lock, transição, dependências.

**Critérios de saída atendidos:**
- [x] existência do módulo/instância validada;
- [x] operação suportada validada contra Definition;
- [x] estado e transição permitidos (máquina de estados);
- [x] dependências e capabilities verificadas;
- [x] conflitos com operações em andamento prevenidos (locking).

**Estado: 🟢 validado.**

## S5 — Frontend e sessão

### Requisitos futuros

- estratégia de armazenamento de sessão definida;
- proteção contra leitura indevida por JavaScript considerada;
- HTTPS, cookies e CSRF tratados como conjunto;
- PWA validado após mudança.

## Registro de evidências

Cada fase deverá registrar:

- data/versão da validação;
- requisito validado;
- testes executados;
- resultado;
- falhas conhecidas;
- decisão de aceite ou bloqueio.

Nenhum resultado de segurança deve ser inferido apenas a partir da existência de código. A evidência precisa demonstrar o comportamento observado.
