# HomeServer Documentation

## Visão Geral

Bem-vindo à documentação do HomeServer.

O HomeServer é um projeto pessoal desenvolvido com o objetivo de criar uma plataforma doméstica modular para hospedagem e gerenciamento de serviços, utilizando uma arquitetura organizada em camadas.

A documentação está estruturada para acompanhar a evolução do projeto, desde sua arquitetura até a implementação de cada componente.

---

# Estrutura da Documentação

A documentação está organizada por assunto.

## Projeto

| Documento | Descrição |
|-----------|-----------|
| VISION.md | Objetivos e filosofia do projeto. |
| ROADMAP.md | Planejamento e evolução do projeto. |
| ARCHITECTURE.md | Arquitetura geral do HomeServer. |

---

## Core

Documentação das camadas que compõem o núcleo do HomeServer.

| Camada | Descrição |
|--------|-----------|
| foundation/ | Biblioteca base do HomeServer Core. |
| infrastructure/ | Integração com o sistema operacional e serviços. |
| applications/ | Aplicações construídas sobre a Infrastructure. |

---

## Serviços

Documentação específica de cada serviço integrado ao HomeServer.

Exemplos:

- Homepage
- FileBrowser
- Gitea

---

## Desenvolvimento

Documentação relacionada ao desenvolvimento do projeto.

Inclui:

- padrões de desenvolvimento;
- convenções;
- testes;
- guias técnicos.

---

# Organização

A documentação segue os mesmos princípios adotados pelo código-fonte:

- simplicidade;
- modularidade;
- baixo acoplamento;
- alta coesão;
- evolução incremental.

Cada documento possui uma responsabilidade específica, evitando duplicação de informações.

---

# Navegação

A leitura recomendada para compreender o projeto é:

1. VISION.md
2. ROADMAP.md
3. ARCHITECTURE.md
4. Foundation
5. Infrastructure
6. Applications

Essa sequência apresenta primeiro a visão do projeto e, em seguida, detalha sua arquitetura e implementação.