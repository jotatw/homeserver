# Backup Library

**Módulo:** Infrastructure

---

# Objetivo

Centralizar todas as operações relacionadas à criação, restauração e gerenciamento de backups.

A biblioteca deve fornecer uma interface simples e consistente para proteger os dados dos serviços do HomeServer.

---

# Responsabilidades

- Criar backups
- Restaurar backups
- Compactar arquivos
- Extrair backups
- Rotacionar backups
- Validar backups
- Limpar backups antigos

---

# Não faz

Esta biblioteca NÃO é responsável por:

- Copiar arquivos (filesystem.sh)
- Gerenciar Docker (docker.sh)
- Gerenciar serviços (service.sh)
- Agendar backups
- Enviar backups para serviços externos

---

# Dependências

- output.sh
- validation.sh
- config.sh
- filesystem.sh

---

# API

## Backup

| Função | Descrição |
|---------|-----------|
| backup_file() | Cria backup de um arquivo |
| backup_directory() | Cria backup de um diretório |
| backup_service() | Cria backup dos dados de um serviço |

---

## Restauração

| Função | Descrição |
|---------|-----------|
| restore_file() | Restaura um arquivo |
| restore_directory() | Restaura um diretório |
| restore_service() | Restaura os dados de um serviço |

---

## Compactação

| Função | Descrição |
|---------|-----------|
| compress_backup() | Compacta um backup |
| extract_backup() | Extrai um backup |

---

## Gerenciamento

| Função | Descrição |
|---------|-----------|
| verify_backup() | Verifica integridade |
| rotate_backups() | Remove backups antigos |
| list_backups() | Lista backups disponíveis |

---

# Casos de Uso

## Backup manual

Criar um backup antes de atualizar um serviço.

---

## Backup automático

Executado por uma tarefa agendada.

---

## Deploy

Criar um backup antes de substituir arquivos.

---

## Restore

Restaurar rapidamente um serviço após uma falha.

---

# Fluxo

```
Script
    │
    ▼
backup.sh
    │
    ▼
filesystem.sh
    │
    ▼
Sistema de Arquivos
```

---

# Convenções

Todas as funções devem:

- Verificar se a origem existe.
- Não sobrescrever backups sem confirmação.
- Retornar códigos de saída.
- Utilizar output.sh para mensagens.
- Registrar data e hora do backup.

---

# Futuras Melhorias

- Backups incrementais
- Backups diferenciais
- Criptografia
- Verificação por checksum
- Compressão configurável
- Destinos remotos (NAS, S3, etc.)
- Políticas de retenção configuráveis

---

# Status

🟡 Especificado