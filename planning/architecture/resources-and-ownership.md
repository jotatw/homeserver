# Recursos e Ownership

## Princípio

```text
USE
    ≠
OWNERSHIP
```

Utilizar um recurso não concede automaticamente o direito de removê-lo, migrá-lo ou destruí-lo.

## Categorias conceituais

Recursos podem pertencer à plataforma, ao módulo, exclusivamente à implementação ou ao usuário. Também podem ser dados derivados e reconstruíveis.

Ownership e persistência são dimensões independentes.

## Resource Requirement e Binding

A Definition declara o que necessita:

```text
RESOURCE REQUIREMENT
```

A Instance registra a associação concreta autorizada:

```text
RESOURCE BINDING
```

A associação não altera automaticamente o ownership do recurso.

## Recursos compartilhados e externos

Recursos compartilhados devem possuir owner e consumidores conhecidos. Remover um consumidor não autoriza remover o recurso.

Recursos externos exigem política explícita e não devem ser tratados como propriedade do módulo apenas porque foram referenciados por ele.

## Persistência e remoção

Antes de `uninstall` ou `purge`, a plataforma deve avaliar:

- owner;
- consumidores;
- compartilhamento;
- origem externa;
- política de persistência;
- elegibilidade para remoção.

`uninstall` remove presença operacional conforme política. `purge` possui escopo destrutivo explícito e continua sujeito às mesmas validações de ownership.

## Dados do usuário

Dados user-owned são protegidos contra remoção automática por operações de lifecycle de módulos.

## Substituição de implementação

A troca de Implementation deve preservar recursos fundamentais da plataforma e do usuário, tratando explicitamente dados exclusivos da implementação anterior e migrações necessárias.
