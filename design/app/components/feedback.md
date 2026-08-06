# Componentes — Feedback

> `Toast`, `Skeleton`, `EmptyState`, `Spinner` — comunicação de estado (ref §3 Offline UX).
> Tokens: `../tokens/colors.md`, `motion.md`, `elevation.md`, `radius.md`.

## Toast

Notificação transitória no topo (alinhado com o design dos fluxos: toast = erro global).

```
┌───────────────────────────────────────────┐
│ ⚠  Não foi possível listar serviços  ✕    │  <- ícone + msg + dismiss
└───────────────────────────────────────────┘
```

### Tokens
- Superfície: `--hs-surface-raised`; raio: `--hs-radius-lg`; sombra: `--hs-shadow-lg`.
- Borda esquerda de 4px com cor de severidade (`--hs-color-*`).
- Padding: `--hs-space-3 --hs-space-4`; tipografia: `--hs-body`.
- Entrada: `--hs-motion-slow` (ease emphasized); saída: `--hs-motion-fast`.

### Variantes
| Variante | Borda/ícone |
|---|---|
| success | `--hs-color-ok` |
| warning | `--hs-color-warn` |
| error | `--hs-color-danger` |
| info | `--hs-color-info` |

### Comportamento
- Máximo 3 simultâneos (fila); auto-dismiss: success/info 4s, warning/error 6s (ou até ação).
- Fechável manualmente (✕); ações opcionais ("Tentar novamente") como botão inline.
- `role="status"` (info) ou `role="alert"` (erro que exige ação).

### A11y
- Anunciado por screen reader ao entrar (live region); foco vai para o toast se tiver ação.

---

## Skeleton

Placeholder de carregamento por bloco (ref §3: skeleton > spinner central).

```
┌──────────────┐   ┌──────────────┐
│ ▓▓▓▓         │   │ ▓▓▓▓▓▓       │  <- blocos de texto
│ ▓▓▓▓▓▓▓▓▓▓  │   │ ▓▓▓          │
└──────────────┘   └──────────────┘
```

### Tokens
- Fundo: `--hs-surface-hover`; shimmer: gradient translúcido animado (120ms loop lento, `--hs-motion-slower`).
- Respeitar `prefers-reduced-motion` (sem shimmer, fundo estático).

### Regras
- Cada bloco da tela tem seu skeleton (cards, tabela, banner) — falha parcial isola.
- Nunca cobrir a tela toda com spinner quando é possível esqueleto por área.

---

## EmptyState

Estado vazio / sem dados / erro de carregamento com ação.

```
    📭
  Nenhum app encontrado para "xyz"
  [ Limpar busca ]
```

### Tokens
- Ícone 48px `--hs-text-faint`; texto: `--hs-body` `--hs-text-muted`; ação: botão primário/secondário.
- Padding: `--hs-space-8`.

### Variantes
| Variante | Conteúdo |
|---|---|
| sem dados | ícone + texto + CTA (ex.: limpar filtro) |
| erro | ícone danger + "Não foi possível carregar" + [Tentar novamente] |
| offline | badge "offline" + texto de cache |

---

## Spinner

Usado só em operações longas (backup/update) ou loading de tela inteira (login).

```
   ⟳
  Entrando…
```

### Tokens
- Anel 24px, borda 3px `--hs-border` com segmento `--hs-primary`; rotação contínua.
- `role="status"` + texto "Carregando…" sempre (a11y).

### Regras
- Reservado para: submit de formulários, operações longas síncronas, boot. O resto usa skeleton.
