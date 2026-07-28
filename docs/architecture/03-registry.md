# HomeServer Architecture

# 03 - Installation Manifest

**Status:** Draft  
**Versão:** 1.0  
**Arquitetura:** HomeServer V1

---

# Objetivo

O Manifest representa a identidade de uma instalação do HomeServer.

Ele é o ponto de entrada do Configuration Engine e descreve apenas informações de alto nível sobre a instalação.

O Manifest não contém configurações técnicas, informações de infraestrutura ou detalhes de implementação.

---

# Responsabilidades

O Manifest é responsável por:

- identificar a instalação;
- selecionar o perfil da instalação;
- definir o ambiente de execução;
- informar a versão do schema;
- armazenar metadados da instalação.

---

# Não Responsabilidades

O Manifest nunca deve:

- configurar portas;
- configurar Docker;
- configurar diretórios;
- habilitar serviços;
- configurar módulos;
- armazenar segredos;
- armazenar informações temporárias.

Essas responsabilidades pertencem a outras camadas do Configuration Engine.

---

# Ciclo de Vida

Nova instalação

↓

Installation Wizard

↓

manifest.conf

↓

Configuration Engine

↓

Runtime

---

# Estrutura

Manifest

├── Installation

├── Profile

├── Environment

└── Metadata

---

# Seções

## Installation

Descreve a identidade da instalação.

Campos previstos:

- Name
- Identifier (UUID)
- Description

---

## Profile

Define qual perfil será utilizado.

Exemplos:

- minimal
- home
- media
- development
- office
- custom

---

## Environment

Define o ambiente da instalação.

Valores previstos:

- development
- testing
- staging
- production

---

## Metadata

Informações administrativas.

Exemplos:

- schema version
- installation version
- creation date
- last update
- migration version

---

# Exemplo

HS_INSTALLATION_NAME="Meu HomeServer"

HS_PROFILE="home"

HS_ENVIRONMENT="production"

HS_SCHEMA_VERSION="1"

---

# Regras

O Manifest deve existir exatamente uma vez por instalação.

O Manifest deve ser carregado antes de qualquer outra configuração.

O Manifest nunca deve depender de outros arquivos.

O Manifest deve ser legível por humanos.

---

# Validação

Durante o bootstrap o Manifest deve validar:

- arquivo existente;
- schema suportado;
- profile existente;
- environment válido;
- campos obrigatórios preenchidos.

Caso alguma validação falhe, a inicialização deve ser interrompida.

---

# Evolução

Novos campos podem ser adicionados.

Campos existentes nunca devem mudar de significado.

Mudanças incompatíveis exigem incremento do Schema Version.