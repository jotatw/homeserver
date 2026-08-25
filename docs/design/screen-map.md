# Mapa de Telas — HomeServer App (`/app`)

> Inventário real (código) + função de cada tela, fluxos e diagnóstico de redundâncias.
> Fonte da verdade: `api/app/js/app.js` + `api/app/js/dashboard-widgets.js`.
> Metodologia: skill `open-design`.

## Visão geral

| Rota | Título | Papel | Desktop | Mobile | Função principal |
|---|---|---|---|---|---|
| `dashboard` | Meu espaço | user | ✅ | ✅ | Painel pessoal com widgets configuráveis |
| `apps` | Aplicações | user | ✅ | ✅ | Catálogo dos serviços com busca/filtros e status |
| `storage` | Armazenamento | user | ✅ | ✅ | Disco, pastas, dispositivos USB/SD e atalho aos arquivos |
| `system` | Sistema | user | ✅ | ✅ | Saúde do servidor: CPU/mem/disco/uptime + checks |
| `admin` | Administração | admin | ✅ | ✅ | Usuários, tokens, módulos, serviços, atualizações |
| `print` | Impressão | admin | ✅ | ❌ | Impressão de texto/arquivos e fila |

**Login** (`login.html`, fora do shell) — autenticação única; sessão de 30/90 dias.

---

## 1. Dashboard — "Meu espaço"

**Objetivo**: ver num relance o que importa para *mim* e agir rápido.

**Widgets registrados** (10):

| Widget | Papel min. | Removível | Mostra |
|---|---|---|---|
| server-status | user | não | CPU, memória, disco, uptime |
| quick-actions | user | sim | Atalhos às áreas principais |
| activity-feed | user | sim | Últimas atividades do sistema |
| services-status | admin | sim | Serviços + controle rápido |
| modules-status | admin | sim | Módulos instalados |
| storage-overview | admin | sim | Uso de disco e pastas |
| system-health | admin | modo admin | Temperatura, discos |
| backup-status | admin | sim | Último backup |
| my-files | user | sim | Atalho ao FileBrowser |
| my-storage | user | sim | Uso pessoal de disco |

**Ações**: editar layout (modo edição), adicionar/remover widgets.
**Estados**: skeletons no carregamento.

### Diagnóstico
- ⚠️ **Duplica Sistema**: server-status ≈ gauges de Sistema; services-status ≈ checks de Sistema; storage-overview ≈ Armazenamento; system-health = hardware de Sistema.
- ⚠️ **Duplica Aplicações**: os cards de aplicação aparecem aqui e em Aplicações.
- ✔️ É a tela certa para personalização por papel (user vê "meu espaço", admin vê operação).

---

## 2. Aplicações

**Objetivo**: encontrar um serviço e abri-lo; ver o que está no ar.

**Conteúdo**: grid de cards (APP_MAP: homepage, api/app, files, gitea, caddy, portainer), busca textual, chips de filtro (Todos / Ativos / Offline), badge de status por serviço, botão abrir.

**Ações**: buscar, filtrar, abrir serviço em nova aba.

### Diagnóstico
- ⚠️ **APP_MAP é estático**, mas o card mostra status dinâmico da API — serviços que existem na API mas não no APP_MAP ficam sem título/ícone (já corrigimos `files`; risco para módulos futuros).
- ⚠️ Cards de apps **sem link** (`caddy`, `portainer` com host vazio) ainda ocupam espaço como se fossem clicáveis.
- ✔️ Busca + filtros são bons diferenciais vs Dashboard.

---

## 3. Armazenamento

**Objetivo**: entender o uso do disco, gerenciar USB/SD e chegar aos arquivos.

**Conteúdo**: 4 statCards do disco principal (%, usado, disponível, total); raiz de dados; 5 pastas (usuários/compartilhado/mídia/documentos/dispositivos); seção Dispositivos (descoberta automática, montar/ejetar 1 clique, diálogo avançado); link "Abrir Arquivos".

**Ações**: montar/ejetar dispositivo, abrir FileBrowser.

### Diagnóstico
- ⚠️ Disco aparece **3×** no App: aqui (4 cards), em Sistema (gauge) e no widget storage-overview.
- ⚠️ Pastas exibem apenas contagem de itens — pouco útil; poderia mostrar tamanho.
- ✔️ Fluxo de dispositivos (descoberta → montar → ejetar) está bom e único nesta tela. ✔️

---

## 4. Sistema

**Objetivo**: saúde geral do servidor e ajustes técnicos (energia/hardware).

**Conteúdo**: gauges CPU/Memória/Disco/Uptime; checks de serviços; **admin-only**: energia (agenda desligar/ligar + diálogo) e hardware (temperatura/discos).

**Ações**: editar agenda de energia (admin).

### Diagnóstico
- ⚠️ Checks de serviços duplicam Aplicações (badges) e widget services-status.
- ✔️ Energia e hardware moram bem aqui (contexto técnico).

---

## 5. Administração

**Objetivo**: gerenciar o sistema como admin — tudo em uma página longa.

**Seções (nesta ordem)**:
1. **Usuários** (tabela + criar/senha/excluir)
2. **Tokens de API** (lista + criar/revogar)
3. **Módulos** (status + start/stop/restart/update/status)
4. **Serviços** (feed com controle)
5. **Atualização** (verificar/aplicar update do sistema)
6. **Pacotes apt** (check/apply)

**Diálogos**: novo usuário, senha, token, confirmação de exclusão.

### Diagnóstico
- 🔴 **Página muito longa** — 6 seções empilhadas exigem scroll infinito; difícil achar.
- 🔴 **Serviços duplicados**: seção Serviços aqui ≈ checks em Sistema ≈ widget services-status ≈ badges em Aplicações. **4 lugares diferentes mostram/gerenciam serviços.**
- ⚠️ Atualização do sistema + pacotes apt poderiam ser uma única seção "Atualizações".
- ✔️ Módulos com menu de operações secundárias ("mais") é um bom padrão.

---

## 6. Impressão

**Objetivo**: imprimir texto/arquivos e acompanhar fila.

**Conteúdo**: wizard em 3 cards (impressora+config → conteúdo → imprimir), fila de jobs com cancelar.

**Diagnóstico**
- ⚠️ Escondida no sheet "+ Mais" no mobile (`mobile: false`) — ok, impressão é caso raro.
- ⚡ Melhorias pontuais: preview antes de imprimir, feedback de job enfileirado mais claro.

---

## Diagnóstico consolidado — onde há repetição hoje

| Informação/Ação | Onde aparece hoje | Avaliação |
|---|---|---|
| **Status de serviços** | Aplicações (badge) · Sistema (checks) · Admin (seção) · Dashboard (widget admin) · Dashboard (activity-feed) | 🔴 **5 lugares** |
| **Controle start/stop/restart** | Admin (serviços) · Dashboard (widget admin) · Admin (módulos) | 🔴 **3 lugares** |
| **Disco/armazenamento** | Armazenamento (4 cards) · Sistema (gauge) · Dashboard (widgets ×2) | 🟡 4 lugares |
| **Módulos** | Admin (seção) · Dashboard (widget admin) | 🟡 2 lugares |
| **Energia** | Sistema (admin) | ✔️ 1 lugar |
| **Usuários/Tokens** | Admin apenas | ✔️ 1 lugar |
| **Impressão** | Print apenas | ✔️ 1 lugar |
| **Atalhos/abrir apps** | Aplicações · Dashboard (quick-actions + my-files) | 🟡 2–3 lugares |

## Princípios propostos para eliminar repetição

1. **Uma casa por informação**: cada dado tem UMA tela canônica.
   - Status detalhado de serviços → **Aplicações** (é o catálogo natural).
   - Saúde técnica (CPU/temp/discos/energia) → **Sistema**.
   - Gestão (criar/trocar/revogar/atualizar) → **Administração**.
2. **Dashboard só referencia, nunca duplica**: widgets mostram resumo mínimo + link para a tela canônica (ex.: "Serviços: 3/4 no ar →" abre Aplicações).
3. **Administração em abas** em vez de página infinita: Usuários · Tokens · Módulos · Atualizações. Serviços saem daqui (vive em Aplicações).
4. **Sistema fica user-friendly**: checks simples para user; energia/hardware colapsados para admin.

## Fluxo-alvo (pós-refactor)

```mermaid
flowchart TD
  Login --> Dash[Meu espaço<br/>resumo pessoal]
  Dash -->|abrir serviço| Apps[Aplicações<br/>catálogo + status + controle]
  Dash -->|meus arquivos| Files[/files/ FileBrowser]
  Dash -->|uso pessoal| Storage[Armazenamento<br/>disco, pastas, dispositivos]
  Apps -->|admin: gerenciar conta/token| Admin[Administração<br/>abas: Usuários·Tokens·Módulos·Atualizações]
  Dash -->|saúde| System[Sistema<br/>CPU·temp·disco·energia]
  Dash -.->|raro, mobile no sheet| Print[Impressão]
```

## Plano de refactor sugerido (ordem)

1. **Abas no Admin** (maior ganho de usabilidade, menor risco) — dividir as 6 seções em 4 abas: Usuários · Tokens · Módulos · Atualizações (funde update+sistema/apt). Seção Serviços sai (canônico em Aplicações).
2. **Widgets do Dashboard viram resumos com link** — server-status mantém (resumo pessoal ok), services/modules/storage viram "mini-status + →", sem controles duplicados.
3. **APP_MAP dinâmico** — derivar título/ícone do catálogo de módulos/serviços da API (acaba o risco de card sem nome).
4. **Armazenamento**: substituir contagem de itens das pastas por tamanho (API já tem `total_size_human`; falta por pasta).
5. **Sistema**: checks viram linha compacta "Serviços: 3/4 no ar → Aplicações" (detalhe vive em Aplicações).

## Próximos passos
- [x] Validar plano com usuário (este doc)
- [x] Protótipo HTML das abas do Admin (validado antes de codificar)
- [x] Implementar item 1 (abas no Admin — commit `ec8ce24`)
- [x] Implementar item 2 (widgets-resumo com link — commit `e120af6`)
- [x] Polling centralizado + pausa em aba oculta (`store.js` — commit `e62da7b`)
- [x] Reordenação de widgets por botões ↑↓ touch/acessível (`f19aaae`)
- [x] Modo compacto de densidade persistido (`5e9844b`)
- [x] APP_MAP dinâmico via `getAppMeta` (`cab757a`)

## Melhorias futuras (backlog, sem data)
- [ ] Armazenamento: tamanho real por pasta na API (hoje só contagem/total)
- [ ] Sistema: checks viram linha compacta "Serviços: 3/4 no ar → Aplicações"
