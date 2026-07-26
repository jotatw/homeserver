# Context

## Visão Geral

O **Context** fornece um armazenamento temporário de pares chave/valor durante a execução do HomeServer.

Os dados existem apenas em memória e são descartados quando a execução termina.

Este componente é utilizado para compartilhar informações entre os demais componentes do Core de forma simples e consistente.

---

## Objetivo

Disponibilizar um armazenamento temporário para:

- parâmetros de execução;
- configurações em tempo de execução;
- informações compartilhadas entre componentes.

---

## Responsabilidades

- Inicializar o contexto.
- Armazenar valores.
- Recuperar valores.
- Verificar existência de chaves.
- Remover entradas.
- Limpar o contexto.
- Listar chaves.
- Contar entradas.

---

## Não Responsabilidades

O Context **não** deve:

- Persistir dados em disco.
- Ler ou escrever arquivos.
- Executar operações.
- Validar regras de negócio.
- Exibir mensagens ao usuário.
- Encerrar a execução da aplicação.

---

## Estrutura

```
Context
    │
    ▼
Array Associativo
    │
    ▼
API Pública
```

---

## API Pública

| Função | Descrição |
|---------|-----------|
| `context_create()` | Inicializa o contexto. |
| `context_set()` | Armazena um valor. |
| `context_get()` | Recupera um valor. |
| `context_exists()` | Verifica se uma chave existe. |
| `context_remove()` | Remove uma chave. |
| `context_clear()` | Limpa todo o contexto. |
| `context_keys()` | Lista todas as chaves. |
| `context_count()` | Retorna a quantidade de entradas. |

---

## Fluxo de Utilização

```
Application
        │
Provisioning
        │
Context
        │
Resultado
```

---

## Exemplos

### Inicialização

```bash
context_create
```

### Armazenar um valor

```bash
context_set "workspace.root" "/srv"
```

### Recuperar um valor

```bash
workspace="$(context_get "workspace.root")"
```

### Verificar existência

```bash
if context_exists "workspace.root"; then
    echo "Existe."
fi
```

### Remover

```bash
context_remove "workspace.root"
```

### Limpar

```bash
context_clear
```

---

## Convenções

- Todas as chaves utilizam o padrão de namespace com ponto (`.`).

Exemplos:

```
workspace.root

workspace.compose

runtime.profile

service.gitea.port

docker.network.default
```

- Todos os valores são armazenados como **strings**.
- A interpretação do valor é responsabilidade do componente consumidor.

---

## Dependências

- Foundation
    - constants.sh
    - config.sh

---

## Testes

### Testes manuais

```
core/tests/manual/test_context.sh
```

### Testes automatizados

Em desenvolvimento.

---

## Qualidade

O componente deve atender aos seguintes requisitos:

- ShellCheck sem erros.
- Compatível com Bash.
- Não utiliza `exit`.
- Não imprime mensagens.
- Não depende de outros componentes.
- Responsabilidade única.

---

## Roadmap

### V1

- Armazenamento em memória.
- API pública estável.

### V1.1

- Avaliar exportação/importação do contexto.
- Avaliar persistência opcional.