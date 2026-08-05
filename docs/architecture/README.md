# HomeServer Infrastructure

## Visão Geral

A Infrastructure é a segunda camada do HomeServer Core.

Seu objetivo é fornecer uma interface padronizada entre o HomeServer e o sistema operacional, encapsulando operações de baixo nível em módulos reutilizáveis.

A Infrastructure utiliza a Foundation como base e disponibiliza serviços para as Applications.

---

# Objetivos

A Infrastructure existe para:

- abstrair operações do sistema operacional;
- centralizar integrações externas;
- reduzir duplicação de código;
- fornecer APIs reutilizáveis;
- manter baixo acoplamento entre aplicações e ambiente.

---

# Responsabilidades

A Infrastructure é responsável por executar operações concretas no ambiente.

Exemplos:

- gerenciamento de arquivos;
- gerenciamento de diretórios;
- manipulação do ambiente;
- gerenciamento de containers;
- gerenciamento de serviços;
- provisionamento.

---

# Não é responsabilidade da Infrastructure

A Infrastructure não:

- implementa regras de negócio;
- conhece aplicações específicas;
- contém constantes globais;
- realiza validações genéricas;
- produz interface para o usuário.

Essas responsabilidades pertencem às outras camadas do HomeServer.

---

# Dependências

A Infrastructure depende exclusivamente da Foundation.

```text
Applications
        │
Infrastructure
        │
Foundation
```

Ela nunca deve depender diretamente das Applications.

---

# Organização

A camada é organizada em módulos independentes.

Cada módulo possui uma única responsabilidade.

```text
core/
└── infrastructure/
    ├── environment.sh
    ├── docker.sh
    ├── compose.sh
    ├── service.sh
    ├── storage.sh
    ├── users.sh
    ├── devices.sh
    ├── hardware.sh
    ├── backup.sh
    ├── scheduler.sh
    ├── power.sh
    └── update.sh
```

Cada módulo expõe apenas uma API pública bem definida (prefixo do módulo).

---

# Decisões de Arquitetura (ADR)

Decisões importantes são registradas em `adr/`:

```text
docs/
└── architecture/
    └── adr/
```

Ver [ADR README](adr/README.md).

---

# Filosofia

A Infrastructure segue os mesmos princípios da Foundation.

- responsabilidade única;
- baixo acoplamento;
- alta coesão;
- APIs pequenas;
- implementação simples;
- documentação obrigatória;
- testes independentes.

---

# Fluxo

As Applications nunca executam comandos diretamente.

Fluxo esperado:

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

Isso garante que alterações na implementação da Infrastructure não afetem as Applications.

---

# Evolução

Novos módulos devem ser adicionados apenas quando representarem uma nova responsabilidade.

Não é permitido transformar um módulo em um componente genérico que concentre múltiplas responsabilidades.

A evolução da Infrastructure deve preservar sua simplicidade e modularidade.