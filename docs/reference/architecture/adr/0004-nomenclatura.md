# ADR-0004 — Nomenclatura por responsabilidade

## Status

Aceito

## Data

2026-08-05

## Decisão

Funções e componentes do Core devem utilizar nomes que indiquem sua responsabilidade ou domínio, evitando funções genéricas e órfãs quando existe um contexto arquitetural claro.

A nomenclatura não deve, porém, tentar representar toda a arquitetura apenas por prefixos. Prefixos são uma convenção de leitura e organização, não uma prova de que um componente pertence a uma camada específica.

O modelo preferencial é:

| Responsabilidade | Convenção | Exemplos |
|---|---|---|
| Foundation | `hs_*` | `hs_fs_*`, `hs_cfg_*`, `hs_val_*`, `hs_out_*`, `hs_const_*`, `hs_registry_*` |
| Capacidade / domínio | prefixo do domínio | `storage_*`, `users_*`, `devices_*`, `hardware_*`, `backup_*`, `scheduler_*`, `power_*`, `service_*` |
| Adapter de integração | prefixo da integração | `filebrowser_*`, `compose_*` |
| Interface CLI | comando e subcomando explícitos | `hs user create`, `hs system status` |

A escolha do prefixo deve responder principalmente:

```text
Qual responsabilidade esta função possui?
```

Por exemplo:

```text
hs_fs_copy_file
→ operação genérica de Foundation

storage_status
→ responsabilidade da capacidade de armazenamento

filebrowser_create_user
→ integração específica com FileBrowser
```

## Contexto

A base cresceu rapidamente e passou a misturar padrões como `hs_*`, prefixos de domínio e funções sem contexto claro, por exemplo `copy_file` ou `create_directory`.

Isso dificultava identificar se uma função era:

- utilitário compartilhado;
- parte de uma capacidade específica;
- detalhe de uma integração externa;
- interface administrativa.

A convenção inicial registrava esses grupos como camadas rígidas. Com a evolução da arquitetura, tornou-se mais importante distinguir responsabilidades e capacidades sem obrigar toda a estrutura a se encaixar em uma cadeia fixa de camadas.

## Regras

### 1. Funções compartilhadas

Funções genéricas reutilizadas por diferentes partes do Core devem possuir um contexto explícito de Foundation.

Exemplo:

```text
hs_fs_*
hs_cfg_*
hs_val_*
```

Não devem ser criados prefixos compartilhados apenas por conveniência quando a responsabilidade já pertence claramente a uma capacidade ou adapter.

### 2. Capacidades e domínios

Funções que implementam uma responsabilidade própria devem utilizar o prefixo do domínio quando isso melhora a identificação.

Exemplo:

```text
power_*
storage_*
backup_*
```

O prefixo não obriga que todo código com o mesmo domínio esteja no mesmo arquivo ou módulo. A organização física continua sendo uma decisão separada.

### 3. Adapters

Integrações com sistemas externos devem usar um prefixo específico quando necessário para evitar que detalhes da integração sejam confundidos com contratos internos.

Exemplo:

```text
filebrowser_*
compose_*
```

### 4. Interfaces

Interfaces devem expor operações compreensíveis sem reproduzir necessariamente os nomes internos das funções.

Exemplo:

```text
hs user create
```

não exige que a implementação interna tenha exatamente o mesmo nome.

### 5. Evitar renomeação sem benefício

Uma função existente não deve ser renomeada apenas para atingir uniformidade visual.

Renomeações devem ocorrer quando melhoram ao menos um destes pontos:

- identificação da responsabilidade;
- prevenção de conflito ou ambiguidade;
- separação entre capacidade e integração;
- compreensão da arquitetura.

## Consequências

### Positivas

- facilita identificar a responsabilidade de funções e componentes;
- reduz funções genéricas sem contexto;
- separa melhor capacidades internas de detalhes de integrações externas;
- permite evolução arquitetural sem depender de uma taxonomia rígida de nomes;
- mantém a CLI como contrato legível, independente dos nomes internos.

### Custos e limites

- convenções precisam ser aplicadas com julgamento, não mecanicamente;
- alguns componentes podem atravessar mais de uma responsabilidade e exigir nomes mais específicos;
- nomes antigos podem permanecer quando sua alteração não trouxer benefício real;
- a nomenclatura não substitui documentação, contratos ou separação arquitetural.

## Alternativas consideradas

### 1. Unificar todas as funções em `hs_*`

**Não adotada.**

Reduziria a identificação imediata de capacidades e integrações específicas.

### 2. Exigir um prefixo que represente rigidamente cada camada

**Não adotada.**

A arquitetura atual não depende de uma cadeia universal de camadas, e um nome não deve ser usado como única definição da posição arquitetural de um componente.

### 3. Não definir convenções

**Não adotada.**

A base já demonstrou que funções sem contexto e padrões misturados dificultam manutenção e compreensão.

## Relação com outros documentos

- ADRs de arquitetura que definem responsabilidades e integrações;
- documentação do Core para organização física e contratos;
- documentação de contribuição para personalização e manutenção do projeto.
