# V2 Readiness — Histórico

> **Status: HISTÓRICO.** Este documento registra a prontidão verificada antes do início da v2.0.
>
> Para o estado atual da release, use `planning/release/v2.0-checklist.md` e `planning/release/release-process.md`.

## Status registrado na época

| Área | Estado |
|------|--------|
| Foundation | PASS |
| Infrastructure | PASS |
| API | PASS |
| Homepage | PASS |
| Documentation | PASS |
| Quality Gate | PASS |
| Architecture Freeze | PASS |
| Design System | PASS |
| App Design | READY |

## Critérios verificados

### Foundation
- `hs_*` padronizado; testes Foundation passam.

### Infrastructure
- Prefixos por módulo; testes Infrastructure passam.

### API
- Respostas `ok/data`; validação em todas as rotas; status HTTP corretos.

### Homepage
- Portal orientado às tarefas; 4 grupos; modos; sem métricas técnicas.

### Documentation
- README, API docs, ARCHITECTURE, VISION, PRINCIPLES, ROADMAP coerentes.
- ADRs cobrindo decisões importantes.

### Quality Gate
- Toda release passou por `planning/quality/review-checklist.md`.

### Architecture Freeze
- `planning/architecture-freeze.md` aceito; mudanças exigem ADR.

### Design System
- `docs/design/` completo (principles, colors, typography, spacing, icons, components).

### App Design
- Branch `app-design` criada e publicada em `design/app/`.
- `references.md` — 33 referências (dashboards self-hosted, design systems, PWA).
- `wireframes/` — 6 telas com variantes mobile + desktop.
- `flows/` — 8 fluxos baseados na API e nas roles reais; gaps G1-G5 registrados.
- `tokens/` — 7 documentos com variáveis CSS dark/light.
- `components/` — 8 famílias de componentes com anatomia, estados, a11y e referências.

---

## Encerramento

A v2.0 só iniciou após todas as áreas estarem **PASS/READY**.

> Nota de revisão (2026-08-05): após a v1.5.0, o Quality Gate de CI
> (`core/tests/run_ci.sh`) foi validado por completo — Shellcheck + Foundation 6/6
> + Infrastructure 3/3 + Smoke 7/7 + CLI 6/6 + API 13/13. Bug de path do
> `PROJECT_ROOT` no `run_ci.sh` corrigido.
