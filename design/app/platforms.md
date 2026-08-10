# HomeServer App — Plataformas

## Objetivo

Definir como a experiência será organizada em mobile, tablet e desktop sem criar aplicações visualmente independentes.

## Mobile

O mobile é a principal prioridade de experiência.

### Características

- navegação orientada a toque;
- conteúdo predominantemente vertical;
- uma ou duas colunas quando houver espaço suficiente;
- ações principais próximas do conteúdo relacionado;
- navegação inferior para os destinos de maior frequência;
- demais áreas acessíveis por menu secundário;
- formulários compactos e fáceis de preencher;
- tabelas substituídas por listas ou rolagem controlada quando necessário;
- diálogos adaptados à largura disponível;
- feedback imediato após ações.

### Regra

Não esconder informação importante somente para fazer uma tela caber. Quando necessário, reorganizar a informação em seções, detalhes expansíveis ou telas secundárias.

## Tablet

O tablet funciona como uma faixa intermediária.

- manter navegação e interação próximas do mobile quando a largura for limitada;
- utilizar duas colunas quando isso melhorar a leitura;
- evitar assumir que a largura disponível é equivalente à de um desktop;
- preservar áreas de toque confortáveis.

## Desktop

O desktop aproveita o espaço horizontal para aumentar a eficiência da navegação e da leitura.

### Características

- sidebar persistente;
- conteúdo centralizado dentro de uma largura confortável;
- múltiplas colunas quando houver relação clara entre os elementos;
- tabelas completas quando forem a melhor representação;
- informações secundárias visíveis quando ajudarem na tarefa;
- ações relacionadas agrupadas horizontalmente quando fizer sentido.

## O que muda entre plataformas

Pode mudar:

- navegação;
- ordem de alguns blocos;
- número de colunas;
- densidade de informação;
- forma de apresentar tabelas;
- posição das ações secundárias;
- comportamento de diálogos e formulários.

## O que não deve mudar

Deve permanecer consistente:

- nomenclatura;
- identidade visual;
- significado das cores;
- estados dos componentes;
- regras de permissão;
- comportamento funcional;
- conteúdo essencial;
- feedback das ações.

## Breakpoints

Os breakpoints não serão tratados como versões separadas da aplicação. Eles representam mudanças de composição necessárias para manter usabilidade.

A definição final dos valores será feita durante os testes reais em dispositivos, considerando principalmente:

- telefones pequenos;
- telefones comuns;
- tablets;
- notebooks;
- desktops.

## Processo por tela

Cada tela será trabalhada nesta ordem:

1. definir o objetivo da tela;
2. definir o conteúdo essencial;
3. projetar a experiência mobile;
4. validar interação e estados;
5. adaptar a composição para desktop;
6. testar em tamanhos intermediários;
7. implementar somente o necessário.
