# Infrastructure

A Infrastructure reúne capacidades internas que conectam o HomeServer ao seu ambiente de execução.

Seu objetivo é encapsular detalhes do sistema e fornecer operações reutilizáveis para o restante da plataforma, evitando que cada componente precise conhecer comandos, caminhos, permissões ou mecanismos específicos do ambiente.

Ela utiliza a Foundation quando necessário, mas possui responsabilidades próprias relacionadas à operação do HomeServer.

## Quando algo pertence à Infrastructure?

Uma capacidade é candidata à Infrastructure quando:

- representa uma operação interna da plataforma;
- depende do ambiente onde o HomeServer é executado;
- encapsula detalhes do sistema operacional ou runtime;
- pode ser reutilizada por diferentes capacidades do HomeServer;
- não pertence a um serviço externo específico.

A pergunta prática é:

> **Isso é uma capacidade necessária para operar o HomeServer, independentemente de qual interface ou módulo a solicita?**

Se sim, provavelmente pertence à Infrastructure.

---

## Responsabilidades

Dependendo do estado atual do projeto, a Infrastructure pode concentrar capacidades relacionadas a:

- ambiente e requisitos de execução;
- arquivos e diretórios pertencentes à plataforma;
- serviços internos;
- containers e Compose;
- armazenamento;
- usuários;
- dispositivos e hardware;
- backup;
- energia;
- agendamento;
- atualização e manutenção.

A lista descreve áreas de responsabilidade, não a obrigação de todas existirem ou possuírem um módulo próprio em qualquer momento.

---

## O que não pertence à Infrastructure?

A Infrastructure não deve concentrar:

- lógica de interface;
- necessidades específicas de Homepage, App ou outra aplicação consumidora;
- integração detalhada com um serviço externo específico;
- comportamento exclusivo de um módulo opcional;
- personalizações particulares de uma instalação, salvo quando forem explicitamente tratadas como parte da plataforma.

Integrações específicas com recursos externos devem permanecer isoladas por fronteiras apropriadas, como Adapters, quando isso reduzir acoplamento e facilitar substituição ou manutenção.

---

## Relação com Foundation e componentes superiores

A direção de dependências preferencial é:

```text
Capacidades / consumidores
        ↓
Infrastructure
        ↓
Foundation
        ↓
Sistema e runtime
```

A Infrastructure pode utilizar a Foundation.

```text
Infrastructure → Foundation     permitido
Foundation → Infrastructure     evitar
```

Componentes superiores devem utilizar capacidades da Infrastructure por interfaces ou contratos apropriados, sem depender desnecessariamente de seus detalhes internos.

---

## Relação com Adapters

Infrastructure e Adapters possuem responsabilidades diferentes.

```text
Infrastructure
→ capacidades do próprio HomeServer e seu ambiente

Adapter
→ integração com uma ferramenta ou serviço externo específico
```

Exemplo conceitual:

```text
Gerenciar containers em geral
→ Infrastructure

Executar uma operação específica do FileBrowser
→ Adapter do FileBrowser
```

A separação evita que detalhes de um fornecedor ou serviço externo se espalhem pela plataforma.

---

## APIs e fronteiras

Cada capacidade deve expor apenas as operações necessárias para seus consumidores.

Evite exigir que componentes superiores conheçam:

- comandos internos;
- caminhos específicos do ambiente;
- detalhes de containers;
- permissões internas;
- formato de ferramentas utilizadas para implementar uma operação.

Esses detalhes podem mudar sem exigir alterações nos consumidores quando permanecem encapsulados.

---

## Organização interna

A estrutura de arquivos pode evoluir conforme as capacidades amadurecem.

Uma organização possível é:

```text
core/infrastructure/
├── environment
├── runtime
├── storage
├── users
├── devices
├── hardware
├── backup
├── scheduler
├── power
└── maintenance
```

Os nomes e a divisão concreta não são contratos arquiteturais por si só. O importante é que cada componente mantenha uma responsabilidade clara e evite se tornar um módulo genérico para operações sem relação.

---

## Adicionando uma nova capacidade

Antes de criar ou ampliar um componente da Infrastructure, avalie:

1. Qual problema operacional ele resolve?
2. Essa responsabilidade já existe em outro componente?
3. Ele depende do ambiente ou runtime do HomeServer?
4. Poderia ser uma integração isolada com um serviço externo?
5. Qual API mínima os consumidores realmente precisam?
6. Como falhas serão apresentadas ou tratadas?
7. A mudança introduz uma dependência nova no núcleo?

O objetivo é adicionar capacidades claras, não acumular operações apenas porque pertencem ao servidor.

---

## Evolução e estabilidade

Capacidades da Infrastructure podem afetar múltiplos componentes do HomeServer.

Antes de consolidar uma mudança, considere:

- impacto sobre consumidores existentes;
- compatibilidade de APIs públicas;
- comportamento em ambientes suportados;
- tratamento de falhas previsíveis;
- possibilidade de teste;
- custo de manutenção;
- necessidade de documentação ou ADR.

Uma nova capacidade deve permanecer simples até que exista evidência para justificar maior abstração.

---

## Testes

A validação deve ser proporcional ao impacto da mudança.

Capacidades que dependem do sistema operacional, Docker, hardware ou outros recursos reais podem exigir validação além de testes isolados.

Consulte [`../../contribute/TESTING.md`](../../contribute/TESTING.md).

---

## Referências relacionadas

- [`CORE.md`](CORE.md) — papel do núcleo técnico;
- [`FOUNDATION.md`](FOUNDATION.md) — componentes independentes e reutilizáveis;
- [`API.md`](API.md) — contratos expostos pela plataforma;
- [`MODULES.md`](MODULES.md) — capacidades opcionais;
- [`adr/`](adr/) — decisões arquiteturais específicas.

Voltar para [Referência de arquitetura](README.md).