# Componentes — Navegação

> `Sidebar`, `BottomNav`, `TopBar` — esqueleto de navegação (ref §3 NN/g: sidebar desktop / bottom nav mobile; ref §2 M3).
> Tokens: `../tokens/spacing.md`, `colors.md`, `elevation.md`.

## Sidebar

Navegação lateral do desktop (≥1024px) e tablet colapsável (768-1024px).

```
┌──────────┐
│ ≡        │  <- brand/collapse
│          │
│ ▓●▓ Home │  <- item ativo (primary-soft)
│   Apps   │
│   Arq.   │
│   Sist.  │
│   Adm ⭐ │  <- admin
│          │
│  ──────  │
│   ⚙ Tema │  <- footer (tema, perfil)
│   👤 Usuario│
└──────────┘
```

### Tokens
- Largura: `--hs-sidebar-w` (240px); colapsada (tablet): `--hs-sidebar-w-collapsed` (60px, só ícones).
- Fundo: `--hs-bg` (mesma da página, com borda direita `--hs-border`).
- Item: altura `--hs-touch`; raio `--hs-radius-md`; padding lateral `--hs-space-3`.
- Ativo: `--hs-primary-soft` + texto `--hs-text` + indicador esquerda 3px `--hs-primary`.
- Inativo: `--hs-text-muted`; hover: `--hs-surface-hover`.

### Regras
- **Nunca esconder em hamburger no desktop** (ref §3 NN/g) — sempre visível com labels.
- Scroll próprio se conteúdo exceder; itens agrupados com labels de grupo (`--hs-label`).
- Colapso tablet: só ícones + tooltip; expandir em botão.

### A11y
- `<nav aria-label="Principal">`; item atual com `aria-current="page"`.

---

## BottomNav

Navegação inferior do mobile (<768px). Máx. 5 destinos (ref §2 M3).

```
┌──────────────────────────────────┐
│ Home   Apps   +    Sist   Adm    │
└──────────────────────────────────┘
        (item ativo destacado)
```

### Tokens
- Altura: `--hs-bottomnav-h` (56px); fundo: `--hs-surface-raised`; borda topo: `--hs-border`.
- Item: largura flexível (1fr), ícone 24px, label `--hs-meta`.
- Ativo: `--hs-primary` (ícone) + dot 4px indicador; inativo: `--hs-text-muted`.
- Slot `+`: abre o Sheet de overflow (busca, tema, perfil, sair).

### Regras
- `position: fixed` bottom, com `padding-bottom: env(safe-area-inset-bottom)` (iPhone).
- Conteúdo das telas tem padding inferior ≥ 64px para não esconder sob a barra.

### A11y
- `<nav aria-label="Principal">`; itens `<a>` com `aria-current` no ativo.

---

## TopBar

Barra superior por tela.

```
┌──────────────────────────────────────────┐
│ ←  Título da tela      🔍   🔔   👤 Usuario ⭐│
└──────────────────────────────────────────┘
```

### Tokens
- Altura: `--hs-topbar-h` (56px); fundo: `--hs-bg` (translúcido + blur sutil) ou `--hs-surface` no móvel.
- Título: `--hs-heading`; voltar (←): `--hs-touch` de alvo; ações à direita (busca, notif, avatar).
- Avatar: círculo 32px, iniciais, badge admin ⭐ (ADMIN).

### A11y
- `<header>` com `aria-label` da tela; notificações com `aria-expanded` se abre painel.
- Em mobile, título centralizado com ações nas pontas (ergonomia polegar — ref §2 Apple HIG).

---

## Tabs

Abas dentro de tela (usado no admin com SegmentedControl — mas como navegação de seção).

```
[ Usuários ] [ Tokens ] [ Config ]
```

- Mesmas regras do `SegmentedControl` (data.md); aqui `role="tablist"` puro.
