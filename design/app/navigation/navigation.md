# Navegação — HomeServer App

> Documento de design e planejamento. Não define implementação de código.

## 1. Objetivo

Definir como o HomeServer App organiza e apresenta suas áreas em diferentes plataformas e perfis de usuário.

A navegação deve permitir encontrar rapidamente as tarefas comuns sem transformar o App em um painel excessivamente complexo.

Mobile e desktop compartilham a mesma arquitetura funcional. A apresentação pode mudar conforme o espaço disponível.

---

## 2. Princípios

1. **Tarefas antes de tecnologia** — destacar o que o usuário pode fazer, não os detalhes internos do servidor.
2. **Mobile como prioridade de uso** — navegação confortável para toque e com poucas opções visíveis simultaneamente.
3. **Desktop como adaptação** — aproveitar o espaço para manter a navegação lateral acessível.
4. **Uma única arquitetura funcional** — mobile e desktop não criam conjuntos diferentes de funcionalidades.
5. **Hierarquia curta** — evitar menus profundos.
6. **Administração separada** — funções técnicas não competem com tarefas cotidianas.
7. **Permissões reais** — o frontend reflete permissões, mas a API continua sendo a autoridade.
8. **Consistência** — a mesma função mantém nome, significado e comportamento entre plataformas.
9. **Navegação recolhível** — priorizar o conteúdo quando a largura disponível for pequena.
10. **Sem navegação artificial** — não adicionar um padrão apenas por ser comum.

---

## 3. Decisão de arquitetura

A direção atual é utilizar uma **sidebar colapsável como modelo principal de navegação**, em vez de adotar uma bottom navigation persistente.

A mesma ideia será adaptada às plataformas:

```text
Desktop expandido
┌──────────────┬──────────────────────────┐
│ Sidebar      │ Conteúdo                 │
└──────────────┴──────────────────────────┘

Desktop recolhido
┌────┬─────────────────────────────────────┐
│ ▣  │ Conteúdo                            │
│ ▣  │                                     │
│ ▣  │                                     │
└────┴─────────────────────────────────────┘

Mobile
┌──────────────────────────────────────────┐
│ ☰  HomeServer                            │
├──────────────────────────────────────────┤
│                                          │
│ Conteúdo                                 │
│                                          │
└──────────────────────────────────────────┘
```

No mobile, a sidebar funciona como **drawer lateral** acionado pelo cabeçalho. No desktop, permanece lateral e pode ser expandida ou recolhida.

A bottom navigation deixa de ser requisito do design. Poderá ser reconsiderada futuramente caso o uso real demonstre vantagem clara.

---

## 4. Mapa funcional inicial

```text
HomeServer
│
├── Início
├── Arquivos
├── Aplicações
├── Impressão
├── Sistema
├── Administração
└── Sobre
```

A posição e a apresentação podem mudar entre plataformas sem alterar as áreas disponíveis.

---

## 5. Perfis

### 5.1 Usuário comum

```text
PRINCIPAL
  Início
  Arquivos
  Aplicações
  Impressão

OUTROS
  Sobre
```

`Sistema` e `Administração` não aparecem como destinos principais para esse perfil.

Informações de estado podem aparecer quando forem relevantes para uma tarefa, como o status da impressora na tela de impressão.

### 5.2 Administrador

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

---

## 6. Mobile

### 6.1 Modelo

O mobile utilizará uma sidebar/drawer lateral acionada pelo cabeçalho.

Fechado:

```text
┌──────────────────────────────┐
│ ☰  HomeServer                │
├──────────────────────────────┤
│                              │
│          Conteúdo            │
│                              │
└──────────────────────────────┘
```

Aberto:

```text
┌──────────────────────┐
│ HomeServer       ×   │
│                      │
│ PRINCIPAL            │
│  Início              │
│  Arquivos            │
│  Aplicações          │
│  Impressão           │
│                      │
│ ADMINISTRAÇÃO        │
│  Sistema             │
│  Administração       │
│                      │
│ OUTROS               │
│  Sobre               │
└──────────────────────┘
```

O drawer ocupa somente a parte necessária da tela e pode ser fechado pelo controle ou tocando fora dele.

### 6.2 Regras

- Cabeçalho acessível durante a navegação principal.
- Botão de abertura com área de toque confortável.
- Grupos claramente identificados.
- Item atual claramente identificado.
- Abertura do menu sem perda da posição da página.
- Conteúdo não fica permanentemente reduzido pela navegação.
- Sobreposição discreta sobre o conteúdo.
- Uso confortável com uma mão.
- Sem bottom navigation por convenção.
- Subáreas usam navegação contextual quando necessário.
- Ações destrutivas ou administrativas não ficam misturadas às ações frequentes.

### 6.3 Por que não usar bottom navigation agora

A bottom navigation foi considerada, mas não será adotada inicialmente porque:

- o HomeServer possui poucas áreas principais, porém algumas são administrativas;
- a frequência das funções ainda não justifica reservar espaço permanente na tela;
- uma sidebar/drawer mantém o mesmo modelo conceitual entre mobile e desktop;
- evita duplicar mecanismos de navegação;
- preserva espaço vertical para arquivos, formulários, impressão e outras tarefas.

A decisão poderá ser revista após observar o uso real.

---

## 7. Desktop

O desktop utilizará uma **sidebar colapsável**.

### 7.1 Expandida

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
│  Administração│                                 │
│              │                                  │
│ OUTROS       │                                  │
│  Sobre       │                                  │
└──────────────┴──────────────────────────────────┘
```

### 7.2 Recolhida

```text
┌────┬───────────────────────────────────────────┐
│ ☰  │                                           │
│ 🏠 │                  Conteúdo                 │
│ 📁 │                                           │
│ 📦 │                                           │
│ 🖨️ │                                           │
│ ⚙️ │                                           │
└────┴───────────────────────────────────────────┘
```

Na versão recolhida, cada item precisa de ícone inequívoco e identificação acessível. O usuário não deve depender exclusivamente da memória para interpretar ícones.

### 7.3 Comportamento

- Sidebar expandível e recolhível pelo usuário.
- Estado da sidebar pode ser preservado entre navegações.
- Conteúdo aproveita a largura liberada quando recolhida.
- Em telas intermediárias, o comportamento pode se aproximar do drawer mobile quando a sidebar expandida não couber confortavelmente.

---

## 8. Relação entre plataformas

```text
                    HomeServer
                        │
             ┌──────────┴──────────┐
             │                     │
          Mobile                Desktop
             │                     │
        Drawer lateral      Sidebar colapsável
             │                     │
             └──────────┬──────────┘
                        │
                mesmas áreas e rotas
```

A diferença está na apresentação e no espaço disponível, não na existência de funcionalidades diferentes.

---

## 9. Rotas

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

Os nomes técnicos podem ser ajustados durante a implementação para preservar compatibilidade com a aplicação existente. A mudança visual da navegação não deve exigir alterações desnecessárias na API.

---

## 10. Estado da navegação

A navegação deve representar claramente:

- página atual;
- item selecionado;
- carregamento;
- acesso negado;
- página inexistente;
- erro de carregamento.

### Acesso negado

```text
Acesso restrito

Você não possui permissão para acessar esta área.

[Voltar]
```

### Página inexistente

```text
Página não encontrada

[Voltar ao início]
```

---

## 11. Navegação contextual

Nem toda função precisa virar uma rota principal.

Exemplos:

- detalhes de uma aplicação dentro de `Aplicações`;
- detalhes de uma impressora dentro de `Impressão`;
- montagem/desmontagem de dispositivo dentro de `Armazenamento`;
- edição de usuário dentro de `Administração`.

Isso evita aumentar artificialmente a navegação principal.

---

## 12. Relação com perfis

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

## 13. O que não entra agora

Não serão implementados nesta etapa:

- bottom navigation persistente;
- múltiplos níveis de menu;
- navegação configurável pelo usuário;
- favoritos complexos;
- abas personalizáveis;
- sidebar arrastável;
- navegação exclusiva para desktop;
- navegação exclusiva para mobile;
- perfis além de comum e administrador.

A bottom navigation pode ser reconsiderada futuramente caso o uso real demonstre vantagem clara.

---

## 14. Critérios de aprovação

A navegação será considerada definida quando:

- [ ] modelo de drawer mobile estiver aprovado;
- [ ] modelo de sidebar desktop estiver aprovado;
- [ ] comportamento da sidebar recolhida estiver aprovado;
- [ ] itens principais estiverem definidos;
- [ ] grupos de navegação estiverem definidos;
- [ ] diferenças entre usuário comum e administrador estiverem documentadas;
- [ ] rotas existentes forem mapeadas;
- [ ] estados de acesso negado e página inexistente estiverem definidos;
- [ ] acessibilidade da navegação for revisada;
- [ ] wireframes mobile e desktop forem aprovados.

---

## 15. Próxima etapa

Depois desta arquitetura, a próxima etapa é definir os **design tokens**: cores, tipografia, espaçamento, bordas, superfícies, sombras, ícones e estados.

A implementação visual deve começar somente depois que a fundação e a navegação estiverem suficientemente estáveis.
