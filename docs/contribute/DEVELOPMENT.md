# HomeServer - Guia de Desenvolvimento

## Objetivo

Este documento define os padrões utilizados no desenvolvimento do HomeServer.

Toda implementação deve seguir estas diretrizes para manter o projeto simples, consistente e de fácil manutenção.

---

# Filosofia

- Comece pequeno.
- Evolua por etapas.
- Uma responsabilidade por módulo.
- Código simples é melhor que código complexo.
- Documentação explica o porquê, o código explica o como.

---

# Fluxo de Desenvolvimento

Cada funcionalidade deve seguir o seguinte fluxo:

Issue
↓
Interface
↓
Implementação
↓
Teste
↓
Review
↓
Commit
↓
Documentação

---

# Organização

Cada arquivo deve possuir apenas uma responsabilidade.

Exemplos:

- filesystem.sh
- storage.sh
- user.sh
- docker.sh
- compose.sh

---

# Estrutura dos Arquivos

Todos os arquivos da Foundation devem seguir a mesma organização.

```bash
#!/usr/bin/env bash

########################################
# Public API
########################################

########################################
# Private
########################################
```

---

# Convenções

## Nomenclatura por camada

Cada camada usa um prefixo próprio, comunicando sua responsabilidade.

| Camada | Prefixo | Exemplos |
|--------|---------|----------|
| Foundation | `hs_*` | `hs_fs_*`, `hs_cfg_*`, `hs_val_*`, `hs_out_*` |
| Infrastructure | prefixo do módulo | `storage_*`, `users_*`, `devices_*`, `hardware_*`, `backup_*`, `scheduler_*`, `power_*`, `compose_*`, `service_*` |
| Adapters | prefixo do serviço | `filebrowser_login`, `filebrowser_create_user` |
| CLI | `hs <comando> <subcomando>` | `hs user create`, `hs system status` |

## Funções públicas

Todas devem utilizar o prefixo correspondente à camada ou módulo.

## Funções privadas

Funções privadas devem iniciar com `_`.

---

# Responsabilidades

Cada função deve possuir apenas uma responsabilidade. Evite funções que executem várias operações.

---

# Foundation

A Foundation:

- não imprime mensagens;
- não conhece módulos;
- não conhece serviços;
- não conhece Docker;
- não conhece serviços específicos.

A Foundation apenas fornece APIs reutilizáveis.

---

# Testes

Toda nova funcionalidade deve possuir testes aplicáveis.

Fluxo mínimo:

Preparação
↓
Execução
↓
Validação
↓
Limpeza

Quando aplicável, testes automatizados devem ser complementados por validação no ambiente real.

---

# Commits

Os commits devem ser pequenos e representar mudanças coerentes.

Exemplos:

```text
feat(foundation): add filesystem helper
test(foundation): add filesystem tests
refactor(foundation): simplify filesystem api
```

---

# Documentação

A documentação deve registrar decisões, funcionamento, limitações e evidências relevantes.

Comentários no código devem ser utilizados apenas quando ajudam a compreender uma decisão ou organização que não seja evidente pela própria implementação.

---

# Organização do Repositório

## Árvore principal

```text
HomeServer
├── core/foundation/      infraestrutura do Core
├── core/infrastructure/  capacidades da plataforma
├── core/adapters/        integração com serviços externos
├── api/                  API REST + App
├── modules/              serviços implantáveis
├── scripts/              utilitários, deploy, systemd e testes
├── docs/                 documentação
├── design/               design do App
└── planning/             fundamentos, arquitetura, módulos, roadmap e qualidade
```

Referências principais:

- `planning/foundations/` — princípios gerais de evolução e decisão.
- `planning/release/baseline-v0.1.0.md` — estado de referência conceitual do projeto.
- `planning/roadmap/evolution.md` — fases e prioridades de evolução contínua.
- `planning/release/` — critérios e processo para futuras releases oficiais.

## Evolução por fases

O desenvolvimento utiliza o roadmap em `planning/roadmap/evolution.md` como direção operacional.

As fases não representam uma sequência rígida de releases. A evolução deve considerar, conforme aplicável:

1. implementação;
2. testes;
3. documentação;
4. evidência;
5. validação de uso real;
6. avaliação de recursos, segurança e manutenção;
7. registro das limitações restantes.

Uma fase posterior não deve mascarar uma pendência crítica de uma fase anterior.

Decisões podem ser revisadas quando novas evidências demonstrarem que existe uma solução mais adequada.

## Nomenclatura

- Módulos de Infrastructure utilizam nomes consistentes com sua responsabilidade.
- Funções públicas utilizam o prefixo da camada ou módulo correspondente.
- Scripts em `scripts/` utilizam nomes que indiquem claramente sua finalidade; convenções específicas devem ser documentadas em `scripts/README.md`.

---

# Objetivo Final

Construir um HomeServer simples, modular, reutilizável, seguro e de fácil manutenção.