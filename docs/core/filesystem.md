# FileSystem Library

Biblioteca responsável pela manipulação de arquivos, diretórios, permissões e links simbólicos utilizados pelo HomeServer.

---

# Objetivo

Centralizar todas as operações relacionadas ao sistema de arquivos em um único local, evitando duplicação de código e mantendo uma interface consistente para todos os scripts.

---

# Responsabilidades

A biblioteca é responsável por:

- Criar diretórios
- Remover diretórios
- Copiar arquivos
- Copiar diretórios
- Mover arquivos
- Renomear arquivos
- Remover arquivos
- Alterar permissões
- Alterar proprietário
- Criar links simbólicos
- Remover links simbólicos
- Consultar informações sobre arquivos e diretórios

---

# Não faz

Esta biblioteca NÃO é responsável por:

- Backup
- Compressão
- Docker
- Containers
- Serviços
- Rede
- Logs
- Monitoramento
- Configuração do sistema

Essas responsabilidades pertencem às suas respectivas bibliotecas.

---

# Dependências

- output.sh
- validation.sh
- config.sh

---

# API

## Diretórios

| Função | Descrição |
|---------|-----------|
| create_directory() | Cria um diretório. |
| create_directories() | Cria vários diretórios. |
| remove_directory() | Remove um diretório. |
| empty_directory() | Remove apenas o conteúdo do diretório. |

---

## Arquivos

| Função | Descrição |
|---------|-----------|
| copy_file() | Copia um arquivo. |
| copy_directory() | Copia um diretório. |
| move_file() | Move um arquivo. |
| rename_file() | Renomeia um arquivo. |
| remove_file() | Remove um arquivo. |

---

## Permissões

| Função | Descrição |
|---------|-----------|
| set_permissions() | Define permissões. |
| set_owner() | Define proprietário e grupo. |

---

## Links simbólicos

| Função | Descrição |
|---------|-----------|
| create_symlink() | Cria um link simbólico. |
| remove_symlink() | Remove um link simbólico. |

---

## Informações

| Função | Descrição |
|---------|-----------|
| path_exists() | Verifica se um caminho existe. |
| is_file() | Verifica se é um arquivo. |
| is_directory() | Verifica se é um diretório. |
| directory_size() | Obtém o tamanho de um diretório. |

---

# Utilizado por

- deploy.sh
- install.sh
- backup.sh
- restore.sh
- update.sh

---

# Convenções

Todas as funções devem:

- Validar parâmetros de entrada.
- Utilizar output.sh para exibir mensagens.
- Retornar código de erro quando necessário.
- Não utilizar caminhos fixos.
- Utilizar variáveis definidas em config.sh.

---

# Futuras melhorias

- Sincronização utilizando rsync
- Comparação entre diretórios
- Hash SHA256
- Verificação de integridade
- Cópia incremental
- Exclusão segura (shred)
- Manipulação de ACLs

---

# Status

🟨 Planejado