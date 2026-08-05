# Fluxo 8 — Erros globais

> Consolida o tratamento de erros de todos os fluxos (auth, navigation, dashboard, apps, storage, system, admin).
> Refs: `../references.md` §3 (Offline UX: informar estado, não só cor; skeletons)
> Fonte de verdade: resposta padronizada da API `{ok, data}` / `{ok:false, error}` (v1.5 Sprint 1).

## 1. Classificação de erros

| Classe | Código/sinal | Origem | Ação padrão |
|---|---|---|---|
| **AUTH** | 401 | token ausente/expirado/revogado | logout limpo → `/login` |
| **FORBIDDEN** | 403 | rota sem permissão | toast + volta para `/` |
| **NOT_FOUND** | 404 | rota/endpoint inexistente | página 404 (com navegação) |
| **VALIDATION** | 400 | body inválido | erro inline no campo |
| **SERVER** | 500 | exceção/CLI falhou | toast genérico + retry |
| **NETWORK** | fetch reject / timeout | sem rede, API down | modo offline (cache) + badge |
| **TIMEOUT_LONG** | req > 60s (backup/update) | operação longa | manter estado "em andamento" até resolução |

## 2. Camadas de tratamento

```
[UI]
   │
   ├─ 1. RESPOSTA OK  {ok:true, data}     → renderiza
   ├─ 2. ERRO API     {ok:false, error}   → decode status → classe
   ├─ 3. HTTP ERROR   !res.ok (ex: proxy) → decode status → classe
   ├─ 4. NETWORK      TypeError fetch     → NETWORK
   └─ 5. TIMEOUT      AbortController     → TIMEOUT_LONG (se op longa)
          │
          ▼
   [Central de erros (client, 1 lugar)]  → handler por classe
```

**Central de erros única** no App: intercepta todos os fetch (wrapper/axios-interceptor), classifica e aciona o handler adequado. Nenhum componente trata erro "na mão" sem passar por aqui.

## 3. Handlers por classe

| Classe | UI | Recuperação |
|---|---|---|
| AUTH (401) | Toast "Sessão expirada" → limpa token → `/login` | usuário reloga |
| FORBIDDEN (403) | Toast "Acesso restrito" | volta para `/` (se estiver em rota admin) |
| NOT_FOUND (404) | Página "Não encontrado" + link Voltar ao início | navegação continua |
| VALIDATION (400) | Mensagem do `error` no campo/contexto | usuário corrige |
| SERVER (500) | Toast "Algo deu errado: <mensagem>" + botão Tentar novamente | retry manual |
| NETWORK | Banner/toast "Sem conexão" + badge offline | auto-retry ao reconectar (ref §3) |
| TIMEOUT_LONG | Estado persistente "em andamento…" (não travar) | resolução ao fim; se falhar → toast |

## 4. Regras de UX (ref §3 Offline UX)

1. **Nunca só cor**: todo erro tem ícone + texto (a11y).
2. **Skeleton > spinner central**: loading é por bloco (dashboard, apps), nunca trava a tela.
3. **Falha parcial isola**: um card/aba com erro não derruba a Home (retry por bloco).
4. **Toast vs inline**: erros de contexto (formulário/dialog) → inline; erros globais → toast.
5. **Retry automático** ao voltar a rede; indicar "reconectando…".
6. **Erros silenciosos são proibidos**: `catch` sem feedback não existe no App.

## 5. Offline (PWA) — comportamento global

```
[NETWORK falha]
    │
    ├─ há cache do estado?  → mostrar dados + badge "offline · dados de <hora>"
    ├─ não → empty state específico por tela + "Tentar novamente"
    └─ reconecta (online event) → toast "Conectado de volta" → re-sync silencioso
```

- Escopo de cache por tela (documentado nos fluxos): status/snapshot da Home, lista de apps, último estado de storage, sparkline da sessão.
- Rotas admin em offline: **bloqueadas com tooltip** ("Operação requer conexão") — nunca deixar clicar e falhar cegamente.
- Escrita em offline (futuro Fase 2): fila de sync — hoje **não há escrita offline** (backup/update/users exigem conexão).

## 6. Matriz de erros por tela (referência rápida)

| Tela | Erros esperados | Ação principal |
|---|---|---|
| Login | 401 (neutro), NETWORK | toast / permanece no login |
| Home | 500 em `/status`, NETWORK | retry por card / cache + badge |
| Apps | 500 em `/services`, 404 | empty state + retry |
| Storage | 500 em `/storage`, NETWORK | retry por bloco / cache |
| System | 403 (nunca em user — oculto), 500 | seção oculta / retry |
| Admin | 403, 400, 401, TIMEOUT_LONG | guarda / inline / logout / estado longo |
| Global | 401 em qualquer req | logout → login |

## 7. Checklist de validação

- [ ] Um único ponto intercepta erros de rede/API (central de erros)
- [ ] 401 → logout limpo; 403 → toast + volta; 404 → página própria
- [ ] Validação inline nos dialogs; toast para erros globais
- [ ] Falha parcial isola blocos; skeleton no lugar de spinner central
- [ ] Offline usa cache + badge; rotas admin bloqueadas com tooltip
- [ ] Erro nunca sem feedback visual (cor + texto + ícone)
