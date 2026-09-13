# Plano — App como superfície completa (zero terminal após instalar)

Data: 2026-09-13 · Estado: Sprint A CONCLUÍDO (2026-09-13, gate 8/8) — B/C pendentes
Objetivo: ninguém precisa abrir terminal para nada além da instalação.
Critérios: utilizável, prático, escalável, fácil de modificar (não "perfeito agora").

## 1. Mapa de funções do App (verificado por grep nas views + rotas)

### Views e rotas atuais
| Rota | Papel mín. | mobile | Funções expostas |
|---|---|---|---|
| #/dashboard | user | tab | widgets por papel, personalizar layout |
| #/apps | user | tab | start/stop/restart por serviço (inline) |
| #/files | user | sheet | FileBrowser embutido (iframe) |
| #/storage | user | tab | uso de disco; montar/desmontar/ejetar/formatar (admin-gated) |
| #/system | user | tab | checks, temperatura, backup, energia (editar), serviços, módulos, dispositivos |
| #/admin | admin | tab | usuários (criar/excluir/senha), tokens API, scheduler (enable/disable/run), update check/apply, módulos ops |
| #/print | admin | sheet | fila, imprimir arquivo, cancelar job |
| sheet "Mais" | — | — | perfil, tema, impressão, admin |

### Ações da API que já têm botão no App (cobertura escrita ✓)
services start/stop/restart/enable/disable · modules/:id/op · power PUT ·
backup POST · users POST/PUT(senha)/DELETE · tokens POST/DELETE ·
scheduler enable/disable/run · update POST/apply · devices mount/unmount/
eject/format · print upload + jobs DELETE.

### Funções do core (hs.sh) SEM equivalente no App  → vão para o backlog
| Comando terminal | Quem precisa | Risco se faltar |
|---|---|---|
| `user is-admin` / promover user→admin | admin humano | MÉDIO — criar admin hoje é só terminal |
| `module instance add/remove` | admin | BAIXO — módulo novo sem instância nomeada fica órfão |
| `system wol enable/status` | admin | BAIXO (config 1x, mas hoje é terminal) |
| `tls init/renew/status/info` | admin | BAIXO — renovável via timer |
| `automation list/run` | admin | BAIXO |
| `storage init` | instalação | NULO — pertence ao bootstrap, não ao uso |
| trocar a PRÓPRIA senha | **QUALQUER usuário** | **ALTO — hoje só admin troca senha de terceiros; usuário sem senha gerada travaria** |

### Vazamentos/casos abertos descobertos no mapeamento
1. **Usuário não troca a própria senha** (falta rota + dialog). Único fluxo de
   "usuário básico" que exige terminal ou depender de admin. → prioridade 1.
2. **`PUT /api/v1/users/:u` só muda senha** — não promove/demove admin.
   O incidente `hs.sh user password` x Quantum: o sync existe no core
   (`filebrowser_user_id`), mas a verificação ponta-a-ponta após troca via App
   nunca foi testada → precisa de teste no sprint, não de suposição.
3. **3 rotas GET mortas** confirmadas na revisão (system, hardware/cpu,
   storage/status) + README perpetuando uma delas.
4. `/srv/scripts` ainda hospeda 3 jobs do scheduler com um divergente
   (power-schedule.sh) — drift que o App não pode consertar, é deploy.
5. Admin não vê **log/detalhe de falha** de tarefa do scheduler nem de
   serviço parado (só status). Terminal continua sendo o funnel de debug.

## 2. Princípios do desenho (fácil de modificar > completo)

- **Uma fonte por capacidade**: cada função vive em `core → adapter → route → view`
  com o MESMO nome de domínio. Nada de rota que a UI não chama.
- **UI declarativa por papel**: o que falta deve reusar o padrão existente
  (feedRow/button/ops-pop de admin.js), não criar componente novo.
- **Instalação continua sendo terminal** — tudo antes do primeiro boot fica
  no bootstrap; nada de "app de setup".
- **Sem feature nova se um campo resolve** (ex.: promover admin = checkbox no
  user-edit dialog, não tela nova).

## 3. Sprints (cada um entrega utilizável isoladamente)

### Sprint A — "conta" (fecha o único furo do usuário básico)  ~pequeno
A1. `POST /api/v1/auth/change-password` (self, com senha atual) → core
    `hs_user_password` do próprio usuário (reusa sync Quantum já existente).
A2. Dialog "Senha" no sheet do perfil (mesmo openPasswordDialog, com campo
    "senha atual"). 
A3. Teste: troca pelo App → login App → login Quantum (prova o sync ponta-a-ponta).
Gate de conclusão: usuário comum criado no terminal loga, troca senha e usa o
App inteiro sem pedir admin.

### Sprint B — admin sem terminal  ~médio
B1. Check "Administrador" no dialog de usuário (novo `PUT users/:u` campo
    `admin` → core `user mod-admin`).
B2. Bloco "Instâncias" por módulo no admin.js (add/remove com nome).
B3. Detalhe de scheduler: próximo disparo + último status/exit code por tarefa
    (GET existe; enrich do JSON core) → substitui `journalctl` de rotina.
Gate: promover admin, criar instância e diagnosticar tarefa falha sem SSH.

### Sprint C — limpeza estrutural (o "sem buraco" da revisão anterior)  ~pequeno
C1. Padronizar scheduler: 100% `/srv/git/homeserver/scripts/*`; remover cópias
    órfãs de `/srv/scripts` (backup.sh, power-schedule.sh antigo).
C2. Remover as 3 rotas mortas + linha do README (cortar vazamento).
C3. CI: teste e2e que navega as rotas do App (Puppeteer já existe em tmp/)
    vira `api/tests/ui-routes.test.ts` com o container — evita regressão de
    "function exists but UI broken" (o bug do app-name provou que isso escapa).
Gate: `git grep` de rota sem consumer = 0; deploy = 1 caminho.

### Sprint D — conveniência (só se doer depois de A-C)
D1. WoL e TLS no admin (leitura status + ações pontuais).
D2. Logs de eventos por usuário na timeline (o /events já expõe).
D3. "Ejetar com segurança" como ação primária no card do dispositivo.

## 4. O que NÃO fazer (decisão explícita)
- Refactor do store para módulos ES com bundler — o padrão globals atual está
  documentado e sem duplicações; trocar isso é risco sem ganho de usuário.
- Gráfico de tendência/histórico — precisa daemon de coleta; escalável depois.
- App de instalação — terminal continua sendo o bootstrap (decisão do projeto).
- Reescrever portal com componentes do App — customapi cobre; poluição maior.

## 5. Riscos conhecidos anotados
- Sync App→Quantum da senha: mecanismo existe (core users.sh), mas prova
  ponta-a-ponta é o A3; se falhar, é bug do incidente antigo e vira A4.
- Puppeteer no CI no container api: memória OK hoje (1.5G livres), mas rodar
  Chromium em CI pode estourar o worker — validar no C3, senão deixar e2e
  local-only com script documentado.
- Toda feature nova de escrita deve nascer com `preHandler` admin/user
  correto (padrão atual) — revisões futuras devem grep por "route sem guard".