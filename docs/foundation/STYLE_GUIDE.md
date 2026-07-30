# Style Guide

## Objetivo

Este documento define as convenções de desenvolvimento da Foundation.

Seu objetivo é garantir consistência, legibilidade e facilidade de manutenção entre todos os módulos do HomeServer Core.

As regras descritas neste documento devem ser seguidas por todo código pertencente à Foundation.

---

# Filosofia

A Foundation prioriza:

- simplicidade;
- previsibilidade;
- reutilização;
- baixo acoplamento;
- alta coesão;
- responsabilidade única.

Sempre que houver mais de uma solução possível, deve-se preferir a alternativa mais simples e de fácil compreensão.

---

# Organização dos Arquivos

Cada módulo deve possuir apenas uma responsabilidade claramente definida.

Um módulo não deve acumular funcionalidades de naturezas diferentes.

A organização interna dos arquivos deve seguir, sempre que possível, a seguinte ordem:

1. Cabeçalho
2. Constantes
3. Variáveis globais (quando necessárias)
4. Funções privadas
5. Funções públicas

Essa organização facilita a leitura e a manutenção do código.

---

# Convenção de Nomes

## Arquivos

Os arquivos devem utilizar nomes em letras minúsculas.

Exemplos:

- bootstrap.sh
- loader.sh
- filesystem.sh
- validation.sh

---

## Funções Públicas

As funções públicas representam a interface do módulo.

Devem possuir nomes descritivos e objetivos.

Exemplos:

- create_directory
- directory_exists
- validate_path

---

## Funções Privadas

As funções privadas são utilizadas apenas internamente pelo módulo.

Devem utilizar o prefixo correspondente ao módulo.

Exemplos:

- _fs_validate_path
- _out_print
- _val_is_empty

---

## Constantes

Constantes devem utilizar letras maiúsculas.

Exemplo:

HS_CORE_ROOT

---

# Responsabilidades

Cada função deve possuir apenas uma responsabilidade.

Uma função deve executar apenas uma tarefa.

Caso uma função comece a executar responsabilidades distintas, ela deve ser dividida.

---

# Tratamento de Erros

As funções da Foundation não devem encerrar a execução do programa.

Em caso de erro, devem apenas retornar um código apropriado.

A decisão sobre interromper ou continuar a execução pertence às camadas superiores.

---

# Retornos

Sempre que possível, utilizar o padrão POSIX.

Sucesso:

return 0

Erro:

return 1

Outros códigos podem ser utilizados quando houver necessidade claramente documentada.

---

# Dependências

Os módulos da Foundation não devem depender de:

- Infrastructure
- Applications

Dependências entre módulos da própria Foundation devem ser mantidas no menor número possível.

---

# Comentários

Comentários devem explicar o motivo de uma decisão e não simplesmente descrever o código.

Sempre que o código for suficientemente claro, comentários podem ser omitidos.

---

# Evolução

Este documento deve evoluir juntamente com a Foundation.

Novas convenções somente devem ser adicionadas após consenso e adoção efetiva no código.