# Result

## Visão Geral

O **Result** representa o resultado da última operação executada pelo HomeServer.

Seu objetivo é padronizar a comunicação entre os componentes da Foundation, fornecendo uma estrutura única para códigos de retorno, mensagens e valores produzidos durante a execução.

O Result existe apenas em memória e pode ser reutilizado por qualquer componente do Core.

---

## Objetivo

Fornecer uma interface única para representar o resultado de uma operação.

---

## Responsabilidades

- Inicializar o resultado.
- Armazenar o código de retorno.
- Armazenar uma mensagem.
- Armazenar um valor opcional.
- Permitir consultar essas informações.
- Limpar o estado atual.

---

## Não Responsabilidades

O Result **não** deve:

- Executar operações.
- Persistir informações.
- Imprimir mensagens.
- Encerrar a aplicação.
- Validar regras de negócio.
- Controlar fluxo da aplicação.

---

## Estrutura

```
Operation
      │
      ▼
Result
      │
      ▼
Application
```

---

## Modelo de Dados

O componente mantém um único resultado ativo.

Campos armazenados:

| Campo | Descrição |
|--------|-----------|
| `code` | Código de retorno da operação. |
| `message` | Mensagem associada ao resultado. |
| `value` | Valor opcional produzido pela operação. |

O estado de sucesso ou falha é determinado exclusivamente pelo código de retorno.

---

## API Pública

| Função | Descrição |
|---------|-----------|
| `result_create()` | Inicializa o componente. |
| `result_set()` | Define o resultado atual. |
| `result_clear()` | Remove o resultado atual. |
| `result_code()` | Retorna o código armazenado. |
| `result_message()` | Retorna a mensagem armazenada. |
| `result_value()` | Retorna o valor armazenado. |

---

## Fluxo de Utilização

```
Componente

↓

result_set()

↓

Result

↓

Consulta

↓

Application
```

---

## Exemplos

### Inicialização

```bash
result_create
```

### Definir um resultado

```bash
result_set \
    "${HS_EXIT_SUCCESS}" \
    "Workspace carregado." \
    "/srv"
```

### Consultar o código

```bash
code="$(result_code)"
```

### Consultar a mensagem

```bash
message="$(result_message)"
```

### Consultar o valor

```bash
workspace="$(result_value)"
```

### Limpar

```bash
result_clear
```

---

## Convenções

- Existe apenas um resultado ativo por execução.
- O código de retorno determina o estado da operação.
- Todas as mensagens são armazenadas como texto.
- O valor é sempre armazenado como string.
- A interpretação do valor é responsabilidade do componente consumidor.

---

## Dependências

Foundation

- constants.sh
- config.sh

---

## Testes

### Testes manuais

```
core/tests/manual/test_result.sh
```

### Testes automatizados

Em desenvolvimento.

---

## Qualidade

O componente deve:

- passar no ShellCheck;
- não utilizar `exit`;
- não imprimir mensagens;
- possuir responsabilidade única;
- manter compatibilidade com Bash;
- ser carregado pelo bootstrap oficial.

---

## Roadmap

### V1

- Resultado único.
- API estável.
- Integração com Context e Operation.

### Futuro

- Avaliar suporte a metadados adicionais.
- Avaliar serialização para logs estruturados.