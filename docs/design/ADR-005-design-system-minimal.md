# ADR-005: Design System Minimal unificado e organização das personalizações

## Status

Aceito

## Data

2026-09-06

## Contexto

O ecossistema HomeServer evolui para um aplicativo oficial (mobile + desktop)
que consome a API. Até então:

- o App usava uma paleta slate (`#0f172a`/blue-600) definida em
  `design/app/tokens/*.md` e implementada em `theme.css`;
- o portal (gethomepage) usava o tema padrão do projeto upstream;
- os mockups validados com o usuário (`tmp/mockup-homepage-tabs-v3.html`)
  estabeleceram uma linguagem visual dark minimalista (base Linear) com
  seletor de acento;
- as personalizações do usuário ficavam dispersas (localStorage no App,
  YAML no homepage) sem documento que definisse onde cada coisa vive.

## Decisão

1. **Linguagem visual única** para App, homepage e interfaces futuras:
   dark minimalista conforme especificação formal em `DESIGN.md`
   (raiz do repositório) — superfícies por luminância, bordas
   branco-translúcidas, texto nunca branco puro, um acento cromático
   por tema, estados semânticos como únicas outras cores.
2. **`DESIGN.md` é a especificação canônica** legível por máquina
   (formato google-labs-code/design.md, lintável com WCAG). As fontes
   de implementação permanecem: `design/app/tokens/*.md` → `theme.css`
   (App) e `modules/homepage/config/custom.css` (portal).
3. **Nomes de token estáveis**: os valores de `--hs-*` migram para a
   paleta v2, os nomes não mudam — componentes não são afetados.
4. **Acento como preferência do usuário** (preset violeta/azul/âmbar,
   violeta padrão), mapeado nos tokens A2/B-slot do contrato open-design.
5. **Organização das personalizações**:

| Personalização | Onde vive hoje | Persistência |
|---|---|---|
| Tema claro/escuro, densidade, acento | App — menu Aparência | `localStorage` (`hs_theme`, `hs_density`) |
| Widgets do dashboard (ordem, visibilidade) | App — modo edição do dashboard | `localStorage` (`hs_dashboard_config`) |
| Layout do portal (tabs, grupos, widgets) | Homepage — `services.yaml`/`settings.yaml` | Arquivo versionado no repo |
| Identidade visual do portal | Homepage — `custom.css` | Arquivo versionado no repo |

6. **Hermes Remote é complemento externo** e não aparece no portal;
   segue esta especificação como referência, com tema próprio.

## Consequências

+ Identidade consistente entre portal e App, base direta para o app
  mobile+desktop (não há duas linguagens para manter).
+ `DESIGN.md` permite validar contraste (WCAG) e exportar tokens
  (Tailwind/DTCG) quando o app ganhar build próprio.
- Migração visual do App exige revisão de contraste em todos os estados
  (feita via troca de valores em `theme.css`, sem mudança estrutural).
- Personalização por dispositivo (localStorage) não sincroniza entre
  dispositivos; sincronização via API (`/api/v1/prefs`) fica como
  evolução futura.

## Alternativas consideradas

- **Manter paleta slate do App** — rejeitada: manteria duas linguagens
  visuais (portal × App) exatamente o problema de retrabalho que se
  quer eliminar.
- **Framework de componentes (React/Vue) para o app** — rejeitado nesta
  fase: o App vanilla com design system de tokens atende; decisão de
  stack pertence a um ADR de arquitetura, não de design.
- **Tema Frutiger Aero como base** — rejeitado como base; registrado
  como tema experimental futuro (variante sobre os mesmos tokens).
