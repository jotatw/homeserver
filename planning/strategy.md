# Estratégia do HomeServer

> **Como chegaremos lá.**
>
> A estratégia define a ordem e os critérios de evolução. Diferente da visão
> (onde queremos chegar) e do roadmap (prioridades e áreas de consolidação), a
> estratégia muda pouco: ela estabelece **como** o HomeServer cresce.

---

## Objetivo estratégico

O objetivo é transformar a base atual em uma plataforma que entregue qualidade de vida ao usuário final sem comprometer simplicidade, segurança, manutenção ou possibilidade de evolução.

O HomeServer deve permitir que uma pessoa instale, compreenda e opere as funções normais do servidor sem precisar conhecer programação, Linux, Docker, systemd ou comandos de terminal.

A complexidade técnica continua existindo quando necessária, mas deve ser encapsulada pela plataforma.

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
                    Interfaces adequadas
                            │
                            ▼
                    Experiência simples
```

O sucesso não é medido apenas pela quantidade de funcionalidades disponíveis. Uma funcionalidade só cumpre plenamente seu objetivo quando resolve uma necessidade real com custo técnico e operacional proporcional.

---

## Evolução incremental

O HomeServer evolui por etapas. Cada etapa fortalece a plataforma antes de ampliar sua complexidade.

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
Consolidação contínua
```

1. **Base confiável** — arquitetura, Foundation, Infrastructure, API, testes e documentação possuem responsabilidades claras.
2. **Capacidades bem definidas** — serviços e operações são auditados, desacoplados e possuem contratos explícitos.
3. **Contratos de plataforma** — interfaces utilizam capacidades estáveis sem depender de detalhes internos da infraestrutura.
4. **Operação centralizada** — interfaces concentram progressivamente as operações normais adequadas ao contexto do usuário.
5. **Modularidade** — a plataforma cresce sem aumentar arbitrariamente a complexidade do Core.
6. **Ecossistema** — dispositivos, sincronização, compartilhamento, automações e serviços distribuídos utilizam capacidades da plataforma quando isso fizer sentido.
7. **Consolidação contínua** — estabilidade, documentação, segurança, desempenho e manutenção são validados continuamente antes de uma futura decisão de release.

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

Essa diretriz não significa esconder informações técnicas de administradores ou desenvolvedores. Ela significa que essas informações não devem ser um pré-requisito para a operação normal.

---

## Interfaces conforme o contexto

A plataforma não exige que todas as interfaces tenham o mesmo escopo.

A direção atual é:

```text
Desktop
→ gerenciamento principal e completo

Mobile
→ acesso rápido às ações mais frequentes
```

O Mobile não deve reproduzir automaticamente toda a interface Desktop. Cada funcionalidade deve justificar seu benefício no contexto de uso móvel.

A direção detalhada das interfaces está em `planning/app/`.

---

## Plataforma como centro das capacidades

A direção arquitetural é:

```text
Usuário
   │
   ▼
Interface adequada ao contexto
   │
   ▼
API / contratos
   │
   ▼
Capacidade da Plataforma
   │
   ▼
Infrastructure / Adapters / Módulos
```

Uma interface é consumidora da plataforma, não uma segunda implementação dela.

Por isso, a evolução deve preferir:

```text
Capacidade da plataforma
        ↓
Contrato apropriado
        ↓
API, quando exposta a clientes
        ↓
Desktop / Mobile / CLI / Integrações
```

O CLI continua importante para instalação, recuperação, automação, testes e diagnóstico avançado.

---

## Evolução da Plataforma

### Fundação

Construir e preservar uma base sólida: arquitetura, Core, sistema de testes, documentação e estrutura de desenvolvimento.

### Plataforma

Disponibilizar capacidades utilizáveis e contratos consistentes para serviços, configuração, gerenciamento e operação do HomeServer.

### Operação centralizada

Reduzir progressivamente a necessidade do terminal para tarefas normais por meio de interfaces e APIs adequadas.

### Modularidade

Preparar serviços e componentes para evoluírem de forma independente, com responsabilidades claras, dependências explícitas, contratos reutilizáveis e ciclo de instalação/remoção que não comprometa o núcleo ou dados não pertencentes ao módulo.

### Ecossistema

Expandir capacidades somente quando necessidades reais justificarem a integração: dispositivos, sincronização, compartilhamento, automações e outros serviços opcionais.

### Consolidação

Validar estabilidade, documentação, segurança, desempenho e manutenção por meio de testes e uso real. A consolidação é contínua e uma release oficial somente ocorre após decisão explícita.

---

## Critério de sucesso para uma futura primeira release

Uma pessoa nova deve conseguir, dentro do escopo consolidado:

1. instalar o HomeServer seguindo a documentação;
2. acessar a plataforma após a instalação;
3. entender o estado básico do servidor;
4. localizar e acessar suas principais capacidades;
5. criar e gerenciar usuários quando autorizado;
6. utilizar serviços e módulos disponíveis;
7. operar dispositivos e armazenamento nas capacidades suportadas;
8. executar operações normais pelas interfaces apropriadas;
9. compreender falhas e receber orientação para recuperação;
10. realizar essas tarefas sem precisar programar ou utilizar o terminal para operações normais.

A primeira release não possui prazo automático. Ela será considerada quando a base estiver suficientemente consolidada e atender aos critérios definidos em `planning/release/`.

---

## Regras de priorização

- Não adicionar funcionalidades apenas porque podem existir.
- Priorizar problemas e necessidades observados no uso real.
- Cada nova capacidade deve entregar melhoria perceptível em confiabilidade, simplicidade ou qualidade de vida.
- Arquitetura sustentável é mais importante que quantidade de funcionalidades.
- Antes de adicionar uma nova capacidade, avaliar se uma capacidade existente já resolve o problema.
- Melhorias técnicas são prioritárias quando reduzem acoplamento, aumentam confiabilidade ou simplificam a evolução futura.
- Funcionalidades dependentes de serviços externos devem ser opcionais quando não forem necessárias ao núcleo.
- Módulos opcionais devem poder ser instalados ou removidos sem comprometer o Core ou dados não pertencentes ao módulo.
- Operações destrutivas ou de risco devem fornecer confirmação e feedback compreensíveis.
- Falhas devem priorizar recuperação e orientação antes de expor detalhes técnicos como única resposta.
- Planejamentos podem ser revisados quando novas evidências justificarem a mudança.

---

## Relação com outros documentos

- `docs/reference/PRINCIPLES.md` define princípios de referência.
- `docs/reference/ARCHITECTURE.md` define responsabilidades e fronteiras técnicas.
- `planning/foundations/` registra fundamentos gerais de evolução e validação.
- `planning/vision.md` define onde o projeto pretende chegar.
- `planning/roadmap/evolution.md` define fases, prioridades e áreas de consolidação.
- `planning/app/` registra a direção atual das interfaces Desktop e Mobile.
- `planning/modules/` define o planejamento dos módulos opcionais.
- `planning/release/` define critérios e processo para futuras releases oficiais.
- `planning/quality/` registra critérios e evidências de qualidade.
