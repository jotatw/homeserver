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

## S4 — Operações de módulos

### Requisitos

- módulo/instância identificado corretamente;
- operação suportada;
- estado e dependências válidos;
- conflitos recusados;
- resultado verificável.

### Evidência mínima

Matriz de testes por operação e transição de estado.

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
