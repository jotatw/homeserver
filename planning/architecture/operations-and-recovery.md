# Operações e Recuperação

## Operação não é estado

Uma operação é uma tentativa controlada de produzir uma mudança. Estado descreve uma situação desejada ou observada.

Cada execução possui identidade própria e alvo explícito.

## Fluxo

```text
CALLER
    ↓
OPERATION REQUEST
    ↓
CORE
    ├── authorize
    ├── validate
    ├── analyze impact
    ├── plan
    ├── execute
    ├── observe
    └── verify
            ↓
      OPERATION JOURNAL
```

Interfaces, App, CLI e automações solicitam operações; a coordenação permanece no Core.

## Pré-validação

Antes da execução, devem ser avaliados conforme a operação:

- existência e estado do alvo;
- dependências e dependentes;
- ownership e recursos compartilhados;
- compatibilidade;
- integrações;
- persistência e política de dados;
- migrações e recuperação.

## Plano

Operações complexas devem possuir plano explícito com validações, recursos afetados, integrações, migrações, etapas e limites de recuperação.

## Lifecycle operacional

```text
REQUESTED
    ↓
VALIDATING
    ↓
PLANNED
    ↓
EXECUTING
    ↓
VERIFYING
    ↓
SUCCEEDED
```

Resultados alternativos incluem `REJECTED`, `FAILED` e `INTERRUPTED`.

## Sucesso exige verificação

```text
COMMAND EXECUTED
    ≠
OPERATION SUCCEEDED
```

O resultado esperado deve ser observado e validado.

## Journal

Logs técnicos e Journal possuem responsabilidades diferentes.

- **Log:** diagnóstico técnico.
- **Journal:** registro estruturado da operação, etapas, observações e resultado.

Operações compostas devem preservar progresso suficiente para diagnóstico e recuperação.

## Interrupção e reconciliação

Após uma interrupção, a plataforma não deve repetir cegamente a operação.

```text
inspect journal
    ↓
observe actual state
    ↓
compare with expected state
    ↓
reconcile
    ↓
recover / repair / continue / abort
```

A incerteza é um resultado válido quando o estado final não pode ser determinado com segurança.

## Destruição

`uninstall` e `purge` são operações distintas. Operações destrutivas devem declarar explicitamente os dados e recursos que podem ser removidos e respeitar ownership, compartilhamento e políticas de preservação.

## Concorrência

Operações incompatíveis sobre o mesmo alvo ou recursos compartilhados devem ser arbitradas. O mecanismo concreto permanece aberto.

## Minimização de dados

O Journal deve registrar evidências suficientes sem persistir desnecessariamente senhas, tokens, segredos ou outros dados sensíveis.
