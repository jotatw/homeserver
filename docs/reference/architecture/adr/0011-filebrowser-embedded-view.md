# ADR-0011 — FileBrowser embutido como tela própria do App (iframe same-origin)

## Status

Aceito

## Data

2026-09-13

## Contexto

A auditoria UI/UX de 2026-09-13 pediu "uma tela do FileBrowser" dentro do
App, sem poluir a interface nem encarecer o servidor. As opções reais:

1. **Nova aba externa** (estado anterior): o usuário sai do App, perde o
   contexto, e o FileBrowser abre cru.
2. **Reimplementar a UI de arquivos na API do Quantum** (`/api/resources`):
   controle total do visual, mas cada tela nova (upload, editor, compartilhamento)
   vira trabalho eterno e a API do Quantum tem contratos próprios não triviais.
3. **iframe same-origin** apontando para `/files/` (via Caddy): zero custo de
   servidor, o FileBrowser roda com a sessão própria dele, e o App ganha uma
   "janela" com toolbar mínima.

Verificações que habilitam a opção 3:

- O Caddy não envia `X-Frame-Options` nem CSP com `frame-ancestors` em
  `/files/*` — o embed não é bloqueado (confirmado por `curl -I` no
  `homeserver.local/files/`).
- Mesma origem (`homeserver.local`) → sem restrições de CORS/cross-origin para
  o frame em si; nenhum cookie ou token é compartilhado entre App e
  FileBrowser — cada um autentica do seu lado.
- Custo no servidor: o frame carrega o bundle estático do Quantum (uma vez por
  sessão do usuário no browser dele). O App não adiciona polling nem endpoint.

## Decisão

Nova view `#/files` (arquivo `api/app/js/views/files.js`) renderizando:

- toolbar da tela: legenda do destino (`FileBrowser — /srv/storage`),
  "Recarregar" (reset do `src`) e "Nova aba" (escape hatch — nunca esconder a
  saída da janela embutida);
- iframe `src="/files/"` com altura ajustada ao viewport restante (guard
  remove o listener de resize ao trocar de view).

Navegação: `files` entra na sidebar desktop entre Aplicações e Armazenamento,
e no sheet "Mais" no mobile — a bottom-nav fica em ≤5 destinos + "Mais"
(regra do screen-map; `mobile: false`). Os atalhos "Arquivos" (quick-actions
e my-files do dashboard) passam a apontar para `#/files` — uma entrada por
destino por contexto.

O ícone da view Armazenamento mudou `folder → harddrive` para eliminar a
colisão apontada na auditoria (mesmo glifo em navegação e em card).

## Consequências

- Positivas: tarefa central (ver/gerenciar arquivos) a um clique sem sair do
  App; zero carga extra no servidor; o Quantum continua sendo a autoridade de
  arquivos (o App não re-implementa — ADR-0008: interface consome, não
  reimplementa).
- Negativas/aceitas: o login do Quantum acontece dentro do frame (primeira
  vez pedida ali, não no App); o tema do frame é o do Quantum, não o do App
  (escuridão parecida por coincidência de paleta); deep-links internos do
  FileBrowser não aparecem na URL do App (o frame gerencia o próprio hash).
- O embed não usa as APIs do portal/anônimo do Caddy — nada de token novo.
