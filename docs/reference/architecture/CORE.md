# Core

> O Core é o núcleo do HomeServer.

Ele fornece toda a infraestrutura comum utilizada pela plataforma, servindo como base para módulos, serviços e demais componentes do sistema.

O Core foi projetado para permanecer pequeno, estável e independente, permitindo que o HomeServer evolua através da adição de módulos sem aumentar a complexidade da sua base.

---

# Objetivo

O Core existe para centralizar funcionalidades compartilhadas por toda a plataforma.

Seu principal objetivo é evitar duplicação de código, padronizar comportamentos e fornecer uma base consistente para toda a arquitetura do HomeServer.

---

# Responsabilidades

O Core é responsável por fornecer:

- inicialização da plataforma;
- gerenciamento de configuração;
- infraestrutura comum;
- bibliotecas compartilhadas;
- gerenciamento de ambiente;
- sistema de logs;
- validações;
- gerenciamento de arquivos;
- utilitários internos.

O Core **não** implementa funcionalidades específicas do usuário.

---

# Filosofia

O desenvolvimento do Core segue alguns princípios fundamentais.

## Simplicidade

Cada componente deve possuir apenas uma responsabilidade.

---

## Modularidade

O Core fornece infraestrutura.

Novas funcionalidades pertencem aos módulos.

---

## Estabilidade

O Core muda lentamente.

Mudanças devem priorizar compatibilidade e facilidade de manutenção.

---

## Reutilização

Sempre que possível, funcionalidades comuns devem ser implementadas apenas uma vez e reutilizadas por toda a plataforma.

---

# Estrutura

O Core é organizado em componentes independentes.

```text
Core

├── Common
├── Foundation
├── Infrastructure
├── Interface
├── Operations
└── Services
```

Cada diretório possui uma responsabilidade específica.

---

# Componentes

## Common

Bibliotecas e funções compartilhadas entre todos os componentes.

---

## Foundation

Implementa os recursos fundamentais utilizados por toda a plataforma.

Exemplos:

- constantes;
- configuração;
- validações;
- saída padrão.

---

## Infrastructure

Responsável pela comunicação com o ambiente do sistema operacional.

Exemplos:

- arquivos;
- diretórios;
- ambiente;
- logs.

---

## Interface

Responsável pela interação entre o Core e outros componentes da plataforma.

---

## Operations

Fluxos operacionais e orquestração das ações do sistema.

---

## Services

Serviços internos utilizados pelo próprio Core.

Não devem ser confundidos com os módulos instalados pelo usuário.

---

# Relação com os Módulos

O Core fornece toda a infraestrutura necessária para que módulos possam ser executados.

```text
             Modules

                 │

                 ▼

              Core

                 │

                 ▼

      Sistema Operacional
```

Os módulos dependem do Core.

O Core nunca depende dos módulos.

---

# Relação com os Testes

Toda funcionalidade implementada no Core deve possuir testes correspondentes.

A Test Suite acompanha a mesma organização do Core, facilitando manutenção e rastreabilidade.

---

# Documentação Relacionada

- ARCHITECTURE.md
- MODULES.md
- TEST_SUITE.md
- docs/developer/
- docs/reference/

---

# Evolução

O Core deve crescer através da criação de novos componentes, nunca pelo aumento excessivo dos componentes existentes.

Sempre que uma nova funcionalidade puder ser implementada como módulo independente, essa será a abordagem preferencial.

O objetivo é preservar um núcleo pequeno, organizado e estável durante toda a evolução do HomeServer.