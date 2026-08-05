# Wireframe — Administração

> App: HomeServer (v2.0) · Tela: "Administração" (terceiro grupo da v1.4) · Somente admin
> Refs: `../references.md` §2 (data tables, dialogs, toasts); §3 (acessibilidade, confirmação destrutiva)
> Telas alvo: mobile (480px) e desktop (1280px).
>
> ⚠️ Nota real (v1.5): **não existem roles "VIEW"/"user" explícitas**. O sistema distingue apenas
> **admin** (`hs user is-admin`) e **não-admin**. Nesta tela, o badge mostra ADMIN ⭐ ou "padrão".

## Objetivo

Gerenciar usuários do sistema (via API `/users` → `hs user`), agenda de energia e backups. Visível apenas para role `admin`. Sem token admin a rota retorna 403 e o App oculta a aba.

## Variante mobile (480×800)

```
┌──────────────────────────────┐
│ ←  Administração       ⚙️    │
│                              │
│  [ Usuários ] [ Tokens ] [Config] │  <- segmented control
│                              │
│  Usuários (2)                │
│  ┌────────────────────────┐  │
│  │ 👤 joao       ADMIN ⭐ │  │  <- badge admin (is-admin)
│  │    criado 05/08/2026   │  │
│  │    ⋯                   │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 👤 convidado    padrão │  │  <- não-admin (sem badge)
│  │    ⋯                   │  │
│  └────────────────────────┘  │
│                              │
│  [ ＋ Adicionar usuário ]    │  <- FAB / botão primário
│                              │
│  ┌─────────┬────────┬──────┐ │
│  │ Home ▓▓ │ Apps   │ +    │ │
│  └─────────┴────────┴──────┘ │
└──────────────────────────────┘
```

### Dialog: Adicionar/editar usuário (mobile)

```
┌──────────────────────────────┐
│ ✕  Novo usuário              │
│                              │
│  Usuário                     │
│  ┌────────────────────────┐  │
│  │ jota                   │  │
│  └────────────────────────┘  │
│  Senha (8+ caracteres)       │
│  ┌────────────────────────┐  │
│  │ ••••••••          👁   │  │
│  └────────────────────────┘  │
│  Role:  (•) Admin  ( ) View │
│                              │
│  [ Cancelar ]  [ Criar ]    │
└──────────────────────────────┘
```

## Variante desktop (1280×800)

```
┌──────┬──────────────────────────────────────────────────────┐
│ ≡    │  Administração               [ + Adicionar usuário ] │
│      ├──────────────────────────────────────────────────────┤
│ ▓●▓  │  Usuários                                            │
│ Home │  ┌────────────────────────────────────────────────┐  │
│      │  │ Nome     Role      Criado         Status  ⋯    │  │
│ Apps │  │ joao     ADMIN     05/08/2026     Ativo   ▾    │  │  <- data table
│      │  │ convidado padrão   05/08/2026     Ativo   ▾    │  │
│ Arq. │  └────────────────────────────────────────────────┘  │
│      │                                                      │
│ Admin│  Tokens de API                                       │
│      │  ┌────────────────────────────────────────────────┐  │
│      │  │ Nome      Criado     Último uso    Revogar     │  │
│      │  │ homepage  05/08/2026  hoje 09:12    [Revogar]  │  │
│      │  └────────────────────────────────────────────────┘  │
│ Sist.│  [ ＋ Novo token ]   (uso: integrações/external)     │
│      │                                                      │
│      │  Configurações                                       │
│      │  ┌───────────────────────────────────────────────┐  │
│      │  │ ⏰ Backup         [ 03:00 diário        ]     │  │
│      │  │ 🌙 Night-off      [ 22:00 - 08:00       ]     │  │
│      │  │ 🔔 Notificações   [ (x) E-mail ( ) Webhook ] │  │
│      │  └───────────────────────────────────────────────┘  │
│      │                                                      │
│      │  Zona de risco        [ ⛔ Parar servidor ]          │  │
│      │                       [ ♻️ Reiniciar ]               │  │
│      │                                                      │
└──────┴──────────────────────────────────────────────────────┘
```

### Dialog: confirmação destrutiva (ref §3)

```
┌───────────────────────────────────────────┐
│ ⚠  Parar servidor?                        │
│ O servidor ficará inacessível (incluindo   │
│ este app) até ser religado.               │
│    [ Cancelar ]   [ Parar agora (vermelho)]│
└───────────────────────────────────────────┘
```

## Notas de implementação (v1.5) — o que a API suporta hoje

| Recurso do wireframe | Suporte real |
|---|---|
| Criar/editar/remover usuário | ✅ `POST/PUT/DELETE /users`, `GET /users` (via `hs user`) |
| Marcar/desmarcar admin | ⚠️ `hs user is-admin` é leitura; promover admin hoje é via sistema (grupo) — **não expor switch** nesta versão |
| Tokens de API (listar/revogar) | ⚠️ Não há endpoint de tokens na v1.5 (só `HS_SERVICE_TOKEN` via env) — manter "Somente leitura/futuro" |
| Agendar backup | ⚠️ Não há configuração de agenda via API (só `POST /backup` imediato + `scheduler.conf`) — mostrar "executar backup agora" |
| Power (night-off) | ✅ `GET/PUT /power` (shutdown/wake HH:MM) |
| Parar/reiniciar servidor | ⚠️ Não há endpoint de shutdown imediato na API (só agenda) — remover da "zona de risco" ou via CLI |

> Estes pontos serão reaproveitados em `../flows/admin.md` e atualizados quando a API evoluir.

## Estados

| Estado | Comportamento |
|---|---|
| Sem permissão | Usuário não-admin não vê a aba Admin; se tentar rota, 403 + toast |
| Salvando | Botão "Criar" → spinner; diálogo não fecha sozinho até sucesso |
| Erro validação | Inline no campo (nunca só toast) |
| Ação destrutiva | Dialog de confirmação com botão vermelho + ação reversa explicada |

## Anotações de design

- **Data table** com ordenação e busca (ref §2: TOAST UI Grid / shadcn Data Table).
- **Role badges** com cor + texto (ADMIN ⭐; não-admin sem badge).
- **Ações destrutivas** sempre com dialog de confirmação (ref §3 Offline UX: não só cor).
- **Tokens**: revogação imediata; listar "último uso" para higiene.
- Ajustes de backup/night-off refletem `config/scheduler.conf` — persistência confirmada antes de fechar o dialog.
- Acessibilidade: foco preso no dialog (focus trap), Esc fecha, backdrop escurecido.
