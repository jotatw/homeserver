# Wireframe — Login

> App: HomeServer (v2.0) · Tela: Autenticação
> Refs: `../references.md` §3 (PWA: sessões longas, "saved, will sync"); §2 (alvos ≥48dp)
> Telas alvo: mobile-first (480px) e desktop (1280px).

## Objetivo

Autenticar o usuário com e-mail/usuário + senha e manter sessão de longa duração (LAN self-hosted). Feedback de erro sem revelar se o usuário existe.

## Variante mobile (480×800)

```
┌──────────────────────────────┐
│  ●  HomeServer               │  <- logo + nome (tap volta)
│                              │
│                              │
│           [ HomeServer ]     │  <- logo, 96px
│                              │
│     Bem-vindo de volta       │
│     Entre para acessar seu   │
│     servidor                 │
│                              │
│   ┌────────────────────────┐ │
│   │ Usuário                │ │  <- input 48dp, autocomplete=off
│   └────────────────────────┘ │
│   ┌────────────────────────┐ │
│   │ Senha            [ 👁 ] │ │  <- toggle reveal
│   └────────────────────────┘ │
│                              │
│   [ x ] Lembrar de mim       │  <- checkbox, alvo ≥24dp
│        Esqueci a senha       │  <- link (futuro, off)
│                              │
│   [ ▓▓▓ Entrar ▓▓▓ ]         │  <- botão primário, 48dp, full width
│                              │
│   ─────────────────────      │
│   Entrar como convidado      │  <- link secundário (modo read-only)
│   ─────────────────────      │
│                              │
│  ⚠  Servidor: homeserver     │  <- host info (segurança: saber onde está)
│     ·  192.168.1.10          │
│                              │
└──────────────────────────────┘
        [touch keyboard]
```

## Variante desktop (1280×800)

```
┌──────────────────────────┬───────────────────────────────────────┐
│  ●  HomeServer           │                                       │
│                          │              ┌───────────┐            │
│  •  Entrar               │              │ HomeServer│            │
│                          │              └───────────┘            │
│  (sem navegação aqui)    │       Bem-vindo de volta               │
│                          │                                       │
│                          │   ┌───────────────────────────────┐   │
│                          │   │ Usuário                       │   │
│                          │   └───────────────────────────────┘   │
│                          │   ┌───────────────────────────────┐   │
│                          │   │ Senha                 [ 👁 ]  │   │
│                          │   └───────────────────────────────┘   │
│                          │   [x] Lembrar · · · Esqueci a senha   │
│                          │                                       │
│                          │   [ ▓▓▓▓▓▓▓▓ Entrar ▓▓▓▓▓▓▓▓ ]        │
│                          │        ────────────────────           │
│                          │       Entrar como convidado           │
│                          │                                       │
│                          │   ⚠ Servidor: homeserver · 192.168.1.10│
│                          │                                       │
└──────────────────────────┴───────────────────────────────────────┘
   (sidebar visível porém sem itens p/ não-logado — fora de foco)
```

## Estados

| Estado | Comportamento |
|---|---|
| Carregando | Botão "Entrar" → spinner + label "Entrando..." (disabled) |
| Erro credenciais | Toast no topo: "Usuário ou senha incorretos" (neutro, sem revelar qual) |
| Erro rede | Toast: "Servidor inalcançável" + botão "Tentar novamente" |
| Offline (PWA) | Card informativo: "Você está offline. Dados salvos serão sincronizados." |
| Sucesso | Transição fade → Dashboard (Meu espaço) |

## Anotações de design

- **Não usar só cor** p/ erro: toast com ícone + texto (ref §3 Offline UX).
- **Alvos de toque ≥48dp** nos botões e inputs (ref §2 M3).
- **Sessão longa**: token com longa duração + refresh; no self-hosted em LAN, evitar logout por inatividade curto (ref §3 PWA checklist).
- **Segurança**: sem "esqueci a senha" nesta versão (reset é via admin/CLI) — manter link desabilitado.
- Autofocus no campo usuário; Enter submete o formulário.
