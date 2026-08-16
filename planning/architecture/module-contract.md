# Module Contract

## Separação estrutural

```text
MODULE DEFINITION
        ≠
MODULE INSTANCE
        ≠
DESIRED STATE
        ≠
OBSERVED STATE
        ≠
IMPLEMENTATION
```

## Module Definition

Declara identidade, versão do contrato, capacidades, dependências, requisitos de recursos, solicitações de integração, schema conceitual de configuração, regras de lifecycle e compatibilidade.

A Definition é declarativa e não registra fatos temporários de uma instalação.

## Module Instance

Representa uma realização concreta de uma Definition e pode conter:

- identidade da instância;
- referência à Definition;
- intenção administrativa;
- configuração;
- bindings de recursos;
- associações de integração;
- implementação selecionada;
- metadados da instância.

A Instance registra associações concretas, sem assumir ownership implícito sobre os recursos utilizados.

## Desired State

A intenção administrativa pertence à Instance. Ela permanece distinta do resultado operacional.

```text
desired: enabled
observed: unavailable
```

Essa divergência é válida e deve permanecer visível.

## Observed State

Registra fatos observados, como estado operacional, saúde, disponibilidade, momento da observação e informações diagnósticas apropriadas.

Detalhes específicos de tecnologia não são campos universais do contrato.

## Implementation

A Implementation realiza tecnicamente a Instance. Ela declara compatibilidade; não redefine unilateralmente a identidade ou as regras do módulo.

Uma substituição de implementação exige validação de compatibilidade, recursos, estado, integrações e migrações aplicáveis.

## Configuration, Binding e Observation

- **Configuration:** valor desejado ou declarado.
- **Binding:** associação concreta autorizada.
- **Observed State:** valor efetivamente observado.

Essas dimensões não devem duplicar uma à outra sem uma regra explícita de fonte de verdade.

## Operações

Operações possuem alvo concreto em uma Instance e são avaliadas contra Definition, contratos, intenção administrativa e estado observado.
