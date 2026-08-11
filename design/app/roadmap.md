# HomeServer App — Plano de evolução do design

## Objetivo

Evoluir o design do App de forma incremental, validando uma tela por vez e evitando implementar componentes ou informações que não tragam benefício real.

## Fase 0 — Fundação

- [x] Registrar princípios gerais do design.
- [x] Definir mobile como prioridade de experiência.
- [x] Separar composição mobile e desktop sem duplicar a aplicação.
- [x] Definir os dois perfis iniciais.
- [ ] Consolidar tokens visuais.
- [ ] Definir navegação mobile.
- [ ] Definir navegação desktop.
- [ ] Definir componentes base.

## Fase 1 — Navegação

### Mobile

Definir os destinos de maior frequência que merecem espaço na navegação inferior e agrupar áreas secundárias em uma entrada de menu.

### Desktop

Definir a sidebar e sua hierarquia de seções, mantendo acesso direto às áreas administrativas para o administrador.

### Resultado esperado

Uma arquitetura de navegação compreensível sem depender do tamanho da tela.

## Fase 2 — Linguagem visual

Definir:

- cores;
- tipografia;
- escala de espaçamento;
- raios;
- bordas;
- sombras;
- ícones;
- estados;
- feedback;
- comportamento de foco e toque.

A linguagem deve ser discreta, reconhecível e leve.

## Fase 3 — Componentes

Especificar e implementar gradualmente:

1. navegação;
2. cabeçalho;
3. seções;
4. botões;
5. status;
6. cards;
7. listas;
8. formulários;
9. tabelas;
10. diálogos;
11. toasts;
12. estados vazios e carregamento.

Cada componente deve ter estados, comportamento mobile/desktop e critérios de acessibilidade documentados antes de ser reutilizado amplamente.

## Fase 4 — Telas

Cada tela seguirá o ciclo:

```text
Analisar estado atual
        ↓
Definir objetivo
        ↓
Definir conteúdo essencial
        ↓
Projetar mobile
        ↓
Validar tarefas
        ↓
Adaptar desktop
        ↓
Implementar
        ↓
Testar
        ↓
Registrar decisão
```

### Ordem inicial

1. Meu espaço / Dashboard
2. Aplicações
3. Armazenamento
4. Sistema
5. Administração
6. Impressão

A ordem pode mudar se uma dependência funcional justificar.

## Fase 5 — Perfis

Depois da estrutura básica de cada tela, validar os dois perfis:

- Usuário comum;
- Administrador.

A mesma tela deve ser reutilizada sempre que possível, alterando somente conteúdo e ações autorizadas.

## Fase 6 — Validação multiplataforma

Testar cada tela em:

- telefone pequeno;
- telefone comum;
- tablet;
- notebook;
- desktop.

Também verificar:

- toque;
- teclado;
- foco;
- rolagem;
- orientação;
- estados de erro;
- loading;
- ausência de dados;
- conexão lenta.

## Critério de conclusão de uma tela

Uma tela pode ser considerada pronta quando:

- a tarefa principal é clara;
- o conteúdo essencial está disponível;
- o mobile funciona sem depender do layout desktop;
- o desktop aproveita o espaço sem excesso;
- os dois perfis apresentam somente o que é necessário;
- estados de sucesso, erro e carregamento estão definidos;
- não existem elementos adicionados apenas por decoração;
- o comportamento está documentado quando houver decisão não óbvia.
