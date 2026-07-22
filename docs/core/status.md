# Status Operation

**Módulo:** Operations

---

# Objetivo

Consultar e apresentar o estado atual de um ou mais serviços do HomeServer.

A operação deve fornecer uma visão rápida da disponibilidade e saúde dos serviços, utilizando informações da camada Services.

---

# Responsabilidades

- Consultar status de um serviço
- Consultar status de todos os serviços
- Exibir informações resumidas
- Exibir informações detalhadas (quando solicitado)

---

# Não faz

Esta operação NÃO é responsável por:

- Reiniciar serviços
- Corrigir problemas
- Executar Docker Compose
- Verificar hardware
- Consultar logs

---

# Dependências

- lib.sh
- service.sh

---

# Fluxo

Administrador

↓

status.sh

↓

service_status()

↓

Resultado

---

# Fluxo Interno

status.sh

↓

Validação

↓

service_exists()

↓

service_status()

↓

Resultado

---

# Entrada

Consultar um serviço

status.sh homepage

Consultar todos

status.sh --all

Modo detalhado

status.sh homepage --verbose

---

# Saída

Exemplo resumido

Homepage

Status: Online

Health: OK

Uptime: 2 dias

---

Exemplo múltiplo

Homepage      Online

FileBrowser   Online

Gitea         Offline

Jellyfin      Online

---

# Casos de Uso

## Homepage

Mostrar o estado dos serviços.

---

## hsctl

Consultar rapidamente um serviço.

---

## Doctor

Obter o estado atual antes das verificações.

---

## Monitoramento

Consultar periodicamente os serviços.

---

# Convenções

A operação deve:

- Nunca alterar o estado do serviço.
- Ser somente leitura.
- Utilizar service.sh.
- Retornar código de saída.

---

# Futuras Melhorias

- Filtros por categoria
- Status em JSON
- Status em YAML
- Modo silencioso
- Saída colorida
- Integração com Homepage

---

# Status

🟡 Especificado