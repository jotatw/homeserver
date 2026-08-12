# HomeServer — Baseline v0.1.0

> Baseline conceitual do estado do projeto antes da próxima fase de evolução.

**Status:** 🟢 Concluído (2026-08-11)
**Versão conceitual:** v0.1.0
**Tag Git:** não criada — as tags históricas permanecem preservadas.

---

## 1. Objetivo

Este documento registra o estado conhecido do HomeServer antes das próximas mudanças estruturais.

O baseline não representa uma nova release distribuída. Ele funciona como uma fotografia técnica do projeto e como referência para medir a evolução posterior.

Regra desta etapa:

> **Nenhuma mudança de código é realizada como parte do Sprint 01.**

São permitidos somente auditoria, documentação, execução de testes e registro de evidências.

---

## 2. Estado atual

O repositório possui atualmente uma plataforma composta por infraestrutura local, serviços Docker, API, Homepage, HomeServer App, CLI e mecanismos de automação e atualização.

A linha de desenvolvimento anterior possui histórico v1.x e uma preparação de v2.0. Este baseline utiliza **v0.1.0 apenas como referência conceitual**, sem apagar ou renomear o histórico Git existente.

### Serviços conhecidos

- Caddy
- FileBrowser
- Gitea
- Homepage
- Portainer
- API
- Samba

### Recursos conhecidos

- autenticação e sessões;
- gerenciamento de usuários;
- storage centralizado;
- descoberta e gerenciamento de dispositivos;
- hardware;
- backup;
- agendamento de energia;
- CLI `hs`;
- auto-update;
- Homepage;
- HomeServer App;
- API REST;
- testes automatizados;
- smoke tests;
- Quality Gate.

### Health / Quality Gate

**Resultado do teste completo:** 🟢 EXECUTADO E VERDE (2026-08-11) — `bash core/tests/run_ci.sh`

| Suite | Resultado | Evidência |
|---|---:|---|
| Foundation | 6/6 ✅ | run_ci.sh (ALL PASSED) |
| Infrastructure | 3/3 ✅ | run_ci.sh (ALL PASSED) |
| Smoke | 7/7 ✅ | run_ci.sh / run-integration |
| CLI | 6/6 ✅ | run_ci.sh / run-integration |
| API | 31/31 ✅ | run_ci.sh / run-integration |
| Session | 12/12 ✅ | run_ci.sh (unit) |

Serviços em produção no momento da auditoria: Caddy, FileBrowser, Gitea, Homepage (healthy), API — todos operacionais; Homepage e API respondendo HTTP 200.

---

## 3. Arquitetura atual

A arquitetura documentada utiliza as seguintes camadas:

```text
HomeServer
├── core/
│   ├── foundation/
│   ├── infrastructure/
│   ├── adapters/
│   └── hs.sh
├── api/
├── modules/
├── automation/
├── scripts/
├── docs/
└── planning/
```

### Foundation

Componentes básicos e reutilizáveis do sistema: filesystem, validação, configuração, saída, constantes e registry.

### Infrastructure

Recursos internos do HomeServer: storage, usuários, dispositivos, hardware, serviços, backup, scheduler, energia e demais operações do sistema.

### Adapters

Camada responsável pela integração com serviços externos. A Infrastructure não deve depender diretamente da implementação de serviços externos.

### API

Interface oficial da plataforma. O App atua como cliente da API e não deve acessar diretamente os serviços externos.

### Modules

Serviços implantáveis, incluindo Homepage, FileBrowser, Gitea, Caddy e Portainer.

### Automation

Hooks e automações do sistema.

### Scripts

Ferramentas auxiliares, deploy, unidades do sistema e testes, conforme a organização atual. A padronização futura dessa área está fora do escopo deste baseline.

---

## 4. Scripts existentes

Os scripts atualmente conhecidos se distribuem conceitualmente em três categorias:

1. **Deploy** — ferramentas copiadas ou utilizadas no runtime em `/srv/scripts`;
2. **Systemd** — unidades e mecanismos relacionados à inicialização/agendamento;
3. **Testes** — suites Foundation, Infrastructure, integração, CLI, API, sessão e smoke tests.

A organização interna ainda possui pontos de mistura e será revisada em uma fase posterior.

---

## 5. Estrutura de diretórios

A estrutura deve ser avaliada distinguindo o que já existe do que é planejado.

```text
HomeServer
├── core/                         ✅ existente
├── api/                          ✅ existente
├── modules/                      ✅ existente
├── automation/                   ✅ existente
├── scripts/                      🟡 existente / organização mista
├── docs/                         ✅ existente
├── planning/                     ✅ existente
├── tests/                        ⚪ planejado / verificar necessidade
└── demais diretórios de suporte  ⚪ conforme arquitetura futura
```

Os diretórios marcados como ⚪ não devem ser criados apenas para satisfazer o diagrama. Eles permanecem como intenção arquitetural até que uma necessidade real justifique sua implementação.

---

## 6. Auditoria classificada

Critério:

- 🟢 **Estável / confirmado** — evidência disponível;
- 🟡 **A revisar** — funciona ou existe, mas possui inconsistência ou falta de evidência;
- 🔴 **Problema** — falha conhecida ou risco que exige correção;
- ⚪ **Planejado** — ainda não implementado e não é problema do estado atual.

| Área | Estado | Evidência / observação |
|---|---|---|
| Foundation | 🟢 | run_ci.sh verde (6/6) em 2026-08-11 |
| Infrastructure | 🟢 | run_ci.sh verde (3/3) em 2026-08-11 |
| API | 🟢 | run_ci.sh verde (31/31) em 2026-08-11; resposta HTTP 200 em produção |
| CLI | 🟢 | run_ci.sh verde (6/6) em 2026-08-11 |
| Session | 🟢 | run_ci.sh unit verde (12/12) em 2026-08-11 |
| Smoke | 🟢 | run_ci.sh verde (7/7) em 2026-08-11 |
| Scripts | 🟡 | Organização mista identificada; melhoria futura |
| Naming | 🟡 | Inconsistências históricas documentadas; melhoria futura |
| Storage | 🟡 | Gaps históricos identificados; validar comportamento real |
| Start/Stop | 🟡 | Gap conhecido; validar serviços e recuperação |
| Histórico | 🟢 | Histórico Git sem dados pessoais auditado (2026-08-11); backup preservado fora do repo |
| PWA | 🟡 | Implementação parcial conhecida |
| Impressão | 🟡 | Recurso conhecido com limitações |
| Segurança | 🟢 | Hardening aplicado (mobile non-root, sem privileged, authz 403); validação real continua |
| Instalação | 🟡 | Instalador recebeu correções; instalação limpa ainda precisa de teste real |
| Upgrade | 🟡 | Fluxo existente; upgrade real precisa de evidência |
| Reboot | 🟡 | Política de restart existente; validação real pendente |
| Documentação | 🟢 | Estrutura consolidada; baseline passa a ser referência oficial |

Nenhum item 🟢 deve ser interpretado como garantia de funcionamento em ambiente externo sem evidência do teste correspondente.

---

## 7. Problemas conhecidos

Os seguintes pontos são reconhecidos antes da próxima fase:

- inconsistências de nomenclatura entre `service` e `services_status`;
- organização mista em `scripts/`;
- gaps relacionados a storage;
- gaps relacionados a start/stop;
- gaps relacionados a histórico;
- PWA ainda parcial;
- impressão ainda limitada;
- necessidade de validação real do instalador;
- necessidade de validação real de upgrade e reboot.

Esses itens não foram corrigidos durante o Sprint 01 e permanecem registrados para evolução posterior.

---

## 8. Limitações atuais

### G1 — Storage

Há lacunas documentadas no gerenciamento/estado do storage que precisam ser avaliadas antes de uma evolução posterior.

### G2 — Start/Stop

O comportamento completo de parada e inicialização dos serviços ainda precisa ser validado de forma sistemática.

### G3 — Histórico

Existem lacunas relacionadas à representação ou histórico de determinadas operações/estados.

### G4 — PWA

O suporte PWA é parcial e não deve ser considerado equivalente a uma aplicação offline completa.

### G5 — Impressão

A funcionalidade de impressão possui limitações conhecidas e não representa uma plataforma de impressão completa.

---

## 9. Evidência do Quality Gate

### Comando oficial

```bash
bash core/tests/run_ci.sh
```

O script executa ShellCheck quando disponível, a suíte Foundation + Infrastructure e a integração Smoke + CLI + API.

### Resultado desta auditoria

**Data:** 2026-08-11

**Comando:** `bash core/tests/run_ci.sh`

**Resultado:** 🟢 PASS

| Verificação | Resultado |
|---|---|
| Foundation | 6/6 PASS |
| Infrastructure | 3/3 PASS |
| Smoke | 7/7 PASS |
| CLI | 6/6 PASS |
| API | 31/31 PASS |
| Session | 12/12 PASS |
| ShellCheck | Executado quando disponível pelo Quality Gate |

**Resultado final:** 🟢 QUALITY GATE APROVADO

Esta evidência representa o ambiente e o estado do projeto auditados nesta data. Validações futuras de instalação limpa, upgrade e reboot permanecem como cenários separados e não devem ser inferidas apenas a partir deste resultado.

---

## 10. Critério de fechamento do baseline

O Sprint 01 está concluído porque:

- [x] este documento está completo;
- [x] cada item relevante possui classificação;
- [x] o Quality Gate completo foi executado;
- [x] os resultados dos testes estão registrados;
- [x] o README aponta para este baseline;
- [x] o roadmap v1.0 está criado;
- [x] nenhuma mudança de código foi introduzida pelo Sprint 01.

---

## 11. Relação com o roadmap v1.0

O roadmap v1.0 registra retrospectivamente que as Fases 1, 2 e 3 atendem aos critérios mínimos definidos para elas no estado auditado em 2026-08-11.

Essa conclusão **não representa trabalho novo realizado pelo Sprint 01**. Ela apenas reconhece que parte da base já existia antes do novo planejamento.

Os itens 🟡 deste baseline continuam como limitações e oportunidades de melhoria. Eles não foram ignorados nem considerados automaticamente resolvidos pela conclusão retrospectiva das fases; cada pendência permanece sujeita à priorização e validação nas fases seguintes.

---

## 12. Assinatura conceitual

Este documento estabelece o **Baseline v0.1.0 conceitual** do HomeServer.

Ele não cria uma tag Git e não substitui versões históricas.

A partir deste ponto, novas alterações devem poder ser comparadas com este estado para medir evolução, regressão e impacto arquitetural.
