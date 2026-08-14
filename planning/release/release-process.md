# Release Process

> Processo permanente de lançamento do HomeServer — aplicado a **toda versão**
> (v2.0, v2.1, v3.0...). Complementa o Quality Gate (`planning/quality/`) e a
> Auditoria de Instalação (`planning/quality/audit-installation.md`).
>
> O Quality Gate valida o **código**; este processo valida o **lançamento**.

## Pergunta central

> A versão está pronta quando um usuário consegue **instalar em uma máquina
> limpa**, utilizar as funcionalidades principais e compreender o sistema
> usando **apenas a documentação oficial** — sem consultar o código-fonte ou
> buscar ajuda externa.

## Etapas

### 0. Audits (sem escrever código)

**Release Audit**

| Check | Critério |
|---|---|
| Instalação | `install.sh` em servidor limpo → servidor funcional |
| Upgrade | versão anterior → atual via `hs update` |
| Reinicialização | reboot → tudo sobe sozinho (`restart: unless-stopped`) |
| Logs | sem erros |
| Docker | sem restart loop |
| Homepage | abre imediatamente |

**Compatibility Audit**

| Navegador | Estado |
|---|---|
| Chrome | testado |
| Firefox | testado |
| Edge | testado |
| Mobile | testado |
| Safari | registrar (não obrigatório) |

### 1. PWA (quando aplicável à versão)

- `manifest.json` válido (name, icons 192/512, start_url, display).
- Service worker mínimo (fetch pass-through) — instalação + base para offline.
- Validação Lighthouse (pelo menos 1 execução).
- Teste: instalar → fechar → abrir → continua logado.

### 2. Polling / dados em tempo real (quando aplicável)

- Intervalo conservador (ex.: 30s) + refresh ao focar a aba.
- **Sem polling duplicado** (single timer, limpo ao navegar).

### 3. Contrato App ↔ API

- Mapa de views → endpoints documentado (`api/README.md`).
- Regra: **toda comunicação entre App e HomeServer ocorre exclusivamente
  através da API oficial** — o App é apenas mais um cliente.

### 4. Versão

- `api/package.json` alinhado à release (`hs version` vem do git tag).

### 5. Acceptance Tests

Matriz com `PASS | Tempo | Observações` (vira histórico):

| Item | PASS | Tempo | Observações |
|---|---|---|---|
| Login | | | |
| Dashboard | | | |
| Arquivos | | | |
| Usuários | | | |
| Energia | | | |
| Serviços | | | |
| Logout | | | |
| Tema | | | |
| Mobile | | | |

Cenários:

1. **Instalação limpa** — Debian → clone → `install.sh` → homepage (sem abrir docs).
2. **Administrador** — login → criar usuário → login do usuário → arquivos → logout.
3. **Upgrade** — versão anterior → atual.
4. **Reboot** — tudo continua funcionando.
5. **Zero Knowledge Test** — máquina limpa, apenas README/QUICKSTART/INSTALLATION:
   Instalou? Homepage? App? Criou usuário? Login? Entendeu o sistema?

### 6. Publish + Rollback

- Publicação via workflow (tags `v*`).
- **Plano B** (se a Action falhar) — publish manual:

```bash
# 1. autenticar no GHCR (precisa de PAT com scope packages:write)
echo "$GITHUB_TOKEN" | docker login ghcr.io -u <usuario> --password-stdin

# 2. build + push
docker build -t ghcr.io/usuario/homeserver/api:<tag> ./api
docker push ghcr.io/usuario/homeserver/api:<tag>
```

- **Rollback** (se a RC tiver problema):

```bash
# voltar o código para a versão anterior
git checkout <tag-anterior>   # ex.: v1.5.0

# reimplantar módulos + API
bash install.sh
```

### 7. Documentos de release

- CHANGELOG atualizado (com **Known Issues** quando houver).
- Checklist da versão (ex.: `planning/archive/release-v2.0/v2.0-checklist.md`) — tudo PASS → tag.
- Release notes (não técnicas, voltadas ao usuário).

### 8. Release Candidata

- **Freeze**: após a RC, apenas `fix`/`docs`/`test`/`ci` — nunca `feat`.
- Fluxo:
  - RC → bug → fix → **RC.2** (se necessário).
  - RC → tudo OK → **versão final**.

---

## Definition of Ready for Release

Critérios permanentes — ver `definition-of-ready-for-release.md`.

## Política de suporte

Status por versão — ver `planning/support/support-policy.md`.
