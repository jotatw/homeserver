# Direção Inicial — App Mobile

**Status:** Direção inicial

Este documento não define uma especificação final. Ele registra o papel esperado do Mobile, prioridades atuais e limites de escopo para orientar experimentos e futuras decisões.

A direção pode ser revisada com base em uso real, testes e necessidades que ainda não são conhecidas.

## 1. Papel do Mobile

O Mobile funciona principalmente como um atalho rápido para o HomeServer.

```text
Mobile
├── acesso rápido
├── ações frequentes
├── transferência simples de arquivos
├── consulta essencial
├── monitoramento pequeno quando necessário
└── comandos remotos controlados quando necessários
```

O objetivo inicial não é substituir a administração principal do sistema.

```text
Mobile ≠ Desktop reduzido
```

Cada funcionalidade deve justificar por que faz sentido ser acessada rapidamente pelo celular.

## 2. Papel do Desktop

O Desktop permanece como a interface principal e completa para tarefas que exigem mais contexto, espaço ou controle.

```text
Desktop
├── gerenciamento completo
├── navegação detalhada
├── configuração
├── administração dos módulos
├── visualização ampliada
└── operações complexas
```

Uma função não precisa existir no Mobile apenas porque existe no Desktop.

## 3. Prioridade inicial

A direção inicial do Mobile é manter um núcleo pequeno e útil.

### Arquivos

- selecionar arquivos;
- enviar rapidamente ao HomeServer;
- escolher o destino;
- usar destinos ou pastas frequentes;
- acompanhar o progresso da transferência;
- acessar arquivos quando necessário.

O principal fluxo a validar é:

```text
Abrir App
    ↓
Selecionar arquivo
    ↓
Escolher destino
    ↓
Enviar
    ↓
Concluído
```

Para destinos frequentes, a experiência pode ser ainda mais direta:

```text
Selecionar arquivo
        ↓
[ Fotos ] [ Downloads ] [ Documentos ]
        ↓
Enviar
```

A forma exata da interface continua aberta para testes de design e uso prático.

### Monitoramento

O Mobile pode mostrar apenas informações necessárias para consulta rápida, por exemplo:

- estado geral do servidor;
- transferências em andamento;
- última atividade relevante;
- alertas importantes.

Monitoramento detalhado ou dashboards extensos não fazem parte da prioridade inicial apenas por serem possíveis.

### Ações remotas

Quando existir uma necessidade real, o Mobile pode oferecer ações previamente definidas e controladas.

```text
Ação do usuário
       ↓
API autorizada
       ↓
Ação permitida
       ↓
Executor controlado
       ↓
Resultado
```

Exemplos futuros podem incluir iniciar uma automação, solicitar uma atualização de estado ou executar outra ação explicitamente permitida.

O objetivo não é disponibilizar um terminal remoto genérico.

## 4. O que não é prioridade inicial

Não deve ser assumida a implementação imediata de:

- reprodução completa da interface Desktop;
- gerenciamento completo dos módulos;
- todas as configurações do servidor;
- terminal remoto genérico;
- dashboards complexos;
- monitoramento detalhado contínuo;
- sistema próprio completo de sincronização;
- substituição automática de serviços especializados já existentes.

Esses pontos podem ser avaliados no futuro, mas exigem necessidade e evidências práticas antes de entrar no escopo.

## 5. Relação com sincronização e Syncthing

A necessidade atual do Mobile está mais próxima de transferência rápida e simples de arquivos do que da criação de um novo mecanismo completo de sincronização.

O Syncthing permanece uma possibilidade dentro da arquitetura modular do HomeServer:

```text
Core
│
├── funções básicas de arquivos
│   └── independentes do Syncthing
│
└── módulo opcional de sincronização
    └── capacidades adicionais quando instalado
```

O papel exato do módulo Syncthing ainda está em avaliação prática.

Ele pode ser instalado ou removido sem tornar o Core, os dados não pertencentes ao módulo ou as funções básicas do App dependentes dele.

Possibilidades futuras incluem:

- manter o Syncthing como serviço opcional separado;
- oferecer gerenciamento ou status limitado pelo HomeServer;
- integrar apenas capacidades específicas que sejam úteis;
- concluir que transferências rápidas resolvem a maior parte do uso do Mobile.

Este documento não decide antecipadamente qual dessas possibilidades será adotada.

## 6. Critério para adicionar funcionalidades

Antes de incluir uma função no Mobile, avaliar:

1. A ação é realmente frequente?
2. Faz sentido executá-la rapidamente pelo celular?
3. O Mobile oferece uma vantagem prática em relação ao Desktop?
4. A funcionalidade mantém a interface simples?
5. O benefício justifica a implementação e manutenção?
6. Existem dependências desnecessárias ou impacto indevido no Core?
7. A necessidade foi observada no uso real ou é apenas uma possibilidade teórica?

Quando houver dúvida, a preferência inicial é manter o recurso fora do primeiro escopo e reavaliá-lo depois.

## 7. Ciclo de evolução

```text
Direção inicial
      ↓
Protótipo ou implementação mínima
      ↓
Teste prático
      ↓
Uso real
      ↓
Avaliação
      ├── útil e simples → consolidar
      ├── útil, mas incompleto → melhorar
      ├── inadequado → refatorar
      └── sem benefício suficiente → remover ou não integrar
      ↓
Documentar o aprendizado
```

## 8. Princípio final

O Mobile deve reduzir etapas para ações frequentes, não concentrar todas as capacidades do HomeServer em uma tela menor.

> Uma funcionalidade pertence ao Mobile quando oferece uma vantagem real para um acesso rápido e simples; caso contrário, a administração principal permanece no Desktop ou a necessidade continua em avaliação.
