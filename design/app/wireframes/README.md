# Wireframes — HomeServer App (v2.0)

> Telas principais da v2.0, em ASCII (mobile-first + desktop).
> Cada wireframe documenta: objetivo, variantes mobile/desktop, estados e anotações de design.
> Refs cruzadas apontam para `../references.md`.

## Índice

| # | Tela | Arquivo | Status |
|---|---|---|---|
| 1 | **Login** — autenticação + sessão longa | `login.md` | Draft v1 |
| 2 | **Dashboard (Meu espaço)** — home com stats e atalhos | `dashboard.md` | Draft v1 |
| 3 | **Aplicações** — grid de serviços com status | `apps.md` | Draft v1 |
| 4 | **Armazenamento** — navegação de arquivos (FS) | `storage.md` | Draft v1 |
| 5 | **Sistema** — monitoramento/status page | `system.md` | Draft v1 |
| 6 | **Administração** — users/tokens/config (admin) | `admin.md` | Draft v1 |

## Convenções ASCII

| Símbolo | Significado |
|---|---|
| `▓` | Barra de progresso / elemento preenchido |
| `░` | Elemento vazio (progresso restante) |
| `🟢🟡🔴` | Estado: ok / degradado / falha (sempre acompanhado de texto) |
| `▾` | Menu dropdown |
| `⋯` / `⋯` | Menu de mais opções / handle de drag |
| `▸` | Link/navegação para frente |
| `###` no diálogo | Foco modal (dimmer implícito) |

## Regras dos wireframes

1. **Estado nunca só por cor** (ref §3): cor + ícone + rótulo textual.
2. **Mobile e desktop** sempre juntos (ref §3 NN/g): não é reescalar, é reorganizar.
3. Cada wireframe lista **Estados** (loading, erro, offline, sucesso) — obrigatório.
4. Todo componente citado deve ser especificado em `../components/`.
5. Navegação citada deve bater com `../navigation/`.

## Próximos passos

- [x] Drafts v1 das 6 telas
- [ ] Revisão de fluxos → `../flows/`
- [ ] Especificar componentes → `../components/`
- [ ] Navegação (tabs/sidebar/rotas) → `../navigation/`
- [ ] Tokens (cor/tipografia/spacing) → `../tokens/`
