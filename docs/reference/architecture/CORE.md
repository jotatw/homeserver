# Core

O Core é o núcleo técnico compartilhado do HomeServer.

Seu objetivo é fornecer capacidades estáveis para a plataforma sem concentrar funcionalidades específicas de módulos, interfaces ou personalizações locais.

A organização detalhada pode evoluir. O que deve permanecer estável são as responsabilidades e as fronteiras entre os componentes.

## O que o Core faz

O Core concentra capacidades compartilhadas necessárias para operar e evoluir a plataforma, como:

- componentes reutilizáveis;
- capacidades internas do HomeServer;
- integração isolada com recursos externos quando necessária;
- contratos e operações utilizadas por componentes da plataforma;
- inicialização e ferramentas centrais.

Nem toda funcionalidade compartilhada pertence automaticamente ao Core. Uma capacidade deve possuir uma responsabilidade clara antes de ser incorporada.

## O que o Core não faz

O Core não deve:

- implementar uma necessidade específica de uma instalação;
- depender de módulos opcionais;
- conhecer personalizações locais como requisito de funcionamento;
- concentrar lógica de interface;
- transformar cada serviço ou experimento em dependência central.

A direção preferencial é manter o núcleo pequeno e permitir que capacidades independentes permaneçam independentes enquanto isso for possível.

---

## Organização arquitetural

A documentação atual utiliza estas responsabilidades principais:

```text
Foundation
    ↓
Infrastructure
    ↓
Capacidades da plataforma
    ↓
Contratos / API
    ↓
Interfaces e integrações consumidoras
```

Essa representação descreve uma direção de responsabilidades, não uma sequência obrigatória para todas as operações.

Além dessas fronteiras, módulos opcionais podem utilizar capacidades da plataforma sem se tornarem dependências do núcleo.

```text
                Modules opcionais
                       │
                       ▼
Foundation → Infrastructure → Capacidades / API
                       │
                       ▼
              Sistema e serviços externos
```

Os detalhes de cada área estão nos documentos específicos desta seção.

---

## Responsabilidades principais

### Foundation

Fornece componentes básicos e reutilizáveis.

Ela deve permanecer independente de serviços e necessidades específicas da plataforma sempre que possível.

Exemplos de responsabilidades:

- validações reutilizáveis;
- acesso comum a configuração;
- utilitários básicos;
- saída e tratamento comum de resultados.

Consulte [`FOUNDATION.md`](FOUNDATION.md).

### Infrastructure

Implementa capacidades internas relacionadas ao funcionamento do HomeServer e à interação controlada com seu ambiente.

Ela encapsula detalhes necessários para que outras partes da plataforma não precisem conhecer diretamente comandos, caminhos ou mecanismos internos.

Consulte [`Infrastructure.md`](Infrastructure.md).

### Adapters e integrações externas

Integrações com serviços externos devem permanecer atrás de fronteiras apropriadas.

Isso reduz o acoplamento entre o restante da plataforma e detalhes específicos de ferramentas ou serviços.

A regra não exige criar uma camada artificial para toda integração pequena. O isolamento deve ser proporcional ao impacto e à possibilidade de mudança do recurso externo.

### API e contratos

Interfaces consumidoras não devem depender diretamente de detalhes internos quando existe um contrato apropriado para a operação.

A API define operações e comportamentos expostos pela plataforma. A implementação interna pode evoluir preservando o contrato suportado.

Consulte [`API.md`](API.md) e a [referência da API](../../api/README.md).

---

## Relação com módulos

Módulos são capacidades opcionais ou implantáveis conforme a arquitetura do projeto.

A relação desejada é:

```text
Módulo
   ↓ usa contratos e capacidades necessárias
Core
   ↓
Sistema / serviços externos
```

O Core não deve depender de um módulo opcional para seu funcionamento normal.

A remoção de um módulo não deve comprometer responsabilidades fora do escopo daquele módulo.

Consulte [`MODULES.md`](MODULES.md).

---

## Estabilidade e evolução

O Core deve evoluir com cautela porque mudanças centrais podem afetar múltiplos consumidores.

Antes de incorporar uma nova capacidade, avalie:

- qual problema ela resolve;
- qual responsabilidade ela possui;
- se realmente precisa ser central;
- se pode permanecer como módulo ou personalização independente;
- quais contratos serão afetados;
- qual custo de manutenção será adicionado.

A evolução preferencial é:

```text
Necessidade identificada
        ↓
Menor solução adequada
        ↓
Validação prática
        ↓
Responsabilidade clara?
        ├── não → permanece independente ou é revisada
        └── sim → pode ser consolidada na arquitetura
```

Isso evita aumentar permanentemente a complexidade do núcleo por necessidades ainda não comprovadas.

---

## Testes

Mudanças no Core devem possuir validação proporcional ao seu impacto.

Componentes reutilizados por várias partes da plataforma merecem atenção especial, pois uma regressão pode afetar múltiplas capacidades.

Consulte [`../../contribute/TESTING.md`](../../contribute/TESTING.md) para a estratégia geral de testes e validação.

---

## Documentação relacionada

- [`../ARCHITECTURE.md`](../ARCHITECTURE.md) — visão geral da arquitetura;
- [`FOUNDATION.md`](FOUNDATION.md) — componentes reutilizáveis;
- [`Infrastructure.md`](Infrastructure.md) — capacidades internas;
- [`API.md`](API.md) — fronteira de contratos;
- [`MODULES.md`](MODULES.md) — módulos opcionais;
- [`adr/`](adr/) — decisões arquiteturais específicas.

Voltar para [Referência de arquitetura](README.md).