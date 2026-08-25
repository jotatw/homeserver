# Files — Avaliação de Sucessor do FileBrowser

> Registro da avaliação de alternativas para substituir o FileBrowser
> (EOL/arquivamento em 2026-09-01). Documenta as opções consideradas,
> critérios, comparação e a decisão — com o racional para consultas futuras.

**Data:** 2026-08-23
**Status:** Decisão registrada; validação prática em andamento.
**Relacionados:** [`../../security/filebrowser-eol.md`](../../security/filebrowser-eol.md) · [`piloto-filebrowser.md`](../piloto-filebrowser.md)

## Contexto e restrições

O FileBrowser original entrou em **maintenance mode** (sem novas features,
sem correções de segurança a partir do arquivamento em 2026-09-01).
O HomeServer o utiliza como fronteira da capacidade `files.access` /
`files.manage`: gestão de usuários com escopo por pasta (`/users/<nome>`),
upload/download, compartilhamento e previews.

Restrições do ambiente:

- hardware modesto (MSI ~2010, 2.7 GB RAM — hoje o FileBrowser usa ~35 MB);
- uso doméstico: 3 usuários, ~3 GB em `/srv/storage`;
- integração existente: Caddy (`/files` → filebrowser:80), adapter do Core
  (`core/adapters/filebrowser.sh`) usado por `users.sh`, módulo M1 piloto;
- princípio do projeto: mínimo funcional com qualidade, simplicidade acima
  de recursos.

## Critérios de avaliação (em ordem de peso)

1. **Leveza** — RAM e imagem Docker pequenas (hardware limitado);
2. **Manutenção ativa** — projeto vivo, correções de segurança;
3. **Compatibilidade de migração** — modelo de usuários/escopos próximo ao
   atual, para migrar `users.sh`/adapter com o menor esforço;
4. **Segurança** — sem superfícies desnecessárias (ex.: terminal/shell);
5. **API programática** — o Core precisa criar/remover usuários via HTTP;
6. **Funcionalidades essenciais** — upload, preview, links de
   compartilhamento, multiusuário.

## Alternativas avaliadas

### FileBrowser Quantum (`gtstef/filebrowser`)

Fork ativo do próprio FileBrowser, criado quando o original desacelerou.
Mantenedor único e muito ativo (>50% do código do fork).

- **RAM:** mínimo documentado 256 MB (típico ~100–256 MB); índice SQLite
  cresce com o número de arquivos;
- **Imagem:** `stable-slim` ~15 MB (só navegação) ou `stable` ~60–180 MB
  (com FFmpeg/previews);
- **Manutenção:** muito ativa; sucessor de fato da comunidade;
- **Migração:** conceitos idênticos ao original (usuários com scope,
  permissões granulares, links) — fork do mesmo projeto;
- **Segurança:** execução de shell **removida** por decisão de segurança;
  2FA, OIDC, LDAP, JWT opcionais;
- **API:** REST documentada com Swagger e tokens de longa duração;
- **Riscos:** projeto jovem (releases estáveis recentes); índice consome
  memória proporcional ao volume indexado.

### Filestash

File manager web maduro, backend Go + frontend próprio.

- **RAM:** ~128 MB;
- **Imagem:** ~240 MB;
- **Manutenção:** ativa;
- **Migração:** UI e modelo próprios (conexões por protocolo: FTP, S3,
  WebDAV, SMB…) — mais flexível, porém diferente do FileBrowser;
- **Segurança:** ok;
- **API:** plugin/REST, menos orientada a administração de usuários locais;
- **Riscos:** modelo mental diferente (mais "conector de storages" do que
  "gestor de arquivos local"); migração de usuários/escopos exigiria mais
  trabalho no adapter.

### Cloud Commander

Gerenciador dual-panel (estilo Norton Commander) em Node.js.

- **RAM:** leve;
- **Imagem:** ~50 MB;
- **Manutenção:** moderada;
- **Migração:** multiusuário básico via config; sem links de
  compartilhamento; inclui **terminal web** (superfície de risco que o
  projeto evita);
- **API:** limitada;
- **Riscos:** terminal embutido contradiz o hardening do projeto;
  administração de usuários fraca para o caso de uso.

### FileGator

Gerenciador multiusuário baseado em PHP.

- **RAM:** requer runtime PHP;
- **Imagem:** `filegator/filegator`;
- **Manutenção:** moderada;
- **Migração:** roles por usuário, storage agnóstico (S3/Dropbox/FTP);
- **Segurança:** ok;
- **API:** limitada;
- **Riscos:** runtime PHP adicional no servidor; API insuficiente para o
  Core gerenciar usuários como fazemos hoje.

## Comparação resumida

| Critério | Quantum | Filestash | Cloud Cmd | FileGator |
|---|---|---|---|---|
| Leveza (RAM/imagem) | ✅ slim ~15MB img | ⚠️ 240MB img | ✅ | ⚠️ PHP |
| Manutenção ativa | ✅✅ | ✅ | ⚠️ | ⚠️ |
| Compatibilidade de migração | ✅✅ (fork) | ⚠️ | ❌ | ⚠️ |
| Segurança (sem shell) | ✅✅ | ✅ | ❌ terminal | ✅ |
| API p/ Core (usuários) | ✅✅ Swagger+tokens | ⚠️ | ❌ | ⚠️ |
| Features essenciais | ✅✅ | ✅ | ⚠️ | ✅ |

## Decisão

**Validar FileBrowser Quantum** (`gtstef/filebrowser:stable-slim`) como
sucessor do FileBrowser original.

Racional:

1. é o caminho de evolução natural da própria comunidade do FileBrowser
   (fork ativo após maintenance mode) — preserva o modelo de usuários,
   escopos e permissões que o HomeServer já usa;
2. menor custo total de migração entre as opções (adapter e `users.sh`
   mudam pouco; conceitos são os mesmos);
3. leve o suficiente para o hardware (tag slim; RAM típica compatível);
4. decisões de segurança alinhadas ao projeto (shell removido, 2FA/OIDC
   disponíveis se um dia houver SSO);
5. API documentada permite manter a automação de criação/remoção de
   usuários pelo Core.

Filestash fica registrado como **alternativa de reserva**, caso o Quantum
apresente problema bloqueante na validação prática.

## Validação prática (a executar)

Plano de baixo risco, aproveitando o piloto M1:

1. subir o Quantum em porta isolada (8081) montando `/srv/storage`,
   com os dados reais, sem tocar no FileBrowser atual;
2. validar: login, escopos por usuário, upload/download, preview,
   compartilhamento, consumo de RAM medido no ambiente real;
3. adaptar `core/adapters/filebrowser.sh` (ou novo adapter quantum) e
   validar criação/remoção de usuário pelo Core;
4. se aprovado: criar `modules/<sucessor>/module.json` + compose,
   trocar a implementation do módulo de arquivos na porta 8080;
   a decisão final foi **porta dedicada 8080** (rota `/files` do Caddy
   removida — o Quantum gera URLs absolutas que quebram atrás de subpath);
5. registrar evidências e encerrar o aceite final do piloto FileBrowser
   (troca de implementation sem alterar Definition/consumidores).

Critérios de aceite da validação:

- [x] RAM medida em repouso ≤ 300 MB no ambiente real (36,8 MiB);
- [x] ciclo completo de usuário via Core (criar → logar → remover);
- [x] escopos isolados por usuário funcionando;
- [x] upload/download com arquivo > 1 GB (1,5 GB validado 2026-08-25:
      integridade md5 OK, RAM pico ~51 MiB, upload 6,6 MB/s, download
      26,9 MB/s);
- [x] acesso via porta dedicada 8080 (substitui a rota `/files`, removida do Caddy);
- [x] **rollback para o FileBrowser original** documentado e testado (2026-08-25):
      `docker compose down modules/files` → `docker compose up modules/filebrowser`
      → container legado healthy + DB original preservado;
      `docker compose down modules/filebrowser` → `docker compose up modules/files`
      → Quantum healthy + login OK. As senhas do ambiente legado são as
      **pré-migração** (o DB legado permanece em `/srv/services/filebrowser/database/`).


## Evidência da validação prática (2026-08-23)

Ambiente: container `filebrowser-quantum-test` na porta 8081, imagem
`gtstef/filebrowser:stable-slim` (85,2 MB), montando `/srv/storage:ro`,
banco e cache em `/srv/services/filebrowser-quantum/`.

Resultados medidos:

| Item | Resultado |
|---|---|
| RAM em repouso | **36,8 MiB** (original: 35,5 MiB — paridade) |
| Imagem | 85,2 MB (stable-slim) |
| Boot + indexação do storage | < 5 s |
| Login via API (`/api/auth/login`) | ✅ JWT |
| Listagem de arquivos (`/api/resources`) | ✅ storage real |
| Gestão de usuários (`/api/users`, Bearer) | ✅ |

Descobertas técnicas importantes:

1. **Bug conhecido [#2317]**: montar um `config.yaml` com bloco `auth:`
   no primeiro boot quebra a criação da conta admin (401 mesmo com a
   senha correta). Solução: primeiro boot SEM config montado, senha via
   env `FILEBROWSER_ADMIN_PASSWORD`; config mínimo só com
   `server.port` e `server.sources`.
2. **Login**: `POST /api/auth/login?username=<u>&recaptcha=` com a senha
   no header `X-Password` (não vai no body).
3. **Token de API**: header `Authorization: Bearer <jwt>` — difere do
   original (`X-Auth`). O adapter do Core precisará usar Bearer.
4. **Endpoints mudaram** em relação ao original: `/api/users` mantém,
   mas listagem é `/api/resources?path=&source=Name`.

Critérios de aceite pendentes para decisão final de migração:

- [x] RAM medida em repouso ≤ 300 MB no ambiente real;
- [x] ciclo completo de usuário via API (criar → definir senha → logar → remover);
- [x] escopos isolados por usuário funcionando (acesso fora do scope negado);
- [x] acesso via porta dedicada 8080 (rota `/files` removida do Caddy);
- [ ] rollback para o FileBrowser atual documentado e testado.

**Aprovação do usuário (2026-08-23):** interface, usabilidade e
funções aprovadas na UI real (porta 8081). Migração autorizada.

> O container de teste (porta 8081) foi removido após a migração para
> produção na porta 8080 (2026-08-24).

## API de usuários do Quantum — mapeamento para o adapter (2026-08-23)

Diferenças em relação ao FileBrowser original, descobertas no ciclo
real de teste (criar → logar → escopo → remover):

| Operação | Original | Quantum |
|---|---|---|
| Login admin | POST /api/login {user,pass} | POST /api/auth/login?username=&recaptcha= + header X-Password |
| Token | X-Auth: <jwt> | Authorization: Bearer <jwt> |
| Criar usuário | POST /api/users (senha no body) | POST /api/users {what:user,which:[],data:{username,scopes,...}} — **sem senha** |
| Definir senha | incluído na criação | **PUT /api/users?id=N** {which:[password],data:{id,password}} (passo separado, obrigatório) |
| Remover usuário | DELETE /api/users/:id | DELETE /api/users?id=N (+ X-Password) |
| Confirmação admin | current_password no body | header X-Password |

Observações:

- criação exige confirmação X-Password do admin;
- a senha do usuário NÃO é aplicada na criação — requer o PUT de
  senha como segundo passo (o fluxo do users.sh será em 2 chamadas);
- escopos por usuário validados: acesso fora do scope retorna erro
  relativo à raiz do próprio usuário (sem vazamento);
- usuário comum autentica e opera apenas dentro do seu scope.

---

## Pendências registradas (2026-08-25)

Validado no ambiente real (Quality Gate no servidor, 2026-08-25):
Smoke 7/7, CLI 6/6, Session 19/19, API 31/31 — **ALL PASSED**. A
suíte CLI foi alinhada à estratégia de estado git (`hs version`
retorna o hash curto do commit, não mais `vX.Y.Z`).

Pendências honestas (não resolvidas, registradas para não mascarar):

- [x] **Instância do Module Core** (resolvida 2026-08-25): instância
      `files` registrada (`desired: enabled`), `module status files`
      refletindo o estado real (observed: healthy). Requisitos de
      fundo corrigidos: `service_directory` resolve módulos
      declarativos (`modules/<id>/`) com fallback legado; validação
      de dependências corrigida (herestring em vez de stdin vazio).
      NOPASSWD restrito configurado em `/etc/sudoers.d/hs-modules`
      para automação.
- [x] **Rollback para o FileBrowser original** documentado e testado
      (2026-08-25): `docker compose down modules/files` →
      `up modules/filebrowser` (legado healthy, DB preservado) →
      retorno ao Quantum (healthy, login OK). Senhas do legado são as
      pré-migração; DB legado permanece em
      `/srv/services/filebrowser/database/`.
- [x] **Upload/download com arquivo > 1 GB** validado no ambiente real
      (2026-08-25, 1,5 GB — detalhes na seção de critérios de aceite;
      exigiu corrigir o volume `:ro` e usar o formato de upload de corpo
      cru com `X-File-Total-Size`).
- [~] **Limpeza do módulo antigo `modules/filebrowser/` (EOL)** — módulo
      removido do repo e referências atualizadas (`services.conf`,
      install, testes) em 2026-08-25. Falta remover a instância antiga
      (`filebrowser`) no servidor via novo comando
      `hs module instance remove filebrowser`. Artefatos de rollback
      preservados fora do repo (`/srv/docker/compose/filebrowser/`).
