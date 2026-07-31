# Infrastructure Modules

## Visão Geral

A Infrastructure é composta por módulos independentes, cada um responsável por uma área específica da interação entre o HomeServer e o sistema operacional.

Cada módulo possui uma API pública pequena, responsabilidades bem definidas e baixo acoplamento.

---

# Modules

## Filesystem

### Objetivo

Realizar operações no sistema de arquivos.

### Responsabilidades

- criar diretórios;
- remover diretórios;
- criar arquivos;
- remover arquivos;
- copiar arquivos;
- mover arquivos;
- alterar permissões;
- alterar proprietário.

### Não faz

- validações genéricas;
- gerenciamento de Docker;
- gerenciamento de serviços.

### Dependências

- Foundation

---

## Environment

### Objetivo

Gerenciar o ambiente de execução do HomeServer.

### Responsabilidades

- variáveis de ambiente;
- detecção do ambiente;
- configuração da sessão;
- verificação de requisitos.

### Não faz

- gerenciamento de arquivos;
- gerenciamento de containers.

### Dependências

- Foundation

---

## Docker

### Objetivo

Fornecer uma interface para gerenciamento de containers Docker.

### Responsabilidades

- imagens;
- containers;
- volumes;
- redes;
- execução de comandos.

### Não faz

- conhecer aplicações específicas;
- executar regras de negócio.

### Dependências

- Foundation
- Environment

---

## Compose

### Objetivo

Gerenciar aplicações baseadas em Docker Compose.

### Responsabilidades

- iniciar stacks;
- parar stacks;
- reiniciar stacks;
- atualizar stacks;
- consultar estado.

### Não faz

- instalar aplicações;
- gerenciar arquivos do projeto.

### Dependências

- Docker
- Foundation

---

## Services

### Objetivo

Padronizar o ciclo de vida dos serviços do HomeServer.

### Responsabilidades

- instalar;
- configurar;
- iniciar;
- parar;
- reiniciar;
- atualizar;
- remover.

### Não faz

- implementar serviços específicos.

### Dependências

- Compose
- Docker
- Foundation

---

## Provisioning

### Objetivo

Automatizar a preparação completa do ambiente.

### Responsabilidades

- inicialização do workspace;
- instalação de dependências;
- preparação do sistema;
- configuração inicial.

### Não faz

- executar aplicações.

### Dependências

- Todos os módulos da Infrastructure.

---

# Dependências

A relação entre os módulos é a seguinte.

```text
Provisioning
        │
        ▼
Services
        │
        ▼
Compose
        │
        ▼
Docker
        │
        ▼
Environment
        │
        ▼
Filesystem
        │
        ▼
Foundation
```

Cada módulo depende apenas dos módulos necessários para cumprir sua responsabilidade.

---

# Evolução

Novos módulos somente devem ser adicionados quando representarem uma nova responsabilidade claramente identificável.

Evita-se concentrar múltiplas responsabilidades em um único módulo para preservar a simplicidade e a facilidade de manutenção.