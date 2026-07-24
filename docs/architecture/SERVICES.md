# Services

> Os serviços representam funcionalidades executáveis da plataforma que utilizam a infraestrutura fornecida pelo Core.

Eles organizam operações de maior nível e podem ser utilizados tanto pela própria plataforma quanto pelos módulos instalados.

---

# Objetivo

Os serviços existem para encapsular funcionalidades específicas da plataforma, reutilizando os recursos fornecidos pelo Core.

Seu objetivo é organizar operações complexas, evitando que responsabilidades sejam distribuídas entre diferentes componentes.

---

# Filosofia

Os serviços devem permanecer independentes da infraestrutura interna do sistema.

Toda comunicação com o sistema operacional, arquivos ou ambiente deve ocorrer através do Core.

Isso mantém a arquitetura organizada e reduz o acoplamento entre componentes.

---

# Responsabilidades

Os serviços podem ser responsáveis por:

- executar operações específicas;
- coordenar componentes do Core;
- disponibilizar funcionalidades para módulos;
- automatizar tarefas recorrentes;
- fornecer interfaces para outras partes da plataforma.

Os serviços não devem implementar infraestrutura.

Essa responsabilidade pertence ao Core.

---

# Arquitetura

```text
              HomeServer

                   │

                   ▼

                Services

                   │

        ┌──────────┼──────────┐

        ▼          ▼          ▼

     Core      Modules     Interface
```

Os serviços atuam como uma camada intermediária entre os componentes da plataforma.

---

# Relação com o Core

Os serviços utilizam recursos fornecidos pelo Core.

Exemplos:

- configuração;
- logs;
- sistema de arquivos;
- ambiente;
- validações.

O Core permanece responsável apenas pela infraestrutura.

---

# Relação com os Módulos

Módulos podem utilizar serviços da plataforma para executar funcionalidades específicas.

Da mesma forma, novos serviços poderão ser disponibilizados por módulos quando necessário.

Essa separação permite crescimento contínuo sem aumentar a complexidade do Core.

---

# Evolução

Novos serviços devem surgir conforme a plataforma amadurece.

A criação de um novo serviço deve representar uma nova capacidade da plataforma, e não apenas uma reorganização de código.

Sempre que possível, serviços devem ser reutilizáveis por diferentes módulos.

---

# Documentação Relacionada

- ARCHITECTURE.md
- CORE.md
- MODULES.md
- TEST_SUITE.md
- docs/developer/services/