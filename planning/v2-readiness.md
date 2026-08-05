# V2 Readiness

Lista de prontidão para o início da v2.0 (HomeServer App).

## Status

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

## Critérios por área

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
- Branch `app-design` com wireframes/components/navigation/flows/tokens.

---

A v2.0 só inicia quando todas as áreas estiverem **PASS/READY**.
