# HomeServer Core - Testes

A pasta `tests/` contém todos os testes do HomeServer Core.

O objetivo é validar cada biblioteca individualmente e garantir que todas funcionem corretamente quando utilizadas em conjunto.

---

# Filosofia

Todo componente do HomeServer Core deve possuir testes.

Os testes são desenvolvidos junto com a implementação e fazem parte do processo oficial de desenvolvimento.

Uma funcionalidade só é considerada concluída quando:

- A documentação estiver atualizada.
- A implementação estiver concluída.
- Os testes passarem.
- O Roadmap for atualizado.

---

# Estrutura

```
tests/

├── foundation/
│   ├── test_bootstrap.sh
│   ├── test_constants.sh
│   ├── test_config.sh
│   ├── test_output.sh
│   ├── test_validation.sh
│   └── test_lib.sh
│
├── infrastructure/
│   ├── test_filesystem.sh
│   ├── test_docker.sh
│   ├── test_network.sh
│   ├── test_system.sh
│   └── test_backup.sh
│
├── services/
│   └── test_service.sh
│
├── operations/
│   ├── control/
│   ├── query/
│   ├── protection/
│   ├── diagnostic/
│   └── administration/
│
├── smoke.sh
├── run.sh
└── README.md
```

---

# Tipos de Testes

O HomeServer Core utiliza quatro níveis de testes.

## 1. Teste Unitário

Valida apenas uma biblioteca.

Exemplo:

```
test_output.sh
```

Verifica:

- info()
- success()
- warn()
- error()

---

## 2. Teste de Integração

Valida a comunicação entre bibliotecas.

Exemplo:

```
bootstrap

↓

lib

↓

output
```

---

## 3. Teste Funcional

Valida um fluxo completo.

Exemplo:

```
deploy

↓

service

↓

docker

↓

resultado
```

---

## 4. Smoke Test

Executa verificações rápidas para confirmar que o Core está operacional.

Exemplo:

- Bootstrap
- Loader
- Foundation

---

# Como Executar

## Executar um teste específico

```bash
bash tests/foundation/test_bootstrap.sh
```

---

## Executar todos os testes da Foundation

```bash
bash tests/run.sh foundation
```

---

## Executar todos os testes

```bash
bash tests/run.sh
```

---

# Organização

Cada biblioteca possui um arquivo de teste correspondente.

Exemplo:

| Biblioteca | Teste |
|------------|--------|
| bootstrap.sh | test_bootstrap.sh |
| constants.sh | test_constants.sh |
| docker.sh | test_docker.sh |

---

# Padrões

Todo teste deve:

- Ser independente.
- Não alterar o ambiente permanentemente.
- Limpar arquivos temporários.
- Retornar código de saída.
- Informar claramente sucesso ou falha.

---

# Processo de Desenvolvimento

Toda nova funcionalidade segue o fluxo:

```
Especificação

↓

Implementação

↓

Teste

↓

Revisão

↓

Commit
```

---

# Objetivo

Garantir que o HomeServer Core evolua com segurança, mantendo estabilidade, previsibilidade e facilidade de manutenção.