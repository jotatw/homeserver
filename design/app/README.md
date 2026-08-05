# design/app — HomeServer App (v2.0)

> Branch: `app-design` · Sem código · Fase de design/protótipo.
> A v2.0 será o HomeServer App: portal unificado do servidor (dashboards, storage, users, status) acessível de qualquer dispositivo.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `references/` → arquivo `references.md` | Referências coletadas na internet (dashboards, design systems, PWA) |
| `wireframes/` | Wireframes de telas (texto/ASCII ou imagens) |
| `components/` | Especificação de componentes (cards, badges, toasts, dialogs, tables...) |
| `navigation/` | Arquitetura de navegação (bottom tabs mobile, sidebar desktop, rotas) |
| `flows/` | Fluxos de usuário (login, acesso a apps, storage, admin) |
| `tokens/` | Design tokens (cores, tipografia, spacing, radius) |

## Regras da branch

1. **Nenhum código** — apenas documentação de design (markdown).
2. Todo documento de design deve referenciar `references.md` quando derivar de referência externa.
3. Mergir em `main` **somente** quando o design estiver READY (conforme `planning/v2-readiness.md`).

## Critérios de READY (definidos na v2-readiness)

- [ ] Wireframes das telas principais aprovados
- [ ] Sistema de navegação definido (mobile + desktop)
- [ ] Design tokens propostos
- [ ] Fluxos de usuário mapeados
- [ ] Revisão de acessibilidade (WCAG 2.1)

> Linha-guia de priorização: a v2.0 herda a organização da v1.4 (Meu espaço, Aplicações, Administração, Sistema) como base da arquitetura de navegação do App.
