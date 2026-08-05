# Wireframe — Sistema (Status)

> App: HomeServer (v2.0) · Tela: "Sistema" (quarto grupo da v1.4)
> Refs: `../references.md` §1 (monitoramento em tempo real: Uptime Kuma, Dash., Beszel; status pages: Gatus); §2 (charts: TOAST UI); §3 (dark mode, prefer-reduced-motion)
> Telas alvo: mobile (480px) e desktop (1280px).

## Objetivo

Monitorar saúde do servidor: CPU/mem/disco/rede, processos, containers, agenda (backup/night-off), temperatura. Visual de status page com histórico.

## Variante mobile (480×800)

```
┌──────────────────────────────┐
│ ←  Sistema             ● OK  │  <- status global
│                              │
│  Servidor                   │
│  CPU  12%    ▓░░░░░░░░░      │  <- gauges compactos
│  MEM  54%    ▓▓▓▓░░░░░░      │
│  DISK 38%    ▓▓▓░░░░░░░      │
│  NET  ⬇ 1.2MB/s ⬆ 340KB/s    │
│  TEMP 42°C                   │
│                              │
│  Containeres (5)             │
│  🟢 gitea        up 34d      │
│  🟢 filebrowser  up 34d      │
│  🟢 homepage     up 34d      │
│  🟢 api          up 34d      │
│  🟢 caddy        up 34d      │
│                              │
│  Agenda                     │
│  ⏰ Backup: diário 03:00     │
│  🌙 Night-off: 22:00-08:00   │
│  💤 Próximo sleep: 22:00     │
│                              │
│  Gráfico (24h)               │
│  ┌────────────────────────┐  │
│  │   ╭─╮        ╭─╮      │  │  <- sparkline CPU (touch scroll)
│  │  ╭╯ ╰─╮    ╭─╯ ╰─╮    │  │
│  │  ╯     ╰────╯     ╰─╮  │  │
│  └────────────────────────┘  │
│   CPU no último dia          │
│  ┌─────────┬────────┬──────┐ │
│  │ Home ▓▓ │ Apps   │ +    │ │
│  └─────────┴────────┴──────┘ │
└──────────────────────────────┘
```

## Variante desktop (1280×800)

```
┌──────┬──────────────────────────────────────────────────────┐
│ ≡    │  Sistema                        [ 1h ▾ ] [ 24h ] [ 7d ]│
│      ├──────────────────────────────────────────────────────┤
│ ▓●▓  │  Status global: ● Operacional (todos os checks OK)    │
│ Home │                                                      │
│ Apps │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│      │  │ CPU         │ │ Memória     │ │ Disco       │     │
│ Arq. │  │ 12%         │ │ 54%         │ │ 38% de 2TB  │     │
│      │  │  ╭─╮        │ │  ╭╮         │ │ ▓▓▓░░░░░░   │     │
│ Admin│  │ ╭╯ ╰╮       │ │ ╭╯╰╮        │ │ 1.2TB livre │     │
│      │  └─────────────┘ └─────────────┘ └─────────────┘     │
│ Sist.│  ┌─────────────┐ ┌─────────────┐                     │
│      │  │ Rede        │ │ Temperatura │                     │
│      │  │ ⬇1.2/⬆0.34  │ │ 42°C ✓      │                     │
│      │  │ MB/s        │ │ fan 1200rpm │                     │
│      │  └─────────────┘ └─────────────┘                     │
│      │                                                      │
│      │  Checks (Gatus-style, ref §1)                        │
│      │  ┌────────────────────────────────────────────┐     │
│      │  │ ✅ api /version     · 12ms · OK            │     │
│      │  │ ✅ homepage :3000   · 10ms · OK            │     │
│      │  │ ✅ gitea :3000      · 22ms · OK            │     │
│      │  │ ✅ caddy :443       · 8ms  · OK            │     │
│      │  └────────────────────────────────────────────┘     │
│      │                                                      │
│      │  Agenda  │ ⏰ Backup 03:00 · 🌙 Night-off 22-08      │
│      │                                                      │
│      │  Processos (top 5)                                   │
│      │  PID  NOME          CPU    MEM    AÇÃO               │
│      │  123  api           2.1%   3.2%   [Detalhes]         │
│      │  999  docker-proxy  0.4%   0.1%   —                  │
│      │                                                      │
└──────┴──────────────────────────────────────────────────────┘
```

## Estados

| Estado | Comportamento |
|---|---|
| Carregando | Gauges skeleton; gráfico placeholder |
| Check falhou | Linha do check em vermelho com mensagem + "Reexecutar" (ref §1 Gatus) |
| Servidor em sleep | Banner "Servidor em modo de economia" (dados do último wake) |
| Histórico | Seletor 1h/24h/7d; gráficos via sparklines leves (TOAST UI ou custom SVG) |

## Anotações de design

- **Status page estilo Gatus** (ref §1): checks listados com latência e badge.
- **Densidade informativa** no desktop (gauges + checks + agenda + processos); mobile só essencial.
- **Motion**: respeitar `prefers-reduced-motion` (ref §3); animações sutis.
- **Dados em tempo real** via WebSocket; em sleep/night-off, o app entra em "modo de espera" e mostra último snapshot.
- Gráficos leves e auto-contidos (sem lib pesada); dataset granular 10s→1h.
