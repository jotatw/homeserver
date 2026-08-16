# CLI `hs`

A CLI `hs` concentra operações administrativas do HomeServer.

```bash
bash core/hs.sh <comando> <subcomando>
```

## Comandos

```text
system      hostname|os|kernel|architecture|uptime|info|memory|disk|cpu|load|services|backup|events|status
status      status geral
version     versão atual
service     list|enable|disable|start|stop|restart|status|update <serviço>
user        create|list|info|password|verify|is-admin|rm
device      list|status|usb|mount <tipo> <rótulo> <dev>|unmount <tipo> <rótulo>|eject <dev>
hardware    status|temp|disks|disk_smart|net|usb
automation  list|run <evento>
scheduler   init|list|enable|disable|run <tarefa>
power       status|enable|disable|set <desliga HH:MM> <liga HH:MM>
tls         init|renew|status|info
update      check|apply [--no-redeploy] | os check|apply
```

## Exemplos

```bash
bash core/hs.sh system status
bash core/hs.sh device list
bash core/hs.sh power status
bash core/hs.sh tls status
bash core/hs.sh update check        # release da linha atual (v1)
bash core/hs.sh update os check     # pacotes do sistema (apt)
```

## Observações

- `update check/apply` acompanha a **linha v1** (tags `v1.x.y`); outras linhas
  (`v2`) permanecem histórico. Use `HS_UPDATE_CHANNEL` para mudar a linha.
- `update os check|apply` atualiza os pacotes do sistema (apt) e registra o
  resultado em `/var/log/homeserver-os-update.log`.
- `tls init/renew` gerencia a CA interna (`/srv/config/tls`).
- Uso completo: `bash core/hs.sh --help` (ou `_usage()` no `core/hs.sh`).