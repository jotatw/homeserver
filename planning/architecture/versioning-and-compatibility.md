# Versionamento e Compatibilidade

## Princípio

Não existe uma única propriedade genérica chamada `version`. Toda versão deve possuir proprietário e escopo explícitos.

## Dimensões

```text
Platform Version
Module Contract Version
Definition Version
Implementation Version
State/Data Format Version
```

Essas dimensões podem evoluir independentemente.

## Compatibilidade

Compatibilidade não é igualdade literal entre números de versão.

```text
component
    ↓ declares compatibility
Core
    ↓ evaluates rules
accepted / rejected
```

Quando relevante, a direção também deve ser explícita: compatibilidade com versões anteriores e compatibilidade com versões futuras não são equivalentes.

## Update

Uma atualização deve analisar antes de executar:

- contratos afetados;
- Definitions e Instances afetadas;
- implementação;
- configuração;
- estado persistido;
- recursos e ownership;
- integrações;
- migrações;
- limites de rollback ou recuperação.

## Migration

`Update` e `Migration` são conceitos separados. Uma atualização pode exigir nenhuma, uma ou várias migrações.

Uma Migration deve possuir origem, destino, condições de aplicabilidade, escopo e estratégia de reversibilidade ou recuperação.

## Troca de implementação

Substituir uma Implementation é uma transição planejada, não simplesmente remover uma tecnologia e instalar outra. Pode exigir transformação de configuração, migração de estado, preservação de dados, reconciliação de integrações e rebinding de recursos.

## Evidência

```text
DECLARED COMPATIBLE
    ≠
VALIDATED COMPATIBLE
```

Declarações de compatibilidade precisam de validações ou testes proporcionais ao risco da alteração.
