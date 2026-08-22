# Release e Baseline

Esta área organiza o estado de referência do projeto e os critérios utilizados quando houver uma decisão explícita de publicar uma release oficial.

O HomeServer está em evolução contínua. Tags e Releases não são usadas apenas para marcar etapas intermediárias de desenvolvimento.

## Documentos

- [Baseline v0.1.0](baseline-v0.1.0.md) — fotografia conceitual do estado inicial da consolidação atual; não é uma tag nem uma release oficial.
- [Definition of Ready for Release](definition-of-ready-for-release.md) — critérios permanentes para decidir se um estado está pronto para publicação.
- [Release Process](release-process.md) — processo a seguir após a decisão de publicar uma release.
- [Checklist da futura v1.0](v1.0-checklist.md) — checklist preparatório da primeira release oficial planejada.
- [Release Notes da futura v1.0](release-notes-v1.0.md) — rascunho de publicação, sem escopo confirmado até a decisão de release.

## Fluxo

```text
Baseline de referência
        ↓
Evolução contínua
        ↓
Implementação e validação
        ↓
Uso real e evidências
        ↓
Decisão explícita de publicar
        ↓
Definition of Ready
        ↓
Freeze da release
        ↓
Tag e GitHub Release
```

## Regra principal

Uma versão não é criada automaticamente porque o roadmap avançou ou porque um conjunto de tarefas foi concluído.

A publicação ocorre somente quando o projeto decide preservar determinado estado como uma referência oficial e os critérios aplicáveis de validação foram atendidos.
