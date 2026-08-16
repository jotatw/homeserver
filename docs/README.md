# HomeServer — Documentação

Documentação do HomeServer organizada **por objetivo**:

| Objetivo | Onde |
|----------|------|
| **Instalar** o HomeServer do zero | [`docs/install/`](install/) · [`QUICKSTART`](install/QUICKSTART.md) · [`INSTALLATION`](install/INSTALLATION.md) · [`FIRST_BOOT`](install/FIRST_BOOT.md) · [`TLS local`](install/tls-local.md) |
| **Usar** no dia a dia | [`docs/use/`](use/) · App e Homepage · [`CLI (hs)`](use/cli.md) · [`FAQ`](use/FAQ.md) · [`QUESTIONS`](use/QUESTIONS.md) · [`PRINTING`](use/PRINTING.md) |
| **Contribuir** / desenvolver | [`docs/contribute/`](contribute/) · [`CONTRIBUTING`](contribute/CONTRIBUTING.md) · [`DEVELOPMENT`](contribute/DEVELOPMENT.md) · [`TESTING`](contribute/TESTING.md) |
| **Referência** técnica | [`docs/reference/`](reference/) · [`PRINCIPLES`](reference/PRINCIPLES.md) · [`ARCHITECTURE`](reference/ARCHITECTURE.md) · `architecture/` · `design/` · `security/` |

> **Docs** explica **como o HomeServer funciona**. Para entender **para onde o
> projeto está evoluindo**, veja [`planning/`](../planning/README.md) (roadmap,
> arquitetura modular M1, qualidade e release).

## Referência rápida

- **API**: [`api/README.md`](../api/README.md) — contrato e endpoints.
- **CLI**: [`docs/use/cli.md`](use/cli.md) ou `bash core/hs.sh --help`.
- **Testes / Quality Gate**: `bash core/tests/run_ci.sh` · ver [`docs/contribute/TESTING.md`](contribute/TESTING.md).
- **Instalação**: `sudo bash install.sh`.
- **Evolução**: [`planning/README.md`](../planning/README.md).