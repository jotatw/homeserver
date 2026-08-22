# Arquitetura do HomeServer

Este documento descreve **como o HomeServer está organizado tecnicamente**: suas principais fronteiras, responsabilidades e direções de dependência.

Use [`PRINCIPLES.md`](PRINCIPLES.md) para entender **por que** a arquitetura segue determinadas regras. Use `architecture/` para detalhes específicos e `architecture/adr/` para decisões estruturais registradas.

## Como interpretar este documento

A arquitetura mistura três tipos de informação que devem ser lidos de forma diferente:

- **Estrutura atual** — organização já utilizada pelo projeto.
- **Contrato arquitetural** — fronteiras e dependências que novas mudanças devem respeitar.
- **Direção de evolução** — comportamentos desejados que ainda dependem de implementação e validação.

Quando uma capacidade estiver apenas planejada, isso não significa que ela já exista como comportamento garantido.

---

## Visão geral

O objetivo da arquitetura é separar a experiência de uso dos detalhes necessários para operar o servidor.

```text
Interfaces
Desktop principal / Mobile rápido / CLI avançado
                       │
                       ▼
                Contratos da plataforma
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

O diagrama representa **responsabilidades e fronteiras**, não uma sequência obrigatória de chamadas. Nem toda operação atravessa todas as caixas.

---

# 1. Core

O Core reúne capacidades fundamentais da plataforma. Sua organização segue dependências direcionadas:

```text
Applications
     │
     ▼
Infrastructure
     │
     ▼
Foundation
```

A regra é simples: camadas superiores podem utilizar capacidades inferiores, mas uma camada inferior não deve conhecer detalhes das superiores.

## Foundation

**Responsabilidade:** fornecer componentes genéricos e reutilizáveis.

Inclui capacidades como:

- constantes;
- configuração;
- validação;
- operações básicas de sistema de arquivos;
- saída padronizada;
- registro e inicialização de componentes do Core.

Não deve conhecer:

- módulos específicos;
- serviços específicos;
- regras particulares de aplicações;
- interfaces de usuário;
- dependências específicas da Infrastructure.

## Infrastructure

**Responsabilidade:** implementar capacidades concretas necessárias para operar o HomeServer.

Exemplos:

- armazenamento;
- usuários;
- dispositivos;
- hardware;
- serviços;
- energia;
- backup;
- agendamento;
- Docker e Compose;
- integração com o sistema operacional.

A Infrastructure utiliza a Foundation, mas não deve depender de módulos específicos para cumprir suas responsabilidades genéricas.

## Applications

**Responsabilidade:** reunir componentes funcionais internos que utilizam as capacidades da plataforma.

A organização concreta dessas aplicações pode evoluir. Uma nova aplicação não deve inverter as dependências do Core para acessar capacidades inferiores.

---

# 2. Adapters e serviços externos

Adapters isolam integrações com componentes externos:

```text
Capacidade da plataforma
        ↓
      Adapter
        ↓
 Serviço externo
```

Exemplos incluem integrações com FileBrowser, Gitea ou outros serviços.

O objetivo é evitar que regras centrais dependam diretamente de detalhes particulares de uma implementação externa. Isso reduz o impacto quando um serviço precisa ser alterado ou substituído.

---

# 3. Módulos

Um módulo amplia o HomeServer sem transformar sua existência em dependência obrigatória do Core.

A definição de referência é:

> Um módulo é um componente opcional ou independente que amplia uma capacidade do HomeServer, reutilizando contratos da plataforma e podendo ser instalado ou removido conforme sua política sem exigir alterações arbitrárias na Foundation ou Infrastructure.

Para módulos opcionais, a arquitetura busca preservar:

- isolamento de falhas;
- instalação e remoção previsíveis;
- responsabilidade clara sobre configuração e dados;
- ausência de dependência do Core para operações não relacionadas;
- possibilidade de evolução sem acoplamentos arbitrários.

O mecanismo concreto de descoberta, carregamento ou gerenciamento de módulos só deve ser tratado como contrato oficial quando estiver definido, implementado, validado e documentado.

---

# 4. API: fronteira pública da plataforma

A API separa clientes dos detalhes internos:

```text
Desktop / Mobile / Integrações
              ↓
             API
              ↓
Capacidades da plataforma
              ↓
Infrastructure / Adapters / Serviços
```

Clientes não devem precisar depender diretamente de:

- nomes de containers;
- comandos internos;
- caminhos internos;
- volumes Docker;
- units do systemd;
- scripts específicos.

Sempre que possível, mudanças internas devem preservar os contratos utilizados pelos clientes.

Os contratos e endpoints específicos estão documentados em [`api/README.md`](../../api/README.md).

---

# 5. Interfaces

As interfaces possuem papéis diferentes conforme o contexto.

## Desktop

É a interface principal para gerenciamento e tarefas que exigem mais contexto, configuração, visualização ou controle.

## Mobile

Prioriza acesso rápido a ações frequentes. Não precisa reproduzir automaticamente todas as capacidades do Desktop.

A direção atual inclui casos como transferências rápidas, acesso a destinos frequentes, consulta de informações essenciais e ações remotas justificadas pelo uso real. O conjunto final permanece sujeito à validação prática.

## CLI

É a interface avançada e operacional, importante para:

- instalação;
- automação;
- testes;
- diagnóstico;
- recuperação;
- manutenção técnica.

Uma capacidade pode existir primeiro no CLI. Isso não significa que toda operação precise posteriormente ganhar uma interface visual; a decisão depende do contexto e do uso real.

---

# 6. Fluxo de operação

A direção preferencial é:

```text
Usuário
   ↓
Interface adequada ao contexto
   ↓
Contrato da plataforma
   ↓
Capacidade responsável
   ↓
Infrastructure / Adapter / Serviço
```

O usuário expressa uma intenção. A plataforma executa os detalhes técnicos necessários.

Interfaces diferentes podem acessar a mesma capacidade, mas não devem criar implementações divergentes para a mesma responsabilidade.

---

# 7. Inicialização

A inicialização do Core segue uma sequência previsível:

```text
bootstrap
      ↓
loader
      ↓
Foundation
      ↓
Infrastructure
      ↓
Applications
```

O lifecycle específico de serviços pode utilizar mecanismos próprios, como Docker Compose ou systemd, conforme sua responsabilidade.

---

# 8. Dependências

As principais direções de dependência são:

```text
Applications → Infrastructure → Foundation
Infrastructure → Adapter → Serviço externo
Interface → API → Plataforma
```

Devem ser evitados:

- dependências inversas;
- conhecimento desnecessário entre camadas;
- acoplamentos implícitos a detalhes internos;
- interfaces que executam diretamente a lógica interna de outra camada.

---

# 9. Persistência

A persistência deve possuir responsabilidades e fontes de verdade claras.

Quando aplicável, um serviço separa:

```text
Serviço
├── Aplicação
├── Configuração
└── Dados persistentes
```

O modelo do HomeServer também separa responsabilidades de armazenamento, backup, configuração, código e infraestrutura. Novos componentes não devem criar estruturas paralelas sem necessidade ou decisão arquitetural explícita.

Essa separação favorece atualização, backup, restauração, substituição de implementação e remoção controlada de componentes opcionais.

---

# 10. Organização do repositório

A estrutura acompanha as responsabilidades da plataforma:

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

A estrutura pode evoluir. Um diretório planejado não deve ser interpretado como capacidade implementada apenas por existir no planejamento.

---

# 11. Evolução arquitetural

Antes de consolidar uma mudança estrutural, avalie:

1. qual problema está sendo resolvido;
2. qual componente é responsável;
3. quais contratos serão afetados;
4. quais consumidores dependem deles;
5. como compatibilidade ou migração será tratada;
6. quais testes e documentos precisam mudar;
7. se já existe evidência suficiente para consolidar a solução.

Mudanças relevantes devem ser avaliadas para registro em `architecture/adr/`.

## Resumo

```text
PRINCIPLES.md
    ↓ por que

ARCHITECTURE.md
    ↓ como está organizado

architecture/
    ↓ detalhes e contratos

architecture/adr/
    ↓ decisões específicas
```

## Documentos relacionados

- [`PRINCIPLES.md`](PRINCIPLES.md) — princípios permanentes.
- [`architecture/`](architecture/) — detalhes arquiteturais.
- [`architecture/adr/`](architecture/adr/) — decisões estruturais relevantes.
- [`api/README.md`](../../api/README.md) — contratos da API.
- `planning/` — direção, fundamentos e evolução futura.
