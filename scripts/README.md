# scripts/

Scripts auxiliares do HomeServer. Organizados por responsabilidade:

## deploy

Scripts copiados/utilizados em runtime no servidor (via `install.sh` → `/srv/scripts`):

| Arquivo | Função |
|---|---|
| `backup.sh` | Backup dos dados (agendado injetado pelo install) |
| `power-schedule.sh` | Suspend/agenda de energia (wakes USB/NIC gerenciados) |
| `restore.sh` | Restauração de backup |
| `handle-device.sh` | Ação em eventos de dispositivo (hotplug) |
| `tls-renew.sh` | Renovação periódica da CA/certificados locais (scheduler) |

*(O `install.sh` copia `backup.sh` e `power-schedule.sh` para `/srv/scripts`; os timers do scheduler (`hs-task-*`) apontam para lá.)*

## systemd

### Agendamento (canônico — `hs scheduler`)

O backup diário (03h) e a suspensão noturna (22h → religa 07:00 via RTC) são
**gerenciados pelo scheduler a partir de `config/scheduler.conf`**:
`hs scheduler init` gera `hs-task-backup.timer` e `hs-task-night-off.timer` em
`/etc/systemd/system/` (executando `/srv/scripts/backup.sh` e
`/srv/scripts/power-schedule.sh`). **Não usar timers separados para estas
tarefas.**

### Wake-on-LAN

| Arquivo | Função |
|---|---|
| `homeserver-wol.service` | Ativa Wake-on-LAN no boot (`ethtool wol g`) |

### Legado (não gerenciar)

| Arquivo | Função |
|---|---|
| `homeserver-backup.service` / `.timer` | Histórico (duplicava o backup do scheduler) |
| `homeserver-night-off.service` / `.timer` | Histórico (duplicava o night-off do scheduler) |

Desabilitados/removidos do instalador em 2026-08-14: a coexistência com o
scheduler causava **disparo duplo** do `power-schedule.sh` que quebrava o
religamento noturno (RTC). Preservados apenas como referência.

## testes

Suítes executadas pelo Quality Gate:

| Arquivo | Função |
|---|---|
| `run-integration.sh` | Orquestra Smoke + CLI + Session + API |
| `smoke-test.sh` | Smoke: CLI, Homepage, API, Storage, Users |
| `test-cli.sh` | Específico do CLI `hs` |
| `test-api.sh` | Contrato da API (`ok/data`, auth, admin) |
| `test-session.sh` | Sessão (TTL, sliding, role) |
| `health-check.sh` | Pós-instalação / operação (docker, serviços, CLI) |

## Regras

- `scripts/` não é uma camada do Core — é a coleção de utilitários do projeto.
- Cada script tem **uma responsabilidade** e nome que a descreve (`test-*` = testes, `homeserver-*` = systemd, demais = deploy/auxiliar).
- Testes novos entram com sufixo `test-`; unidades systemd com prefixo `homeserver-`.