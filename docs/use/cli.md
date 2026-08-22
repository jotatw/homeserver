# CLI `hs`

A CLI `hs` concentra operações administrativas, diagnóstico, manutenção e automação do HomeServer.

```bash
bash core/hs.sh <comando> <subcomando>
```

## Comandos

```text
system      hostname|os|kernel|architecture|uptime|info|memory|disk|cpu|load|services|backup|events|status
status      status geral
version     commit atualmente instalado
service     list|enable|disable|start|stop|restart|status|update <serviço>
user        create|list|info|password|verify|is-admin|rm
device      list|status|usb|mount <tipo> <rótulo> <dev>|unmount <tipo> <rótulo>|eject <dev>
hardware    status|temp|disks|disk_smart|net|usb
automation  list|run <evento>
scheduler   init|list|enable|disable|run <tarefa>
power       status|enable|disable|set <desliga HH:MM> <liga HH:MM>
tls         init|renew|status|info
update      check|apply | os check|apply
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

### HomeServer

`update check` consulta a branch remota configurada e compara o commit local com o destino remoto.

O resultado informa um dos estados:

- `up_to_date` — a instalação está no mesmo commit do destino remoto;
- `update_available` — existem commits remotos que podem ser aplicados por fast-forward;
- `modified` — existem alterações locais e a atualização automática é recusada;
- `ahead` — existem commits locais à frente do remoto;
- `diverged` — o histórico local e remoto divergiram;
- `unavailable` — não foi possível consultar o destino remoto.

Uma atualização disponível não significa que qualquer instalação possa ser atualizada automaticamente. O `update apply` só continua quando o estado permite um fast-forward seguro.

```text
update_available
        ↓
registrar ponto de recuperação do código
        ↓
fast-forward para o destino remoto
        ↓
retornar commit atualizado
```

O processo não executa `git reset --hard` e não sobrescreve alterações locais. Antes da atualização, o commit anterior é registrado em uma referência local `refs/homeserver/pre-update/<commit>`.

Essa referência permite recuperar o código anterior, mas não representa rollback completo de dados, configurações persistentes ou migrações.

A atualização padrão atualiza apenas o código do HomeServer. Ela não executa automaticamente uma instalação completa ou redeploy. Caso uma mudança futura exija etapas adicionais, essas etapas devem ser explicitamente definidas e validadas.

Enquanto o projeto estiver em desenvolvimento contínuo, a atualização acompanha a branch configurada. Tags e releases não são necessárias para detectar atualizações. Uma futura política de releases poderá definir canais estáveis sem substituir este mecanismo de desenvolvimento.

### Sistema operacional

A atualização do sistema é independente da atualização do HomeServer:

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
- Interfaces diferentes podem oferecer fluxos próprios para capacidades compartilhadas; a CLI não é substituída por uma interface específica.
- Uso completo e sintaxe atual: `bash core/hs.sh --help`.
