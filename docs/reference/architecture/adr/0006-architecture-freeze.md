# ADR-0006 — Architecture Freeze

- **Status**: Aceito
- **Data**: 2026-08-05 (v1.5.0)
- **Decisão**: A arquitetura principal do HomeServer é considerada estável.

## Contexto

Após a v1.5 (Stabilization), a base atingiu maturidade. Para proteger o projeto
de crescimento desorganizado, as camadas principais são congeladas.

## Decisão

- Mudanças estruturais exigem **ADR** aprovado.
- Novas funcionalidades reutilizam Foundation, Infrastructure, Adapters e API
  existentes.
- Exceções só com justificativa arquitetural documentada.

Camadas congeladas:

```text
Homepage / App → API → Adapters → Infrastructure → Foundation
```

Documento completo: `planning/architecture-freeze.md`.

## Consequências

- Positivas: crescimento previsível; sem retrabalho arquitetural.
- Negativas: mudanças estruturais agora exigem processo (ADR).
