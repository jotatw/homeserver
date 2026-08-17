# Threat Model

## Escopo

Modelo inicial para orientar o hardening do HomeServer. Deve evoluir junto com a arquitetura modular e com a implementação das operações.

## Ativos a proteger

- contas e credenciais;
- sessões e tokens;
- dados persistentes dos usuários;
- configurações do servidor;
- backups;
- integridade dos módulos e serviços;
- capacidade de administrar o host;
- histórico de operações e evidências de auditoria.

## Fronteiras de confiança

### Cliente → API

A API é a fronteira entre interface e lógica privilegiada. Autenticação, autorização e validação não podem depender apenas do frontend.

### API → Core

A API valida formato e identidade do chamador. O Core mantém validação independente das regras de negócio, estado e operações.

### Core → Adapter/Implementation

O contrato do módulo limita o que uma implementação pode executar e quais recursos declara utilizar.

### Executor → Host

Esta é a fronteira de maior impacto. O executor deve receber somente operações previamente validadas e explicitamente suportadas.

## Ameaças prioritárias

### T1 — Exposição de detalhes internos

Risco: mensagens de erro revelarem paths, comandos ou detalhes de infraestrutura.

Mitigação: S1.

### T2 — Sessão prolongada por atividade automática

Risco: polling manter sessões ativas além da intenção do usuário.

Mitigação: S2.

### T3 — Comprometimento de uma camada alcançar o host

Risco: uma falha na API ampliar impacto por meio da fronteira privilegiada de execução.

Mitigação: S3, executor limitado e validação em camadas.

### T4 — Operação de módulo contornar regras de estado

Risco: uma operação chegar à implementação sem validação suficiente de estado, dependências ou conflitos.

Mitigação: S4 e contratos M1.

### T5 — Roubo de token após XSS

Risco: token acessível por JavaScript ser exfiltrado caso exista execução de script malicioso.

Mitigação futura: S5, cookies `HttpOnly` e hardening contra XSS.

## Princípios

### Defesa em profundidade

Nenhuma camada isolada é a única responsável pela segurança de uma operação crítica.

### Menor privilégio

Cada componente deve possuir apenas as capacidades necessárias.

### Fail closed

Quando identidade, autorização, estado ou operação não puderem ser validados, a operação deve ser recusada.

### Contratos explícitos

Operações e integrações privilegiadas não devem depender de comandos livres ou parâmetros com significado implícito.

### Auditabilidade

Operações relevantes devem produzir resultado rastreável sem expor detalhes sensíveis ao usuário final.

## Limitação do modelo atual

Este documento é um threat model inicial baseado na arquitetura e nos pontos revisados. Não substitui uma análise exaustiva de todos os arquivos, dependências, imagens de container, infraestrutura ou ambiente de produção.
