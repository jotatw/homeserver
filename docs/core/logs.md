# Logs Operation

**Módulo:** Operations / Query

---

# Objetivo

Consultar e apresentar os logs de um ou mais serviços do HomeServer.

A operação fornece uma interface padronizada para acessar os logs dos serviços sem exigir conhecimento sobre Docker ou localização dos arquivos.

---

# Responsabilidades

- Exibir logs de um serviço
- Exibir logs em tempo real
- Limitar quantidade de linhas
- Filtrar saída
- Exportar logs (futuro)

---

# Não faz

Esta operação NÃO é responsável por:

- Gerenciar arquivos de log
- Rotacionar logs
- Corrigir erros
- Reiniciar serviços

---

# Dependências

- lib.sh
- service.sh

---

# API

logs.sh <serviço>

logs.sh <serviço> --follow

logs.sh <serviço> --tail 100

---

# Casos de Uso

## Diagnóstico

Consultar erros após falha.

---

## Monitoramento

Acompanhar inicialização.

---

## Desenvolvimento

Depurar configurações.

---

# Fluxo

Administrador

↓

logs.sh

↓

service_logs()

↓

docker.sh

↓

Docker Compose

↓

Container

---

# Convenções

A operação deve:

- Nunca alterar o estado do serviço.
- Ser somente leitura.
- Utilizar service_logs().

---

# Futuras Melhorias

- Busca por palavras
- Exportação
- JSON
- Destaque de erros

---

# Status

🟡 Especificado