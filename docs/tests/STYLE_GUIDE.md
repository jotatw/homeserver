# Testing Guide

Toda biblioteca criada para o HomeServer Core deve possuir testes.

---

# Processo

Especificação

↓

Implementação

↓

Teste Unitário

↓

Teste de Integração

↓

Smoke Test

↓

Commit

---

# Organização

Cada biblioteca possui um teste correspondente.

Exemplo

bootstrap.sh

↓

test_bootstrap.sh

---

# Padrões

Todo teste deve:

- Ser independente.
- Não modificar permanentemente o sistema.
- Retornar código de saída.
- Ser reproduzível.
- Ser documentado.

---

# Definition of Done

Uma biblioteca só é considerada concluída quando:

- Documentação concluída.
- Código implementado.
- Testes unitários aprovados.
- Integração aprovada.
- Smoke Test aprovado.