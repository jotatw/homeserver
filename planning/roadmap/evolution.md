# HomeServer — Roadmap de Evolução

> Roadmap operacional para consolidar e evoluir o HomeServer a partir do Baseline v0.1.0.

Este documento organiza prioridades e fases de evolução. Não representa um cronograma rígido, uma sequência obrigatória de releases ou uma especificação imutável. As fases podem ser revisadas com base em implementação, testes, uso real e novas evidências.

Não substitui `planning/vision.md`, os fundamentos em `planning/foundations/` ou os critérios de release em `planning/release/`.

## Regra geral

Cada fase deve produzir uma base utilizável e evidências suficientes para o escopo definido. Nenhuma fase é concluída apenas porque o código existe.

### Estados

- 🟢 concluída/validada para o escopo definido;
- 🟡 implementada ou em evolução, com evidências ou limitações pendentes;
- ⚪ planejada ou preparada para evolução futura;
- 🔴 bloqueada por pendência crítica.

### Evolução contínua

Durante a fase atual, o projeto evolui continuamente:

```text
Planejamento
    ↓
Implementação
    ↓
Testes
    ↓
Uso no ambiente real
    ↓
Avaliação
    ↓
Consolidar / Melhorar / Refatorar / Remover
    ↓
Documentar o aprendizado
```

Tags e Releases não são utilizadas apenas para marcar etapas intermediárias. A primeira versão oficial será considerada somente após uma decisão explícita de que a base atingiu um nível adequado de consolidação.

### Conclusão retrospectiva

As Fases 1, 2 e 3 foram avaliadas retrospectivamente durante a auditoria do Baseline v0.1.0, em 2026-08-11.

O estado 🟢 dessas fases significa que seus critérios mínimos definidos neste roadmap estavam atendidos pela base existente e pelas evidências disponíveis. Isso não representa trabalho novo executado pelo Sprint 01 e não elimina limitações específicas ainda classificadas como 🟡 no baseline.

---

## FASE 0 — Baseline

**Pergunta:** qual é exatamente o estado do projeto?

**Entregáveis:**
- baseline v0.1.0;
- auditoria classificada;
- Quality Gate executado;
- estrutura e problemas conhecidos documentados;
- README apontando para o baseline e roadmap.

**Critério de saída:** evidência do Quality Gate registrada, documentação consistente e nenhuma mudança de código feita durante a auditoria.

**Estado:** 🟢 Concluída (2026-08-11)

---

## FASE 1 — Organização e padronização

**Pergunta:** a base é consistente o suficiente para evoluir?

**Entregáveis:**
- `scripts/` organizado;
- nomenclatura padronizada;
- responsabilidades claras por camada;
- duplicações removidas ou justificadas;
- configurações consistentes;
- convenções de contribuição atualizadas.

**Critério de saída:** estrutura documentada, Quality Gate verde e nenhuma duplicação conhecida sem justificativa crítica para evolução.

**Estado:** 🟢 Concluída retrospectivamente (2026-08-11)

**Observação:** existem melhorias não bloqueantes registradas no baseline, incluindo organização mista em `scripts/` e inconsistências históricas de nomenclatura.

---

## FASE 2 — Core / Foundation

**Pergunta:** a base interna é reutilizável e previsível?

**Entregáveis:**
- Foundation estável;
- filesystem;
- configuração;
- validação;
- output;
- constantes;
- registry;
- contratos internos;
- testes unitários.

**Critério de saída:** Foundation possui responsabilidades claras, testes verdes e não depende de detalhes específicos dos serviços externos.

**Estado:** 🟢 Concluída retrospectivamente (2026-08-11)

---

## FASE 3 — Infraestrutura

**Pergunta:** os recursos do servidor podem ser administrados de forma consistente?

**Entregáveis:**
- storage;
- usuários;
- dispositivos;
- hardware;
- serviços;
- backup;
- scheduler;
- energia;
- mounts;
- recuperação após falhas.

**Critério de saída:** cada recurso coberto pela base atual possui contrato operacional, testes e comportamento previsível nas operações já implementadas.

**Estado:** 🟢 Concluída retrospectivamente (2026-08-11)

**Limitação:** gaps G1-G3 permanecem registrados no baseline e exigem validação adicional de comportamento real e recuperação antes de uma futura release estável.

---

## FASE 4 — Serviços

**Pergunta:** os serviços externos estão integrados de maneira previsível?

**Entregáveis:**
- FileBrowser;
- Gitea;
- Homepage;
- Caddy;
- Portainer;
- Samba;
- API;
- adapters;
- health checks;
- ciclo de vida dos containers;
- planejamento de modularização quando aplicável.

**Estado atual:** os serviços e suas integrações principais já existem, e a arquitetura prevê isolamento por adapters e contratos. O planejamento dos módulos está consolidado; a implementação gradual e a validação completa do ciclo de instalação, remoção, recuperação e preservação de dados continuam em evolução.

**Critério de saída:** serviços aplicáveis iniciam, param e recuperam corretamente; integrações externas ficam isoladas pelos adapters quando aplicável; módulos opcionais não se tornam dependências do núcleo.

**Estado:** 🟡 Em consolidação.

---

## FASE 5 — Homepage / Hub

**Pergunta:** o servidor é fácil de entender e usar?

**Entregáveis:**
- ponto de entrada claro;
- modos de usuário quando aplicável;
- navegação simples;
- acesso unificado;
- estados de serviço;
- cards ou atalhos informativos;
- baixa redundância;
- identidade visual consistente.

**Estado atual:** Homepage e App existem, com planejamento de Design System e fluxos. A próxima evolução é reorganizar a experiência e consolidar identidade visual, navegação e facilidade de uso antes de considerar a fase validada.

**Critério de saída:** usuário novo entende o ponto de entrada, encontra as principais tarefas e identifica o estado do servidor sem interpretar detalhes técnicos.

**Estado:** 🟡 Implementada; UX em evolução.

---

## FASE 6 — Backup e armazenamento

**Pergunta:** os dados estão organizados e recuperáveis?

**Entregáveis:**
- estrutura oficial de storage;
- permissões;
- backup automático;
- validação de backup;
- restauração;
- dispositivos externos;
- retenção;
- documentação de recuperação.

**Estado atual:** estrutura de storage, backup automático e validação de integridade consolidadas: backup diário automático, `manifest.sha256` por backup e validação automática diária (`backup-check`, 08:30).

**Evidência de restauração completa em ambiente limpo (2026-08-23):**
`scripts/test-restore-clean.sh` — simula um servidor recém-formatado
(container Debian sem nada pré-existente), transfere o último backup real
(3,3 GB · 8.299 arquivos, incluindo fotos do Syncthing) via mecanismo
privilegiado do sistema, restaura com o `restore.sh` oficial e verifica:
- estruturas `/srv/{storage,services,git,docker}` presentes;
- `git`, `services` e `docker` byte-idênticos ao backup (`diff -r`);
- arquivo real de usuário íntegro (`cmp`);
- contagem restaurada: 8.273/8.299 (diferença = metadados do próprio
  diretório `latest`, esperado).

Critério de saída atendido: um backup foi criado, validado e restaurado
em ambiente de teste, com dados verificados após a restauração.

**Estado:** 🟢 Concluída/validada para o escopo atual.

---

## FASE 7 — Segurança

**Pergunta:** o sistema possui uma base segura por padrão?

**Entregáveis:**
- autenticação;
- autorização;
- permissões;
- secrets;
- Docker;
- API;
- firewall;
- exposição de serviços;
- logs;
- hardening;
- testes de segurança.

**Estado atual:** o hardening principal foi avançado e a CI executa a suíte completa aplicável da API. Validações operacionais, falhas representativas e itens planejados para evolução futura devem continuar sendo avaliados no estado real do projeto.

**Critério de saída:** não existem vulnerabilidades críticas abertas; operações administrativas estão protegidas; secrets e permissões foram auditados; checklist de segurança possui evidência aplicável ao estado consolidado.

**Estado:** 🟡 Hardening principal avançado; validação operacional e itens futuros pendentes.

---

## FASE 8 — Automação

**Pergunta:** tarefas repetitivas podem ser executadas pelo próprio sistema?

**Entregáveis:**
- hooks quando necessários;
- automações de dispositivos;
- backup automático;
- startup/shutdown;
- scheduler;
- tarefas recorrentes;
- recuperação automática quando apropriado.

**Estado atual:** automações consolidadas e validadas em uso real (2026-08-23):
backup automático diário, validação diária de backup (`backup-check`),
watchdog de serviços a cada 15 min (`service-watchdog`), fluxos de energia
(night-off S3 + religamento por RTC) e scheduler gerenciável pelo App.

Evidência do primeiro ciclo completo (2026-08-22 → 2026-08-23):

```text
22:00  night-off suspendeu o servidor (S3) com religamento agendado
08:00  servidor acordou sozinho via alarme RTC
08:00  backup executado automaticamente (catch-up do timer 07:30,
       Persistent=true — o horário 07:30 cai dentro da janela de S3)
08:30  backup-check validou o último backup (após correções de SIGPIPE
       e permissão de log encontradas nesse primeiro ciclo)
12:00  watchdog executando a cada 15 min sem reinícios indevidos
```

Correções geradas pela evidência: `find | head` recebia SIGPIPE com
pipefail e abortava a validação; `log()` dos scripts abortava o script
quando executado sem permissão de gravação. Ambos corrigidos.

Critério de saída atendido: execução previsível (timers ativos), logs
(`homeserver-{backup,watchdog,power}.log`) e tratamento de falhas;
automações opcionais podem ser desabilitadas sem impacto no núcleo.

**Estado:** 🟢 Concluída/validada para o escopo atual.

---

## FASE 9 — UX / facilidade de uso

**Pergunta:** uma pessoa consegue utilizar o servidor sem conhecer sua implementação?

**Base de direção já consolidada:**
- princípios de evolução e validação documentados;
- direção geral do App documentada;
- Desktop definido como interface principal e completa;
- Mobile definido como acesso rápido às ações frequentes;
- funcionalidades mobile devem justificar seu benefício e não reproduzir automaticamente toda a interface Desktop.

**Próximos pontos de evolução:**
- fundamentos visuais e Design System ✅
- temas e cores ✅
- iconografia ✅
- navegação ✅
- componentes básicos ✅
- experiência Desktop ✅
- experiência Mobile ✅
- mensagens de erro e estados vazios ✅
- acessibilidade ✅
- testes com uso real ✅

**Critério de saída:** uma pessoa que não participou do desenvolvimento consegue encontrar e utilizar as funções principais sem precisar compreender a implementação interna.

**Estado:** 🟢 Concluída — Design System aplicado a todas as telas (desktop + mobile), v1.0.0 publicada.

---

## Consolidação para a primeira release

A publicação da `v1.0.0` não é uma fase automática do roadmap e não possui prazo definido.

Ela será considerada somente quando existir uma decisão explícita de preservar um estado do projeto como primeira referência estável e os critérios aplicáveis estiverem atendidos.

Entre os pontos relevantes:

- fases necessárias suficientemente consolidadas;
- critérios de release aplicáveis atendidos;
- validações executadas novamente no estado candidato à release;
- instalação limpa validada;
- reboot e recuperação aplicáveis validados;
- backup e restauração validados para o escopo da release;
- segurança revisada no estado final;
- documentação suficiente para uso e manutenção;
- nenhum problema crítico conhecido aberto.

O processo de publicação é definido em:

- `planning/release/definition-of-ready-for-release.md`;
- `planning/release/release-process.md`;
- `planning/release/v1.0-checklist.md`.

Quando esses critérios forem atendidos e houver decisão explícita de publicar, a primeira Tag e Release oficial poderão ser criadas como `v1.0.0`.

---

## Relação com a visão

Este roadmap operacionaliza a evolução do repositório sem substituir as fases de valor definidas em `planning/vision.md`.

A visão responde às perguntas de produto e plataforma; este documento organiza prioridades e áreas de consolidação necessárias para a evolução sustentável do projeto.

## Regra de evolução

A consolidação de qualquer fase exige, conforme aplicável:

1. implementação;
2. testes;
3. documentação;
4. evidência;
5. validação de uso real;
6. avaliação de recursos, segurança e manutenção;
7. registro das limitações restantes.

Uma fase posterior não deve mascarar uma pendência crítica de uma fase anterior.

O roadmap pode ser revisado quando novas evidências justificarem a mudança, seguindo os fundamentos definidos em `planning/foundations/`.
