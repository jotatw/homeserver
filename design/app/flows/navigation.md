# Fluxo 2 — Navegação por role

> Telas: `../wireframes/*` · API: matriz de permissões em `README.md` §2
> Refs: `../references.md` §2 (sidebar desktop / bottom nav mobile); §3 (NN/g: mobile-first não é mobile-only)
> Este fluxo descreve **como o App monta e protege a navegação** conforme a role.

## 1. Modelo de navegação

```
        anônimo              user                  admin
  ┌──────────────┐    ┌────────────────┐    ┌──────────────────────┐
  │    Login     │    │  Meu espaço    │    │  Meu espaço          │
  │  (tela única)│    │  Aplicações    │    │  Aplicações          │
  └──────────────┘    │  Armazenamento │    │  Armazenamento       │
                      │  Sistema       │    │  Sistema             │
                      └────────────────┘    │  Administração ⭐    │
                                            └──────────────────────┘
```

Regra central: **o App monta a navegação a partir da role real** (endpoint `GET /auth/session` + `hs user is-admin`). Nunca por estado client-side confiável — a verdade é a API.

## 2. Definição declarativa da navegação

A lista de destinos é **estática no App** (uma fonte única), com permissão mínima por item:

| Rota | Área | user | admin | Ícone |
|---|---|---|---|---|
| `/` | Meu espaço (dashboard) | ✅ | ✅ | house |
| `/apps` | Aplicações | ✅ | ✅ | grid |
| `/storage` | Armazenamento | ✅ | ✅ | folder |
| `/system` | Sistema | ✅ | ✅ | activity |
| `/admin` | Administração | ❌ | ✅ | settings |
| `/login` | Login | (fora da nav) | (fora da nav) | — |
| `/` + 404 | Não encontrado | — | — | — |

Filtro de montagem:

```
navegacao = DESTINOS.filter(item => item.minRole <= roleDoUsuario)
```

`roleDoUsuario` = ordem anônimo(0) < user(1) < admin(2).

## 3. Layout por viewport (ref §3)

| Viewport | Padrão |
|---|---|
| **mobile** (<768px) | Bottom navigation com **5 slots**: as 4 áreas + um "mais" (`+`) que abre sheet com ações extras (busca, configurações de tema, perfil) |
| **desktop** (≥1024px) | Sidebar fixa (240px) com labels + ícones; sempre visível (nunca colapsar em hamburger — ref NN/g) |
| **tablet** (768-1024px) | Sidebar colapsável por ícones (60px), expandível por botão |

Bottom nav (mobile) — admin:

```
┌─────────┬────────┬──────┬────────┬──────┐
│ Home    │ Apps   │  +   │ Sist   │ Adm  │
└─────────┴────────┴──────┴────────┴──────┘
 (active)
```

- 5 slots máx. no mobile (ref M3 Navigation Bar: 3-5 destinos).
- Admin tem 4 áreas → usa os 4 + `+`. user tem 4 → usa 3 + `+` (Home, Apps, +, Arq, Sist) — prioridade: Home, Apps, [+, Arq, Sist].
- O slot `+` é o overflow: acesso rápido, busca, tema, perfil, logout.

## 4. Fluxo de montagem da navegação

```
[App inicia]
    │
    ▼
[Boot sequence]
    │
    ├─ 1. le token local (IndexedDB)
    ├─ 2. GET /auth/session
    │      ├─ 200 → perfil { username, admin: bool }  → role = admin|user
    │      ├─ 401 → role = anônimo → rota /login
    │      └─ falha rede → modo offline → usa última role em cache
    ├─ 3. monta lista de destinos (filtro por role)
    ├─ 4. renderiza layout (sidebar OU bottom-nav conforme viewport)
    └─ 5. resolve rota atual; se rota proibida → redireciona (ver §5)
```

## 5. Guarda de rota e tratamento 401/403

| Evento | Detecção | Comportamento |
|---|---|---|
| Rota proibida por role | filtro de montagem (client-side, UX) | Redireciona para `/` + toast "Sem permissão" (sem chamar a API) |
| 401 ao carregar dados | resposta API | Limpa token → `/login` com toast "Sessão expirada" |
| 403 ao chamar rota admin | resposta API (verdade real) | Toast "Acesso restrito" + volta para `/` (não mostra tela quebrada) |
| 401 no boot | `GET /auth/session` | `/login` (fluxo `auth.md`) |
| Offline | falha de rede | Mantém última navegação em cache + badge offline; rotas admin desabilitadas com tooltip |

**Regra de ouro**: a navegação esconde (UX), a API proíbe (segurança). O App **nunca** bloqueia só no client — se um 403 chegar, trata-o graciosamente.

## 6. Comportamento dos elementos por role

| Elemento | user | admin | anônimo |
|---|---|---|---|
| Top bar: avatar | nome | nome + ⭐ badge | não existe |
| Top bar: notificações | 🔔 (eventos) | 🔔 + alertas de admin | não existe |
| Busca global (`/`) | todos os apps + arquivos | idem | — |
| CTA "Ver tudo" (dashboard) | → /apps | → /apps | — |
| Card app → "Ações ▾" | abrir serviço | abrir + [Iniciar/Parar/Reiniciar] (G3 futuro) | — |
| Botão "Executar backup" | oculto | visível | — |
| Agenda/power | somente leitura | editar (dialog + confirmação) | — |
| "Verificar atualização" | visível (leitura) | visível + "Aplicar" | — |
| Footer "N apps · X up" | visível | visível | — |

## 7. Integração com fluxos

```
[navigation] → auth.md (login/boot)
             → dashboard.md (home, atalhos)
             → apps.md (listar/abrir)
             → storage.md (status de disco)
             → system.md (monitoramento)
             → admin.md (users/power/backup/update)
             → errors.md (401/403/offline globais)
```

## 8. Checklist de validação

- [ ] user vê 4 áreas, admin vê 5 (com Admin ⭐), anônimo só Login
- [ ] Mobile: bottom nav com ≤5 slots + `+`; Desktop: sidebar fixa com labels
- [ ] Navegação manual para `/admin` como user → redireciona `/` + toast (sem chamar API)
- [ ] 401 em qualquer resposta → logout limpo → `/login` + toast
- [ ] 403 real da API → toast + volta para `/`
- [ ] Offline → mantém última navegação, badge, rotas admin bloqueadas com tooltip
- [ ] Rota inexistente → página 404 com link "Voltar ao início" (não navegação quebrada)
