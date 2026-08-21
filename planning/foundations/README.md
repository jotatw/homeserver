# Fundamentos Gerais

Esta seção reúne princípios que orientam a evolução do HomeServer independentemente de módulos, tecnologias específicas, sprints ou decisões temporárias de implementação.

Os fundamentos não substituem documentação técnica, arquitetura, roadmap ou planejamento. Eles definem os critérios gerais usados para avaliar mudanças e tomar decisões ao longo do projeto.

## Documentos

- [`evolution-and-validation.md`](evolution-and-validation.md) — como o projeto evolui, como mudanças são validadas e por que planejamento pode ser revisado com base em evidências práticas.

## Papel dos fundamentos

```text
Fundamentos
     ↓
Princípios gerais de decisão
     ↓
Arquitetura e planejamento
     ↓
Implementação
     ↓
Testes automatizados
     ↓
Validação no ambiente real
     ↓
Aprendizado
     ↓
Evolução dos fundamentos ou das decisões específicas
```

Documentos desta seção devem permanecer relativamente estáveis. Mudanças neles exigem uma alteração real nos princípios do projeto, e não apenas uma mudança de implementação.

## Relação com outras áreas

| Área | Responsabilidade |
|---|---|
| `planning/foundations/` | princípios gerais e critérios de decisão |
| `planning/roadmap/` | fases, objetivos e critérios de evolução |
| `planning/modules/` | planejamento específico dos módulos |
| `planning/security/` | segurança, hardening e evidências |
| `planning/release/` | baseline, critérios e preparação de releases |
| `docs/` | documentação de uso, operação e desenvolvimento |

## Princípio central

O HomeServer evolui com base em planejamento e evidências práticas. Uma decisão pode ser revisada quando testes, uso real ou novas informações demonstrarem que existe uma solução melhor, mais simples, mais adequada ao hardware ou mais sustentável para o futuro.
