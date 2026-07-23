# Runner

## Objetivo

O Runner é o componente responsável por executar as suítes de testes do HomeServer.

Ele centraliza toda a lógica de execução, contabilização de resultados e retorno da suíte.

O Runner não possui conhecimento sobre os módulos do HomeServer (Foundation, Infrastructure, Docker, etc.), apenas sobre testes.

---

# Responsabilidades

O Runner é responsável por:

- Inicializar uma suíte de testes;
- Executar testes individuais;
- Contabilizar resultados;
- Exibir o resumo da execução;
- Retornar o código de saída da suíte.

---

# Não é responsabilidade do Runner

O Runner não deve:

- localizar diretórios;
- carregar bibliotecas;
- realizar assertions;
- imprimir mensagens específicas dos testes;
- conhecer módulos do HomeServer.

---

# Estado

O Runner mantém apenas o estado da suíte atual.

Variáveis:

HS_TEST_CURRENT_SUITE

HS_TEST_TOTAL

HS_TEST_PASS

HS_TEST_FAIL

---

# API Pública

## initialize_suite()

Descrição

Inicializa uma nova suíte de testes.

Parâmetros

- Nome da suíte.

Retorno

- Nenhum.

---

## run_test()

Descrição

Executa um único teste.

Parâmetros

- Nome do teste;
- Caminho do script.

Retorno

- Atualiza os contadores internos.

---

## tests_passed()

Descrição

Verifica se todos os testes passaram.

Retorno

- true
- false

---

## tests_failed()

Descrição

Verifica se existe algum teste com falha.

Retorno

- true
- false

---

## show_summary()

Descrição

Apresenta o resumo da suíte.

Retorno

- Nenhum.

---

## suite_exit_status()

Descrição

Retorna o código de saída da suíte.

Retorno

0 → sucesso

1 → falha

---

# Fluxo

```
initialize_suite()

↓

run_test()

↓

run_test()

↓

...

↓

show_summary()

↓

suite_exit_status()
```

---

# Evolução

Versão 1

- Execução;
- Contadores;
- Resumo;
- Exit Code.

Versão 2

- Tempo de execução;
- Percentual de sucesso;
- Modo silencioso;
- Integração com CI;
- Relatórios.