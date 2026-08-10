# HomeServer App — Diretrizes de Design

## Objetivo

Definir a linguagem visual e as regras de experiência do HomeServer App antes da implementação das telas da v2.0.

O App deve funcionar bem em desktop e mobile, com prioridade de projeto para o uso em dispositivos móveis. As duas plataformas compartilham dados, componentes e comportamento, mas podem organizar a informação de formas diferentes.

## Personalidade visual

O HomeServer deve transmitir:

- simplicidade;
- confiabilidade;
- clareza;
- discrição;
- sensação de ferramenta doméstica bem organizada.

A interface não deve tentar parecer futurista, corporativa ou excessivamente tecnológica. Também não deve depender de elementos decorativos para criar identidade.

A identidade visual será construída principalmente por tipografia, espaçamento, superfícies, cor de destaque, ícones e consistência entre componentes.

## Princípios

### 1. Simplicidade antes de quantidade

Mostrar primeiro o que ajuda o usuário a realizar a tarefa. Informações técnicas e secundárias ficam disponíveis em níveis posteriores.

### 2. Mobile como prioridade de experiência

O mobile será tratado como uma experiência própria, e não como uma versão reduzida do desktop.

### 3. Desktop como adaptação

No desktop, o espaço adicional deve ser utilizado para organizar melhor a informação, não simplesmente para aumentar tamanhos ou adicionar conteúdo desnecessário.

### 4. Uma aplicação, duas composições

Mobile e desktop compartilham lógica, conteúdo, componentes e identidade visual. A composição, navegação e densidade podem variar conforme a plataforma.

### 5. Informação em camadas

Cada informação deve ser classificada como essencial, importante, secundária ou administrativa. Nem tudo precisa estar visível simultaneamente.

### 6. Feedback claro

Toda ação relevante deve produzir um estado compreensível: carregando, concluído, atenção, erro ou indisponível.

### 7. Leveza

Evitar animações pesadas, gráficos desnecessários, efeitos decorativos e dependências que aumentem significativamente o custo da interface.

### 8. Consistência sem rigidez

Componentes devem possuir regras comuns, mas cada tela pode utilizar a composição mais adequada para sua tarefa.

## Hierarquia de informação

### Essencial

Informação necessária para entender o estado atual ou concluir a tarefa principal.

### Importante

Informação ou ação que deve estar facilmente acessível, mas não precisa dominar a tela.

### Secundária

Detalhes úteis para consulta, diagnóstico ou contexto.

### Administrativa

Configurações, manutenção e operações que não fazem parte do fluxo comum do usuário.

## Componentes e padrões

O design system deverá definir progressivamente:

- navegação;
- cabeçalho de página;
- seções;
- botões;
- links e ações;
- cards;
- listas;
- tabelas;
- formulários;
- status e badges;
- banners;
- diálogos;
- toasts;
- estados vazios;
- loading e skeletons;
- mensagens de erro.

A regra é evitar transformar todo conteúdo em card. Cards serão usados principalmente para métricas, recursos e ações. Listas serão preferidas para itens repetitivos e tabelas para dados realmente tabulares.

## Desempenho e acessibilidade

A interface deve continuar utilizável em hardware antigo e em conexões locais modestas.

Devem ser considerados desde o início:

- áreas de toque adequadas;
- foco visível;
- contraste suficiente;
- navegação por teclado;
- `prefers-reduced-motion`;
- mensagens de erro compreensíveis;
- não depender somente de cor para comunicar estado.

## Perfis de usuário

A primeira versão terá somente dois perfis:

- Usuário comum;
- Administrador.

A diferença entre os perfis será definida por **permissões e exposição de funções**, não por dois designs diferentes.

## Evolução

O design será implementado de forma incremental. Nenhuma tela deve receber uma grande quantidade de componentes ou informações apenas para preencher espaço.

A implementação de cada tela seguirá:

1. definir objetivo da tela;
2. definir conteúdo essencial;
3. desenhar mobile;
4. validar estados e tarefas;
5. adaptar para desktop;
6. implementar;
7. testar em tamanhos diferentes;
8. registrar decisões relevantes.
