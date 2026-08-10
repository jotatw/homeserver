# Security Policy

## Supported Versions

Security fixes are applied to the actively maintained release line.

| Version | Support |
|---|---|
| v2.x | Supported |
| v1.x | Maintenance only while v2.0 is being finalized |
| Older releases | Unsupported |

## Reporting a Vulnerability

Do not open a public GitHub issue for an undisclosed security vulnerability.

Report the problem privately through the repository's available GitHub security reporting channel. Include:

- affected version;
- affected component or file;
- steps to reproduce;
- expected and actual behavior;
- possible impact;
- any suggested mitigation, if known.

Please do not include passwords, API tokens, private keys, personal data, or other secrets in a report.

## Scope

Security reports may concern the HomeServer core, API, installation process, authentication, update mechanism, Docker configuration, storage permissions, or other code maintained by this repository.

Third-party services bundled or integrated by HomeServer may have their own security policies. When appropriate, vulnerabilities should also be reported to the upstream project.

## General Guidance

HomeServer is designed primarily for trusted local networks. Do not expose the API or administrative interfaces directly to the public internet unless an appropriate security layer is intentionally configured.
