# Componentes — Formulários

> `Button`, `Input`, `Checkbox`, `Toggle`, `Select` — entradas do App (ref §2 M3: alvos ≥48dp, foco claro).
> Tokens: `../tokens/colors.md`, `spacing.md`, `radius.md`, `typography.md`, `elevation.md`.

## Button

Ações primária, secundária, ghost e destrutiva.

```
[ ▓▓ Entrar ▓▓ ]     ← primária (preenchido)
[   Cancelar   ]     ← secundária (borda)
[   Ver tudo   ]     ← ghost (sem borda)
[  Excluir     ]     ← destrutiva (vermelha)
```

### Tokens
| Variante | Fundo | Texto | Borda |
|---|---|---|---|
| primary | `--hs-primary` | `--hs-on-primary` | — |
| secondary | `--hs-surface` | `--hs-text` | `--hs-border` |
| ghost | transparente | `--hs-text` | — |
| danger | `--hs-color-danger` | `--hs-text-inverse` | — |

- Hover: primary → `--hs-primary-hover`; danger → danger escurecido.
- Raio: `--hs-radius-md`; altura: `--hs-touch` (≥48dp); padding: `--hs-space-3 --hs-space-4`; tipografia: `--hs-button`.

### Estados
| Estado | Comportamento |
|---|---|
| default | variante |
| hover | variante-hover + sombra sm |
| focus-visible | anel `--hs-shadow-focus` |
| disabled | opacidade 0.5, sem hover, `aria-disabled` |
| loading | spinner inline + label "…" (anti duplo clique) |
| pressed | `--hs-primary-active` |

### A11y
- `<button>` real (nunca div); loading com `aria-busy`.

---

## Input

Campo de texto (login, senha, criar usuário, agenda).

```
┌────────────────────────┐
│ Usuário                │  <- label acima (label)
└────────────────────────┘
┌────────────────────────┐
│ Senha            [👁]   │  <- com reveal
└────────────────────────┘
```

### Tokens
- Fundo: `--hs-surface`; borda: `--hs-border`; focus: `--hs-border-strong` + anel `--hs-shadow-focus`.
- Raio: `--hs-radius-md`; altura: `--hs-touch`; tipografia: `--hs-input` (≥16px mobile, ref §2).
- Label: `--hs-label` `--hs-text-muted`; erro: borda `--hs-color-danger` + mensagem inline `--hs-color-danger`.

### Estados
| Estado | Comportamento |
|---|---|
| default | borda neutra + placeholder `--hs-text-faint` |
| focus | borda forte + anel; autofocus no primeiro campo do form |
| erro | borda danger + inline (nunca só toast) + `aria-invalid` + `aria-describedby` |
| disabled | opacidade 0.5 |

### Regras
- Erro **inline no campo** (regra dos fluxos) + `role="alert"` na mensagem.
- Login: autocomplete off; senha com toggle reveal (aria-pressed).

---

## Checkbox

Seleção (lembrar de mim, remover pasta).

```
[✓] Lembrar de mim     [ ] também remover pasta (danger)
```

### Tokens
- Caixa 20px; borda `--hs-border`; marcado: `--hs-primary` + check branco.
- Label `--hs-body`; texto de warning junto (remover pasta) em `--hs-color-danger`.
- Alvo de toque: label clicável com área ≥ `--hs-touch` (24dp visual + área de toque).

### A11y
- `<input type="checkbox">` nativo com `label`; estado com `aria-checked` (nativo).

---

## Toggle

Ligado/desligado (agenda de energia, modo de economia).

```
      ○─────   ← off (trilho surface-hover, knob surface)
    ─────●     ← on (trilho primary, knob white)
```

### Tokens
- Trilho: 44×24px; knob 20px; on: trilho `--hs-primary`, knob `--hs-on-primary`; off: trilho `--hs-surface-hover`.
- `role="switch"` + `aria-checked`; label obrigatório.
- **Evitar** para decisões destrutivas (usar Checkbox com confirmação) — ref §2.

---

## Select

Dropdown de opções (filtros, role, HH:MM quando aplicável).

```
[ Estado: ▾ ]  ▾
```

### Tokens
- Mesmo visual do Input; opções em lista (`Menu`/popover, overlays.md).
- `role="listbox"` + `aria-expanded`; teclado: setas, Enter, Esc.
- Preferir componentes nativos em mobile (picker do sistema) — ref §2 ergonomia.

---

## Checklist por formulário

- [ ] Labels visíveis (nunca só placeholder)
- [ ] Erro inline + `aria-invalid` + `aria-describedby`
- [ ] Inputs ≥16px; alvos ≥48dp
- [ ] Botão primary com estado loading em submit (anti duplo clique)
- [ ] Ações destrutivas fora do formulário exigem ConfirmDialog
