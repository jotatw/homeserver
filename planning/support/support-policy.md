# Política de Suporte

> Política de suporte do HomeServer. Esta política passa a ser aplicada formalmente quando existirem releases oficiais publicadas.

O projeto está atualmente em evolução contínua a partir do Baseline v0.1.0. O baseline é um documento de referência e não representa uma linha de releases, uma tag Git ou uma versão suportada distribuída aos usuários.

## Estado atual

Enquanto não existir uma release oficial consolidada, o projeto utiliza o branch e a documentação atuais como referência de desenvolvimento e validação.

Isso significa:

- não existe atualmente uma linha de versões estáveis com suporte formal;
- mudanças podem continuar sendo avaliadas, melhoradas, refatoradas ou removidas;
- o suporte formal por versão começará quando uma release oficial for publicada;
- a primeira release oficial planejada é `v1.0.0`, mas não possui data automática;
- versões ou tags históricas não representam o estado atual do projeto.

## Categorias

| Categoria | Significado | Suporte |
|---|---|---|
| Desenvolvimento atual | Estado em evolução contínua | Correções e melhorias conforme prioridades e evidências atuais |
| Release oficial atual | Versão explicitamente publicada como estável | Conforme política definida na publicação |
| Release histórica | Versão substituída por decisões ou releases posteriores | Sem suporte regular, salvo decisão explícita |
| Histórico documental | Registros arquivados de versões, testes ou decisões anteriores | Preservado para rastreabilidade, não redefine o estado atual |

## Regras

- O baseline `v0.1.0` é conceitual e não cria uma tag Git.
- O roadmap ativo é `planning/roadmap/evolution.md`.
- Uma mudança no desenvolvimento atual não recebe automaticamente número de versão ou release.
- Tags e Releases são utilizadas para estados que o projeto decidiu preservar e publicar explicitamente.
- Uma futura `v1.0.0` será considerada somente após os critérios aplicáveis em `planning/release/` e uma decisão explícita de publicação.
- O suporte de uma release oficial deve ser definido ou atualizado no momento de sua publicação.
- Documentos em `planning/archive/` preservam contexto histórico e não representam suporte ativo.

## Publicação futura

Quando a primeira release oficial estiver pronta, esta política deverá ser atualizada para declarar:

1. quais versões recebem suporte ativo;
2. quais versões recebem apenas correções críticas ou de segurança;
3. quando uma versão passa a histórico;
4. qual processo será utilizado para atualizações e compatibilidade.

Até esse momento, a prioridade é consolidar o projeto e validar mudanças no ambiente real antes de assumir compromissos formais de suporte por versão.