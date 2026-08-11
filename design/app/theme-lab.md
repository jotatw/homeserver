# Laboratório visual — temas e ícones

## Objetivo

Criar um espaço de avaliação visual antes da escolha definitiva dos tokens do HomeServer App.

O laboratório não é uma funcionalidade destinada ao usuário final. Ele existe para comparar propostas de design em situações reais da interface e reduzir decisões baseadas apenas em amostras de cores.

## Princípios

1. Avaliar temas dentro de componentes reais, não apenas por códigos hexadecimais.
2. Usar os mesmos componentes e conteúdos para todas as propostas.
3. Avaliar mobile e desktop separadamente.
4. Avaliar tema claro e escuro quando a proposta oferecer os dois.
5. Verificar contraste e acessibilidade antes da aprovação.
6. Não escolher uma paleta definitiva antes de testar navegação, ações, formulários e estados.
7. A aparência deve continuar leve; efeitos visuais não podem ser usados para compensar uma hierarquia ruim.

## O que será avaliado

### 1. Estrutura

- fundo;
- superfícies;
- superfícies elevadas;
- bordas;
- texto primário;
- texto secundário;
- texto de apoio.

### 2. Ações

- ação primária;
- ação secundária;
- hover;
- active/pressed;
- selected;
- focus;
- disabled.

### 3. Estados

- sucesso;
- atenção;
- erro;
- informação.

Estados não devem depender somente da cor. Sempre que necessário, devem utilizar texto, ícone ou outro indicador visual.

### 4. Componentes de referência

Cada tema deverá ser avaliado nos seguintes exemplos:

- sidebar/drawer;
- cabeçalho;
- botão primário;
- botão secundário;
- card de métrica;
- lista;
- formulário;
- status badge;
- banner de alerta;
- diálogo;
- estado vazio;
- toast.

### 5. Telas de referência

Para evitar que a escolha seja influenciada por um único componente, o tema deverá ser observado pelo menos em:

- Dashboard;
- Aplicações;
- Armazenamento;
- Impressão.

Essas telas cobrem métricas, navegação, listas, formulários, ações e estados.

## Critérios de avaliação

Cada proposta pode receber uma nota de 1 a 5 nos seguintes critérios:

| Critério | Pergunta |
|---|---|
| Clareza | A hierarquia de informação é fácil de perceber? |
| Legibilidade | Texto e controles continuam fáceis de ler? |
| Contraste | Os elementos importantes possuem contraste adequado? |
| Identidade | O visual parece próprio do HomeServer? |
| Discrição | O tema evita chamar atenção sem necessidade? |
| Consistência | Os componentes parecem pertencer ao mesmo sistema? |
| Mobile | O tema funciona bem em telas pequenas? |
| Desktop | O tema funciona bem em telas grandes? |
| Estados | Sucesso, atenção e erro são facilmente distinguíveis? |
| Leveza | O visual permanece simples e adequado ao projeto? |

A nota não substitui a análise qualitativa. Comentários curtos devem registrar o motivo de uma avaliação particularmente alta ou baixa.

## Temas iniciais a testar

A primeira rodada deve conter propostas de famílias diferentes, sem assumir uma vencedora:

1. Azul técnico — continuação da linguagem atual.
2. Azul petróleo — tecnológico, porém menos genérico.
3. Teal discreto — mais característico e doméstico.
4. Slate neutro — foco em sobriedade.
5. Cinza frio — identidade mais minimalista.
6. Teal escuro — alternativa com maior personalidade.
7. Violeta discreto — proposta experimental.
8. Âmbar técnico — proposta experimental, observando o conflito com o estado de atenção.

As cores concretas dessas propostas serão definidas durante a montagem do laboratório e não devem ser tratadas como tokens definitivos antes da avaliação.

## Ícones

O sistema deverá utilizar um único conjunto visual de ícones, preferencialmente simples e consistente.

### Regras

- o ícone deve contribuir para a compreensão da função;
- o estilo visual deve ser consistente entre todas as telas;
- ícones de navegação representam áreas;
- ícones de ação representam operações;
- ícones de estado representam condições;
- emojis podem ser usados em protótipos, mas não são a referência definitiva da interface;
- ícones decorativos devem ser evitados quando não acrescentarem significado.

### Primeiros ícones a validar

- Início;
- Arquivos;
- Aplicações;
- Impressão;
- Sistema;
- Administração;
- Configurações;
- Upload;
- Download;
- Editar;
- Excluir;
- Atualizar;
- Sucesso;
- Atenção;
- Erro;
- Informação;
- Menu;
- Fechar;
- Voltar;
- Abrir/expandir.

## Processo de decisão

```text
Propostas
   ↓
Theme Lab
   ↓
Desktop + Mobile
   ↓
Claro + Escuro
   ↓
Componentes reais
   ↓
Contraste e acessibilidade
   ↓
Avaliação qualitativa
   ↓
Notas
   ↓
Seleção de uma ou mais direções
   ↓
Tokens definitivos
   ↓
Componentes
   ↓
Wireframes
   ↓
Implementação
```

## O que não fazer nesta fase

- não alterar o visual de produção apenas para testar uma cor;
- não criar temas configuráveis para o usuário final;
- não escolher a paleta somente pelo gosto visual de uma amostra;
- não criar componentes novos apenas para demonstrar um tema;
- não misturar conjuntos de ícones diferentes;
- não adicionar animações ou efeitos para tornar uma proposta mais chamativa.

## Resultado esperado

Ao final desta etapa teremos:

- uma direção visual escolhida;
- uma paleta semântica inicial;
- um conjunto de ícones aprovado;
- critérios de contraste documentados;
- exemplos de componentes em mobile e desktop;
- base suficiente para fechar os tokens definitivos.
