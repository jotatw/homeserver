# Ícones

Fonte de ícones: **Material Design Icons** (`mdi-*`) + `sh-*` para
serviços (via gethomepage).

## Regras

- **Ícones só nas categorias** (título do grupo) e em cards de ação.
- Cards técnicos (Sistema) usam ícone discreto e pequeno.
- Ícones de status nunca são usados como ícone principal — o estado
  é comunicado por **cor** + dot, não por ícone.

## Ícones principais

| Conceito | Ícone |
|----------|-------|
| Arquivos | `mdi-folder` |
| Projetos / Git | `mdi-code-tags` / `sh-gitea` |
| Downloads | `mdi-download` |
| Mídia | `mdi-movie` |
| Homepage | `mdi-home` |
| HomeServer App | `mdi-monitor-dashboard` |
| Usuários | `mdi-account-group` |
| Storage | `mdi-harddisk` |
| Backups | `mdi-backup-restore` |
| Agendamento | `mdi-power-settings` |
| Serviços | `mdi-server-network` |
| Sensores | `mdi-thermometer` |
| Dispositivos | `mdi-usb` |
| Servidor | `mdi-server` |
| Eventos | `mdi-calendar-today` |

## Estado (indicadores)

- 🟢 `ok` — Online (dot `#22c55e`)
- 🟡 `warn` — Atenção (dot `#eab308`)
- 🔴 `danger` — Indisponível (dot `#ef4444`)

O dot é um círculo de 8px, sem texto adicional, com `statusStyle: dot`.
