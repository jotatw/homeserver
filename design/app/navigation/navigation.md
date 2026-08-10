# Navegação — HomeServer App

> Documento de design e planejamento. Não define implementação de código.

## 1. Objetivo

Definir como o HomeServer App organiza e apresenta suas áreas em diferentes plataformas e perfis de usuário.

A navegação deve permitir que uma pessoa encontre rapidamente as tarefas mais comuns sem transformar o App em um painel excessivamente complexo.

Mobile e desktop compartilham a mesma arquitetura funcional, mas podem apresentar a navegação de maneiras diferentes.

---

## 2. Princípios

1. **Tarefas antes de tecnologia** — a navegação deve destacar o que o usuário pode fazer, não os detalhes internos do servidor.
2. **Mobile como prioridade de uso** — a navegação mobile deve ser confortável para toque e limitar as opções de primeiro nível.
3. **Desktop como adaptação** — a área disponível permite expor mais opções simultaneamente.
4. **Uma única arquitetura funcional** — mobile e desktop não devem criar conjuntos diferentes de funcionalidades.
5. **Hierarquia curta** — evitar menus profundos e cadeias de navegação difíceis de memorizar.
6. **Administração separada** — funções técnicas e administrativas não devem competir com as tarefas cotidianas.
7. **Permissões reais** — a interface reflete as permissões do usuário, mas a API continua sendo a autoridade de autorização.
8. **Consistência** — a mesma função deve manter nome, significado e comportamento entre plataformas.

---

## 3. Mapa funcional inicial

```text
HomeServer
│
├── Início
│
├── Arquivos
│
├── Aplicações
│
├── Impressão
│
├── Sistema
│
├── Administração
│
└── Sobre
```

Essa é a arquitetura funcional inicial. A posição de cada item pode mudar entre mobile e desktop sem alterar as áreas disponíveis.

---

## 4. Perfis

### 4.1 Usuário comum

O usuário comum deve encontrar principalmente tarefas cotidianas:

```text
Início
Arquivos
Aplicações
Impressão
Mais
└── Sobre
```

`Sistema` e `Administração` não aparecem como destinos principais para esse perfil.

Isso não significa que o usuário comum não possa receber informações de estado quando elas forem relevantes para uma tarefa. Por exemplo, o status de uma impressora pode aparecer na tela de impressão.

### 4.2 Administrador

O administrador possui acesso às funções de gerenciamento:

```text
Início
Arquivos
Aplicações
Impressão
Mais
├── Sistema
├── Administração
└── Sobre
```

A navegação mobile não precisa transformar todas essas áreas em abas principais. `Mais` funciona como agrupador das funções menos frequentes.

---

## 5. Mobile

### 5.1 Estrutura

A navegação mobile deve priorizar uma barra inferior persistente para as áreas mais frequentes.

Modelo inicial:

```text
┌──────────────────────────────┐
│                              │
│          Conteúdo            │
│                              │
│                              │
├──────────────────────────────┤
│ Início │ Arquivos │ Apps │ Mais │
└──────────────────────────────┘
```

A quantidade definitiva de itens da barra inferior ainda será validada durante os wireframes. Não devemos preencher a barra apenas para ocupar espaço.

### 5.2 `Mais`

`Mais` concentra funções menos frequentes ou administrativas.

Para usuário comum:

```text
Mais
├── Sobre
└── outras opções futuras
```

Para administrador:

```text
Mais
├── Sistema
├── Administração
└── Sobre
```

### 5.3 Regras mobile

- A navegação inferior permanece acessível nas telas principais.
- A área de conteúdo não deve ficar escondida atrás da barra inferior.
- Cada item precisa ter área de toque confortável.
- O estado ativo deve ser perceptível sem depender somente de cor.
- Não usar menus horizontais extensos como mecanismo principal de navegação.
- Subáreas devem usar navegação contextual quando necessário.
- Ações destrutivas ou administrativas não devem ficar misturadas às ações frequentes.

---

## 6. Desktop

No desktop, a navegação pode usar uma sidebar persistente.

Modelo inicial:

```text
┌──────────────┬──────────────────────────────────┐
│ HomeServer   │                                  │
│              │              Conteúdo            │
│ PRINCIPAL    │                                  │
│  Início      │                                  │
│  Arquivos    │                                  │
│  Aplicações  │                                  │
│  Impressão   │                                  │
│              │                                  │
│ ADMINISTRAÇÃO│                                  │
│  Sistema     │                                  │
│  Admin       │                                  │
│              │                                  │
│ OUTROS       │                                  │
│  Sobre       │                                  │
└──────────────┴──────────────────────────────────┘
```

### 6.1 Usuário comum

```text
PRINCIPAL
  Início
  Arquivos
  Aplicações
  Impressão

OUTROS
  Sobre
```

### 6.2 Administrador

```text
PRINCIPAL
  Início
  Arquivos
  Aplicações
  Impressão

ADMINISTRAÇÃO
  Sistema
  Administração

OUTROS
  Sobre
```

### 6.3 Sidebar recolhida

Futuramente pode existir uma versão recolhida da sidebar, desde que os ícones tenham significado claro e exista identificação acessível dos itens.

Isso é uma melhoria futura, não um requisito da primeira implementação.

---

## 7. Rotas

A arquitetura deve manter rotas simples e previsíveis.

Modelo conceitual:

```text
/
├── /files
├── /apps
├── /print
├── /system
├── /admin
└── /about
```

Os nomes técnicos das rotas podem ser ajustados durante a implementação para preservar compatibilidade com a aplicação existente.

A mudança visual da navegação não deve exigir mudanças desnecessárias na API.

---

## 8. Estado da navegação

A navegação deve representar claramente:

- página atual;
- item selecionado;
- carregamento;
- acesso negado;
- página inexistente;
- erro de carregamento.

### Acesso negado

Quando uma rota existir, mas o perfil não tiver permissão:

```text
Acesso restrito

Você não possui permissão para acessar esta área.

[Voltar]
```

Não devemos simplesmente esconder toda possibilidade de erro como se a rota não existisse.

### Página inexistente

```text
Página não encontrada

[Voltar ao início]
```

---

## 9. Navegação contextual

Nem toda função precisa virar uma rota principal.

Exemplos:

- detalhes de uma aplicação podem abrir dentro de `Aplicações`;
- detalhes de uma impressora podem permanecer em `Impressão`;
- montagem/desmontagem de dispositivo pode ocorrer em `Armazenamento`;
- edição de usuário pode ocorrer em `Administração`.

Isso evita aumentar artificialmente a navegação principal.

---

## 10. Relação com perfis

A navegação deve ser derivada das permissões reais.

```text
                    Usuário autenticado
                            │
                 ┌──────────┴──────────┐
                 │                     │
             Comum                 Admin
                 │                     │
                 ▼                     ▼
        navegação reduzida      navegação completa
```

O frontend pode ocultar itens que não são relevantes para o perfil, mas isso é apenas uma decisão de experiência. A proteção efetiva continua no backend.

---

## 11. O que não entra agora

Não serão implementados nesta etapa:

- múltiplos níveis de menu;
- navegação configurável pelo usuário;
- favoritos complexos;
- abas personalizáveis;
- sidebar arrastável;
- navegação exclusiva para desktop;
- navegação exclusiva para mobile;
- perfis além de comum e administrador.

Esses recursos podem ser considerados posteriormente se houver necessidade real.

---

## 12. Critérios de aprovação

A navegação será considerada definida quando:

- [ ] fluxo mobile estiver aprovado;
- [ ] fluxo desktop estiver aprovado;
- [ ] itens principais estiverem definidos;
- [ ] conteúdo de `Mais` estiver definido;
- [ ] diferenças entre usuário comum e administrador estiverem documentadas;
- [ ] rotas existentes forem mapeadas;
- [ ] estados de acesso negado e página inexistente estiverem definidos;
- [ ] acessibilidade da navegação for revisada;
- [ ] wireframes mobile e desktop forem aprovados.

---

## 13. Próxima etapa

Depois desta arquitetura, a próxima etapa é definir os **design tokens**: cores, tipografia, espaçamento, bordas, superfícies, sombras, ícones e estados.

A implementação visual deve começar somente depois que a fundação e a navegação estiverem suficientemente estáveis.
