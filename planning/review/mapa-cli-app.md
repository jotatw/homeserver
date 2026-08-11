# Mapa — Funções via terminal → onde encaixam no App

> Cruzamento entre os comandos do CLI `hs` (hoje acessíveis apenas por
> terminal) e as telas/áreas do App. Guia para **centralizar no App** até que
> nada exija comando além do `install`.
>
> Estado: mapeamento (2026-08-11) · sem implementação ainda.

## Legenda

- **App (já)**: a função já está no App.
- **Falta UI**: a API já existe; só falta a interface no App.
- **Falta API+UI**: nem endpoint nem interface existem; precisa criar os dois.
- **Nível**: user (uso diário) / admin (operação e configuração).

---

## 1. system (informações — leitura)

| CLI | Função | Onde encaixa no App | Nível | Ação |
|---|---|---|---|---|
| `system hostname/os/kernel/architecture/uptime/info` | info do servidor | Meu espaço (dashboard) + Sistema | user | **já** (via `/status`) |
| `system memory/disk/cpu/load` | métricas | Meu espaço + Sistema (gauges) | user | **já** |
| `system services` | estado dos serviços | Aplicações | user | **já** |
| `system backup` | último backup | Meu espaço (atividades) · Administração | admin | **falta UI** (info; API via `/status` tem backup) |
| `system events` | eventos | Meu espaço (feed) | user | **já** |
| `system status` | status geral | Meu espaço | user | **já** |

## 2. status / version

| CLI | Função | Onde encaixa | Nível | Ação |
|---|---|---|---|---|
| `status` | status geral | Meu espaço | user | **já** |
| `version` | versão | Meu espaço (footer) / Administração | user | **já** |

## 3. service (gestão de serviços) — maior gap

| CLI | Função | Onde encaixa | Nível | Ação |
|---|---|---|---|---|
| `service list` | lista serviços | Aplicações | user | **já** |
| `service status` | estado | Aplicações | user | **já** |
| `service enable/disable` | ativar/desativar | **Aplicações** (admin) — ação no card / Admin | admin | **falta API+UI** |
| `service start/stop/restart` | iniciar/parar/reiniciar | **Aplicações** (admin) — ação no card | admin | **falta API+UI** |
| `service update <serviço>` | atualizar serviço | **Aplicações** (admin) — ação no card | admin | **falta API+UI** |

## 4. user (gestão de usuários)

| CLI | Função | Onde encaixa | Nível | Ação |
|---|---|---|---|---|
| `user create` | criar usuário | Administração (Usuários) | admin | **já** (dialog) |
| `user list` | listar | Administração (Usuários) | admin | **já** |
| `user info` | detalhes | Administração (Usuários) | admin | **falta UI** (dados em `/users`) |
| `user password` | trocar senha | Administração (Usuários) — ação "senha" | admin | **falta UI** (API `PUT` existe) |
| `user verify` | validar senha | Login (autenticação) | — | **já** |
| `user is-admin` | verificar admin | Sessão/role | — | **já** |
| `user rm` | remover usuário | Administração (Usuários) — ação "excluir" | admin | **falta UI** (API `DELETE` existe) |

## 5. device (dispositivos)

| CLI | Função | Onde encaixa | Nível | Ação |
|---|---|---|---|---|
| `device list/status/usb` | listar | Armazenamento (Dispositivos) | user | **já** |
| `device mount/unmount/eject` | montar/desmontar/ejetar | Armazenamento (admin) — dialog | admin | **já** |

## 6. hardware

| CLI | Função | Onde encaixa | Nível | Ação |
|---|---|---|---|---|
| `hardware status` | geral | Sistema (admin) | admin | **já** (temp/rede) |
| `hardware temp` | temperatura | Sistema (admin) | admin | **já** |
| `hardware disks` / `disk_smart` | discos/health | **Sistema** (admin) — seção "Discos" | admin | **falta UI** (API `/hardware` existe) |
| `hardware net` | rede | Sistema (admin) | admin | **já** |
| `hardware usb` | USB | Sistema (admin) | admin | **já** (via devices) |

## 7. power (energia)

| CLI | Função | Onde encaixa | Nível | Ação |
|---|---|---|---|---|
| `power status` | agenda | Sistema (Energia) | admin | **já** |
| `power set` | definir agenda | Sistema (Energia) — dialog | admin | **já** |
| `power enable/disable` | ativar/desativar | Sistema (Energia) — dialog | admin | **já** |

## 8. update (atualização)

| CLI | Função | Onde encaixa | Nível | Ação |
|---|---|---|---|---|
| `update check` | verificar | **Administração** — seção "Atualização" | admin | **falta UI** (API `GET` existe) |
| `update apply` | aplicar | **Administração** — seção "Atualização" | admin | **falta UI** (API `POST` existe) |

## 9. scheduler (tarefas agendadas)

| CLI | Função | Onde encaixa | Nível | Ação |
|---|---|---|---|---|
| `scheduler list` | listar tarefas | **Administração** — seção "Agenda" | admin | **falta API+UI** |
| `scheduler enable/disable` | ativar/desativar | **Administração** — seção "Agenda" | admin | **falta API+UI** |
| `scheduler run <tarefa>` | executar agora | **Administração** — seção "Agenda" | admin | **falta API+UI** |

## 10. automation (automações/hooks)

| CLI | Função | Onde encaixa | Nível | Ação |
|---|---|---|---|---|
| `automation list` | listar automações | **Sistema** (admin) — seção "Automações" | admin | **falta API+UI** |
| `automation run <evento>` | disparar | **Sistema** (admin) | admin | **falta API+UI** |

## 11. impressão (já integrada)

| CLI | Função | Onde encaixa | Nível | Ação |
|---|---|---|---|---|
| `lp` (CUPS) | imprimir | Impressão | admin | **já** |

---

## Resumo por tipo de ação

| Tipo | Quantidade | Itens |
|---|---|---|
| **Já no App** | ~20 | system info, status, services(list), events, user create/list, device*, power*, hardware temp/net, version, print |
| **Falta UI (API existe)** | 6 | user info · user password · user rm · hardware disks/smart · update check · update apply |
| **Falta API+UI** | 9 | service enable/disable · start/stop/restart · update <serviço> · scheduler list/enable/disable/run · automation list/run |

## Prioridade sugerida (com calma, mínimo funcional)

1. **user rm + user password** (API existe — só UI) — FASE 7, baixo esforço.
2. **update check/apply** (API existe — só UI) — FASE 9, baixo esforço.
3. **service enable/disable + start/stop/restart** (API+UI) — FASE 4, o mais usado no dia a dia.
4. scheduler/automation — depois, sob demanda.

> Cada item passa pela regra: **o que já existe → o que pode ser simplificado →
> só então implementar**, sem abusar do hardware.
