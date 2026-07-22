# HomeServer Core

O HomeServer Core é o framework responsável pela administração do HomeServer.

Seu objetivo é abstrair a complexidade do Linux, Docker e da infraestrutura através de uma arquitetura simples, modular e reutilizável.

---

# Missão

Fornecer uma plataforma de administração consistente, automatizada e de fácil manutenção para todos os serviços do HomeServer.

---

# Visão

O administrador deve executar tarefas utilizando comandos simples.

Exemplo:

hsctl deploy homepage

Ao invés de:

docker compose pull
docker compose up -d
docker compose logs
docker compose ps

---

# Filosofia

O Core segue cinco princípios.

## Simplicidade

Toda funcionalidade deve ser simples de utilizar.

## Modularidade

Cada biblioteca possui apenas uma responsabilidade.

## Reutilização

Uma funcionalidade é implementada apenas uma vez.

## Padronização

Todos os scripts possuem o mesmo comportamento.

## Evolução

Novas funcionalidades devem ser adicionadas sem alterar a arquitetura existente.

---

# Arquitetura

```
                 Usuário
                     │
                     ▼
              Interface (hsctl)
                     │
                     ▼
               Operations
                     │
                     ▼
                 Services
                     │
                     ▼
             Infrastructure
                     │
                     ▼
                Foundation
                     │
                     ▼
            Linux / Docker Engine
```

---

# Camadas

## Foundation

Responsável pelos recursos básicos do Core.

Bibliotecas:

- output.sh
- validation.sh
- config.sh
- constants.sh
- lib.sh

---

## Infrastructure

Responsável pela comunicação com o sistema operacional.

Bibliotecas:

- filesystem.sh
- docker.sh
- network.sh
- system.sh
- backup.sh

---

## Services

Responsável pelas regras de negócio do HomeServer.

Bibliotecas:

- service.sh

---

## Operations

Responsável pelos fluxos de administração.

Exemplos:

- deploy.sh
- install.sh
- restart.sh
- update.sh
- doctor.sh

---

## Interface

Responsável pela interação com o administrador.

Exemplo:

hsctl

---

# Ciclo de Vida

Todo script segue o mesmo fluxo.

```
Script

↓

lib.sh

↓

Foundation

↓

Infrastructure

↓

Services

↓

Operation

↓

Resultado
```

---

# Fluxo de Desenvolvimento

Toda nova funcionalidade segue obrigatoriamente o seguinte processo.

```
Ideia

↓

Planejamento

↓

Especificação

↓

Implementação

↓

Teste

↓

Homologação

↓

Documentação
```

Nenhuma implementação deve começar antes da especificação.

---

# Regras

## Uma responsabilidade

Cada biblioteca deve possuir apenas uma responsabilidade.

---

## Baixo acoplamento

Bibliotecas não devem conhecer detalhes internos umas das outras.

---

## Alta coesão

Funções semelhantes devem permanecer juntas.

---

## Dependências

As dependências seguem apenas um sentido.

```
Interface

↓

Operations

↓

Services

↓

Infrastructure

↓

Foundation
```

Nunca no sentido contrário.

---

# Estrutura

```
core/

docs/

common/

infrastructure/

services/

operations/

interface/
```

---

# Objetivos da V1

Ao final da primeira versão o Core deverá permitir:

- Deploy de serviços
- Atualização de serviços
- Reinício de serviços
- Consulta de logs
- Backup
- Restauração
- Diagnóstico
- Status do servidor

Tudo através de uma interface padronizada.

---

# Objetivos futuros

- Plugins
- TUI
- Interface Web
- Agendamentos
- API REST
- Suporte a múltiplos hosts
- Cluster doméstico

---

# Princípio Fundamental

A complexidade pertence ao Core.

A simplicidade pertence ao usuário.