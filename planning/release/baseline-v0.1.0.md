# HomeServer — Baseline v0.1.0

> Baseline conceitual do estado do projeto antes da próxima fase de evolução.

**Status:** 🟡 Em auditoria
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

**Resultado do teste completo:** ⬜ PENDENTE DE EXECUÇÃO NO AMBIENTE DE TESTE

Os números de testes descritos no plano do Sprint 01 são a referência esperada para a auditoria:

| Suite | Resultado esperado | Evidência |
|---|---:|---|
| Foundation | 6/6 | ⬜ executar `run_ci.sh` |
| Infrastructure | 3/3 | ⬜ executar `run_ci.sh` |
| Smoke | 7/7 | ⬜ executar integração |
| CLI | 6/6 | ⬜ executar integração |
| API | 31/31 | ⬜ executar integração |
| Session | 12/12 | ⬜ executar suíte correspondente |

**Importante:** os números acima são o alvo definido para a auditoria e não são declarados como PASS até que o teste seja executado e registrado.

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
| Foundation | 🟡 | Suites existentes; execução completa ainda precisa ser registrada no baseline |
| Infrastructure | 🟡 | Suites existentes; execução completa ainda precisa ser registrada |
| API | 🟡 | Testes existentes; Quality Gate completo ainda precisa de evidência desta auditoria |
| CLI | 🟡 | Testes existentes; validar no ambiente real |
| Session | 🟡 | Testes existentes; validar no ambiente real |
| Smoke | 🟡 | Teste existente; executar como parte do baseline |
| Scripts | 🟡 | Organização mista identificada; refactor está fora do Sprint 01 |
| Naming | 🟡 | Há inconsistências históricas documentadas; correção fica para fase posterior |
| Storage | 🟡 | Gaps históricos identificados; validar comportamento real |
| Start/Stop | 🟡 | Gap conhecido; validar serviços e recuperação |
| Histórico | 🟡 | Necessita revisão dos gaps documentados |
| PWA | 🟡 | Implementação parcial conhecida |
| Impressão | 🟡 | Recurso conhecido com limitações |
| Segurança | 🟡 | Hardening anterior realizado; validação real continua necessária |
| Instalação | 🟡 | Instalador recebeu correções; instalação limpa ainda precisa de teste real |
| Upgrade | 🟡 | Fluxo existente; upgrade real precisa de evidência |
| Reboot | 🟡 | Política de restart existente; validação real pendente |
| Documentação | 🟡 | Estrutura consolidada; baseline passa a ser referência oficial |

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

Esses itens não serão corrigidos durante o Sprint 01.

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

O script executa ShellCheck quando disponível, a suíte Foundation + Infrastructure e a integração Smoke + CLI + API. citeturn198file0

### Resultado desta auditoria

```text
PENDENTE — executar no ambiente real do projeto.
```

Após a execução, registrar aqui:

```text
Data:
Commit:
Ambiente:
ShellCheck:
Foundation:
Infrastructure:
Smoke:
CLI:
API:
Session:
Resultado final:
```

---

## 10. Critério de fechamento do baseline

O Sprint 01 somente poderá ser marcado como concluído quando:

- [ ] este documento estiver completo;
- [ ] cada item relevante possuir classificação;
- [ ] o Quality Gate completo tiver sido executado;
- [ ] os resultados dos testes estiverem registrados;
- [ ] o README apontar para este baseline;
- [ ] o roadmap v1.0 estiver criado;
- [ ] nenhuma mudança de código tiver sido introduzida pelo Sprint 01.

---

## 11. Assinatura conceitual

Este documento estabelece o **Baseline v0.1.0 conceitual** do HomeServer.

Ele não cria uma tag Git e não substitui versões históricas.

A partir deste ponto, novas alterações devem poder ser comparadas com este estado para medir evolução, regressão e impacto arquitetural.
