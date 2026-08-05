# Wireframe — Dashboard (Meu espaço)

> App: HomeServer (v2.0) · Tela: Home / "Meu espaço" (primeiro grupo da v1.4)
> Refs: `../references.md` §1 (status embutido no card: Dashy, Homepage, Gatus); §2 (stat cards, sidebar desktop / bottom nav mobile); §3 (skeleton, dark mode)
> Telas alvo: mobile (480px) e desktop (1280px).

## Objetivo

Primeira tela após login: visão geral do servidor com atalhos de ação e status em tempo real. Densidade informativa no desktop, essencial no mobile.

## Variante mobile (480×800) — bottom nav

```
┌──────────────────────────────┐
│ ≡  Meu espaço        🔔   ●  │  <- top bar (profile + notif)
│                              │
│   ● Servidor OK · 5 apps up  │  <- status banner (cor + ícone + texto)
│                              │
│   ┌─────────┐ ┌─────────┐   │
│   │ CPU 12% │ │ MEM 54% │   │  <- stat cards (2 cols)
│   └─────────┘ └─────────┘   │
│   ┌─────────┐ ┌─────────┐   │
│   │ DISK 38%│ │ NET  ✓  │   │
│   └─────────┘ └─────────┘   │
│                              │
│   Acesso rápido              │
│   ┌─────────────┐ ┌────────┐ │
│   │ 📁 Arquivos │ │ ⬆️ Up   │ │  <- ação 1 / ação 2
│   └─────────────┘ └────────┘ │
│   ┌─────────────┐ ┌────────┐ │
│   │ ⚙️ Configura│ │ 📦 Apps │ │
│   └─────────────┘ └────────┘ │
│                              │
│   [ ▓▓▓ Ver tudo ▓▓▓ ]       │  <- CTA → Aplicações
│                              │
│  ┌─────────┬────────┬──────┐ │
│  │ Home ▓▓ │ Apps   │ +    │ │  <- bottom nav (5 tabs) — ref §2
│  └─────────┴────────┴──────┘ │
│   (active)                   │
└──────────────────────────────┘
```

## Variante desktop (1280×800) — sidebar

```
┌──────┬──────────────────────────────────────────────────────┐
│ ≡    │  HomeServer                       🔔   Joao ▾        │  <- top bar
│      ├──────────────────────────────────────────────────────┤
│ ▓●▓  │                                                      │
│ Home │  ● Servidor OK · 5 apps up · last check 12s atrás     │
│      │                                                      │
│ Apps │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│      │  │ CPU     │ │ MEM     │ │ DISK    │ │ UPTIME  │    │
│ Arq. │  │ 12%     │ │ 54%     │ │ 38%     │ │ 34d 2h  │    │  <- 4 stat cards
│      │  │ ▓▓░░░░  │ │ ▓▓▓▓░░  │ │ ▓▓░░░░  │ │ ✓       │    │
│ Admin│  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│      │                                                      │
│ Sist.│  Acesso rápido                                       │
│      │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│      │  │ 📁 Arquivos │ │ ⬆️  Atualizar │ │ 📊 Relatório │    │  <- ações
│      │  └─────────────┘ └─────────────┘ └─────────────┘    │
│      │                                                      │
│      │  Últimas atividades                    [Ver tudo →]  │
│      │  ┌────────────────────────────────────────────────┐ │
│      │  │ ✓  API atualizada       há 5 min               │ │  <- feed
│      │  │ ✓  Backup concluído     há 2 h                 │ │
│      │  │ ⚠  Disco 80% (nextcloud) há 1 d                │ │
│      │  └────────────────────────────────────────────────┘ │
│      │                                                      │
│      │  5 apps em execução · 0 alertas                     │  <- footer status
│      │                                                      │
│ (▲ /) │  Busca rápida  (tecla "/" — ref §1 Homer)          │
└──────┴──────────────────────────────────────────────────────┘
```

## Estados

| Estado | Comportamento |
|---|---|
| Carregando | Stat cards viram **skeletons** (ref §3); nada de spinner central grande |
| Erro de um widget | Card isolado mostra "—" + ícone de retry; não derruba a tela |
| Server down | Banner "Servidor inacessível" + modo read-only (dados do último cache) |
| Offline PWA | Banner + dados do cache (IndexedDB), toast ao reconectar |

## Anotações de design

- **Status no card** (ref §1): cada stat card tem cor + ícone + texto, nunca só cor.
- **Sidebar desktop / bottom nav mobile** (ref §2): sidebar visível com labels no desktop; no mobile, 5 tabs.
- **Densidade**: desktop usa grid de 4 colunas e mostra feed de atividades; mobile mostra só stats essenciais + atalhos.
- **Busca global** com tecla `/` (ref §1 Homer) e atalhos de teclado.
- Herda os grupos da v1.4 como base da navegação (ref §1 Organizr).
- Atualização em tempo real via WebSocket (ref §1 Homarr) com fallback polling 30s.
