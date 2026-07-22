# HomeServer Core Style Guide

Este documento define os padrões utilizados no desenvolvimento do HomeServer Core.

O objetivo é manter todos os scripts consistentes, legíveis e fáceis de manter.

---

# Filosofia

Todo código deve seguir cinco princípios.

- Simples
- Modular
- Reutilizável
- Documentado
- Consistente

Sempre prefira clareza ao invés de soluções complexas.

---

# Estrutura de Arquivos

Cada arquivo possui apenas uma responsabilidade.

Exemplos:

✓ filesystem.sh → Sistema de arquivos

✓ docker.sh → Docker

✓ network.sh → Rede

✗ filesystem.sh contendo funções Docker

---

# Estrutura dos Scripts

Todos os scripts seguem a mesma organização.

```bash
#!/usr/bin/env bash

# ==========================================================
# HomeServer Core
# Script:
#
# Objetivo:
#
# Uso:
#
# ==========================================================

set -euo pipefail

source common/lib.sh
```

---

Depois seguem sempre esta ordem.

```
Constantes

↓

Variáveis

↓

Funções privadas

↓

Funções públicas

↓

Main
```

---

# Comentários

Comentários devem explicar o motivo.

Nunca apenas repetir o código.

Bom exemplo

```bash
# Preserva atributos para facilitar restauração.
```

Ruim

```bash
# Copia o arquivo.

cp arquivo destino
```

---

# Nomenclatura

Funções

Sempre utilizar verbos.

Exemplos

```
create_directory()

copy_file()

remove_file()

compose_up()

service_restart()
```

Evitar

```
run()

go()

exec()

do()
```

---

Variáveis

Sempre utilizar nomes descritivos.

Bom

```
SERVICE_NAME

BACKUP_PATH

COMPOSE_DIRECTORY
```

Ruim

```
dir

tmp

var

a
```

---

Constantes

Sempre maiúsculas.

```
PROJECT_NAME

DEFAULT_TIMEOUT

EXIT_SUCCESS
```

---

# Organização das Funções

Funções semelhantes permanecem juntas.

Exemplo

Filesystem

```
Diretórios

Arquivos

Permissões

Links

Informações
```

---

# Retornos

Toda função deve retornar um código de saída.

```
return 0
```

Sucesso

```
return 1
```

Erro

Nunca depender de retorno implícito.

---

# Tratamento de Erros

Utilizar sempre:

```
set -euo pipefail
```

Validar argumentos antes da execução.

Nunca assumir que um diretório existe.

Nunca assumir que um arquivo existe.

---

# Mensagens

Nunca utilizar echo diretamente.

Sempre utilizar:

```
info

success

warn

error
```

Essas funções pertencem ao output.sh.

---

# Dependências

Nunca carregar bibliotecas individualmente.

Correto

```bash
source common/lib.sh
```

Evitar

```bash
source output.sh

source docker.sh
```

---

# Responsabilidades

Antes de adicionar uma função, responder:

1. Esta função pertence realmente a esta biblioteca?

2. Já existe outra biblioteca responsável por isso?

3. Ela pode ser reutilizada?

Se alguma resposta for negativa, revisar a arquitetura antes de implementar.

---

# Fluxo de Desenvolvimento

Toda funcionalidade segue o mesmo ciclo.

```
Ideia

↓

Arquitetura

↓

Especificação

↓

Implementação

↓

Teste

↓

Homologação

↓

Documentação
```

Nenhuma implementação começa antes da especificação.

---

# Princípio Fundamental

A simplicidade da interface é consequência da organização do Core.

Todo código deve contribuir para tornar a administração do HomeServer mais simples.