# Estratégia do HomeServer

> **Como chegaremos lá.**
>
> A estratégia define a ordem e os critérios de evolução. Diferente da visão
> (onde queremos chegar) e do roadmap (o que será feito em uma fase ou versão),
> a estratégia muda pouco: ela estabelece **como** o HomeServer cresce.

---

## Objetivo estratégico da linha v1.0

A linha v1.0 tem como objetivo transformar a base atual em uma plataforma que
entregue qualidade de vida ao usuário final.

O HomeServer deve permitir que uma pessoa instale, compreenda e opere as
funções normais do servidor sem precisar conhecer programação, Linux, Docker,
systemd ou comandos de terminal.

A complexidade técnica continua existindo quando necessária, mas deve ser
encapsulada pela plataforma.

```text
Complexidade do servidor
Docker · systemd · permissões · rede · storage · serviços
                            │
                            ▼
                    HomeServer Platform
                            │
                            ▼
                     API / contratos
                            │
                            ▼
                    HomeServer App
                            │
                            ▼
                    Experiência simples
```

O sucesso não é medido apenas pela quantidade de funcionalidades disponíveis.
Uma funcionalidade só cumpre plenamente seu objetivo quando o usuário consegue
entender o que ela faz e utilizá-la sem precisar conhecer sua implementação.

---

## Evolução incremental

O HomeServer evolui por etapas. Cada etapa fortalece a plataforma antes da
próxima, garantindo que novas capacidades sejam construídas sobre uma base
sólida, simples e organizada.

A evolução deve seguir, em termos estratégicos, a sequência:

```text
Base confiável
     ↓
Capacidades bem definidas
     ↓
Contratos de plataforma
     ↓
Operação centralizada
     ↓
Modularidade
     ↓
Ecossistema
     ↓
Consolidação
```

1. **Base confiável** — arquitetura, Foundation, Infrastructure, API, testes e
   documentação precisam possuir responsabilidades claras.
2. **Capacidades bem definidas** — serviços e operações devem ser auditados,
   desacoplados e possuir contratos explícitos.
3. **Contratos de plataforma** — interfaces devem utilizar capacidades estáveis
   sem depender de detalhes internos da infraestrutura.
4. **Operação centralizada** — o App passa progressivamente a concentrar as
   operações normais do usuário final.
5. **Modularidade** — a plataforma cresce sem aumentar arbitrariamente a
   complexidade do Core.
6. **Ecossistema** — dispositivos e integrações passam a utilizar as
   capacidades da plataforma.
7. **Consolidação** — estabilidade, documentação, segurança, desempenho e
   manutenção de longo prazo.

---

## Qualidade de vida como critério

A pergunta estratégica para cada capacidade é:

> **O usuário consegue concluir sua tarefa sem precisar aprender como a infraestrutura funciona?**

O HomeServer deve preferir apresentar intenções e tarefas, por exemplo:

- criar usuário;
- acessar arquivos;
- conectar dispositivo;
- executar backup;
- verificar serviços;
- reiniciar um serviço;
- configurar um agendamento.

O usuário não deve precisar conhecer, para concluir essas tarefas:

- comandos internos;
- Docker;
- nomes de containers;
- units do systemd;
- caminhos internos;
- volumes;
- permissões técnicas;
- detalhes da implementação.

Essa diretriz não significa esconder informações técnicas de administradores ou
desenvolvedores. Ela significa que essas informações não devem ser um pré-
requisito para a operação normal.

---

## App como centro de operação

O objetivo progressivo da linha v1.0 é centralizar no HomeServer App as
operações normais disponíveis para o usuário final.

A direção arquitetural é:

```text
Usuário
   │
   ▼
HomeServer App
   │
   ▼
API
   │
   ▼
Capacidade da Plataforma
   │
   ▼
Infrastructure / Adapters / Serviços
```

O App é uma interface da plataforma, não uma segunda implementação dela.

Por isso, a evolução deve preferir:

```text
Capacidade da plataforma
        ↓
Contrato apropriado
        ↓
API, quando exposta a clientes
        ↓
App / CLI / Integrações
```

O CLI continua sendo importante para instalação, recuperação, automação,
testes e diagnóstico avançado.

A existência de uma operação no CLI não significa, entretanto, que essa deva
permanecer sendo a única forma de executar uma tarefa normal do usuário.

---

## Evolução da Plataforma

```text
Fundação
   ↓
Plataforma
   ↓
Operação centralizada
   ↓
Preparação para modularidade
   ↓
Módulos Oficiais
   ↓
Ecossistema
   ↓
Consolidação
```

### Fase 1 — Fundação

Construir uma base sólida para todo o projeto: arquitetura, Core, sistema de
testes, documentação e estrutura de desenvolvimento.

### Fase 2 — Plataforma

Disponibilizar capacidades utilizáveis e contratos consistentes para serviços,
configuração, gerenciamento e operação do HomeServer.

### Fase 3 — Operação centralizada

Reduzir progressivamente a necessidade do terminal para tarefas normais por
meio do App e da API.

A prioridade é transformar capacidades técnicas em operações compreensíveis e
orientadas à intenção do usuário.

### Fase 4 — Preparação para modularidade

Preparar serviços e componentes para evoluírem de forma independente, com
responsabilidades claras, dependências explícitas e contratos reutilizáveis,
sem criar prematuramente um sistema de plugins ou módulos automáticos.

### Fase 5 — Módulos Oficiais

Disponibilizar funcionalidades através de módulos independentes somente após o
contrato de modularidade estar definido, validado e documentado por decisão
arquitetural. Instalação, atualização, remoção, configuração e versionamento
fazem parte desse contrato e não devem ser assumidos antes de sua definição.

### Fase 6 — Ecossistema

Transformar o HomeServer em uma plataforma de integração doméstica:
dispositivos, sincronização, compartilhamento, automações e serviços
distribuídos.

### Fase 7 — Consolidação

Garantir estabilidade e maturidade: documentação, segurança, desempenho,
otimizações, manutenção e evolução de longo prazo.

---

## Critério de sucesso da v1.0

Uma pessoa nova deve conseguir:

1. instalar o HomeServer seguindo a documentação;
2. acessar a plataforma após a instalação;
3. entender o estado básico do servidor;
4. localizar e acessar suas principais capacidades;
5. criar e gerenciar usuários quando autorizado;
6. utilizar serviços disponíveis;
7. operar dispositivos e armazenamento nas capacidades suportadas;
8. executar operações normais pelo App quando essas capacidades estiverem
   maduras;
9. compreender falhas e receber orientação para recuperação;
10. realizar essas tarefas sem precisar programar ou utilizar o terminal para
    operações normais.

O critério prático pode ser resumido como:

> Um novo usuário deve conseguir usar o HomeServer sem precisar abrir o código
> para descobrir como a plataforma funciona.

A instalação e a administração avançada podem exigir procedimentos técnicos
explicitamente documentados. A meta é que isso não seja necessário para o uso
normal após a plataforma estar instalada e configurada.

---

## Regras de priorização

- Nenhuma nova funcionalidade entra antes que a anterior esteja realmente
  utilizável.
- Cada nova fase deve entregar uma melhoria perceptível em confiabilidade,
  simplicidade ou qualidade de vida.
- Arquitetura estável é mais importante que quantidade de funcionalidades.
- Antes de adicionar uma nova capacidade, avaliar se uma capacidade existente
  já resolve o problema por meio de um contrato que possa ser reutilizado.
- Uma melhoria técnica deve ser priorizada quando reduz acoplamento, aumenta a
  confiabilidade ou permite simplificar a experiência futura.
- Funcionalidades que dependem obrigatoriamente de um serviço externo são
  tratadas como integrações opcionais, nunca como requisito do núcleo.
- Operações destrutivas ou de risco devem fornecer confirmação e feedback
  compreensíveis.
- Falhas devem priorizar recuperação e orientação antes de expor detalhes
  técnicos como única resposta.

---

## Relação com outros documentos

- `../docs/reference/PRINCIPLES.md` define os princípios permanentes.
- `../docs/reference/ARCHITECTURE.md` define as responsabilidades e fronteiras técnicas.
- `planning/vision.md` define onde o projeto pretende chegar.
- `planning/roadmap/v1.0.md` define as fases concretas até a v1.0.
- `planning/quality/` registra critérios e evidências de qualidade.
