# HomeServer — Documentação

Bem-vindo à documentação técnica do HomeServer.

> **Docs** explica **como o HomeServer funciona**. Para entender **para onde o
> projeto está evoluindo**, veja `planning/` (visão, roadmap e product backlog).

## Estrutura

| Caminho | Conteúdo |
|---------|----------|
| `PRINCIPLES.md` | Princípios permanentes do projeto. |
| `ARCHITECTURE.md` | Arquitetura em camadas (Foundation → Adapters → Infrastructure → Applications). |
| `architecture/` | Detalhamento das camadas e módulos do Core + ADRs. |
| `design/` | Design System (princípios, cores, tipografia, spacing, ícones, componentes). |
| `security/` | Threat model, premissas de segurança e auditoria. |
| `development/CONTRIBUTING.md` | Padrões e fluxo de desenvolvimento. |
| `guide/` | Guia passo a passo para montar um HomeServer. |

## Planejamento (`planning/`)

| Caminho | Conteúdo |
|---------|----------|
| `planning/vision.md` | Objetivos e filosofia do projeto. |
| `planning/strategy.md` | Estratégia de evolução (ordem de crescimento). |
| `planning/roadmap/` | Planos por versão (v1.1, v1.2, v1.4-ux, v1.5, v2.0). |
| `planning/quality/` | Quality Gate e review checklist. |
| `planning/health/` | Baselines de performance por versão. |
| `planning/backlog/` | Product backlog numerado por área. |

## Navegação recomendada

1. `PRINCIPLES.md`
2. `ARCHITECTURE.md`
3. `architecture/README.md`
4. `development/CONTRIBUTING.md`
5. `guide/README.md`
6. `design/` (Design System) e `design/app/` (App v2.0, branch `app-design`)

## Referência rápida

- **API**: `api/README.md` (endpoints REST) e `docs/architecture/API.md`.
- **CLI**: `bash core/hs.sh --help` (comandos `system`, `service`, `user`, `device`, `hardware`, `automation`, `scheduler`).
- **Testes**: `bash core/tests/run_ci.sh`.
