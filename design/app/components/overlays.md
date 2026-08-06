# Componentes — Overlays

> `Dialog`, `ConfirmDialog`, `Menu`, `Sheet` — camadas sobre o conteúdo (ref §2: Radix/aria, focus trap).
> Tokens: `../tokens/colors.md`, `elevation.md`, `motion.md`, `spacing.md`, `radius.md`.

## Dialog

Janela modal de formulário/edição (ex.: criar usuário, editar agenda).

```
   ┌────────────────────────────────────┐
   │ ✕  Novo usuário                    │  <- header: título + fechar
   │                                    │
   │  [ campo ]                         │  <- corpo (form)
   │                                    │
   │  [ Cancelar ]   [ Criar ]          │  <- footer: actions
   └────────────────────────────────────┘
```

### Tokens
- Superfície: `--hs-surface-raised`; raio: `--hs-radius-xl`; sombra: `--hs-shadow-lg`.
- Backdrop: `--hs-overlay`; entrada: `--hs-motion-slow` (ease emphasized).
- Largura: min(560px, `calc(100vw - 2rem)`); padding: `--hs-space-4`.

### A11y (obrigatório — base Radix/headless)
- `role="dialog"` + `aria-labelledby` (título).
- **Focus trap**: Tab cicla dentro; Esc fecha; foco volta ao elemento que abriu.
- Backdrop clicável fecha apenas dialogs não-destrutivos.

### Estados
| Estado | Comportamento |
|---|---|
| abrindo | entra com slide/fade (slow) |
| salvando | botão primário vira spinner + disabled (anti duplo clique) |
| erro validação | inline no campo (nunca fecha) |
| fechando | fade out (fast) |

---

## ConfirmDialog

Dialog de confirmação — usado para ações destrutivas (excluir usuário, parar, aplicar update).

```
┌───────────────────────────────────────────┐
│ ⚠  Excluir "convidado"?                   │  <- título com ícone de perigo
│ Remover permanentemente o usuário.        │  <- corpo: impacto
│ [ ] também remover pasta de arquivos      │  <- opção perigosa (default off)
│                                           │
│ [ Cancelar ]  [ Excluir  (vermelho) ]     │  <- destrutivo à direita
└───────────────────────────────────────────┘
```

### Tokens
- Botão destrutivo: `--hs-color-danger` (fundo) + `--hs-text-inverse`; hover `--hs-color-danger` escurecido.
- Ícone de alerta: `--hs-color-warn` ou `--hs-color-danger`.
- Corpo explica **consequência irreversível** em `--hs-body`.

### Regras
- Botão destrutivo **nunca é o foco inicial** (foco em Cancelar ou campo seguro).
- Opções perigosas opcionais com default **desmarcado** + aviso vermelho.
- `role="alertdialog"` (anuncia alerta ao abrir; impede interação de fundo).

---

## Menu ("Ações ▾")

Menu contextual de ações por item (card de app, avatar).

```
┌───────────────┐
│ ▸ Abrir        │
│ ───────────── │
│ ▸ Detalhes     │
│ ▸ Reiniciar    │  (desabilitado — tooltip G3)
│ ▸ ⋯            │
└───────────────┘
```

### Tokens
- Superfície: `--hs-surface-raised`; raio: `--hs-radius-lg`; sombra: `--hs-shadow-lg`.
- Item: `--hs-body`; hover: `--hs-surface-hover`; separador: `--hs-border`.
- Desabilitado: opacidade 0.5 + tooltip ("Requer atualização da API").

### A11y
- `role="menu"` / `role="menuitem"`; abrir com tecla de contexto; Esc fecha; foco gerenciado.

---

## Sheet

Painel lateral (móvel: bottom sheet; desktop: slide-in direito). Usado para overflow do bottom nav e detalhes.

```
   ┌─────────────────────┐
   │  ⌄                  │  <- drag handle
   │  Busca rápida        │
   │  Configurações       │
   │  Tema               │
   │  Perfil             │
   │  Sair               │
   └─────────────────────┘
   (móvel: 92% da altura, bottom)
```

### Tokens
- Superfície: `--hs-surface-raised`; raio superior: `--hs-radius-xl`.
- Entrada: slide up (móvel) / slide right (desktop) — `--hs-motion-slow`.
- Backdrop: `--hs-overlay`; fechar: Esc, backdrop, ou swipe down (móvel).

### A11y
- `role="dialog"` + focus trap; gesto de swipe com fallback para teclado (a11y ref §3).
