# Fluxo 1 — Autenticação

> Telas: `../wireframes/login.md` · API: `POST /auth/login`, `GET /auth/session`, `POST /auth/logout`
> Refs: `../references.md` §3 (PWA: sessões longas, 2-cookie handoff)

## Diagrama principal (sucesso)

```
[App abre]
    │
    ▼
[Token local? (IndexedDB/secure cookie)]
    ├─ não → [Tela de Login]
    │           │  usuário+senha → POST /auth/login
    │           │     ├─ 200 {ok, data:{token,...}} → salva token → [Home]
    │           │     └─ 401 → toast "Usuário ou senha inválidos" (neutro)
    │           └─ Enter / autofocus usuário
    │
    └─ sim → [GET /auth/session com token]
               ├─ 200 → usuário válido → [Home]
               ├─ 401 (expirada) → limpa token → [Tela de Login] (com toast "sessão expirada")
               └─ rede falha → modo offline → usa dados em cache → [Home (cache)]
```

## Estados de sessão

| Estado | Como detecta | UI | Ação |
|---|---|---|---|
| Não logado | sem token | Login | — |
| Válida | session 200 | Home | — |
| Expirada | session 401 | Login + toast | limpar token |
| Invalida (revogada) | session 401 | Login + toast | limpar token |
| Offline (PWA) | fetch falha | Home com badge "offline · dados de <hora>" | cache local; re-sync ao voltar |
| Admin | session + role admin | badge ⭐ + aba Admin visível | — |

## Decisões de design

1. **Sessão longa** (ref §3): self-hosted em LAN → token de longa duração, sem logout por inatividade curto. Logout explícito via botão.
2. **Login offline (futuro)**: cache do último usuário logado no IndexedDB; permitir reentrada sem rede com aviso. (v2.0 fase 2 — depende do G-pendências)
3. **Segurança do erro**: mesmo toast p/ usuário inexistente ou senha errada (evita user enumeration).
4. **Token armazenado**: IndexedDB (não localStorage) + header `Authorization: Bearer`. Nunca em query string.
5. **Service token** não é usado pelo App — é para integrações (homepage). Se um token service tentar abrir o App, o App detecta e trata como não-admin (403 nas abas admin → oculta).

## Integração com navegação

```
[Login] --sucesso--> [Home] 
                        │
   role?                ▼
   ├─ user  → nav sem "Administração"
   └─ admin → nav com "Administração" ⭐
```

O App **não esconde rotas por client-side em segurança** (não confiar), mas por UX esconde o que o usuário não pode ver. A verdade é a API (403 retorna se tentar).

## Checklist de validação

- [ ] Login com usuário/senha corretos → Home
- [ ] Login com senha errada → toast neutro, permanece no Login
- [ ] Token expirado → volta ao Login com toast
- [ ] Token revogado (logout em outro device) → volta ao Login
- [ ] Logout → token removido → Login (não volta p/ Home em refresh)
- [ ] Admin logado → aba Administração visível
- [ ] user logado → aba Administração oculta; navegação manual → toast 403
- [ ] Offline → Home com dados em cache + badge
