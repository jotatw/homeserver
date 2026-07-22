# System Library

**Módulo:** Infrastructure

---

# Objetivo

Centralizar todas as operações relacionadas ao sistema operacional.

A biblioteca fornece informações sobre o servidor e executa operações administrativas de baixo nível.

---

# Responsabilidades

- Consultar informações do sistema
- Consultar utilização de recursos
- Consultar informações do hardware
- Executar operações administrativas
- Verificar disponibilidade do sistema

---

# Não faz

Esta biblioteca NÃO é responsável por:

- Docker
- Backup
- Rede
- Serviços
- Arquivos

---

# Dependências

- output.sh
- validation.sh
- config.sh

---

# API

## Sistema

| Função | Descrição |
|---------|-----------|
| hostname() | Nome do servidor |
| uptime() | Tempo ligado |
| kernel_version() | Versão do Kernel |
| os_version() | Sistema operacional |
| architecture() | Arquitetura do sistema |

---

## Recursos

| Função | Descrição |
|---------|-----------|
| cpu_usage() | Uso da CPU |
| memory_usage() | Uso da memória |
| disk_usage() | Uso do disco |
| disk_free() | Espaço livre |
| load_average() | Carga média do sistema |

---

## Hardware

| Função | Descrição |
|---------|-----------|
| cpu_info() | Informações da CPU |
| memory_info() | Informações da memória |
| disk_info() | Informações dos discos |
| temperature() | Temperatura do sistema (quando disponível) |

---

## Administração

| Função | Descrição |
|---------|-----------|
| reboot_system() | Reinicia o servidor |
| shutdown_system() | Desliga o servidor |
| current_user() | Usuário atual |

---

# Utilizado por

- doctor.sh
- status.sh
- homepage
- monitoramento

---

# Convenções

Todas as funções devem:

- Ser independentes do Docker.
- Retornar códigos de saída.
- Utilizar output.sh para mensagens.
- Não alterar configurações sem solicitação explícita.

---

# Futuras melhorias

- Informações SMART dos discos
- Sensores de hardware
- Consumo de energia
- Estatísticas históricas
- Suporte a múltiplas distribuições

---

# Status

🟡 Especificado

---

# Casos de Uso

## Doctor

Verifica CPU, memória e disco antes de validar os serviços.

---

## Homepage

Exibe informações do servidor em tempo real.

---

## Status

Mostra um resumo da saúde do sistema.