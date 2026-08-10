# HomeServer Infrastructure

## Visão Geral

A Infrastructure é a segunda camada do HomeServer Core.

Seu objetivo é fornecer uma interface padronizada entre o HomeServer e o sistema operacional, encapsulando operações de baixo nível em módulos reutilizáveis.

A Infrastructure utiliza a Foundation como base e disponibiliza serviços para as camadas superiores.

## Responsabilidades

A Infrastructure é responsável por executar operações concretas no ambiente, incluindo:

- gerenciamento de arquivos;
- gerenciamento de diretórios;
- manipulação do ambiente;
- gerenciamento de containers;
- gerenciamento de serviços;
- provisionamento;
- storage, usuários, dispositivos, hardware, backup, energia e agendamento.

A Infrastructure não implementa interface de usuário nem regras específicas de aplicações.

## Dependências

A dependência entre as camadas segue o sentido:

```text
Applications
      │
Infrastructure
      │
Foundation
```

A Infrastructure nunca depende diretamente das Applications ou dos módulos de produto.

Integrações com serviços externos passam pela camada de Adapters.

## Organização

```text
core/
├── foundation/
├── infrastructure/
│   ├── environment.sh
│   ├── docker.sh
│   ├── compose.sh
│   ├── service.sh
│   ├── storage.sh
│   ├── users.sh
│   ├── devices.sh
│   ├── hardware.sh
│   ├── backup.sh
│   ├── scheduler.sh
│   ├── power.sh
│   └── update.sh
└── adapters/
```

Cada módulo de Infrastructure expõe uma API pública pequena e utiliza o prefixo definido para sua camada.

## Fluxo

```text
Application
      │
      ▼
Infrastructure
      │
      ▼
Foundation
      │
      ▼
Sistema Operacional
```

As Applications não executam operações de infraestrutura diretamente.

## Princípios

- responsabilidade única;
- baixo acoplamento;
- alta coesão;
- APIs pequenas;
- implementação simples;
- documentação obrigatória;
- testes independentes.

## Decisões arquiteturais

Decisões relevantes são registradas em `docs/architecture/adr/`.

Consulte o [índice de ADRs](adr/README.md).

## Evolução

Novos módulos devem representar uma responsabilidade claramente identificável. Não se deve transformar um módulo em um componente genérico que concentre múltiplas responsabilidades.
