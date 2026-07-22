# HomeServer Scripts Architecture

Este documento descreve a arquitetura dos scripts responsáveis pela administração do HomeServer.

O objetivo é manter uma estrutura modular, reutilizável e simples de manter.

---

# Princípios

A arquitetura segue alguns princípios fundamentais.

- Uma responsabilidade por biblioteca.
- Reutilização de código.
- Baixo acoplamento.
- Alta coesão.
- Comentários apenas quando agregam valor.
- Documentação antes da implementação.

---

# Arquitetura

```
                Usuário
                    │
                    ▼
           Scripts de Alto Nível
      ┌─────────────────────────────┐
      │ deploy.sh                   │
      │ install.sh                  │
      │ update.sh                   │
      │ backup.sh                   │
      │ restore.sh                  │
      │ doctor.sh                   │
      └─────────────────────────────┘
                    │
                    ▼
         Camada de Serviços
      ┌─────────────────────────────┐
      │ service.sh                  │
      └─────────────────────────────┘
                    │
                    ▼
       Camada de Infraestrutura
┌──────────────────────────────────────────┐
│ docker.sh                                │
│ filesystem.sh                            │
│ network.sh                               │
│ system.sh                                │
│ backup.sh                                │
└──────────────────────────────────────────┘
                    │
                    ▼
            Camada Base
┌──────────────────────────────────────────┐
│ output.sh                                │
│ validation.sh                            │
│ config.sh                                │
│ constants.sh                             │
│ lib.sh                                   │
└──────────────────────────────────────────┘
                    │
                    ▼
        Linux + Docker + Sistema
```

---

# Camadas

## Base

Fornece recursos compartilhados por todas as demais bibliotecas.

Responsável por:

- Configuração
- Constantes
- Mensagens
- Validação
- Inicialização

Bibliotecas:

- output.sh
- validation.sh
- config.sh
- constants.sh
- lib.sh

---

## Infraestrutura

Responsável por conversar diretamente com o sistema operacional.

Bibliotecas:

- filesystem.sh
- docker.sh
- network.sh
- system.sh
- backup.sh

Estas bibliotecas nunca conhecem serviços específicos.

Elas apenas executam operações.

---

## Serviços

Responsável pelas regras de negócio do HomeServer.

Biblioteca:

- service.sh

Ela conhece:

- Homepage
- FileBrowser
- Gitea
- Jellyfin
- etc.

Ela decide quais operações devem ser executadas.

---

## Scripts

São os comandos utilizados pelo administrador.

Exemplos:

deploy.sh

restart.sh

logs.sh

backup.sh

restore.sh

doctor.sh

Esses scripts apenas orquestram chamadas às bibliotecas.

---

# Fluxo

Exemplo:

```
deploy.sh

↓

service.sh

↓

filesystem.sh

↓

docker.sh

↓

Docker Compose

↓

Linux
```

---

# Responsabilidades

## Script

Orquestrar operações.

Nunca implementar lógica de baixo nível.

---

## Service

Conhecer os serviços.

Nunca executar comandos diretamente.

---

## Infraestrutura

Executar operações.

Nunca conhecer regras do HomeServer.

---

## Base

Disponibilizar recursos compartilhados.

Nunca executar regras de negócio.

---

# Dependências

```
Scripts
    ↓

Service
    ↓

Infrastructure
    ↓

Base
```

As dependências devem seguir apenas esta direção.

Nunca o contrário.

---

# Regras

Uma biblioteca:

- possui uma única responsabilidade;
- possui documentação própria;
- pode ser utilizada por outras bibliotecas;
- não implementa funcionalidades pertencentes a outra camada.

---

# Organização

```
scripts/

common/

install/

maintenance/

backup/

update/
```

---

# Roadmap

## Base

- [x] output.sh
- [x] validation.sh
- [x] config.sh
- [ ] constants.sh
- [ ] lib.sh

## Infraestrutura

- [ ] filesystem.sh
- [ ] docker.sh
- [ ] network.sh
- [ ] system.sh
- [ ] backup.sh

## Serviços

- [ ] service.sh

## Scripts

- [ ] deploy.sh
- [ ] install.sh
- [ ] restart.sh
- [ ] stop.sh
- [ ] logs.sh
- [ ] status.sh
- [ ] update.sh
- [ ] doctor.sh

---

# Objetivo

Esconder a complexidade do Linux e do Docker atrás de uma interface simples, consistente e reutilizável, permitindo administrar o HomeServer com comandos intuitivos e fáceis de manter.