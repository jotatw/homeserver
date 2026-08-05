# Wireframe — Administração

> App: HomeServer (v2.0) · Tela: "Administração" (terceiro grupo da v1.4) · Somente admin
> Refs: `../references.md` §2 (data tables, dialogs, toasts); §3 (acessibilidade, confirmação destrutiva)
> Telas alvo: mobile (480px) e desktop (1280px).

## Objetivo

Gerenciar usuários, tokens, permissões e configurações do servidor. Visível apenas para role `admin` (referente à API `/users`).

## Variante mobile (480×800)

```
┌──────────────────────────────┐
│ ←  Administração       ⚙️    │
│                              │
│  [ Usuários ] [ Tokens ] [Config] │  <- segmented control
│                              │
│  Usuários (2)                │
│  ┌────────────────────────┐  │
│  │ 👤 usuario       ADMIN ⭐ │  │  <- role badge
│  │    criado 05/08/2026   │  │
│  │    ⋯                   │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 👤 convidado    VIEW  │  │
│  │    read-only           │  │
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
│ Apps │  │ usuario     ADMIN     05/08/2026     Ativo   ▾    │  │  <- data table
│      │  │ convidado VIEW      05/08/2026     Ativo   ▾    │  │
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

## Estados

| Estado | Comportamento |
|---|---|
| Sem permissão | Usuário VIEW não vê a aba Admin; se tentar rota, 403 + toast |
| Salvando | Botão "Criar" → spinner; diálogo não fecha sozinho até sucesso |
| Erro validação | Inline no campo (nunca só toast) |
| Ação destrutiva | Dialog de confirmação com botão vermelho + ação reversa explicada |

## Anotações de design

- **Data table** com ordenação e busca (ref §2: TOAST UI Grid / shadcn Data Table).
- **Role badges** com cor + texto (ADMIN ⭐, VIEW).
- **Ações destrutivas** sempre com dialog de confirmação (ref §3 Offline UX: não só cor).
- **Tokens**: revogação imediata; listar "último uso" para higiene.
- Ajustes de backup/night-off refletem `config/scheduler.conf` — persistência confirmada antes de fechar o dialog.
- Acessibilidade: foco preso no dialog (focus trap), Esc fecha, backdrop escurecido.
