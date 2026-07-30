# Architecture

## Visão Geral

A Foundation é a biblioteca padrão do HomeServer Core.

Seu objetivo é fornecer funcionalidades genéricas, reutilizáveis e independentes do domínio da aplicação, servindo como base para todas as demais camadas do Core.

A Foundation não implementa regras de negócio e não possui conhecimento sobre aplicações, serviços ou infraestrutura específica do HomeServer.

---

# Princípios Arquiteturais

A arquitetura da Foundation é baseada nos seguintes princípios:

- Responsabilidade única.
- Baixo acoplamento.
- Alta coesão.
- Reutilização.
- Simplicidade.
- Independência entre camadas.
- Evolução incremental.
- Compatibilidade retroativa sempre que possível.

---

# Foundation

A Foundation fornece recursos básicos para construção das demais camadas.

Responsabilidades:

- organização da inicialização do Core;
- gerenciamento de configuração;
- constantes do projeto;
- validações genéricas;
- operações genéricas de arquivos e diretórios;
- abstrações reutilizáveis.

A Foundation não deve conhecer:

- Docker;
- Compose;
- FileBrowser;
- Homepage;
- Gitea;
- Samba;
- aplicações;
- serviços específicos do HomeServer.

---

# Infrastructure

A Infrastructure é responsável por integrar o Core ao sistema operacional e aos serviços utilizados pelo HomeServer.

Responsabilidades:

- gerenciamento de serviços;
- integração com Docker;
- gerenciamento de ambientes;
- operações específicas do HomeServer;
- recursos dependentes da plataforma.

A Infrastructure pode utilizar a Foundation.

---

# Applications

A camada Applications implementa as funcionalidades disponibilizadas pelo HomeServer.

Cada aplicação representa um serviço ou funcionalidade construída sobre a Infrastructure.

A camada Applications pode utilizar Infrastructure e Foundation.

---

# Fluxo de Inicialização

A inicialização do Core ocorre em etapas.

```text
bootstrap.sh
        │
loader.sh
        │
Foundation
        │
Infrastructure
        │
Applications
```

Cada etapa prepara a próxima camada.

---

# Dependências

As dependências devem respeitar a seguinte direção.

```text
Applications
        ↓
Infrastructure
        ↓
Foundation
```

Dependências inversas não são permitidas.

A Foundation nunca deve depender da Infrastructure ou das Applications.

---

# Responsabilidade dos Módulos

Cada módulo deve possuir apenas uma responsabilidade claramente definida.

Novas funcionalidades devem ser adicionadas ao módulo correspondente à sua responsabilidade, evitando módulos genéricos ou multifuncionais.

---

# Evolução da Arquitetura

A arquitetura da Foundation deve permanecer estável.

Novas funcionalidades devem ser implementadas preferencialmente por meio da criação de novos módulos, evitando aumentar excessivamente a responsabilidade dos módulos existentes.

Alterações arquiteturais devem preservar os princípios definidos neste documento.