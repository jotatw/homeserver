# Foundation

A Foundation reúne componentes básicos e reutilizáveis utilizados para construir outras partes do HomeServer.

Seu objetivo é reduzir duplicação e fornecer comportamentos comuns sem adquirir conhecimento sobre serviços, módulos ou necessidades específicas da plataforma.

## Quando algo pertence à Foundation?

Uma capacidade é candidata à Foundation quando:

- resolve um problema realmente reutilizável;
- não depende de um serviço específico;
- não precisa conhecer uma funcionalidade concreta do HomeServer;
- possui uma responsabilidade pequena e clara;
- pode ser usada sem conhecer detalhes da Infrastructure ou de módulos opcionais.

A pergunta prática é:

> **Isso continuaria fazendo sentido se os serviços atuais do HomeServer fossem substituídos?**

Se a resposta for sim, pode ser uma boa candidata à Foundation.

---

## Responsabilidades

Exemplos de responsabilidades adequadas:

- validações genéricas;
- leitura e tratamento comum de configuração;
- constantes compartilhadas;
- utilitários reutilizáveis;
- operações básicas abstraídas quando não dependem do domínio;
- tratamento comum de resultados e saída.

Esses exemplos não representam uma lista fixa de diretórios ou arquivos. A organização interna pode evoluir sem alterar a responsabilidade da camada.

---

## O que não pertence à Foundation?

A Foundation não deve conhecer detalhes como:

- Docker ou Compose;
- um serviço externo específico;
- módulos opcionais;
- regras particulares de Homepage, FileBrowser, Gitea ou outra aplicação;
- estado específico de uma instalação;
- lógica de interface;
- decisões operacionais dependentes do ambiente.

Essas responsabilidades normalmente pertencem à Infrastructure, a uma integração isolada, a um módulo ou a outra capacidade específica.

---

## Relação com outras camadas

A Foundation pode ser utilizada por componentes superiores, mas deve permanecer independente deles.

```text
Capacidades da plataforma
        ↓
Infrastructure
        ↓
Foundation
```

A direção indica dependências preferenciais:

```text
Infrastructure → Foundation     permitido
Módulos → Foundation            permitido quando necessário
Foundation → Infrastructure     evitar
Foundation → Módulo             não permitido como dependência
```

A Foundation não precisa conhecer quem a utiliza.

---

## Como evitar uma Foundation genérica demais

Reutilização não significa colocar qualquer código compartilhável na Foundation.

Antes de adicionar algo, avalie:

1. Existe mais de um uso real ou uma justificativa forte de reutilização?
2. A responsabilidade é independente do domínio?
3. A abstração simplifica o restante do código?
4. A nova dependência reduz ou aumenta a complexidade?
5. É possível manter uma API pequena e compreensível?

Evite abstrações criadas apenas para uma necessidade hipotética.

Uma solução específica pode permanecer fora da Foundation até que a necessidade de reutilização seja demonstrada.

---

## APIs da Foundation

Componentes públicos devem fornecer contratos pequenos e previsíveis.

Quando aplicável, o arquivo pode separar sua API pública de detalhes internos:

```bash
#!/usr/bin/env bash

########################################
# Public API
########################################

########################################
# Private
########################################
```

Funções internas devem permanecer privadas e não devem ser utilizadas como contrato por outras camadas.

Alterações em uma API pública da Foundation exigem atenção especial porque podem afetar múltiplos consumidores.

---

## Evolução

A Foundation deve crescer lentamente.

O fluxo preferencial é:

```text
Necessidade específica
        ↓
Implementação simples no componente responsável
        ↓
Surge reutilização real?
        ├── não → permanece específica
        └── sim → avaliar extração para Foundation
```

Extrair uma capacidade para a Foundation deve simplificar as dependências, não apenas mover código para um local central.

---

## Testes

Componentes reutilizáveis devem possuir validação adequada ao impacto de seus consumidores.

Um erro em uma função compartilhada pode afetar várias capacidades, portanto mudanças em APIs reutilizadas devem considerar regressão e compatibilidade.

Consulte [`../../contribute/TESTING.md`](../../contribute/TESTING.md).

---

## Referências relacionadas

- [`CORE.md`](CORE.md) — papel do núcleo técnico;
- [`Infrastructure.md`](Infrastructure.md) — capacidades dependentes da plataforma;
- [`../ARCHITECTURE.md`](../ARCHITECTURE.md) — visão geral;
- [`../../contribute/DEVELOPMENT.md`](../../contribute/DEVELOPMENT.md) — convenções de implementação.

Voltar para [Referência de arquitetura](README.md).