# Fluxo 7 — Administração

> Tela: `../wireframes/admin.md` · API: `/users*`, `/backup`, `/update`, `/power` (todos admin-only)
> Refs: `../references.md` §2 (data tables, dialogs, toasts)
> Este fluxo descreve as operações de administração implementáveis na v1.5.

## 1. Operações e endpoints (reais, v1.5)

| Operação | Endpoint | Payload/comportamento | Duração |
|---|---|---|---|
| Listar usuários | `GET /users` | `user list` → array (schema FileBrowser: id, username, scope, perm...) | rápida |
| Criar usuário | `POST /users` body `{username, password?, email?, gitea?}` | `hs user create` → 201 | rápida |
| Trocar senha | `PUT /users/:username` body `{password}` | `hs user password` | rápida |
| Remover usuário | `DELETE /users/:username?folder=1` | `hs user rm [--remove-folder]` | rápida |
| Executar backup | `POST /backup` | roda `backup.sh` em container privilegiado | **lenta (até 300s)** |
| Verificar atualização | `GET /update` | `{current, latest, update}` | rede (pode demorar) |
| Aplicar atualização | `POST /update` body `{noRedeploy?}` | `hs update apply` → JSON | **lenta (redeploy)** |
| Agenda de energia | `GET|PUT /power` | `{shutdown, wake, enabled}` | rápida |

> **Atenção**: backup e update são **síncronos** na API v1.5 — o request fica aberto até concluir. A UI precisa de estado "em andamento" com proteção contra duplo clique (ver §5).

## 2. Seções da tela (admin)

```
[rota /admin]  (guarda: só admin — ver navigation.md §5)

├─ 1. Usuários  (GET /users)
│     data table: username · admin (is-admin) · ações [senha] [excluir]
│     [ + Novo usuário ] → dialog
│
├─ 2. Manutenção
│     [ 💾 Executar backup agora ]   → POST /backup
│     [ ⬆️ Verificar atualização ]   → GET /update → dialog resultado
│     [ Aplicar atualização ]        → POST /update (só se update=true)
│
└─ 3. Energia (agenda)  (GET /power)
      shutdown HH:MM · wake HH:MM · [Editar] → dialog PUT /power
```

## 3. Fluxo: criar usuário

```
[+ Novo usuário] → dialog (username obrigatório · senha · e-mail · criar no Gitea?)
     │
     ├─ validação client: username ≥3 chars, sem espaços
     ├─ POST /users {username, password?, email?, gitea?}
     │     ├─ 201 → toast sucesso → reload da tabela
     │     └─ 400/500 → erro inline no dialog (não fecha)
     └─ botão "Criar" com spinner; bloqueado enquanto em andamento
```

- Campo **"criar no Gitea"** (checkbox) reflete `--gitea` da API.
- Não expor switch de admin (a API não promove admin — nota do wireframe).

## 4. Fluxo: excluir usuário

```
[excluir] → dialog de confirmação (ref §3 destrutiva)
     "Remover 'fulano'?"
     [ ] também remover pasta de arquivos (danger)   ← DELETE ?folder=1
     [ Cancelar ] [ Excluir (vermelho) ]
     → DELETE /users/:username → toast → reload
```

- Checkbox "remover pasta" é **destrutivo irreversível** — padrão default **desmarcado** + aviso em vermelho.

## 5. Fluxo: backup e atualização (operações longas)

### Backup
```
[💾 Executar backup] → confirm dialog ("pode levar alguns minutos")
     → POST /backup (request aberto)
        ├─ estado "Backup em andamento…" (spinner + desabilitar botão)
        ├─ sucesso {ok:true} → toast verde
        └─ erro (timeout/500) → toast vermelho + botão reativo
```
- **Proteção**: botão desabilitado enquanto em andamento; não fechar/reabrir em duplo clique.
- Ideal futuro: endpoint async com progresso (backlog) — hoje é síncrono.

### Atualização
```
[⬆️ Verificar] → GET /update
     ├─ update=false → toast "Você está atualizado (v1.5.0)"
     └─ update=true  → dialog:
          "Nova versão disponível: X (atual: Y)"
          [ Aplicar ] (danger-ish) / [Agora não]
     [Aplicar] → POST /update → spinner longo ("Reiniciando serviços…")
          → sucesso: toast + revalidar versão
          → note: redeploy pode derrubar a sessão (o App volta ao login; aceitável)
```

## 6. Fluxo: agenda de energia

```
[Editar] → dialog (HH:MM)
     shutdown: [22:00]   wake: [07:00]
     ( ) agendado   ( ) desativado
     [ Salvar ] → PUT /power {shutdown, wake, enabled}
        ├─ 200 → toast "Agenda salva" → refresh
        └─ 400 → erro inline (validação HH:MM)
```
- Sempre avisar o impacto: "O servidor desligará às 22:00 e religará às 07:00".
- Desativar agenda usa `{enabled:false}`.

## 7. Estados e erros

| Estado | Comportamento |
|---|---|
| user tenta /admin | Redireciona `/` + toast (guarda) · 403 real → mesma UX |
| Backup em andamento | Botão desabilitado + spinner; sem navegação bloqueada |
| Update aplicando | Modal "Aplicando atualização…" + aviso de possível desconexão |
| 401 durante operação longa | Intercepta → logout → login (sessão expirada) |
| Erro validação | Inline no campo do dialog (nunca só toast) |

## 8. Checklist de validação

- [ ] Só admin acessa /admin (guarda + 403 tratado)
- [ ] CRUD de usuários com dialogs; excluir tem confirmação + checkbox de pasta (default off)
- [ ] Backup/update síncronos: estados longos com proteção anti duplo clique
- [ ] Agenda power com validação HH:MM e aviso de impacto
- [ ] Erros inline nos dialogs; toasts para sucesso/erro global
