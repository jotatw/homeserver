# Como o HomeServer funciona

Este documento explica o funcionamento do HomeServer de forma simples: **o que ele é, o que faz e como as partes trabalham juntas**.

## Em uma frase

O HomeServer transforma um computador em um ponto central da sua rede local para **armazenar arquivos, executar serviços, organizar acessos e simplificar tarefas administrativas**.

Você não precisa acessar cada serviço por uma porta diferente ou administrar tudo diretamente pelo Docker. O HomeServer organiza esses componentes e fornece caminhos comuns para acesso e gerenciamento.

## Visão geral

```text
Você
 │
 ├── Desktop ─────────────┐
 ├── Celular ─────────────┤
 └── CLI ─────────────────┤
                           ↓
                    HomeServer
                           │
          ┌────────────────┼────────────────┐n          ↓                ↓                ↓
        App/API         Core            Módulos
          │                │                │
          │         usuários, backup,   FileBrowser,
          │         dispositivos,       Gitea, impressão,
          │         energia, serviços   outros opcionais
          │                │                │
          └────────────────┼────────────────┘
                           ↓
                    Computador servidor
                           ↓
                      Rede local
```

## 1. O computador é o servidor

O HomeServer é instalado em um computador que permanece disponível na sua rede.

Esse computador pode fornecer recursos como:

- espaço central para arquivos;
- serviços web locais;
- usuários e permissões;
- backup;
- automações;
- monitoramento básico;
- gerenciamento de dispositivos conectados;
- outras capacidades adicionadas por módulos.

O computador continua sendo o lugar onde os dados e os serviços são executados. O HomeServer organiza como eles são instalados, acessados e administrados.

## 2. Você acessa um endereço principal

Em vez de memorizar várias portas, o acesso principal é centralizado em:

```text
https://homeserver.local/
```

A partir dele, o servidor pode encaminhar para diferentes partes:

| Caminho | Função |
|---|---|
| `/` | Portal principal |
| `/app` | Gerenciamento do HomeServer |
| `/files/` | Arquivos, quando o módulo estiver instalado |
| `/git/` | Repositórios Git, quando o módulo estiver instalado |
| `/api/v1/` | Interface usada pelo App e integrações |

Nem todas as rotas precisam existir em todas as instalações. Isso depende dos módulos ativos.

## 3. Homepage, App e CLI têm papéis diferentes

O HomeServer não tenta colocar tudo em uma única interface.

### Homepage — encontrar e abrir

A Homepage funciona como um portal rápido. Seu objetivo principal é mostrar os serviços disponíveis e facilitar o acesso a eles.

Exemplo:

```text
Abrir HomeServer
      ↓
Homepage
      ↓
Escolher FileBrowser
      ↓
Gerenciar arquivos
```

### App — gerenciar o HomeServer

O App é usado para operações que pertencem à própria plataforma, como consultar informações, administrar usuários ou utilizar recursos que o App suporta.

Ele se comunica com a API oficial do HomeServer. Não deve depender diretamente dos detalhes internos de cada serviço externo.

### CLI — administração técnica

A CLI `hs` é voltada principalmente para:

- instalação;
- diagnóstico;
- manutenção;
- recuperação;
- automação;
- operações técnicas avançadas.

Exemplo:

```bash
bash core/hs.sh system status
```

A CLI não precisa ser usada para todas as tarefas cotidianas quando existe uma interface apropriada para a mesma operação.

## 4. O Core cuida do que pertence ao HomeServer

O Core contém as capacidades fundamentais da plataforma.

De forma simplificada:

```text
Core
├── Foundation      componentes reutilizáveis
├── Infrastructure  recursos internos do servidor
├── Adapters        integração controlada com serviços externos
└── CLI             operações administrativas
```

A Infrastructure pode cuidar de recursos como usuários, armazenamento, dispositivos, backup, scheduler, energia e serviços.

A ideia é manter essas responsabilidades separadas para que adicionar ou remover um serviço externo não obrigue a reconstruir o restante do sistema.

## 5. Serviços podem ser módulos opcionais

Nem toda instalação precisa ter exatamente os mesmos serviços.

Um módulo adiciona uma capacidade sem transformar essa capacidade em requisito do Core.

Exemplo simplificado:

```text
HomeServer básico
├── Core
├── API
└── Interface

HomeServer com módulos adicionais
├── Core
├── API
├── Interface
├── FileBrowser
├── Gitea
└── outros módulos compatíveis
```

O objetivo é que instalar ou remover um módulo não prejudique o funcionamento das partes que não dependem dele.

## 6. Os dados ficam organizados no servidor

A estrutura principal utiliza `/srv` para separar dados, backups, configurações e componentes relacionados ao servidor.

Exemplo:

```text
/srv
├── storage/   dados e arquivos
├── backup/    cópias de segurança
├── docker/    dados de implantação
├── git/       dados relacionados ao Git
└── config/    configurações do HomeServer
```

A separação ajuda a evitar que dados de usuários, backups e configurações sejam tratados como uma única coisa.

## 7. O App conversa com a API

O fluxo simplificado é:

```text
Usuário
  ↓
App
  ↓
API do HomeServer
  ↓
Validação + autorização
  ↓
Core / Adapter responsável
  ↓
Sistema ou serviço
```

Isso significa que a interface não deve executar diretamente operações privilegiadas no servidor.

A API e o Core aplicam os contratos, validações e permissões necessários antes da operação suportada ser executada.

## 8. Usuários e permissões pertencem ao HomeServer

A identidade principal é gerenciada pelo HomeServer.

Um fluxo de acesso simplificado é:

```text
Login
  ↓
API verifica usuário
  ↓
Sessão HomeServer
  ↓
Usuário autenticado
  ↓
Verificação de permissão
  ↓
Operação permitida ou negada
```

Serviços externos podem possuir características próprias, mas o App não deve assumir que autenticação nesses serviços é a mesma coisa que a identidade da plataforma.

## 9. Atualizações e evolução

O projeto está em evolução contínua.

Isso significa que uma funcionalidade não é considerada definitiva apenas porque foi implementada. Ela pode ser:

```text
Implementar
    ↓
Testar
    ↓
Usar na prática
    ↓
Observar resultados
    ↓
Consolidar
melhorar
manter experimental
ou remover
```

O objetivo é evitar transformar ideias iniciais em obrigações permanentes antes de verificar se elas realmente funcionam e são úteis.

## O que usar em cada situação?

| Situação | Caminho recomendado |
|---|---|
| Quero entender o projeto | Este documento e o `README.md` |
| Quero instalar | [`docs/install/`](../install/README.md) |
| Quero usar um serviço | Homepage ou documentação do serviço correspondente |
| Quero gerenciar o HomeServer | App, quando a operação estiver disponível |
| Preciso de diagnóstico ou manutenção | CLI `hs` |
| Quero personalizar ou desenvolver | [`docs/contribute/`](../contribute/README.md) |
| Quero entender a arquitetura | [`docs/reference/architecture/`](../reference/architecture/README.md) |

## Resumo

O funcionamento básico pode ser entendido assim:

```text
Um computador
      ↓
HomeServer organiza recursos internos
      ↓
Módulos adicionam capacidades opcionais
      ↓
API conecta interfaces aos recursos suportados
      ↓
Homepage facilita o acesso
App facilita o gerenciamento
CLI atende administração técnica
      ↓
Você usa o servidor pela rede local
```

Para começar a utilizar: [`README de uso`](README.md).
