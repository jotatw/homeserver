# Segurança

## Objetivo

Esta área registra o baseline, as decisões, o plano de hardening e as evidências de validação de segurança do HomeServer.

## Documentos

- [Hardening plan](hardening-plan.md) — prioridades, escopo e sequência de melhorias.
- [Threat model](threat-model.md) — ativos, fronteiras de confiança, ameaças e riscos arquiteturais.
- [Validation](validation.md) — critérios e evidências necessárias para considerar uma melhoria validada.

## Princípio de validação

Uma melhoria não é considerada concluída apenas porque o código foi alterado:

`Requirement → Implementation → Test → Result → Evidence`

## Baseline atual

A revisão inicial identificou:

- boa base de autenticação e autorização;
- rate limiting para a API e login;
- headers de segurança;
- CORS restritivo;
- uso de execução sem shell nos pontos revisados;
- sessões que precisam separar atividade real de polling e possuir limite absoluto;
- exposição potencial de detalhes internos em respostas de erro;
- operações privilegiadas no host como principal superfície arquitetural de risco;
- necessidade de amadurecer validação de operações de módulos em camadas;
- token de sessão no `localStorage` como melhoria futura de defesa contra impacto de XSS.

Nenhuma vulnerabilidade crítica explorável foi confirmada na revisão inicial. Isso não substitui validação contínua ou revisões futuras.
