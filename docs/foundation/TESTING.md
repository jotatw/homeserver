# Testing

## Objetivo

Este documento descreve a estratégia de testes adotada pela Foundation.

Seu objetivo é garantir que todos os módulos da Foundation sejam validados de forma consistente, independente e previsível.

Os testes fazem parte do processo de desenvolvimento e aprovação de cada módulo.

---

# Princípios

A estratégia de testes da Foundation é baseada nos seguintes princípios:

- Cada módulo deve ser testado individualmente.
- Os testes devem ser independentes entre si.
- Os testes devem ser reproduzíveis.
- A aprovação de um módulo depende da execução bem-sucedida de seus testes.
- A documentação deve refletir apenas funcionalidades aprovadas.

---

# Organização

Os testes são organizados por módulo.

Cada módulo da Foundation possui sua própria suíte de testes, permitindo sua validação de forma isolada.

Essa organização facilita a identificação de regressões e simplifica a manutenção da suíte de testes.

---

# Escopo

Os testes da Foundation verificam apenas o comportamento da própria Foundation.

Não fazem parte do escopo:

- Infrastructure
- Applications
- Serviços externos
- Regras de negócio

---

# Processo de Validação

Cada módulo deve seguir o mesmo processo de validação.

1. Revisão técnica.
2. Refatoração (quando necessária).
3. Execução da suíte de testes.
4. Verificação com ShellCheck.
5. Aprovação do módulo.
6. Atualização da documentação.

Somente após essas etapas o módulo é considerado estável.

---

# ShellCheck

Todo código da Foundation deve ser analisado com ShellCheck.

O objetivo é identificar:

- erros comuns;
- problemas de portabilidade;
- práticas inseguras;
- inconsistências de estilo.

Avisos ignorados devem ser justificados e documentados.

---

# Critérios de Aprovação

Um módulo é considerado aprovado quando:

- sua responsabilidade está claramente definida;
- sua implementação atende à arquitetura da Foundation;
- todos os testes são aprovados;
- não existem erros relevantes apontados pelo ShellCheck;
- sua documentação foi atualizada.

---

# Evolução

A estratégia de testes poderá evoluir conforme a Foundation crescer.

Novas ferramentas ou tipos de teste poderão ser incorporados desde que mantenham a simplicidade e a previsibilidade do processo de validação.