# Fluxo 7 — Administração

> Tela: `../wireframes/admin.md` · API: `/users*`, `/backup`, `/update`, `/power` (todos admin-only)
> Refs: `../references.md` §2 (data tables, dialogs, toasts)
> Este fluxo descreve operações administrativas planejadas para a interface.

## 1. Operações e endpoints

| Operação | Endpoint | Payload/comportamento | Duração |
|---|---|---|---|
| Listar usuários | `GET /users` | `user list` → array | rápida |
| Criar usuário | `POST /users` | cria usuário conforme contrato da API | rápida |
| Trocar senha | `PUT /users/:username` | atualiza credencial conforme contrato da API | rápida |
| Remover usuário | `DELETE /users/:username?folder=1` | remove usuário; pasta é opcional | rápida |
| Executar backup | `POST /backup` | operação de backup | **lenta** |
| Verificar atualização | `GET /update` | estado Git da instalação | rede |
| Aplicar atualização | `POST /update` | permitido apenas quando o estado for seguro | **lenta** |
| Agenda de energia | `GET|PUT /power` | configuração de desligamento e religamento | rápida |

> Backup e update podem permanecer síncronos enquanto a implementação atual não possuir processamento assíncrono com acompanhamento de progresso. A UI deve impedir dupla execução enquanto a operação estiver em andamento.

## 2. Seções da tela

```text
[rota /admin]  (somente admin)

├─ 1. Usuários  (GET /users)
│     data table: username · admin · ações [senha] [excluir]
│     [ + Novo usuário ] → dialog
│
├─ 2. Manutenção
│     [ Executar backup agora ]       → POST /backup
│     [ Verificar atualização ]       → GET /update → resultado
│     [ Aplicar atualização ]         → POST /update quando permitido
│
└─ 3. Energia (agenda)  (GET /power)
      shutdown HH:MM · wake HH:MM · [Editar] → dialog PUT /power
```

## 3. Fluxo: criar usuário

```text
[+ Novo usuário] → dialog
     │
     ├─ validação local dos campos necessários
     ├─ POST /users
     │     ├─ sucesso → atualizar tabela
     │     └─ erro → informar no dialog
     └─ botão bloqueado enquanto em andamento
```

Não expor controles administrativos que não possuam suporte explícito no contrato da API.

## 4. Fluxo: excluir usuário

```text
[excluir] → confirmação
     "Remover este usuário?"
     [ ] também remover pasta de arquivos
     [ Cancelar ] [ Excluir ]
     → DELETE → atualizar tabela
```

A remoção da pasta é uma operação destrutiva e deve permanecer desmarcada por padrão.

## 5. Fluxo: backup e atualização

### Backup

```text
[Executar backup] → confirmação quando necessária
     → POST /backup
        ├─ operação em andamento → bloquear nova execução
        ├─ sucesso → informar resultado
        └─ erro → informar falha e liberar nova tentativa
```

### Atualização

```text
[Verificar] → GET /update
     ↓
status recebido
     │
     ├─ up_to_date
     │    → informar que a instalação já está atualizada
     │
     ├─ update_available
     │    → mostrar commits atual e destino
     │    → permitir [Aplicar atualização]
     │
     ├─ modified
     │    → informar alterações locais
     │    → não oferecer atualização automática
     │
     ├─ ahead
     │    → informar commits locais
     │    → não oferecer atualização automática
     │
     ├─ diverged
     │    → informar divergência de histórico
     │    → não oferecer atualização automática
     │
     └─ unavailable
          → informar indisponibilidade do destino remoto
          → permitir nova verificação
```

Quando `update_available`:

```text
[Aplicar atualização]
     ↓
confirmação
     ↓
POST /update
     ↓
spinner e bloqueio contra dupla execução
     ↓
resultado
     ├─ sucesso → mostrar commit atualizado e ponto de recuperação
     └─ erro → mostrar motivo sem assumir que a instalação foi alterada
```

A interface não deve chamar `POST /update` para tentar resolver estados `modified`, `ahead` ou `diverged`. Esses casos exigem avaliação ou recuperação apropriada fora do fluxo automático.

A atualização atualiza o código por fast-forward seguro. A interface não deve prometer redeploy, reinício de serviços ou rollback completo após a operação.

## 6. Fluxo: agenda de energia

```text
[Editar] → dialog (HH:MM)
     shutdown: [22:00]   wake: [07:00]
     agendado / desativado
     [ Salvar ]
        ├─ sucesso → atualizar estado
        └─ erro → informar validação
```

Sempre informar o impacto da agenda antes de salvar.

## 7. Estados e erros

| Estado | Comportamento |
|---|---|
| acesso sem permissão | bloquear acesso e tratar resposta de autorização |
| backup em andamento | bloquear nova execução |
| update aplicando | mostrar progresso indeterminado e impedir dupla execução |
| `modified` / `ahead` / `diverged` | não oferecer atualização automática |
| `unavailable` | informar falha de consulta e permitir nova tentativa |
| erro de validação | informar próximo ao campo ou operação correspondente |

## 8. Checklist de validação

- [ ] Operações administrativas protegidas por autorização
- [ ] CRUD de usuários com confirmação para remoções destrutivas
- [ ] Backup e update impedem dupla execução
- [ ] Cada estado de atualização possui comportamento próprio
- [ ] `update_available` é o único estado que oferece aplicação automática
- [ ] A UI não promete redeploy ou rollback completo
- [ ] Agenda de energia valida horários e informa impacto
