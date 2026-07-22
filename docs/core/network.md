# Network Library

Biblioteca responsável pelas operações relacionadas à rede.

---

# Objetivo

Centralizar todas as verificações e consultas de rede utilizadas pelo HomeServer Core.

Seu objetivo é fornecer uma interface simples para validar conectividade, disponibilidade de portas e informações da rede local.

---

# Responsabilidades

A biblioteca é responsável por:

- Verificar conectividade
- Consultar IPs
- Consultar gateway
- Consultar DNS
- Testar portas
- Verificar disponibilidade de serviços
- Aguardar serviços iniciarem

---

# Não faz

Esta biblioteca NÃO é responsável por:

- Configurar interfaces de rede
- Alterar firewall
- Criar regras NAT
- Gerenciar VPN
- Gerenciar Docker Networks

Essas responsabilidades pertencem ao sistema operacional ou a futuras bibliotecas específicas.

---

# Dependências

- output.sh
- validation.sh
- config.sh

---

# API

## Conectividade

| Função | Descrição |
|---------|-----------|
| ping_host() | Testa conectividade com um host. |
| internet_available() | Verifica acesso à Internet. |

---

## Endereçamento

| Função | Descrição |
|---------|-----------|
| local_ip() | Obtém o IP local. |
| gateway_ip() | Obtém o gateway padrão. |
| dns_servers() | Lista os servidores DNS configurados. |

---

## Portas

| Função | Descrição |
|---------|-----------|
| port_open() | Verifica se uma porta está acessível. |
| wait_port() | Aguarda uma porta ficar disponível. |

---

## Informações

| Função | Descrição |
|---------|-----------|
| hostname() | Obtém o hostname do servidor. |
| network_summary() | Exibe um resumo da configuração de rede. |

---

# Utilizado por

- doctor.sh
- deploy.sh
- service.sh

---

# Convenções

Todas as funções devem:

- Ser apenas de consulta.
- Nunca alterar configurações da rede.
- Retornar códigos de saída.
- Utilizar output.sh para mensagens.

---

# Futuras melhorias

- IPv6
- Latência
- Throughput
- Interfaces de rede
- Descoberta automática de dispositivos

---

# Status

🟡 Especificado