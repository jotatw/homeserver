# Docker Library

Biblioteca responsável por encapsular todas as operações relacionadas ao Docker Compose.

---

# Objetivo

Centralizar as chamadas ao Docker Compose, fornecendo uma interface única para os demais scripts do HomeServer.

A biblioteca não conhece serviços específicos, apenas executa operações Docker.

---

# Responsabilidades

A biblioteca é responsável por:

- Validar arquivos Compose
- Subir containers
- Parar containers
- Reiniciar containers
- Atualizar imagens
- Exibir logs
- Exibir status
- Executar comandos em containers
- Consultar informações do Docker Compose

---

# Não faz

Esta biblioteca NÃO é responsável por:

- Deploy de serviços
- Backup
- Configuração
- Cópia de arquivos
- Validação de diretórios
- Monitoramento
- Regras de negócio

Essas responsabilidades pertencem às demais bibliotecas.

---

# Dependências

- output.sh
- validation.sh
- config.sh

---

# API

## Compose

| Função | Descrição |
|---------|-----------|
| compose_validate() | Valida o compose.yaml |
| compose_up() | Inicia os containers |
| compose_down() | Remove os containers |
| compose_restart() | Reinicia os containers |
| compose_pull() | Atualiza as imagens |
| compose_build() | Constrói as imagens |
| compose_status() | Exibe o status |
| compose_logs() | Exibe os logs |

---

## Container

| Função | Descrição |
|---------|-----------|
| compose_exec() | Executa comando em um container |
| compose_ps() | Lista containers |
| compose_images() | Lista imagens |
| compose_version() | Exibe a versão do Docker Compose |

---

# Fluxo

deploy.sh
    │
    ▼
docker.sh
    │
    ▼
Docker Compose
    │
    ▼
Docker Engine

---

# Utilizado por

- service.sh
- deploy.sh
- update.sh
- maintenance.sh

---

# Convenções

Todas as funções devem:

- Executar apenas comandos Docker Compose.
- Não alterar arquivos.
- Não copiar arquivos.
- Não conhecer serviços específicos.
- Utilizar output.sh para mensagens.

---

# Futuras melhorias

- Suporte a perfis Compose
- Execução paralela
- Health Checks
- Estatísticas dos containers
- Suporte ao Docker Context
- Suporte ao Podman (camada de compatibilidade)

---

# Status

🟨 Planejado