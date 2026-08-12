# Arquitetura do HomeServer

## Propósito

Este documento descreve a organização arquitetural do HomeServer, as
responsabilidades de suas principais camadas e os limites entre elas.

Os princípios que orientam essas decisões estão definidos em
`PRINCIPLES.md`. Decisões estruturais específicas e relevantes devem ser
registradas em `architecture/adr/`.

---

## Visão da Plataforma

O HomeServer separa a experiência do usuário dos detalhes necessários para
operar o servidor.

```text
                    Usuário
                       │
                       ▼
                HomeServer App
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

A arquitetura não exige que toda operação atravesse todas as caixas do
diagrama. O diagrama representa responsabilidades e fronteiras, não uma
cadeia obrigatória de chamadas.

O objetivo é permitir que interfaces como o App utilizem capacidades da
plataforma sem conhecer comandos, containers, arquivos de configuração ou
outros detalhes internos.

---

# Camadas do Core

O Core é organizado em camadas com dependências direcionadas das camadas
superiores para as inferiores.

```text
Applications
     │
     ▼
Infrastructure
     │
     ▼
Foundation
```

A Foundation não depende da Infrastructure. A Infrastructure não depende de
Applications ou de módulos específicos.

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

Ela deve permanecer reutilizável e independente das implementações da
infraestrutura.

---

## Infrastructure

### Objetivo

A Infrastructure implementa operações concretas necessárias para executar o
HomeServer no ambiente.

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

A Infrastructure depende da Foundation e utiliza contratos definidos pelo
Core.

Ela não deve depender de módulos específicos. Uma capacidade genérica, como
gerenciar serviços, não deve conhecer antecipadamente todos os serviços que
poderão existir.

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

A lógica de infraestrutura não deve depender diretamente de detalhes da
implementação externa quando um adapter puder fornecer essa fronteira.

Isso permite substituir ou alterar uma integração com menor impacto nas
camadas superiores.

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

Os serviços devem permanecer tão desacoplados quanto possível. A falha de um
serviço não deve, por si só, tornar toda a plataforma indisponível.

---

# Módulos

Módulos representam componentes que podem ampliar a plataforma sem exigir
alterações arbitrárias na Foundation ou na Infrastructure.

A definição atual do projeto é:

> Um módulo é qualquer componente que possa ser instalado, atualizado ou
> removido sem alterar a Foundation nem a Infrastructure do HomeServer.

A estrutura definitiva e o contrato de módulos ainda serão definidos antes de
se tornarem uma interface oficial da plataforma.

Até essa definição, novos componentes não devem assumir mecanismos implícitos
de descoberta, carregamento ou configuração automática que ainda não foram
estabelecidos como contrato.

---

# API: fronteira da plataforma

A API é a interface entre clientes e as capacidades internas do HomeServer.

```text
App / outros clientes
          │
          ▼
         API
          │
          ▼
Core / Infrastructure / Adapters
```

A API é responsável por expor contratos estáveis para operações da plataforma,
como autenticação, usuários, serviços, armazenamento e outras capacidades
suportadas.

Clientes não devem depender diretamente de:

- comandos internos;
- nomes de containers;
- volumes Docker;
- caminhos internos;
- units do systemd;
- scripts específicos.

Uma alteração interna deve, sempre que possível, preservar o contrato utilizado
pelos clientes.

A documentação específica dos endpoints e contratos da API está em
`api/README.md` e nos documentos relacionados à arquitetura da API.

---

# HomeServer App

O HomeServer App é a interface principal para a operação normal da plataforma.

Seu papel é apresentar capacidades e tarefas de forma compreensível, por
exemplo:

- verificar o estado do servidor;
- gerenciar usuários;
- acessar arquivos;
- acompanhar e operar serviços;
- gerenciar dispositivos e armazenamento;
- executar ou acompanhar backups;
- configurar agendamentos;
- executar operações de energia.

O App consome contratos da API. Ele não deve implementar diretamente regras de
infraestrutura ou depender da estrutura interna dos serviços.

A disponibilidade visual de uma capacidade depende do seu contrato e do seu
nível de maturidade. Nem toda capacidade planejada está necessariamente
implementada no App atual.

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

Durante a evolução do projeto, uma capacidade pode existir primeiro no CLI.
Quando essa capacidade fizer parte da operação normal do usuário final, ela
deve ser avaliada para exposição pela API e pelo App.

O objetivo da linha v1.0 é reduzir progressivamente a necessidade de terminal
para operações normais.

---

# Fluxo de Operação

A experiência principal segue a separação:

```text
Usuário
   │
   ▼
App
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

O usuário expressa uma intenção, como criar um usuário ou reiniciar um serviço.
A plataforma é responsável por executar os detalhes técnicos necessários.

Interfaces diferentes podem utilizar a mesma capacidade, mas não devem criar
implementações divergentes para a mesma regra de negócio.

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

A inicialização e o lifecycle específicos dos serviços podem utilizar seus
próprios mecanismos, como Docker Compose ou systemd, conforme definido pela
infraestrutura correspondente.

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
App → API → Plataforma
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

O modelo de diretórios do HomeServer separa responsabilidades como código,
configuração, infraestrutura, armazenamento e backups.

A persistência de usuários e dados deve seguir as fontes de verdade definidas
pela plataforma. Módulos não devem criar estruturas paralelas fora dos modelos
oficiais sem uma decisão arquitetural explícita.

Essa separação favorece:

- atualização sem perda desnecessária de dados;
- backup;
- restauração;
- substituição de implementação;
- isolamento entre serviços.

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

A estrutura concreta pode evoluir conforme o projeto avança. Diretórios
planejados devem ser identificados como tal até possuírem uma responsabilidade
implementada e documentada.

A documentação técnica principal está organizada em `docs/`, enquanto visão,
estratégia, roadmaps, baselines e planejamento vivem em `planning/`.

---

# Evolução da Arquitetura

A arquitetura evolui por contratos e responsabilidades claras.

Uma mudança estrutural deve considerar:

1. qual problema está sendo resolvido;
2. qual camada é responsável pela solução;
3. quais contratos serão afetados;
4. quais consumidores dependem desses contratos;
5. como a compatibilidade será mantida ou migrada;
6. quais testes e documentos precisam ser atualizados.

Mudanças arquiteturais relevantes devem ser avaliadas conforme a política de
ADR do projeto.

---

# Relação com outros documentos

- `PRINCIPLES.md` define os princípios permanentes.
- `architecture/` detalha componentes e decisões arquiteturais.
- `architecture/adr/` registra decisões estruturais relevantes.
- `api/README.md` documenta a interface da API.
- `design/` documenta a linguagem visual e especificações do App.
- `planning/strategy.md` define a direção estratégica.
- `planning/roadmap/v1.0.md` define as fases de evolução.
- `planning/quality/` contém critérios e checklists de qualidade.
