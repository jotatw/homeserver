# Fluxo 3 — Meu espaço (Dashboard)

> Tela: `../wireframes/dashboard.md` · API: `GET /status`, `GET /events`, `GET /services`
> Refs: `../references.md` §1 (status no card, feed), §3 (skeletons, dados em cache)
> Este fluxo descreve como a Home monta os dados, atualiza e se comporta.

## 1. Fontes de dados (reais, v1.5)

| Dado do card | Endpoint (v1.5) | Payload real |
|---|---|---|
| CPU | `GET /api/v1/status` | `cpu.percent` |
| Memória | `GET /api/v1/status` | `memory.used/available/percent` |
| Disco | `GET /api/v1/status` | `disk.used/total/available/percent` |
| Uptime | `GET /api/v1/status` | `uptime` (string), `load` |
| Host/OS | `GET /api/v1/status` | `hostname`, `os`, `kernel`, `architecture` |
| Banner "N apps up" | `GET /api/v1/services` | `[{name, status:running}]` |
| Feed de atividades | `GET /api/v1/events` | `[{time, type, action}]` |
| Version (footer) | `GET /api/v1/version` | `{version}` (público) |

> **Nota**: `GET /status` já agrega `system` + `services` + `backup` num único payload
> (interface `SystemStatus` em `adapters/system.ts`) — um request para quase tudo.

## 2. Montagem da Home (fluxo)

```
[rota /]
    │
    ├─ 1. (paralelo) GET /status · GET /events · GET /version
    │
    ├─ 2. skeletons nos cards enquanto resolve (ref §3)
    │
    ├─ 3. sucesso → preenche cards + banner + feed
    │
    └─ 4. falha:
           • /status falha → card "—" + retry por card (não derruba Home)
           • /events falha → feed "sem atividades" (área isolada)
           • rede → modo offline: dados do último cache + badge
```

## 3. Composição dos cards

| Card | Conteúdo | Comportamento ao tocar/clicar |
|---|---|---|
| CPU | % + barra | → tela Sistema (gráfico CPU) |
| Memória | % + barra + usado/total | → tela Sistema |
| Disco | % + barra + disponível | → tela Sistema |
| Uptime | duração + load | → tela Sistema |
| Banner status | "Servidor OK · N apps up" | → tela Aplicações |
| Feed item | ícone + texto + tempo relativo | item de backup/device/sistema → sem navegação (apenas leitura) |

**Ícones por tipo de evento** (feed, ref §1):

```
backup → 💾   "Backup concluído"
device → 🔌   "Dispositivo conectado/removido"
system → ⚙️   "Servidor iniciado / sleep"
power  → 🔋   "Agenda de energia alterada"
```

## 4. Cálculo do banner de status

```
apps = GET /services
up   = apps.filter(status === "running")

banner:
  up === apps.length && apps.length > 0 → 🟢 "Servidor OK · N apps em execução"
  up <  apps.length                      → 🟡 "N de M apps com problema"  → link /apps
  apps.length === 0                      → 🔴 "Nenhum serviço reportando" → link /apps
```

Sempre cor + ícone + texto (ref §3: nunca só cor).

## 5. Atalhos de ação (por role)

| Atalho | user | admin |
|---|---|---|
| 📁 Arquivos → `/storage` | ✅ | ✅ |
| 📦 Aplicações → `/apps` | ✅ | ✅ |
| ⬆️ Verificar atualização → dialog status | ✅ (só leitura) | ✅ + botão "Aplicar" |
| 💾 Executar backup | oculto | ✅ (dialog confirm) |
| 📊 Relatório → `/system` | ✅ | ✅ |

## 6. Atualização em tempo real

- Polling `GET /status` a cada **30s** + refresh ao focar a aba (visibilitychange).
- WebSocket **futuro** (ref §1 Homarr) para eventos push — hoje o poll é suficiente (dados com cache de 10s na API).
- Indicador "atualizado há Xs" discreto no cabeçalho.

## 7. Estados

| Estado | Comportamento |
|---|---|
| Carregando | Cards skeleton (ref §3); banner skeleton |
| /status falha | Cards viram "—" com botão de retry individual; banner "sem dados" |
| /events falha | Feed vazio com "Sem atividades registradas" |
| Offline PWA | Dados do último snapshot (cache); badge "dados de <hora>"; botão "tentar reconectar" |
| Servidor dormindo | Banner especial "Servidor em modo de economia · dados de <último wake>" (não tenta poll em loop) |
| 401 | Fluxo global (navigation.md §5) → `/login` |

## 8. Checklist de validação

- [ ] Home carrega com 1 request agregado (`/status`) + eventos + versão em paralelo
- [ ] Cards CPU/Mem/Disk/Uptime preenchidos com payload real
- [ ] Banner: verde se todos running, amarelo se algum down, link para /apps
- [ ] Feed mostra backup/device/system com ícones por tipo
- [ ] Atalho de backup e atualizar-appear só para admin
- [ ] Falha parcial não derruba a Home (retry por card)
- [ ] Polling 30s + refresh no focus; cache 10s respeitado
