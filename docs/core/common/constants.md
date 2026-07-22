# Constants Library

Biblioteca responsável por centralizar todas as constantes utilizadas pelo HomeServer Core.

---

# Objetivo

Disponibilizar valores fixos utilizados por todo o framework.

Centralizar essas informações facilita a manutenção e evita duplicação de valores.

---

# Responsabilidades

- Nome do projeto
- Versão
- Autor
- Licença
- Status
- Exit Codes
- Valores padrão

---

# Não faz

Esta biblioteca NÃO é responsável por:

- Ler arquivos
- Alterar configurações
- Executar comandos
- Validar ambiente
- Manipular arquivos
- Executar operações Docker

---

# Dependências

Nenhuma.

Esta é uma das primeiras bibliotecas carregadas pelo Core.

---

# API

## Projeto

| Constante | Descrição |
|-----------|-----------|
| PROJECT_NAME | Nome do projeto |
| PROJECT_VERSION | Versão atual |
| PROJECT_AUTHOR | Autor do projeto |
| PROJECT_LICENSE | Licença |

---

## Exit Codes

| Constante | Valor | Descrição |
|-----------|------:|-----------|
| EXIT_SUCCESS | 0 | Execução concluída com sucesso |
| EXIT_ERROR | 1 | Erro genérico |
| EXIT_INVALID_ARGUMENT | 2 | Argumento inválido |
| EXIT_NOT_FOUND | 3 | Recurso não encontrado |
| EXIT_PERMISSION_DENIED | 4 | Permissão insuficiente |
| EXIT_CONFIGURATION_ERROR | 5 | Erro de configuração |

---

## Status

| Constante | Descrição |
|-----------|-----------|
| STATUS_OK | Operação concluída |
| STATUS_WARNING | Atenção necessária |
| STATUS_ERROR | Erro |
| STATUS_INFO | Informação |

---

## Valores padrão

| Constante | Descrição |
|-----------|-----------|
| DEFAULT_TIMEOUT | Timeout padrão |
| DEFAULT_RETRIES | Número padrão de tentativas |
| DEFAULT_TIMEZONE | Timezone padrão |

---

# Convenções

As constantes devem:

- Utilizar letras maiúsculas.
- Utilizar underscore como separador.
- Nunca serem alteradas durante a execução.

---

# Utilizado por

Todo o HomeServer Core.

---

# Futuras melhorias

- Informações de Build
- Canal de atualização
- Compatibilidade mínima
- Feature Flags

---

# Status

🟡 Especificado