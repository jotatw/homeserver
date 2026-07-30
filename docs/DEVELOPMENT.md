# HomeServer Development Guide

## Objetivo

Este documento define os padrões utilizados durante o desenvolvimento do HomeServer.

Seu objetivo é garantir consistência entre módulos, documentação e arquitetura.

---

# Fluxo de Desenvolvimento

Toda nova funcionalidade deve seguir a sequência abaixo.

1. Planejamento
2. Documentação
3. Implementação
4. Testes
5. ShellCheck
6. Auditoria técnica
7. Aprovação

Nenhuma funcionalidade é considerada concluída antes da aprovação.

---

# Organização do Código

Cada módulo deve possuir apenas uma responsabilidade.

Evite módulos grandes ou que concentrem funcionalidades distintas.

Quando um módulo começar a crescer excessivamente, considere dividi-lo.

---

# Convenções

## Variáveis

- Utilizar nomes descritivos.
- Preferir `readonly` quando aplicável.
- Utilizar `local` dentro das funções.

---

## Funções Públicas

Devem representar a API do módulo.

Exemplo:

```bash
create_directory
remove_directory
file_exists
```

---

## Funções Privadas

Devem iniciar com `_`.

Exemplo:

```bash
_initialize
_load_module
_validate_input
```

---

## Retornos

As funções devem retornar códigos de saída.

Evite imprimir mensagens diretamente, exceto nos módulos responsáveis por saída.

---

# Dependências

Cada camada depende apenas da camada imediatamente inferior.

Foundation

↓

Infrastructure

↓

Applications

Nunca utilizar dependências inversas.

---

# Documentação

Toda decisão arquitetural relevante deve ser documentada.

A documentação deve representar apenas funcionalidades implementadas e aprovadas.

---

# Testes

Todo módulo deve possuir testes independentes.

Os testes devem validar:

- casos de sucesso;
- casos de erro;
- comportamento esperado.

---

# ShellCheck

Todos os scripts devem permanecer compatíveis com o ShellCheck.

Avisos devem ser corrigidos sempre que possível.

---

# Filosofia

Antes de adicionar uma nova funcionalidade, pergunte:

- Ela realmente é necessária?
- Pode reutilizar algo existente?
- Mantém a simplicidade do projeto?

Se a resposta for negativa, reavalie a implementação.