# HomeServer Architecture

# Product Model

**Status:** Draft  
**Versão:** 1.0  
**Arquitetura:** HomeServer V1

---

# Objetivo

Definir o modelo conceitual do HomeServer.

Este documento descreve os principais conceitos do sistema e suas relações.

Não descreve implementação.

Não descreve código.

Não descreve tecnologias.

---

# Visão Geral

O HomeServer é composto por um conjunto de entidades organizadas em diferentes níveis.

Cada entidade possui uma responsabilidade específica.

```
                     HomeServer
                           │
                           ▼
                    Installation
                           │
                           ▼
                     Configuration
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
         Profile                     Runtime
            │
            ▼
      Capability
            │
            ▼
         Module
            │
            ▼
         Service
            │
            ▼
         Feature
```

---

# Entidades

## HomeServer

Representa o produto.

Existe apenas um.

Responsabilidades:

- nome do produto
- versão
- canal de atualização
- schema

---

## Installation

Representa uma instalação específica.

Responsabilidades:

- identificação
- ambiente
- perfil
- informações da instalação

Existe uma instalação por servidor.

---

## Configuration

Representa toda a configuração da instalação.

É composta por diversas camadas.

Nunca é utilizada diretamente pelos módulos.

---

## Profile

Representa um objetivo de instalação.

Exemplos:

- Minimal
- Home
- Media
- Development
- Office
- Custom

Um perfil ativa capacidades.

Nunca ativa serviços diretamente.

---

## Capability

Representa funcionalidades oferecidas pelo HomeServer.

Exemplos:

Storage

Media

Development

Backup

Monitoring

Automation

VPN

Remote Access

Uma capacidade pode depender de outras.

---

## Module

Representa uma regra de negócio.

Exemplos:

System

Storage

Backup

Network

Docker

Git

Update

Um módulo implementa capacidades.

Nunca representa softwares.

---

## Service

Representa aplicações instaladas.

Exemplos:

Homepage

API

FileBrowser

Gitea

Portainer

Jellyfin

Immich

Paperless

Um serviço implementa um ou mais módulos.

---

## Runtime

Representa a configuração final resolvida.

Todos os componentes do HomeServer utilizam Runtime.

Nenhum componente deve acessar diretamente:

- Manifest
- Profiles
- Defaults
- Local

---

## Feature

Representa funcionalidades visíveis ao usuário.

Exemplos:

Dashboard

Web File Manager

Media Center

Git Hosting

Backup Manager

Uma Feature utiliza:

Capabilities

↓

Modules

↓

Services

---

# Relações

Installation

↓

Profile

↓

Capabilities

↓

Modules

↓

Services

↓

Features

---

# Filosofia

O HomeServer não conhece softwares.

O HomeServer conhece funcionalidades.

Softwares são implementações substituíveis.

Exemplo:

Storage

↓

FileBrowser

ou

Storage

↓

Samba

ou

Storage

↓

NFS

O módulo continua o mesmo.

Muda apenas a implementação.

---

# Objetivos

Este modelo permite:

- baixo acoplamento
- fácil substituição de serviços
- evolução incremental
- instalação reproduzível
- arquitetura orientada ao domínio