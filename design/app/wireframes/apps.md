# Wireframe — Aplicações

> App: HomeServer (v2.0) · Tela: "Aplicações" (segundo grupo da v1.4)
> Refs: `../references.md` §1 (grid de cards + status no card, busca fuzzy: Homer/Dashy); §2 (data grid); §3 (list virtualization p/ listas grandes)
> Telas alvo: mobile (480px) e desktop (1280px).

## Objetivo

Navegar pelos serviços instalados (gitea, filebrowser, homepage, api, caddy...), ver status/health e abrir cada um. Busca rápida e filtros por status.

## Variante mobile (480×800)

```
┌──────────────────────────────┐
│ ←  Aplicações          🔍    │  <- search icon no top bar
│                              │
│  [ 🟢 Todos ] [⬤ Down] [⚙]  │  <- filter chips (ref §2 M3)
│                              │
│  ┌────────────────────────┐  │
│  │ 🟢 Gitea        ●  Up  │  │  <- card: status dot + label
│  │     Versão 1.22.1      │  │
│  │     git.jotatw         │  │  <- host + open icon
│  │     [ Ações ▾ ]    →   │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 🟢 FileBrowser  ●  Up  │  │
│  │     files.jotatw       │  │
│  │     [ Ações ▾ ]    →   │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 🟡 Homepage     ◐ Degr.│  │  <- degradation state
│  │     health.degraded    │  │
│  │     [ Ações ▾ ]    →   │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 🔴 API           ✕ Down│  │  <- down state
│  │     restarting...      │  │
│  │     [ Ações ▾ ]    →   │  │
│  └────────────────────────┘  │
│                              │
│  ─ 4 apps · 2 up · 1 deg · 1 down ─  <- summary footer
│                              │
│  ┌─────────┬────────┬──────┐ │
│  │ Home    │ Apps ▓▓│ +    │ │
│  └─────────┴────────┴──────┘ │
└──────────────────────────────┘
```

## Variante desktop (1280×800)

```
┌──────┬──────────────────────────────────────────────────────┐
│ ≡    │  Aplicações                        [ 🔍  Buscar app ] │
│      ├──────────────────────────────────────────────────────┤
│ ▓●▓  │                                                      │
│ Home │  Filtros: [ Todos ▾ ]  [ Estado: ▾ ]  [ Grupo: ▾ ]   │
│      │                                                      │
│ Apps │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────┐ │
│      │  │ 🟢 Gitea  │ │ 🟢 FileBrw │ │ 🟢 Homepage│ │ 🔴 API│ │
│ Arq. │  │ Up 1.22   │ │ Up        │ │ Up        │ │ Down  │ │
│      │  │ · · · · → │ │ · · · · → │ │ · · · · → │ │ retry │ │  <- grid cards
│ Admin│  └───────────┘ └───────────┘ └───────────┘ └───────┘ │
│      │                                                      │
│ Sist.│  [ + Instalar aplicação ]   (futuro; hoje gerenciado  │
│      │                            via CLI `hs app` / Docker) │
│      │                                                      │
│      │  Lista (para admin — detalhe técnico)                 │
│      │  ┌────────────────────────────────────────────────┐  │
│      │  │ Nome      Estado   Container   Versão   Porta  │  │
│      │  │ Gitea     Up       gitea       1.22.1   3000   │  │
│      │  │ FileBrowser Up     filebrowser 2.x      8080   │  │
│      │  │ Homepage  Degraded homepage     v0.9    3000   │  │
│      │  └────────────────────────────────────────────────┘  │
│      │                                                      │
│      │  4 apps · 2 up · 1 deg · 1 down     [ ⬇ Export ]     │
│      │                                                      │
└──────┴──────────────────────────────────────────────────────┘
```

## Estados

| Estado | Comportamento |
|---|---|
| Carregando | Cards skeleton (ref §3) |
| App down | Card fica vermelho com "Tentar novamente" (não bloqueia a tela) |
| Buscando | Resultados filtram conforme digita (fuzzy, ref §1 Homer); vazio mostra empty state |
| Offline | Cards usam último status cacheado + badge "cacheado" |

## Anotações de design

- **Status embutido no card**: dot colorido + label textual + cor de borda sutil (ref §1).
- **Ações por app** em menu "Ações ▾" (iniciar/parar/reiniciar/logs) — no mobile abaixo do card.
- **Filtros por status** e **busca fuzzy** (ref §1) são os dois pilares de navegação.
- **Lista detalhada** só para admin; cards são a visão padrão para todos.
- **List virtualization** (ref §3 Patterns.dev) quando o nº de apps crescer.
- "Instalar aplicação" fica desabilitado na v2.0 inicial (gerenciamento via CLI/Docker).
