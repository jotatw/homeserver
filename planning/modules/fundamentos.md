# Fundamentos da Modularização

## Status

**Planejamento fechado:** M1.1 a M1.6.

Este documento registra decisões conceituais. Ele não define ainda formato de manifesto, schema, banco de dados, API ou implementação em código.

---

## 1. Objetivo

O HomeServer deve administrar funcionalidades como módulos, permitindo que serviços sejam controlados pela plataforma sem exigir que o usuário final use diretamente o terminal.

A modularização deve preservar os princípios abaixo:

- desacoplamento entre funcionalidades e tecnologias concretas;
- validação central das operações pelo Core;
- proteção de dados da plataforma e do usuário;
- instalação, ativação, desativação, atualização e remoção controladas;
- possibilidade futura de substituir implementações;
- suporte conceitual a diferentes mecanismos de execução, não apenas Docker.

---

# M1.1 — Informação mínima sobre um módulo

O contrato futuro de um módulo deverá cobrir conceitualmente:

```text
MODULE
├── identity
├── classification
├── administrative_state
├── operational_state
├── capabilities
├── dependencies
├── operations
├── persistence
├── integrations
├── health
└── implementation
```

## 1.1 Identidade

A identidade técnica deve ser estável e independente do nome apresentado ao usuário ou da tecnologia utilizada.

## 1.2 Classificação

Os módulos podem possuir papéis arquiteturais diferentes, como infraestrutura, experiência, capacidade e administração. A classificação influencia políticas de visibilidade, lifecycle e impacto das operações.

## 1.3 Estado

O estado não deve ser reduzido à existência ou execução de um container. Estado administrativo e estado operacional são conceitos distintos.

## 1.4 Capacidades

O módulo declara o que oferece à plataforma. A capacidade não deve depender do nome de uma tecnologia concreta.

## 1.5 Dependências

O módulo deve declarar relações necessárias para instalação, execução ou operações específicas, sem transformar automaticamente toda integração em dependência existencial.

## 1.6 Operações

As operações possíveis incluem, conforme o módulo e as regras do Core:

- install;
- enable;
- disable;
- update;
- uninstall;
- purge.

Uma implementação pode suportar uma operação, mas o Core continua responsável por validar se ela pode ser executada naquele contexto.

## 1.7 Persistência

A plataforma precisa conhecer a propriedade e a política de persistência dos recursos utilizados. A localização física, isoladamente, não define propriedade.

## 1.8 Integrações

Módulos devem declarar necessidades de integração. Eles não devem modificar diretamente outros módulos ou infraestrutura compartilhada sem mediação da plataforma.

## 1.9 Health

Execução e saúde são conceitos distintos. Um processo ou container em execução não é automaticamente considerado saudável.

## 1.10 Implementação

O conceito de módulo deve permanecer independente do mecanismo de execução. Uma implementação futura pode usar Docker, systemd, processo nativo ou outro adapter compatível.

---

# M1.2 — Serviço, módulo, capacidade e implementação

## Serviço

Unidade concreta de execução que fornece funcionalidades por meio de processo, container ou mecanismo equivalente.

Exemplos atuais: Caddy, FileBrowser, Gitea, Homepage e Portainer.

## Capacidade

Funcionalidade conceitual oferecida à plataforma, independente da tecnologia utilizada para implementá-la.

Exemplo: acesso a arquivos, e não FileBrowser.

## Implementação

Conjunto de recursos técnicos utilizado para fornecer uma ou mais capacidades de um módulo.

## Módulo

Unidade administrativa da plataforma que agrupa capacidades, lifecycle, dependências, persistência, integrações e uma implementação responsável por disponibilá-las.

### Relação conceitual

```text
Módulo
├── administra
│   ├── capacidades
│   ├── dados
│   ├── lifecycle
│   └── integrações
└── utiliza
    └── implementação
        └── executa um ou mais serviços
```

### Regra de terminologia

Usar `Módulo Files` para a unidade administrada pela plataforma, `acesso a arquivos` para a capacidade e `FileBrowser` para a implementação ou serviço atual.

### Cardinalidades iniciais

- um módulo pode fornecer uma ou mais capacidades;
- um módulo pode possuir uma implementação composta por um ou mais serviços;
- um serviço concreto deve possuir um responsável claro e não deve ser diretamente administrado por múltiplos módulos.

---

# M1.3 — Descoberta e registro de módulos

## 3.1 Separações obrigatórias

```text
DEFINIÇÃO DO MÓDULO
≠
ESTADO DA INSTALAÇÃO
≠
ESTADO OBSERVADO
```

E:

```text
MÓDULO CONHECIDO
≠
MÓDULO INSTALADO
```

## 3.2 Três níveis de informação

### Definição

Responde: **o que este módulo é?**

Inclui identidade, capacidades, dependências, operações, requisitos, políticas de persistência e integrações declaradas.

### Estado da instalação

Responde: **como este módulo está nesta instância?**

Inclui instalação, habilitação, implementação selecionada, versão instalada, configuração e informações administrativas equivalentes.

### Estado observado

Responde: **como este módulo está funcionando agora?**

Inclui saúde, status observado, degradação, falhas e resultados de verificações.

## 3.3 Fonte de verdade

A descoberta não deve depender exclusivamente de `docker ps` ou da presença de containers. A plataforma precisa conhecer o módulo mesmo quando sua implementação estiver parada, ausente, falhando ou em transição.

## 3.4 Catálogo

O catálogo representa módulos conhecidos pela plataforma. Um módulo pode estar planejado ou disponível sem estar instalado em uma instância específica.

## 3.5 Remoção

`uninstall` não remove a definição conceitual do módulo do catálogo. A definição permanece conhecida para permitir reinstalação e validação futura.

O formato e a localização física do catálogo permanecem em aberto.

---

# M1.4 — Dependências

## 4.1 Tipos conceituais

- infraestrutura;
- módulo;
- capacidade.

## 4.2 Obrigatoriedade

Dependências podem ser obrigatórias ou opcionais.

## 4.3 Contexto

Uma dependência pode existir em contextos diferentes:

- instalação;
- runtime;
- operação específica.

Uma necessidade durante a instalação não deve ser automaticamente modelada como dependência permanente de execução.

## 4.4 Dependência por capacidade

Quando possível, módulos devem depender de capacidades em vez de tecnologias concretas. Isso reduz o acoplamento com uma implementação específica.

## 4.5 Dependência não é integração

A existência de uma rota ou configuração de proxy, por exemplo, não significa automaticamente que dois módulos possuem dependência existencial.

## 4.6 Validação central

Antes de operações de lifecycle, o Core deve resolver o grafo de dependências e validar o impacto.

```text
API
↓
Core
↓ valida dependências e impacto
Infrastructure
↓ executa
```

A infraestrutura não deve decidir isoladamente uma operação destrutiva apenas executando comandos sobre containers.

## 4.7 Regra de segurança

Depender de uma capacidade não concede controle irrestrito sobre o módulo ou serviço que a fornece.

---

# M1.5 — Lifecycle completo

## 5.1 Dimensões de estado

### Estado do catálogo

```text
planned
available
deprecated
unsupported
```

Responde se o módulo existe e é suportado pela plataforma.

### Estado administrativo

```text
not_installed
installed
active
disabled
```

Representa o estado registrado e desejado para a instância.

### Estado de configuração

```text
unknown
not_required
required
incomplete
valid
invalid
```

A configuração é uma condição independente para evitar multiplicação de estados administrativos.

### Estado operacional

```text
unknown
healthy
degraded
unhealthy
stopped
```

Um módulo `active` pode estar `unhealthy`.

### Operação

Operações transitórias incluem:

```text
idle
installing
enabling
disabling
updating
uninstalling
purging
```

O resultado da última operação deve ser registrado separadamente do estado administrativo.

## 5.2 Transições principais

```text
not_installed
      │ install
      ▼
installed
      │ enable
      ▼
active
      │ disable
      ▼
disabled
      │ enable
      └──────────────► active

installed / active / disabled
      │ uninstall
      ▼
not_installed
```

Atualização deve preservar a intenção administrativa: atualizar um módulo desativado não deve ativá-lo implicitamente.

## 5.3 Uninstall

A operação deve:

1. validar dependentes;
2. validar política de dados;
3. remover integrações aplicáveis;
4. remover a implementação;
5. preservar recursos conforme ownership e persistência;
6. retornar o módulo a `not_installed` sem removê-lo do catálogo.

## 5.4 Purge

`purge` é separado de `uninstall` e remove apenas recursos elegíveis segundo política explícita e confirmação adequada.

## 5.5 Invariantes

- `not_installed` não pode ser operacionalmente `healthy`;
- `active` não implica `healthy`;
- `uninstall` não implica `purge`;
- falha de operação não transforma automaticamente o estado administrativo em `failed`;
- operações destrutivas não podem ignorar dependências ou políticas de persistência.

---

# M1.6 — Dados, persistência e propriedade

## 6.1 Localização não define propriedade

Um serviço pode acessar `/srv/storage` sem possuir esse recurso. Uso não concede propriedade.

## 6.2 Categorias de propriedade

### Platform-owned

Pertence ao HomeServer e sobrevive a módulos e implementações.

### Module-owned

Pertence conceitualmente ao módulo, independentemente de detalhes exclusivos de uma implementação.

### Implementation-owned

Pertence exclusivamente à implementação concreta e pode exigir migração explícita para ser reutilizado por outra implementação.

### User-owned

Dados criados ou fornecidos pelo usuário. Não devem ser removidos automaticamente por operações de lifecycle de módulos.

### Generated/Rebuildable

Dados derivados que podem ser recriados, como caches e índices adequadamente classificados.

## 6.3 Propriedade e persistência

São dimensões independentes. A política de persistência pode ser conceitualmente:

```text
permanent
persistent
recoverable
rebuildable
temporary
```

## 6.4 Recursos compartilhados

Cada recurso importante deve possuir proprietário e consumidores conhecidos. Remover um consumidor não concede autorização para remover o recurso compartilhado.

Exemplo conceitual:

```text
Resource: /srv/storage
Owner: platform
Consumers: Files, Backup, Media
```

## 6.5 Substituição de implementação

A substituição deve preservar recursos fundamentais da plataforma e do usuário, tratar explicitamente dados exclusivos da implementação antiga e instalar a nova implementação contra contratos e recursos conhecidos.

Migrações entre estados internos incompatíveis devem ser explícitas:

```text
Implementation A
↓
Migration Adapter
↓
Implementation B
```

Não se deve assumir que uma implementação nova pode ler arbitrariamente os dados internos da anterior.

## 6.6 Configuração

Separar:

- configuração da plataforma;
- configuração do módulo;
- configuração exclusiva da implementação.

O App deve trabalhar preferencialmente com configurações conceituais da plataforma ou do módulo. Adapters podem traduzir essas configurações para detalhes específicos de uma implementação.

## 6.7 Regra para exclusão

Nenhuma operação destrutiva deve receber simplesmente um caminho arbitrário para apagar. O fluxo conceitual é:

```text
operação
↓
resolver recursos registrados
↓
consultar ownership
↓
consultar política de remoção
↓
calcular impacto
↓
confirmar quando necessário
↓
executar
```

## 6.8 Invariantes

- uso não implica propriedade;
- dados user-owned são protegidos contra remoção automática;
- recursos permanentes platform-owned são protegidos contra módulos consumidores;
- uninstall não implica purge;
- recursos compartilhados exigem análise de consumidores;
- implementação não define unilateralmente propriedade global;
- operações destrutivas trabalham com recursos conhecidos e validados.

---

# Decisões ainda abertas

As decisões abaixo dependem das próximas etapas e não estão fechadas:

- M1.7 — modelo de integração entre módulos e plataforma;
- formato do contrato ou manifesto;
- mecanismo de descoberta física;
- localização do catálogo;
- armazenamento do estado da instância;
- schema e validação formal;
- versionamento e compatibilidade entre plataforma, módulo e implementação;
- extensibilidade por terceiros;
- instalação automática ou coordenada de dependências;
- inventário definitivo dos recursos dos serviços atuais;
- políticas específicas para Files, Git, Access, Experience e Administration.

---

# Próxima etapa

**M1.7 — Integrações entre módulos e plataforma**.

O objetivo será definir como módulos:

- aparecem no App;
- registram capacidades;
- solicitam integração de roteamento;
- utilizam recursos compartilhados;
- recebem informações da plataforma;
- removem integrações durante uninstall;
- evitam modificar diretamente outros módulos.
