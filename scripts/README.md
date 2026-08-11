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

*(O `install.sh` copia `backup.sh` e `power-schedule.sh` para `/srv/scripts`; as units systemd apontam para lá.)*

## systemd

Unidades do sistema (copiadas pelo instalador para `/etc/systemd/system/`):

| Arquivo | Função |
|---|---|
| `homeserver-backup.service` / `.timer` | Backup diário (03h) |
| `homeserver-night-off.service` / `.timer` | Suspensão noturna (22h) |
| `homeserver-wol.service` | Wake-on-LAN |

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