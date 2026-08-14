# Revisão — Simplicidade e centralização no App

> Documento central do projeto. Define o objetivo de uso do HomeServer e as
> restrições de evolução. Referência para as próximas fases (roadmap v1.0).

**Status:** Registrado (2026-08-11) · Revisão sem alteração de código.

---

## Objetivo central

> **Uma pessoa deve conseguir instalar e operar o HomeServer apenas pelo App —
> sem digitar nenhum comando além da instalação.**

Detalhando:

1. Ninguém precisa de comando além do `install.sh`.
2. As funções são **centralizadas no App** (única interface).
3. Cada funcionalidade é **organizada por nível de usuário** (user / admin).
4. **Tudo que for configurável deve ser configurável pelo App** — nunca por
   edição manual de arquivo ou comando.

## Restrição de hardware (gargalo real)

O servidor é **velho, barulhento e esquenta muito**. Toda decisão de evolução
deve considerar:

- adicionar só o **mínimo necessário** que agrega valor;
- priorizar **qualidade e vida útil** do hardware sobre quantidade de recursos;
- evitar processos pesados, polling agressivo e serviços ativos sem uso;
- manter o servidor ocioso quando possível;
- nenhuma funcionalidade nova entra sem justificativa de valor real.

Regra de evolução aqui:

> **Simplificar o que existe antes de crescer.**
> Menos recursos, mais qualidade, mais estabilidade.

---

## Inventário atual (estado v0.1.0)

### CLI (`hs`) — ~30 operações

```
system hostname|os|kernel|architecture|uptime|info|memory|disk|cpu|load|
       services|backup|events|status
service list|enable|disable|start|stop|restart|status|update <serviço>
status
user create|list|info|password|verify|is-admin|rm
device list|status|usb|mount|unmount|eject
hardware status|temp|disks|disk_smart|net|usb
automation list|run
scheduler init|list|enable|disable|run
power status|enable|disable|set
version
update check|apply
```

### API — ~34 endpoints (auth, status, system, storage, services, devices,
events, power, hardware, backup, update, users, tokens, print, app)

### App — 6 telas + login

Meu espaço · Aplicações · Armazenamento · Sistema · Administração · Impressão

---

## Revisão de simplicidade — o que já dá no App

| Área | App | Observação |
|---|---|---|
| Autenticação / sessão | ✅ | login/logout, role |
| Meu espaço | ✅ | stats + atividades |
| Aplicações | ✅ | abrir serviços |
| Armazenamento | ✅ | uso + dispositivos (montar/desmontar) |
| Sistema | ✅ | gauges, checks, energia (editar), temperatura |
| Usuários | ✅/parcial | listar + criar (faltam: remover, senha) |
| Tokens de API | ✅ | listar/criar/revogar |
| Impressão | ✅ | texto/arquivo + fila + cancelar |

## Gaps — o que ainda exige comando/arquivo (não está no App)

| Funcionalidade | CLI | API existe? | App? | Nível |
|---|---|---|---|---|
| Ativar/desativar serviço | `service enable/disable` | ❌ | ❌ | admin |
| Iniciar/parar/reiniciar serviço | `start/stop/restart` | ❌ | ❌ | admin |
| Trocar senha de usuário | `user password` | ✅ PUT | ❌ | admin |
| Remover usuário | `user rm` | ✅ DELETE | ❌ | admin |
| Verificar/aplicar update | `update check/apply` | ✅ GET/POST | ❌ | admin |
| Tarefas agendadas (backup/night-off) | `scheduler` | ❌ | ❌ | admin |
| Automações (hooks) | `automation` | ❌ | ❌ | admin |
| Hardware completo (discos/smart/consumo) | `hardware` | ✅ | parcial (temp+rede) | admin |

### Config manual que deveria ser App

- `config/services.conf` (ativação de serviços) → mesmo item "ativar/desativar".
- `config/scheduler.conf` (agenda) → mesmo item "tarefas agendadas".

---

## Níveis de usuário (estado atual vs objetivo)

| Nível | Hoje | Objetivo |
|---|---|---|
| **user** | dashboard · apps · storage · system (leitura) | uso diário (arquivos, apps, status) |
| **admin** | + users (criar), tokens, impressão, energia, dispositivos | **toda** a operação e configuração |

---

## Princípios de decisão (aplicar em toda fase)

1. **Mínimo funcional com qualidade** — menos é mais; não adicionar por adicionar.
2. **Simplificar antes de crescer** — revisar o existente antes de planejar novo.
3. **App como única interface** — CLI fica para instalação; o App concentra a operação.
4. **Dançar conforme o hardware** — nada pesado, nada desnecessário ativo.
5. **Cada resource só é adicionado se resolve um problema real** e mantém o
   servidor estável por anos.

## Encaixe nas fases (referência — decidir item a item, com calma)

- **FASE 4 (Serviços)**: ativar/desativar + iniciar/parar/reiniciar no App (novos
  endpoints). *Com cuidado: start/stop de container é leve; manter mínimo.*
- **FASE 7 (Segurança)**: remover usuário + trocar senha no App (API já existe).
- **FASE 9 (UX)**: update no App (API existe); scheduler/automação só se houver
  valor real e baixo custo de recurso.

> Regra: **não planejar tudo e implementar de uma vez.** Cada item passa primeiro
> por "o que já existe → o que pode ser simplificado → só então o que cresce".
---

## Saúde do servidor (baseline 2026-08-11)

Medição real (servidor ocioso):

| Métrica | Valor | Observação |
|---|---|---|
| Load (1/5/15) | 0.01 / 0.05 / 0.08 | muito baixo — servidor ocioso |
| Memória | 929Mi / 2.7Gi (~34%) | saudável |
| Temperatura (GPU) | **84-85 °C** | ⚠ alto — ponto de calor real |
| CPU (núcleos) | 65 °C | normal |
| Containers CPU | ~0% (ociosos) | homepage 153Mi · gitea 163Mi · api 96Mi · caddy 27Mi |
| Disco | 5% de 290G | ok |

### Ações aplicadas (manter saudável, mínimo com qualidade)

- ✅ **Health Check ampliado**: agora reporta load, memória e temperatura
  (alerta ⚠ >70 °C, falha >85 °C) — `scripts/health-check.sh`.
- ✅ **Agendamento unificado no scheduler** (canônico): backup diário (03h) e
  night-off (22h → religa 07:00 via RTC) são gerenciados por
  `config/scheduler.conf` via `hs scheduler` (units `hs-task-backup` /
  `hs-task-night-off`). **Não usar timers separados para estas tarefas.**

### Incidente 2026-08-14 — timers duplicados (corrigido)

A reativação dos timers legados `homeserver-night-off.timer` /
`homeserver-backup.timer` (registrada em 08-11) criou **disparo duplo** com as
tarefas do scheduler (ambos às 22h/03h). Duas invocações de `power-schedule.sh`
rodavam em corrida: um processo restaurava os wakes (NIC/USB) **enquanto** o
outro suspendia → despertava imediato (~5s), consumia o alarme do RTC e o ciclo
22h/07h deixava de religar sozinho (servidor indisponível até ação manual).

- **Correção (2026-08-14)**: `systemctl disable --now
  homeserver-night-off.timer homeserver-backup.timer` — ficam ativos apenas os
  timers `hs-task-*` do scheduler.
- **Validação**: suspend S3 de 90s (`rtcwake -m mem`) religou em ~91s (exit 0);
  wakes restaurados e wakealarm consumido.
- **Regressão**: `install.sh` configura backup/energia via `hs scheduler
  enable` (sem timers legados).

### Decisões de qualidade de vida (hardware)

- Prioridade: **servidor ocioso quando possível** e **desligado à noite**.
- Nada de polling agressivo ou processos ativos sem uso.
- GPU em 84-85 °C mesmo ociosa é característica do hardware; a mitigação é o
  desligamento noturno + evitar carga desnecessária (limitação sob demanda).
