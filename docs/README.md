# HomeServer — Documentação

Bem-vindo à documentação técnica do HomeServer.

> **Docs** explica **como o HomeServer funciona**. Para entender **para onde o projeto está evoluindo**, veja `planning/`.

## Estrutura

| Caminho | Conteúdo |
|---------|----------|
| `PRINCIPLES.md` | Princípios permanentes do projeto. |
| `ARCHITECTURE.md` | Arquitetura geral em camadas. |
| `architecture/` | Detalhamento do Core, Infrastructure e decisões arquiteturais. |
| `design/` | Design System e especificações da aplicação. |
| `security/` | Threat model, premissas e auditorias de segurança. |
| `INSTALLATION.md` | Instalação operacional detalhada. |
| `FIRST_BOOT.md` | Validação e primeiros passos após a instalação. |
| `FAQ.md` | Dúvidas e problemas frequentes. |

> O guia conceitual/histórico (experiências de construção) foi arquivado em
> `planning/archive/guide/` — fora da documentação técnica ativa.

## Planejamento (`planning/`)

| Caminho | Conteúdo |
|---------|----------|
| `planning/vision.md` | Objetivos e filosofia do projeto. |
| `planning/strategy.md` | Estratégia de evolução. |
| `planning/roadmap/` | Roadmaps por versão. |
| `planning/quality/` | Quality Gate e checklists de revisão. |
| `planning/health/` | Baselines de desempenho e saúde. |
| `planning/backlog/` | Product backlog por área. |

## Navegação recomendada

Para quem está chegando ao projeto:

1. `README.md` — visão geral
2. `QUICKSTART.md` — instalação rápida
3. `INSTALLATION.md` — instalação detalhada
4. `FIRST_BOOT.md` — validação pós-instalação
5. `FAQ.md` / `QUESTIONS.md` — dúvidas comuns
6. `PRINCIPLES.md` — princípios arquiteturais
7. `ARCHITECTURE.md` — arquitetura geral
8. `architecture/` — detalhes técnicos
9. `design/` — Design System e App

## Referência rápida

- **API**: `api/README.md` — contrato e endpoints da API.
- **CLI**: `bash core/hs.sh --help`.
- **Testes**: `bash core/tests/run_ci.sh`.
- **Instalação**: `sudo bash install.sh`.

> Documentos históricos permanecem identificados como históricos quando seus valores representam um ambiente ou estado específico de uma versão anterior.
