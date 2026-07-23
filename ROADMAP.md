# HomeServer Core Roadmap

Este documento define o planejamento de desenvolvimento do Core do HomeServer.

O objetivo é acompanhar a evolução do framework de administração e manter uma ordem lógica de implementação.

---

# Fases

O Core é dividido em cinco módulos principais.

1. Foundation
2. Infrastructure
3. Services
4. Operations
5. Interface

Cada módulo depende do anterior.

```
Interface
    ▲
Operations
    ▲
Services
    ▲
Infrastructure
    ▲
Foundation
```

---

# Foundation

Bibliotecas básicas utilizadas por todo o Core.

| Biblioteca | Status |
|------------|--------|
| output.sh | 🟩 |
| validation.sh | 🟩 |
| config.sh | 🟩 |
| constants.sh | ⬜ |
| lib.sh | ⬜ |

Objetivo:

Criar a base comum para todas as demais bibliotecas.

---

# Infrastructure

Bibliotecas responsáveis pela comunicação com o sistema operacional.

| Biblioteca | Status |
|------------|--------|
| filesystem.sh | ⬜ |
| docker.sh | ⬜ |
| network.sh | ⬜ |
| system.sh | ⬜ |
| backup.sh | ⬜ |

Objetivo:

Centralizar todas as operações de baixo nível.

---

# Services

Camada responsável pelas regras do HomeServer.

| Biblioteca | Status |
|------------|--------|
| service.sh | ⬜ |

Objetivo:

Abstrair os serviços da infraestrutura.

---

# Operations

Scripts utilizados pelo administrador.

| Script | Status |
|---------|--------|
| deploy.sh | ⬜ |
| install.sh | ⬜ |
| restart.sh | ⬜ |
| stop.sh | ⬜ |
| status.sh | ⬜ |
| logs.sh | ⬜ |
| update.sh | ⬜ |
| backup.sh | ⬜ |
| restore.sh | ⬜ |
| doctor.sh | ⬜ |

Objetivo:

Automatizar todas as tarefas administrativas.

---

# Interface

Ferramentas utilizadas pelo usuário.

| Ferramenta | Status |
|------------|--------|
| hsctl | ⬜ |
| help | ⬜ |
| autocomplete | ⬜ |

Objetivo:

Disponibilizar uma interface simples para administração do HomeServer.

---

# Ordem de implementação

## Foundation

- output.sh
- validation.sh
- config.sh
- constants.sh
- lib.sh

## Infrastructure

- filesystem.sh
- docker.sh
- network.sh
- system.sh
- backup.sh

## Services

- service.sh

## Operations

- deploy.sh
- install.sh
- restart.sh
- stop.sh
- logs.sh
- status.sh
- backup.sh
- restore.sh
- update.sh
- doctor.sh

## Interface

- hsctl
- help
- autocomplete

---

# Objetivo da V1

Ao final da primeira versão do Core será possível:

- Implantar serviços
- Atualizar serviços
- Reiniciar serviços
- Consultar logs
- Verificar status
- Criar backups
- Restaurar backups
- Validar a infraestrutura
- Diagnosticar problemas

Tudo utilizando uma interface padronizada.