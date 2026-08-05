# Fluxos — HomeServer App (v2.0)

> Visão geral das interfaces e comportamento por tipo de usuário.
> Este documento **descreve o sistema real** (endpoints da API v1.5) — é a fonte de verdade para os fluxos.
> Refs cruzadas para `../references.md` e `../wireframes/`.

## 1. Roles reais do sistema

Levantado da API (`api/src/plugins/auth.ts`, `api/src/routes/*`):

| Role | Como autentica | O que vê/faz |
|---|---|---|
| **anônimo** | sem token | Somente `POST /auth/login`, `GET /version`, `/app*` |
| **user** (logado) | Bearer token de sessão | Leitura de status: `system`, `status`, `services`, `storage`, `devices`, `events`; logout |
| **admin** | Bearer token + `hs user is-admin` | Tudo do user + `users*`, `power`, `backup`, `hardware`, `update` |
| **service** (interno) | `HS_SERVICE_TOKEN` (ex: homepage) | Acesso de leitura amplo; **não** é admin (403 em rotas admin) |

> ⚠️ Correção vs `../wireframes/admin.md`: **não existe role "VIEW"**. O wireframe será revisado (todo).

## 2. Matriz de permissões por rota (real, v1.5)

| Endpoint | anônimo | user | admin | service |
|---|---|---|---|---|
| `POST /api/v1/auth/login` | ✅ | — | — | — |
| `POST /api/v1/auth/logout` | ❌ | ✅ | ✅ | ✅ |
| `GET /api/v1/auth/session` | ❌ | ✅ | ✅ | ✅ |
| `GET /api/v1/version` | ✅ | ✅ | ✅ | ✅ |
| `GET /api/v1/status` | ❌ | ✅ | ✅ | ✅ |
| `GET /api/v1/system` | ❌ | ✅ | ✅ | ✅ |
| `GET /api/v1/services` / `services/status` | ❌ | ✅ | ✅ | ✅ |
| `GET /api/v1/storage` / `storage/status` | ❌ | ✅ | ✅ | ✅ |
| `GET /api/v1/devices` | ❌ | ✅ | ✅ | ✅ |
| `GET /api/v1/events` | ❌ | ✅ | ✅ | ✅ |
| `GET/POST/PUT/DELETE /api/v1/users*` | ❌ | ❌ | ✅ | ❌ (403) |
| `GET/PUT /api/v1/power` | ❌ | ❌ | ✅ | ❌ |
| `POST /api/v1/backup` | ❌ | ❌ | ✅ | ❌ |
| `GET /api/v1/hardware` | ❌ | ❌ | ✅ | ❌ |
| `GET/POST /api/v1/update` | ❌ | ❌ | ✅ | ❌ |

## 3. Mapa de telas × roles

```
                          anônimo   user    admin
  Login                    ✅        —       —
  Dashboard (Meu espaço)   —         ✅      ✅
  Aplicações               —         ✅      ✅
  Armazenamento            —         ✅      ✅
  Sistema                  —         ✅      ✅
  Administração            —         ❌      ✅
```

- **user** vê 4 áreas: Meu espaço, Aplicações, Armazenamento, Sistema.
- **admin** vê as mesmas 4 + **Administração**.
- **anônimo** só vê Login (e o `/app` legado da v1.x).
- **service** não tem UI própria — usado por integrações (homepage/widgets).

## 4. Elementos comuns e seu comportamento por role

| Elemento | anônimo | user | admin |
|---|---|---|---|
| Top bar (profile/notif) | não existe | avatar + nome | avatar + nome + badge admin ⭐ |
| Navegação (sidebar/bottom) | não existe | Home · Apps · Arq · Sist | + Admin |
| Stat cards | — | valores | valores (mesmos) |
| Card de app "Ações ▾" | — | abrir (target=_blank) | abrir + iniciar/parar/reiniciar via CLI |
| Botão backup | — | oculto | visível |
| Botão power (shutdown/wake) | — | oculto | visível (com confirmação) |
| Ações de update | — | "verificar" só | "verificar" + "aplicar" |
| Rotas admin por URL | — | redireciona p/ Home + toast 403 | acessa |

## 5. Fluxos (documentos)

| # | Fluxo | Arquivo | Status |
|---|---|---|---|
| 1 | **Autenticação** — login/sessão/logout/expiração | `auth.md` | Draft v1 |
| 2 | **Navegação por role** — montagem sidebar/bottom-nav + 401/403 | `navigation.md` | Draft v1 |
| 3 | **Meu espaço** — dashboard (status + atalhos) | `dashboard.md` | Draft v1 |
| 4 | **Aplicações** — listar/abrir apps | `apps.md` | Draft v1 |
| 5 | **Armazenamento** — status de disco (ver gap §6) | `storage.md` | pendente |
| 6 | **Sistema** — monitoramento + agenda | `system.md` | pendente |
| 7 | **Admin** — users, power, backup, update | `admin.md` | pendente |
| 8 | **Erros globais** — 401/403/offline/retry | `errors.md` | pendente |

## 6. Gaps descobertos (design vs sistema real)

| # | Gap | Detalhe | Impacto |
|---|---|---|---|
| G1 | **Storage é só status** | A API só expõe `GET /storage(+/status)` → retorna uso de disco. Não há listagem/navegação/upload de arquivos. | Wireframe `storage.md` descreve filebrowser — **não implementável hoje**; vira roteiro para a API ou é descartado na v2.0 |
| G2 | **Não existe role VIEW** | Só user/admin/service. | Corrigir `admin.md` |
| G3 | **Ações de app (start/stop)** | Não há endpoint; hoje via CLI `hs`. | Card "Ações ▾" de iniciar/parar fica para quando a API expor |
| G4 | **"Instalar aplicação"** | Sem endpoint. | Manter desabilitado (futuro) |

## 7. Próximos passos

- [x] Levantar API real e montar matriz de permissões
- [x] Fluxo 1: autenticação
- [x] Fluxo 2: navegação por role
- [x] Fluxo 3: Meu espaço (dashboard)
- [x] Fluxo 4: Aplicações
- [ ] Fluxos 5-8 (montar um por vez, validando com o usuário)
- [ ] Atualizar wireframes conforme descobertas (G1, G2)
