# HomeServer Architecture

## Visão Geral

O HomeServer é organizado em uma arquitetura em camadas, onde cada camada possui responsabilidades específicas e depende apenas das camadas inferiores.

Essa organização reduz o acoplamento entre componentes, facilita a manutenção e permite que o sistema evolua de forma incremental.

---

# Arquitetura em Camadas

```text
                    Applications
                          │
                          ▼
                  Infrastructure
                          │
                          ▼
                     Foundation
```

Cada camada fornece serviços para a camada imediatamente superior.

Nenhuma camada pode acessar diretamente uma camada superior.

---

# Foundation

## Objetivo

A Foundation é a biblioteca base do HomeServer Core.

Ela fornece funcionalidades genéricas reutilizáveis e independentes do ambiente onde o HomeServer está sendo executado.

## Responsabilidades

- Constantes
- Configuração
- Validação
- Manipulação básica do sistema de arquivos
- Saída padronizada
- Inicialização do Core

## Não faz

A Foundation não:

- cria diretórios;
- instala serviços;
- executa comandos do sistema;
- manipula Docker;
- conhece aplicações específicas.

---

# Infrastructure

## Objetivo

A Infrastructure implementa a integração entre o HomeServer e o sistema operacional.

Ela utiliza a Foundation para executar operações concretas no ambiente.

## Responsabilidades

- Gerenciamento de diretórios
- Gerenciamento de arquivos
- Configuração do ambiente
- Docker
- Docker Compose
- Serviços
- Provisionamento

## Depende de

- Foundation

---

# Applications

## Objetivo

As Applications representam os componentes funcionais do HomeServer.

Cada aplicação utiliza a Infrastructure para executar suas tarefas sem conhecer detalhes da implementação.

## Exemplos

- Homepage
- FileBrowser
- Gitea
- Jellyfin (futuro)

## Depende de

- Infrastructure
- Foundation (indiretamente)

---

# Serviços

Os serviços são aplicações executadas pelo HomeServer.

Cada serviço deve ser independente e possuir sua própria configuração, armazenamento de dados e ciclo de vida.

Sempre que possível:

- dados persistentes ficam separados da aplicação;
- configurações ficam versionadas;
- troca de implementação não deve afetar os dados.

---

# Fluxo de Inicialização

A inicialização do HomeServer segue uma sequência previsível.

```text
bootstrap
      │
      ▼
loader
      │
      ▼
Foundation
      │
      ▼
Infrastructure
      │
      ▼
Applications
```

Cada etapa prepara o ambiente necessário para a próxima.

---

# Dependências

As dependências seguem apenas um sentido.

```text
Applications
        │
Infrastructure
        │
Foundation
```

Não são permitidas dependências inversas.

---

# Persistência

Todo serviço deve separar claramente:

- Aplicação
- Configuração
- Dados

```text
Serviço
│
├── Configuração
├── Dados
└── Aplicação
```

Essa separação permite:

- substituição da aplicação sem perda de dados;
- backup simplificado;
- restauração independente;
- atualização segura dos serviços.

---

# Organização do Repositório

```text
core/
├── foundation/
├── infrastructure/
├── applications/
└── provisioning/

docs/
├── foundation/
├── infrastructure/
├── applications/
└── services/
```

A estrutura da documentação acompanha a estrutura do código-fonte.

---

# Princípios Arquiteturais

A arquitetura do HomeServer segue os seguintes princípios.

## Responsabilidade Única

Cada módulo deve possuir apenas uma responsabilidade.

---

## Baixo Acoplamento

Os módulos devem depender do menor número possível de componentes.

---

## Alta Coesão

Funções relacionadas devem permanecer no mesmo módulo.

---

## Modularidade

Novos recursos devem ser adicionados por novos módulos sempre que possível.

---

## Independência

Os serviços devem ser independentes entre si.

Sempre que possível:

- configurações independentes;
- dados independentes;
- implantação independente.

---

# Evolução

A arquitetura foi projetada para crescer por camadas.

Cada camada somente é expandida após estar:

- documentada;
- implementada;
- testada;
- revisada;
- aprovada.