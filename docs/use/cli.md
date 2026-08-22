# CLI `hs`

A CLI `hs` concentra operações administrativas, diagnóstico, manutenção e automação do HomeServer.

```bash
bash core/hs.sh <comando> <subcomando>
```

## Comandos

```text
system      hostname|os|kernel|architecture|uptime|info|memory|disk|cpu|load|services|backup|events|status
status      status geral
version     estado/versionamento atual
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
bash core/hs.sh update check
bash core/hs.sh update os check
```

## Atualizações

`update check` verifica o estado disponível no repositório remoto e compara a instalação atual com a referência alcançável configurada pelo mecanismo de atualização.

`update apply` aplica o fluxo de atualização suportado pelo projeto e pode executar o reimplante quando aplicável. Antes de atualizar, o processo registra um ponto local de recuperação `pre-update-<estado>`.

Enquanto não existir uma release oficial consolidada, a disponibilidade de atualização não deve ser interpretada como suporte formal por uma linha de versões. Tags futuras podem ser utilizadas como referências de publicação quando uma política explícita de release estiver em vigor.

Para atualizar os pacotes do sistema:

```bash
bash core/hs.sh update os check
bash core/hs.sh update os apply
```

O resultado é registrado em:

```text
/var/log/homeserver-os-update.log
```

## Outras observações

- `tls init/renew` gerencia a CA interna em `/srv/config/tls`.
- A CLI é especialmente útil para instalação, diagnóstico, recuperação, automação e manutenção avançada.
- Para operações cotidianas suportadas pela interface, prefira o App quando ele oferecer o fluxo completo.
- Uso completo e sintaxe atual: `bash core/hs.sh --help`.
