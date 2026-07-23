# HomeServer Test Framework

O Test Framework é responsável por validar o funcionamento do HomeServer Core.

Seu objetivo é fornecer testes simples, reutilizáveis e consistentes para todas as bibliotecas do projeto.

---

# Arquitetura

```
run.sh
    │
    ▼
runner.sh
    │
    ▼
test.sh
    │
    ▼
assert.sh
    │
    ▼
Bibliotecas
```

---

# Responsabilidades

## run.sh

Ponto de entrada do framework.

Responsável por iniciar os testes.

---

## runner.sh

Localiza e executa os testes.

---

## test.sh

Padroniza a apresentação dos testes.

---

## assert.sh

Fornece funções de validação.

---

# Fluxo

```
Executar

↓

Validar

↓

Resultado

↓

Resumo
```

---

# Objetivo

Todo teste deve ser simples, previsível e reutilizável.