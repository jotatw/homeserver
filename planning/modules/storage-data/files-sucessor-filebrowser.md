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
   trocar a implementation do módulo de arquivos na porta 8080,
   manter Caddy `/files` inalterado;
5. registrar evidências e encerrar o aceite final do piloto FileBrowser
   (troca de implementation sem alterar Definition/consumidores).

Critérios de aceite da validação:

- [ ] RAM medida em repouso ≤ 300 MB no ambiente real;
- [ ] ciclo completo de usuário via Core (criar → logar → remover);
- [ ] escopos isolados por usuário funcionando;
- [ ] upload/download com arquivo > 1 GB;
- [ ] Caddy servindo `/files` através do novo serviço;
- [ ] rollback para o FileBrowser atual documentado e testado.


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
- [ ] ciclo completo de usuário via Core (criar → logar → remover) —
      exige adaptar o adapter para Bearer + novos endpoints;
- [ ] escopos isolados por usuário funcionando;
- [ ] upload/download com arquivo > 1 GB;
- [ ] Caddy servindo `/files` através do novo serviço;
- [ ] rollback para o FileBrowser atual documentado e testado.

Container de teste permanece disponível para avaliação manual da UI:
`http://192.168.0.10:8081` (admin / TesteQ2026) — sem restart
automático; não afeta o FileBrowser atual.
