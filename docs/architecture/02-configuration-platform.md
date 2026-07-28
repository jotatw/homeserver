# HomeServer Architecture

# Configuration System

**Status:** Draft  
**Versão:** 1.0  
**Arquitetura:** HomeServer V1

---

# Objetivo

O sistema de configuração do HomeServer é responsável por definir a identidade,
o comportamento e as funcionalidades de uma instalação.

Toda configuração utilizada pelo projeto deve ser obtida através deste sistema.

Nenhum componente do HomeServer deve possuir valores fixos ("hardcoded")
como portas, diretórios, hostname ou nomes de serviços.

---

# Objetivos da arquitetura

- Uma única fonte da verdade.
- Configuração reproduzível.
- Fácil personalização.
- Fácil atualização.
- Separação clara de responsabilidades.
- Suporte a diferentes perfis de instalação.
- Resolução automática de dependências.
- Compatibilidade futura entre versões.

---

# Arquitetura

```
                   Configuration System

                    Manifest
                        │
                        ▼
                    Profile
                        │
                        ▼
                   Capabilities
                        │
                        ▼
                     Modules
                        │
                        ▼
                     Services
                        │
                        ▼
                 Local Overrides
                        │
                        ▼
                     Runtime
```

O carregamento sempre ocorre nesta ordem.

Cada camada pode complementar ou sobrescrever informações da camada anterior.

---

# Estrutura

```
config/

├── manifest.conf

├── defaults/

├── profiles/

├── capabilities/

├── modules/

├── services/

├── local/

├── runtime/

└── examples/
```

---

# Manifest

## Responsabilidade

Identificar uma instalação do HomeServer.

O Manifest **não** descreve detalhes técnicos.

Ele apenas responde:

- Quem é esta instalação?
- Qual perfil está sendo utilizado?
- Qual ambiente?
- Qual versão do schema?

Exemplo:

```
HS_INSTALLATION_NAME

HS_PROFILE

HS_ENVIRONMENT

HS_SCHEMA_VERSION
```

---

# Defaults

## Responsabilidade

Definir os valores padrão do projeto.

Todos os arquivos desta pasta são versionados.

Nunca devem ser alterados diretamente pelo usuário.

Exemplos:

- portas padrão
- caminhos padrão
- timezone padrão
- rede Docker padrão

---

# Profiles

## Responsabilidade

Representar tipos de instalação.

Exemplos:

- minimal
- home
- media
- development
- office
- custom

Um perfil habilita capacidades.

Ele nunca habilita diretamente serviços.

---

# Capabilities

## Responsabilidade

Representar funcionalidades do HomeServer.

Exemplos:

- Storage
- Development
- Media
- Backup
- Monitoring
- Automation

Uma capacidade pode depender de outras capacidades.

Exemplo:

Media

↓

Storage

↓

Network

---

# Modules

## Responsabilidade

Representar os módulos do domínio do HomeServer.

Exemplos:

System

Storage

Network

Backup

Service

Docker

Git

Os módulos não representam softwares.

Representam regras de negócio.

---

# Services

## Responsabilidade

Representar aplicações instaladas.

Exemplos:

Homepage

API

FileBrowser

Gitea

Portainer

Jellyfin

Immich

Paperless

Um serviço declara:

- dependências
- portas
- volumes
- capacidades necessárias

---

# Local

## Responsabilidade

Personalização da instalação.

Exemplos:

Hostname

Domínio

Portas

Diretórios

Nunca é versionado.

---

# Runtime

## Responsabilidade

Resultado final da resolução.

Nenhum componente do HomeServer deve acessar diretamente:

- defaults
- profiles
- capabilities
- manifest

Todos devem consumir apenas Runtime.

---

# Resolver

O Resolver é responsável por construir a configuração final.

Fluxo:

Manifest

↓

Defaults

↓

Profile

↓

Capabilities

↓

Modules

↓

Services

↓

Local

↓

Runtime

---

# Bootstrap

O Bootstrap executa o Resolver durante a inicialização.

Após a resolução:

Foundation

Infrastructure

Modules

API

CLI

Homepage

passam a utilizar apenas Runtime.

---

# Ordem de precedência

Da menor para maior prioridade:

Defaults

↓

Profile

↓

Capabilities

↓

Modules

↓

Services

↓

Local

↓

Runtime

Cada camada pode sobrescrever valores anteriores.

---

# Dependências

As dependências são declarativas.

Exemplo:

Capability

↓

Services

↓

Modules

↓

Infrastructure

O usuário não precisa conhecer essas relações.

O Resolver cuida automaticamente.

---

# Perfis

Minimal

- Homepage
- API

---

Home

- Homepage
- API
- FileBrowser
- Gitea
- Portainer

---

Media

- Homepage
- API
- Jellyfin
- Immich
- FileBrowser

---

Development

- Homepage
- API
- Gitea
- Registry
- Portainer

---

Office

- Homepage
- API
- Nextcloud
- Paperless
- OnlyOffice

---

Custom

Configuração totalmente manual.

---

# Boas práticas

- Nunca utilizar valores hardcoded.
- Nunca acessar arquivos diretamente.
- Nunca depender da estrutura interna das configurações.
- Sempre utilizar Runtime.
- Toda nova configuração deve possuir documentação.
- Toda nova capacidade deve declarar dependências.
- Todo novo serviço deve possuir seu próprio arquivo de configuração.

---

# Evolução

A arquitetura foi projetada para suportar futuras versões do HomeServer
sem necessidade de alterações estruturais.

Novos:

- perfis
- capacidades
- módulos
- serviços

devem ser adicionados sem modificar o funcionamento existente.
