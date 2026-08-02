# HomeServer — Documentação

Bem-vindo à documentação técnica do HomeServer.

> **Docs** explica **como o HomeServer funciona**. Para entender **para onde o
> projeto está evoluindo**, veja `planning/` (visão, roadmap e product backlog).

## Estrutura

| Caminho | Conteúdo |
|---------|----------|
| `PRINCIPLES.md` | Princípios permanentes do projeto. |
| `ARCHITECTURE.md` | Arquitetura em camadas (Foundation → Adapters → Infrastructure → Applications). |
| `architecture/` | Detalhamento das camadas e módulos do Core. |
| `development/CONTRIBUTING.md` | Padrões e fluxo de desenvolvimento. |
| `guide/` | Guia passo a passo para montar um HomeServer. |

## Planejamento (`planning/`)

| Caminho | Conteúdo |
|---------|----------|
| `planning/VISION.md` | Objetivos e filosofia do projeto. |
| `planning/ROADMAP.md` | Macro-roadmap (fases de evolução). |
| `planning/roadmap/` | Planos por versão (v1.1, v1.2, v2.0). |
| `planning/backlog/` | Product backlog numerado por área. |

## Navegação recomendada

1. `PRINCIPLES.md`
2. `ARCHITECTURE.md`
3. `architecture/README.md`
4. `development/CONTRIBUTING.md`
5. `guide/README.md`

## Referência rápida

- **API**: `api/README.md` (endpoints REST) e `docs/architecture/API.md`.
- **CLI**: `bash core/hs.sh --help` (comandos `system`, `service`, `user`, `device`, `hardware`, `automation`, `scheduler`).
- **Testes**: `bash core/tests/run_ci.sh`.
