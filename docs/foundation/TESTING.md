# Infrastructure Testing

## Objetivo

Este documento descreve a estratégia de testes da camada Infrastructure.

Os testes garantem que os módulos funcionem corretamente e continuem compatíveis durante a evolução do HomeServer.

---

# Objetivos

Os testes da Infrastructure devem verificar:

- funcionamento correto das APIs públicas;
- tratamento de erros;
- integração com a Foundation;
- comportamento esperado em diferentes cenários.

---

# Escopo

Cada módulo deve possuir testes independentes.

Exemplo:

core/
└── tests/
    └── infrastructure/
        ├── filesystem/
        ├── environment/
        ├── docker/
        ├── compose/
        ├── services/
        └── provisioning/

---

# Tipos de Teste

## Testes Unitários

Validam um único módulo.

Não devem depender de outros módulos da Infrastructure além das dependências documentadas.

---

## Testes de Integração

Validam a interação entre módulos.

Exemplos:

- Services + Compose
- Compose + Docker
- Docker + Environment

---

## Testes de Ambiente

Verificam requisitos do sistema.

Exemplos:

- Docker instalado.
- Docker Compose disponível.
- Permissões corretas.
- Diretórios obrigatórios existentes.

---

# Boas Práticas

Cada teste deve:

- possuir apenas um objetivo;
- ser independente;
- limpar recursos temporários ao finalizar;
- produzir mensagens claras.

---

# ShellCheck

Todos os scripts da Infrastructure devem permanecer compatíveis com o ShellCheck.

Nenhum módulo é considerado aprovado enquanto houver problemas relevantes.

---

# Critérios de Aprovação

Um módulo somente é considerado aprovado quando:

- documentação concluída;
- testes aprovados;
- ShellCheck aprovado;
- auditoria técnica concluída.