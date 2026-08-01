# HomeServer - Guia de Desenvolvimento

## Objetivo

Este documento define os padrões utilizados no desenvolvimento do HomeServer.

Toda implementação deve seguir estas diretrizes para manter o projeto simples, consistente e de fácil manutenção.

---

# Filosofia

- Comece pequeno.
- Evolua por etapas.
- Uma responsabilidade por módulo.
- Código simples é melhor que código complexo.
- Documentação explica o porquê, o código explica o como.

---

# Fluxo de Desenvolvimento

Cada funcionalidade deve seguir o seguinte fluxo:

Issue
↓
Interface
↓
Implementação
↓
Teste
↓
Review
↓
Commit
↓
Documentação

---

# Organização

Cada arquivo deve possuir apenas uma responsabilidade.

Exemplos:

- filesystem.sh
- storage.sh
- user.sh
- docker.sh
- compose.sh

---

# Estrutura dos Arquivos

Todos os arquivos da Foundation devem seguir a mesma organização.

```bash
#!/usr/bin/env bash

########################################
# Public API
########################################

########################################
# Private
########################################
```

---

# Convenções

## Funções públicas

Todas devem utilizar o prefixo correspondente ao módulo.

Exemplos:

```text
hs_fs_create_directory

hs_storage_init

hs_user_create

hs_service_start
```

---

## Funções privadas

Funções privadas devem iniciar com "_".

Exemplo:

```text
_hs_storage_validate

_hs_fs_create
```

---

## Variáveis

Utilizar nomes completos.

Correto:

```bash
directory

file

service

storage

configuration
```

Evitar abreviações.

---

# Responsabilidades

Cada função deve possuir apenas uma responsabilidade.

Evite funções que executem várias operações.

---

# Foundation

A Foundation:

- não imprime mensagens;
- não conhece módulos;
- não conhece serviços;
- não conhece Docker;
- não conhece FileBrowser.

A Foundation apenas fornece APIs reutilizáveis.

---

# Testes

Toda nova funcionalidade deve possuir testes.

Fluxo:

Preparação

↓

Execução

↓

Validação

↓

Limpeza

---

# Commits

Os commits devem ser pequenos.

Exemplos:

```text
feat(foundation): add hs_fs_create_directory

test(foundation): add filesystem create tests

refactor(foundation): simplify filesystem api
```

---

# Documentação

A documentação deve ficar na pasta `docs/`.

Comentários no código devem ser utilizados apenas para organização.

---

# Objetivo Final

Construir um HomeServer simples, modular, reutilizável e de fácil manutenção.