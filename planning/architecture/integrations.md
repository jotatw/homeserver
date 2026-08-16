# Integrações

## Objetivo

Uma integração não é o próprio módulo. O modelo separa a necessidade declarada da realização concreta.

```text
MODULE DEFINITION
    ↓ declares
INTEGRATION REQUEST
    ↓ realized for
MODULE INSTANCE
```

Exemplos de integração incluem entradas do App, rotas, itens de menu e outros pontos de exposição controlados pela plataforma.

## Regras

1. A Definition declara a necessidade arquitetural de integração.
2. A realização concreta é associada à Instance.
3. Integrações possuem lifecycle e políticas próprios.
4. Uma mudança de estado do módulo não implica remoção automática da integração.
5. Módulos não modificam diretamente integrações compartilhadas sem mediação do Core.

## Request e realization

```text
REQUEST
    "preciso desta integração"

REALIZATION
    "esta instalação possui esta associação concreta"
```

Essa separação permite que múltiplas Instances tenham realizações diferentes sem alterar a Definition.

## Relação com operações

Operações devem respeitar a política da integração. `disable`, `uninstall` e `purge` podem ter efeitos diferentes, definidos explicitamente conforme o tipo de integração.

## Invariante

```text
MODULE ≠ ROUTE
MODULE ≠ MENU ITEM
MODULE ≠ APPLICATION ENTRY
```

O lifecycle de cada elemento deve permanecer explícito.
