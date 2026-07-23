# HomeServer Test Suite

## Objetivo

A Test Suite é responsável por validar automaticamente todos os módulos do HomeServer.

Seu objetivo é fornecer uma infraestrutura padronizada para criação, execução e manutenção dos testes do projeto.

A Test Suite segue a mesma filosofia arquitetural do HomeServer Core:

- responsabilidade única;
- reutilização;
- organização modular;
- fácil integração com CI/CD.

---

# Arquitetura

```
Usuário
    │
    ▼
Suite
    │
    ▼
Bootstrap
    │
    ▼
Core
    │
    ▼
Framework
    │
    ▼
Testes
```

---

# Estrutura

```
core/tests/

bootstrap.sh

common/
    runner.sh
    output.sh
    assert.sh
    utils.sh

foundation/
infrastructure/
docker/
network/
services/

docs/

suite_all.sh
suite_foundation.sh
suite_infrastructure.sh
suite_ci.sh
```

---

# Componentes

## bootstrap.sh

Responsável por inicializar toda a Test Suite.

### Responsabilidades

- localizar diretórios;
- carregar o HomeServer Core;
- carregar o framework da Test Suite;
- disponibilizar variáveis globais.

### Não faz

- executar testes;
- imprimir mensagens;
- validar resultados.

---

## runner.sh

Responsável pela execução das suítes.

### Responsabilidades

- executar testes;
- controlar execução;
- contabilizar resultados;
- retornar código de saída.

### Não faz

- assertions;
- output;
- localização de diretórios.

---

## output.sh

Responsável pela apresentação.

Funções previstas

- header
- section
- pass
- fail
- warning
- summary

---

## assert.sh

Responsável pelas validações.

Funções previstas

- assert_true
- assert_false
- assert_equals
- assert_not_equals

Especializações futuras

- assert_file_exists
- assert_directory_exists
- assert_command_exists

---

## utils.sh

Responsável pelas funções auxiliares.

Exemplos

- create_temp_workspace
- remove_temp_workspace
- random_name
- temporary_file

---

# Fluxo

```
suite_all.sh

↓

bootstrap.sh

↓

core/bootstrap.sh

↓

runner.sh

↓

output.sh

↓

assert.sh

↓

teste
```

---

# Filosofia

Cada componente possui uma única responsabilidade.

A infraestrutura da Test Suite deve permanecer desacoplada da implementação dos testes.

Os testes devem conter apenas a lógica de validação.

Todo código de infraestrutura deve permanecer centralizado no framework da Test Suite.

---

# Roadmap

## Sprint 1

- Arquitetura
- Bootstrap

## Sprint 2

- Runner

## Sprint 3

- Output

## Sprint 4

- Assertions

## Sprint 5

- Refatoração dos testes