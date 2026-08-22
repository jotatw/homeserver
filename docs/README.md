# HomeServer — Documentação

Documentação do HomeServer organizada por objetivo.

| Objetivo | Onde |
|---|---|
| **Instalar** o HomeServer do zero | [`docs/install/`](install/) · [`QUICKSTART`](install/QUICKSTART.md) · [`INSTALLATION`](install/INSTALLATION.md) · [`FIRST_BOOT`](install/FIRST_BOOT.md) · [`TLS local`](install/tls-local.md) |
| **Usar** no dia a dia | [`docs/use/`](use/) · [`CLI (hs)`](use/cli.md) · [`FAQ`](use/FAQ.md) · [`QUESTIONS`](use/QUESTIONS.md) · [`PRINTING`](use/PRINTING.md) |
| **Contribuir** ou personalizar | [`docs/contribute/`](contribute/) · [`CONTRIBUTING`](contribute/CONTRIBUTING.md) · [`DEVELOPMENT`](contribute/DEVELOPMENT.md) · [`TESTING`](contribute/TESTING.md) |
| **Consultar referência técnica** | [`docs/reference/`](reference/) · [`PRINCIPLES`](reference/PRINCIPLES.md) · [`ARCHITECTURE`](reference/ARCHITECTURE.md) |

A documentação técnica detalhada também está organizada em:

- [`reference/architecture/`](reference/architecture/) — Core, Foundation, Infrastructure, API, módulos e ADRs;
- [`reference/design/`](reference/design/) — princípios e especificações do Design System;
- [`reference/security/`](reference/security/) — princípios, premissas, threat model e registros de auditoria.

> **Docs** explica como o HomeServer funciona e como utilizá-lo. Para entender como o projeto é planejado e evolui, veja [`planning/`](../planning/README.md).

## Referência rápida

- **API:** [`api/README.md`](../api/README.md) — contrato e endpoints.
- **CLI:** [`docs/use/cli.md`](use/cli.md) ou `bash core/hs.sh --help`.
- **Testes / Quality Gate:** `bash core/tests/run_ci.sh` · [`TESTING`](contribute/TESTING.md).
- **Instalação:** `sudo bash install.sh`.
- **Evolução:** [`planning/README.md`](../planning/README.md).
