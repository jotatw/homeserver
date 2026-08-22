# Arquitetura do HomeServer

## Propósito

Este documento descreve a organização arquitetural do HomeServer, as responsabilidades de suas principais camadas e os limites entre elas.

Os princípios que orientam essas decisões estão definidos em `PRINCIPLES.md`. Decisões estruturais específicas e relevantes devem ser registradas em `architecture/adr/`.

---

## Visão da Plataforma

O HomeServer separa a experiência do usuário dos detalhes necessários para operar o servidor.

```text
                 Interfaces
          Desktop principal / Mobile rápido
                       │
                       ▼
                      API
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
         Core     Infrastructure   Modules
          │            │            │
          └────────────┼────────────┘
                       ▼
              Adapters / Serviços
                       │
                       ▼
          Docker / systemd / Sistema
```

A arquitetura não exige que toda operação atravesse todas as caixas do diagrama. O diagrama representa responsabilidades e fronteiras, não uma cadeia obrigatória de chamadas.

O objetivo é permitir que interfaces utilizem capacidades da plataforma sem conhecer comandos, containers, arquivos de configuração ou outros detalhes internos.

---

# Camadas do Core

O Core é organizado em camadas com dependências direcionadas das camadas superiores para as inferiores.

```text
Applications
     │
     ▼
Infrastructure
     │
     ▼
Foundation
```

A Foundation não depende da Infrastructure. A Infrastructure não depende de Applications ou de módulos específicos.

## Foundation

### Objetivo

A Foundation fornece capacidades genéricas reutilizáveis para o Core.

### Responsabilidades

- constantes;
- configuração;
- validação;
- operações básicas de sistema de arquivos;
- saída padronizada;
- registro e inicialização de componentes do Core.

### Não conhece

A Foundation não conhece:

- serviços específicos;
- módulos específicos;
- Docker;
- interfaces de usuário;
- regras de negócio de aplicações.

Ela deve permanecer reutilizável e independente das implementações da infraestrutura.

---

## Infrastructure

### Objetivo

A Infrastructure implementa operações concretas necessárias para executar o HomeServer no ambiente.

### Responsabilidades

Entre suas responsabilidades estão capacidades como:

- armazenamento;
- usuários;
- dispositivos;
- hardware;
- serviços;
- energia;
- backup;
- agendamento;
- Docker e Compose;
- provisionamento e integração com o sistema operacional.

### Dependências

A Infrastructure depende da Foundation e utiliza contratos definidos pelo Core.

Ela não deve depender de módulos específicos. Uma capacidade genérica, como gerenciar serviços, não deve conhecer antecipadamente todos os serviços que poderão existir.

---

## Adapters

Adapters isolam integrações com componentes externos.

```text
Infrastructure
      │
      ▼
   Adapter
      │
      ▼
Serviço externo
```

Exemplos incluem integrações com FileBrowser ou outros serviços externos.

A lógica de infraestrutura não deve depender diretamente de detalhes da implementação externa quando um adapter puder fornecer essa fronteira.

Isso permite substituir ou alterar uma integração com menor impacto nas camadas superiores.

---

# Aplicações e Serviços

Aplicações representam componentes funcionais utilizados pela plataforma.

Exemplos atuais ou planejados incluem:

- Homepage;
- FileBrowser;
- Gitea;
- Caddy;
- Portainer;
- Jellyfin ou outros serviços futuros.

Um serviço deve possuir, quando aplicável:

- responsabilidade definida;
- configuração identificável;
- dados persistentes separados;
- dependências explícitas;
- lifecycle definido;
- estado ou mecanismo de health;
- contrato de integração claro.

Os serviços devem permanecer tão desacoplados quanto possível. A falha de um serviço não deve, por si só, tornar toda a plataforma indisponível.

Serviços ainda em avaliação podem permanecer fora da base principal enquanto sua utilidade, custo, comportamento e impacto arquitetural são testados.

---

# Módulos

Módulos representam componentes que podem ampliar a plataforma sem exigir alterações arbitrárias na Foundation ou na Infrastructure.

A definição atual do projeto é:

> Um módulo é um componente opcional ou independente que amplia uma capacidade do HomeServer, reutilizando contratos da plataforma e podendo ser instalado ou removido conforme sua política sem exigir alterações arbitrárias na Foundation ou Infrastructure.

Para módulos opcionais, a arquitetura deve preservar as seguintes propriedades:

- o Core não depende do módulo para operações não relacionadas;
- a indisponibilidade do módulo não derruba capacidades independentes;
- instalação e remoção possuem comportamento definido;
- dados e configuração possuem responsabilidade e localização claras;
- a remoção não deve comprometer dados externos à responsabilidade do módulo;
- a interface reconhece o módulo por contratos, e não por detalhes internos arbitrários.

A implementação concreta desses comportamentos pode evoluir. Novos mecanismos de descoberta, carregamento ou gerenciamento automático não devem ser assumidos como contrato antes de serem definidos, validados e documentados.

---

# API: fronteira da plataforma

A API é a interface entre clientes e as capacidades internas do HomeServer.

```text
Desktop / Mobile / outros clientes
          │
          ▼
         API
          │
          ▼
Core / Infrastructure / Adapters
```

A API é responsável por expor contratos estáveis para operações da plataforma, como autenticação, usuários, serviços, armazenamento e outras capacidades suportadas.

Clientes não devem depender diretamente de:

- comandos internos;
- nomes de containers;
- volumes Docker;
- caminhos internos;
- units do systemd;
- scripts específicos.

Uma alteração interna deve, sempre que possível, preservar o contrato utilizado pelos clientes.

A documentação específica dos endpoints e contratos da API está em `api/README.md` e nos documentos relacionados à arquitetura da API.

---

# Interfaces

O HomeServer utiliza interfaces adequadas ao contexto de uso.

## Desktop

O Desktop é a interface principal para gerenciamento e operações completas, especialmente quando a tarefa exige mais contexto, configuração, visualização ou controle.

## Mobile

O Mobile prioriza acesso rápido às ações frequentes. Não deve ser tratado automaticamente como uma reprodução reduzida do Desktop.

A direção inicial inclui transferências rápidas de arquivos, acesso simples a destinos frequentes, consulta de informações essenciais e ações remotas controladas quando justificadas pelo uso real.

A implementação e o conjunto final de funcionalidades permanecem sujeitos à validação prática.

---

# CLI

O CLI é uma interface avançada e operacional da plataforma.

Ele continua importante para:

- instalação;
- automação;
- testes;
- diagnóstico;
- recuperação;
- manutenção técnica.

Durante a evolução do projeto, uma capacidade pode existir primeiro no CLI. Quando essa capacidade fizer parte da operação normal do usuário final, ela deve ser avaliada para exposição por contratos apropriados e pelas interfaces em que realmente faça sentido.

---

# Fluxo de Operação

A experiência segue a separação:

```text
Usuário
   │
   ▼
Interface adequada ao contexto
   │
   ▼
API
   │
   ▼
Capacidade da plataforma
   │
   ▼
Infrastructure / Adapter / Serviço
```

O usuário expressa uma intenção, como criar um usuário ou reiniciar um serviço. A plataforma é responsável por executar os detalhes técnicos necessários.

Interfaces diferentes podem utilizar a mesma capacidade, mas não devem criar implementações divergentes para a mesma regra de negócio.

---

# Fluxo de Inicialização

A inicialização do Core segue uma sequência previsível:

```text
bootstrap
      │
      ▼
loader
      │
      ▼
Foundation
      │
      ▼
Infrastructure
      │
      ▼
Applications
```

Cada etapa prepara as capacidades necessárias para a seguinte.

A inicialização e o lifecycle específicos dos serviços podem utilizar seus próprios mecanismos, como Docker Compose ou systemd, conforme definido pela infraestrutura correspondente.

---

# Dependências

As dependências devem respeitar responsabilidades e fronteiras.

Para o Core:

```text
Applications → Infrastructure → Foundation
```

Integrações externas devem ser isoladas por adapters quando apropriado:

```text
Infrastructure → Adapter → Serviço externo
```

Clientes utilizam a API como fronteira pública:

```text
Interface → API → Plataforma
```

Dependências inversas e acoplamentos implícitos devem ser evitados.

---

# Persistência

Serviços devem separar claramente, quando aplicável:

```text
Serviço
│
├── Aplicação
├── Configuração
└── Dados persistentes
```

O modelo de diretórios do HomeServer separa responsabilidades como código, configuração, infraestrutura, armazenamento e backups.

A persistência de usuários e dados deve seguir as fontes de verdade definidas pela plataforma. Módulos não devem criar estruturas paralelas fora dos modelos oficiais sem uma decisão arquitetural explícita.

Essa separação favorece:

- atualização sem perda desnecessária de dados;
- backup;
- restauração;
- substituição de implementação;
- isolamento entre serviços;
- instalação e remoção controladas de componentes opcionais.

---

# Organização do Repositório

A estrutura do repositório acompanha as responsabilidades da plataforma.

```text
core/
├── foundation/
├── infrastructure/
├── adapters/
└── applications/

modules/
api/
docs/
planning/
```

A estrutura concreta pode evoluir conforme o projeto avança. Diretórios planejados devem ser identificados como tal até possuírem uma responsabilidade implementada e documentada.

A documentação técnica principal está organizada em `docs/`, enquanto fundamentos, visão, estratégia, roadmaps, baselines e planejamento vivem em `planning/`.

---

# Evolução da Arquitetura

A arquitetura evolui por contratos e responsabilidades claras.

Uma mudança estrutural deve considerar:

1. qual problema está sendo resolvido;
2. qual camada é responsável pela solução;
3. quais contratos serão afetados;
4. quais consumidores dependem desses contratos;
5. como a compatibilidade será mantida ou migrada;
6. quais testes e documentos precisam ser atualizados;
7. se existe evidência suficiente para consolidar a mudança ou se ela deve permanecer experimental.

Mudanças arquiteturais relevantes devem ser avaliadas conforme a política de ADR do projeto.

---

# Relação com outros documentos

- `PRINCIPLES.md` define os princípios permanentes.
- `architecture/` detalha componentes e decisões arquiteturais.
- `architecture/adr/` registra decisões estruturais relevantes.
- `api/README.md` documenta a interface da API.
- `planning/foundations/` registra fundamentos gerais de evolução e validação.
- `planning/app/` registra a direção das interfaces Desktop e Mobile.
- `planning/strategy.md` define a direção estratégica.
- `planning/roadmap/evolution.md` define as fases de evolução.
- `planning/quality/` contém critérios e checklists de qualidade.
