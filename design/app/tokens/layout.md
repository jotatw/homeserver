# Tokens — Layout

> Define a estrutura espacial do HomeServer App. Layout é separado dos tokens de aparência para que mobile e desktop possam mudar a composição sem mudar a linguagem visual.

## Estrutura geral

```text
Mobile
┌──────────────────────────────┐
│ Topbar                       │
├──────────────────────────────┤
│                              │
│ Conteúdo                     │
│                              │
└──────────────────────────────┘

Desktop
┌──────────────┬───────────────┐
│ Sidebar      │ Topbar        │
│              ├───────────────┤
│              │ Conteúdo      │
└──────────────┴───────────────┘
```

## Containers

- Conteúdo mobile ocupa a largura disponível com gutter lateral.
- Conteúdo desktop usa `--hs-max-content` quando a tela for larga o suficiente.
- A largura máxima não deve produzir colunas excessivamente largas.
- A sidebar pertence à estrutura da aplicação; não deve ser tratada como conteúdo.

## Mobile

- Priorizar fluxo vertical.
- Uma coluna é o padrão.
- Duas colunas somente quando os itens continuarem confortáveis para toque e leitura.
- Drawer abre a navegação sem criar uma segunda página.
- O conteúdo continua sendo o foco quando o drawer está fechado.
- Formulários e ações importantes devem permanecer visíveis e fáceis de alcançar.

## Desktop

- Sidebar expandida por padrão em telas grandes.
- Sidebar pode ser recolhida para aumentar a área útil.
- Grid pode usar múltiplas colunas quando isso reduzir rolagem sem prejudicar a leitura.
- Informações secundárias podem permanecer visíveis quando houver espaço.
- Não preencher espaço vazio apenas aumentando componentes.

## Breakpoints

Os seguintes intervalos são referências iniciais:

| Faixa | Modelo |
|---|---|
| <480px | mobile compacto |
| 480–767px | mobile amplo / tablet pequeno |
| 768–1023px | tablet |
| ≥1024px | desktop |
| ≥1440px | desktop amplo |

Esses valores não devem ser tratados como fronteiras absolutas. Um componente pode mudar antes ou depois quando seu conteúdo exigir.

## Densidade

O HomeServer deve favorecer uma densidade moderada:

- informação suficiente para administrar o servidor;
- espaço suficiente para leitura e toque;
- poucos elementos decorativos;
- nenhuma seção criada somente para preencher a tela.

## Regra principal

**O layout deve se adaptar ao conteúdo, não obrigar o conteúdo a se adaptar a um grid fixo.**

