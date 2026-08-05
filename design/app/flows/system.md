# Fluxo 6 — Sistema

> Tela: `../wireframes/system.md` · API: `GET /status`, `GET /hardware` (admin), `GET|PUT /power` (admin), `GET /events`
> Refs: `../references.md` §1 (status page, monitoramento), §2 (charts leves)
>
> ⚠️ **Gap (G5)**: não há endpoint de **histórico** de métricas — só snapshot atual.
> Gráfico de longo prazo (24h/7d) exige novo endpoint ou coleta client-side.

## 1. Fontes de dados (reais, v1.5)

| Dado | Endpoint | Payload real | role |
|---|---|---|---|
| CPU/Mem/Disk/Uptime/Load | `GET /api/v1/status` | `cpu.percent, memory, disk, uptime, load` | user+admin |
| Serviços | `GET /api/v1/services` | `[{name, status}]` | user+admin |
| Eventos | `GET /api/v1/events` | `[{time, type, action}]` | user+admin |
| Dispositivos | `GET /api/v1/devices` | `[{type, label, mountpoint}]` | user+admin |
| Temperatura/Rede/Discos | `GET /api/v1/hardware` | `{network:{ip}, temperature:[{label,temp}], disks:{blockdevices:[...]}}` | **admin** |
| Agenda de energia | `GET /api/v1/power` | `{shutdown:"22:00", wake:"07:00", enabled}` | **admin** |

> **user não vê** temperatura/hardware/agenda — tudo isso é admin-only na API.

## 2. Seções da tela por role

```
user:                                 admin:
┌────────────────────┐                ┌────────────────────────────┐
│ Resumo (gauges)    │                │ Resumo (gauges)            │
│  CPU · Mem · Disk  │                │  CPU · Mem · Disk · Temp   │  <- /hardware
│                    │                │                            │
│ Serviços + checks  │                │ Serviços + checks          │
│  (de /services)    │                │  (de /services)            │
│                    │                │ Rede (IP)                  │  <- /hardware
│ Eventos (feed)     │                │ Discos físicos             │  <- /hardware
│                    │                │ Agenda de energia [editar] │  <- /power
│                    │                │ Eventos (feed)             │
└────────────────────┘                └────────────────────────────┘
```

## 3. Gauges (resumo em tempo real)

- Fonte: `GET /status` (poll 10s — cache da API é 10s).
- CPU% e Mem% → barras com cor por faixa (verde <60 · amarelo 60-85 · vermelho >85) + percentual textual.
- Disk% → barra + "X livre de Y".
- **Temp (admin)**: lista de `temperature[]` (label + °C); aviso ≥80°C (ex.: GPU nouveau em 82°C no servidor real hoje).

### Gráfico histórico (limitado)

- Sem endpoint de histórico (G5): o App **acumula amostras** enquanto a aba fica aberta (sparkline da sessão, max 30min) com label claro "esta sessão".
- Histórico real 24h/7d: bloqueado por endpoint novo (backlog Fase 2) — **não simular dados** (honestidade, ref §3).

## 4. Checks de serviço (estilo status page, ref Gatus)

```
GET /status (services) + mapa de URL (do fluxo apps)
  → por serviço:
      running → ✅ Nome · Ativo
      ausente → 🔴 Nome · Offline
  → clicar em um serviço abre o app (nova aba)
```

- Agrupado por ordem do payload; badge por estado (cor + ícone + texto).
- **user** vê os mesmos checks que admin (ambos têm `/services`).

## 5. Agenda de energia (admin)

| Ação | Endpoint | Comportamento |
|---|---|---|
| Ver agenda | `GET /power` | `shutdown/wake/enabled` exibidos |
| Ativar/editar | `PUT /power` body `{shutdown, wake}` | Dialog com horários HH:MM + validação; persistir via `hs power set` |
| Desativar | `PUT /power` body `{enabled:false}` | Dialog confirm; `hs power disable` |

- **user** não vê a seção (sem endpoint de leitura pública).
- Aviso: "Servidor desligará às 22:00 e ligará às 07:00" — confirmação explícita antes de salvar.
- Ações de energia refletem o `power-schedule.sh` (S3 da v1.5) — já validado em produção.

## 6. Estados

| Estado | Comportamento |
|---|---|
| Carregando | Gauges skeleton |
| `/status` falha | Gauges "—" + retry; seções independentes continuam |
| `/hardware` 403 (user) | Seção não renderizada (nunca tentar) |
| Temperatura alta | Card vermelho + texto "Temperatura elevada" (cor + ícone + texto) |
| Servidor em sleep | Banner "Modo de economia" (dados do último snapshot) |
| Offline PWA | Últimos valores + badge |

## 7. Checklist de validação

- [ ] user vê apenas seções de `/status`, `/services`, `/events`; admin vê + hardware + power
- [ ] Gauges com faixas de cor + percentual textual; temp com alerta ≥80°C
- [ ] Sparkline "esta sessão" honesto; sem histórico simulado (G5 no backlog)
- [ ] Agenda power: leitura/edição admin com dialogs de confirmação e validação HH:MM
- [ ] 403 em /hardware nunca chega a user (seção oculta por role)
- [ ] Falha parcial isolada por seção
