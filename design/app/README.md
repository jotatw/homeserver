# design/app — HomeServer App (v2.0)

> Fase de design e protótipo. O objetivo da v2.0 é o HomeServer App: portal unificado do servidor, acessível por desktop e mobile.

## Objetivo

Esta pasta concentra a documentação do design do App antes da implementação definitiva. A abordagem é incremental: uma tela por vez, com mobile como prioridade de experiência e desktop como adaptação da mesma aplicação.

## Estrutura

| Arquivo/Pasta | Conteúdo |
|---|---|
| `DESIGN.md` | Princípios, personalidade visual e regras gerais do design |
| `platforms.md` | Diretrizes para mobile, tablet e desktop |
| `profiles.md` | Perfis de Usuário comum e Administrador |
| `roadmap.md` | Plano incremental de evolução e critérios de conclusão |
| `theme-lab.md` | Processo de comparação de temas, cores e ícones antes da definição dos tokens |
| `references/` | Referências coletadas e análise de padrões |
| `wireframes/` | Wireframes de telas |
| `components/` | Especificação de componentes |
| `navigation/` | Arquitetura de navegação e rotas |
| `flows/` | Fluxos de usuário |
| `tokens/` | Design tokens |

## Regras do design

1. A documentação de design deve ser escrita em português.
2. Código e nomes técnicos podem permanecer em inglês quando isso for necessário para implementação.
3. O mobile deve ser projetado como experiência própria, não como uma versão reduzida do desktop.
4. Desktop e mobile compartilham identidade, dados, permissões e componentes, mas podem utilizar composições diferentes.
5. A interface deve permanecer leve e adequada ao objetivo doméstico do HomeServer.
6. Novos elementos não devem ser adicionados apenas para preencher espaço.
7. Segurança e autorização pertencem ao backend; a interface apenas reflete as permissões disponíveis.
8. A identidade visual deve ser construída por tokens e componentes reutilizáveis, não por estilos isolados de cada tela.
9. Temas e ícones devem ser avaliados em situações reais antes da aprovação dos tokens definitivos.

## Perfis iniciais

O App começa com dois perfis:

- **Usuário comum** — foco em tarefas cotidianas, como arquivos, aplicações e impressão.
- **Administrador** — inclui as áreas e ações necessárias para gerenciamento, manutenção e diagnóstico.

A regra é reutilizar as mesmas telas sempre que possível, alterando apenas conteúdo e ações permitidas.

## Processo de design

```text
Princípios
   ↓
Plataformas e perfis
   ↓
Navegação
   ↓
Laboratório visual
   ├── Temas
   └── Ícones
   ↓
Tokens definitivos
   ↓
Componentes
   ↓
Wireframes
   ↓
Fluxos
   ↓
Implementação
```

O laboratório visual deve ocorrer antes da escolha definitiva de cores e do refinamento final dos componentes.

## Critérios de READY

A documentação atual de prontidão da v2.0 exige wireframes aprovados, navegação mobile/desktop definida, tokens propostos, fluxos mapeados e revisão de acessibilidade. Esses critérios continuam válidos; os novos documentos desta pasta detalham como chegaremos a eles.

## Referências

Quando uma decisão de design for derivada de uma referência externa, ela deve ser registrada em `references/` e a decisão deve indicar sua origem. O objetivo é usar referências para aprender padrões, não copiar interfaces.
