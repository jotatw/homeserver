# Revisão — Simplicidade e interfaces do HomeServer

> Registro de revisão do projeto. Define princípios de simplicidade, prioridades de uso e restrições observadas no ambiente real.

**Status:** Histórico de revisão com princípios ainda relevantes (2026-08-11). A revisão não substitui o roadmap ativo, os fundamentos ou a arquitetura atual.

---

## Objetivo central

O objetivo é reduzir a necessidade de conhecimento técnico para as operações normais do HomeServer, sem eliminar interfaces avançadas que continuam necessárias para instalação, diagnóstico, recuperação, automação e desenvolvimento.

A direção atual é:

1. operações normais devem possuir interfaces adequadas ao contexto;
2. o Desktop é a interface principal para gerenciamento completo;
3. o Mobile prioriza atalhos e ações frequentes, sem obrigação de reproduzir todo o Desktop;
4. CLI e terminal continuam disponíveis para instalação e operações avançadas;
5. nenhuma capacidade é obrigada a existir em todas as interfaces;
6. uma interface que declara suporte a uma tarefa deve permitir concluir o fluxo sem exigir passos técnicos ocultos.

---

## Restrição de hardware

A revisão registrou uma limitação real do ambiente: o servidor é antigo, barulhento e possui restrições térmicas.

Toda evolução deve considerar:

- adicionar apenas o necessário que gera valor real;
- priorizar estabilidade e vida útil do hardware;
- evitar processos pesados, polling agressivo e serviços ativos sem necessidade;
- manter o servidor ocioso quando possível;
- justificar o custo de cada nova funcionalidade.

Regra de evolução:

> Simplificar o que existe antes de crescer. Menos recursos, mais qualidade e mais estabilidade.

---

## Inventário observado na revisão

### CLI (`hs`)

Na revisão, o CLI possuía aproximadamente 30 operações nas áreas:

```text
system
service
status
user
device
hardware
automation
scheduler
power
version
update
```

O CLI permanece uma interface operacional avançada e uma fonte importante para diagnóstico, automação, recuperação e desenvolvimento.

### API

A revisão identificou aproximadamente 34 endpoints cobrindo áreas como autenticação, status, sistema, storage, serviços, dispositivos, eventos, energia, hardware, backup, atualização, usuários, tokens, impressão e App.

### App/Desktop

A revisão identificou seis áreas principais além do login:

- Meu espaço;
- Aplicações;
- Armazenamento;
- Sistema;
- Administração;
- Impressão.

O inventário é um registro de estado observado. A documentação atual de arquitetura e planejamento define a direção futura das interfaces.

---

## Revisão de simplicidade — estado observado

| Área | Interface visual na revisão | Observação |
|---|---|---|
| Autenticação / sessão | Disponível | login/logout, role |
| Meu espaço | Disponível | estatísticas e atividades |
| Aplicações | Disponível | abrir serviços |
| Armazenamento | Parcial | uso e dispositivos |
| Sistema | Disponível | checks, energia e temperatura conforme fluxo suportado |
| Usuários | Parcial | havia lacunas de operações administrativas |
| Tokens de API | Disponível | listar/criar/revogar |
| Impressão | Disponível | envio e gerenciamento de fila conforme capacidade implementada |

Esses dados não devem ser tratados como confirmação permanente de maturidade. O estado atual deve ser validado pelas evidências e documentação correspondentes.

---

## Lacunas registradas na revisão

A revisão identificou capacidades ainda dependentes de CLI, configuração manual ou integração parcial:

| Capacidade | Situação registrada |
|---|---|
| Ativação e desativação de serviços | Necessitava consolidação da interface e contrato |
| Start/stop/restart de serviços | Necessitava integração visual completa |
| Alteração de senha | API existente; interface precisava evolução na revisão |
| Remoção de usuário | API existente; interface precisava evolução na revisão |
| Atualizações | Capacidade em evolução e exigindo validação operacional |
| Tarefas agendadas | Interface visual ainda não definida como prioridade obrigatória |
| Automações | Interface visual apenas se houver valor real para o contexto |
| Hardware avançado | Integração parcial na interface |

As lacunas devem ser reavaliadas conforme a evolução contínua. Não representam automaticamente um backlog obrigatório.

---

## Princípios de decisão

1. **Mínimo funcional com qualidade** — não adicionar por adicionar.
2. **Simplificar antes de crescer** — revisar o existente antes de expandir.
3. **Interface adequada ao contexto** — Desktop, Mobile e CLI possuem papéis diferentes.
4. **Respeitar o hardware** — evitar carga e processos sem benefício proporcional.
5. **Cada recurso deve resolver um problema real** e justificar seu custo de manutenção e recursos.
6. **Validar antes de consolidar** — implementação não é confirmação automática de maturidade.

---

## Prioridades de evolução

Esta revisão não cria uma sequência obrigatória de fases. Os itens devem ser priorizados pelo roadmap ativo e pelas evidências disponíveis.

Direções registradas:

- operações de serviços devem ser avaliadas para integração por contratos apropriados;
- operações administrativas devem evitar exigir edição manual de arquivos quando uma interface suportada fizer sentido;
- atualizações precisam de validação operacional antes de serem tratadas como fluxo consolidado;
- scheduler e automações devem receber interface visual apenas quando houver benefício claro;
- novas capacidades devem considerar custo no hardware e manutenção futura.

Regra:

> Não planejar tudo para implementar de uma vez. Avaliar o que já existe, simplificar quando possível e expandir somente quando houver justificativa.

---

## Saúde do servidor — baseline da revisão (2026-08-11)

Medição registrada com o servidor ocioso:

| Métrica | Valor registrado | Observação |
|---|---|---|
| Load (1/5/15) | 0.01 / 0.05 / 0.08 | muito baixo |
| Memória | 929Mi / 2.7Gi (~34%) | saudável no momento observado |
| Temperatura | GPU 84-85 °C | alta — ponto térmico relevante |
| CPU | ~65 °C | normal no momento observado |
| Containers | ~0% CPU | ociosos no momento observado |
| Disco | 5% de 290G | disponível no momento observado |

Esses números são evidência histórica do ambiente naquele momento e não devem ser tratados como métricas atuais permanentes.

### Ações registradas

- Health Check ampliado para reportar load, memória e temperatura.
- Backup e desligamento noturno consolidados no scheduler canônico.

### Incidente 2026-08-14 — timers duplicados

A reativação de timers legados de backup e desligamento noturno causou disparo duplicado junto às tarefas do scheduler. Processos concorrentes interferiam no ciclo de suspensão e wake por RTC.

A correção registrada foi desabilitar os timers legados e manter apenas os timers `hs-task-*` gerenciados pelo scheduler.

A validação registrada incluiu suspend S3 temporário com retorno automático e ajuste do instalador para configurar backup e energia pelo scheduler canônico.

### Decisão de qualidade de vida relacionada ao hardware

- priorizar ociosidade quando possível;
- evitar polling agressivo e processos sem uso;
- utilizar desligamento noturno como mitigação operacional;
- tratar limitações térmicas como restrição de planejamento.

---

## Relação com a documentação atual

Este documento é um registro de revisão e deve ser interpretado junto com:

- `planning/foundations/` — fundamentos gerais de evolução e validação;
- `planning/roadmap/evolution.md` — prioridades e áreas de evolução;
- `planning/quality/user-quality-of-life.md` — critérios atuais de qualidade de vida;
- `planning/app/` — direção das interfaces;
- `docs/reference/PRINCIPLES.md` — princípios permanentes;
- `docs/reference/ARCHITECTURE.md` — arquitetura atual.

Quando houver divergência entre este registro histórico e uma decisão posterior consolidada, prevalece a documentação atual de decisão ou arquitetura.