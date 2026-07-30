# Modules

## Objetivo

Este documento descreve as responsabilidades dos módulos que compõem a Foundation.

Cada módulo possui um propósito específico e deve respeitar o princípio da responsabilidade única (Single Responsibility Principle).

A descrição apresentada neste documento representa a responsabilidade funcional de cada módulo, independentemente de sua implementação.

---

# Bootstrap

## Objetivo

Inicializar a Foundation.

## Responsabilidades

- Preparar o ambiente de execução.
- Inicializar as variáveis essenciais do Core.
- Carregar o Loader.
- Iniciar o carregamento da Foundation.

## Não é responsabilidade

- Carregar Infrastructure.
- Carregar Applications.
- Executar regras de negócio.
- Configurar serviços.

---

# Loader

## Objetivo

Carregar os módulos da Foundation e das demais camadas do Core.

## Responsabilidades

- Localizar módulos.
- Carregar módulos.
- Organizar a ordem de carregamento das camadas.

## Não é responsabilidade

- Implementar funcionalidades dos módulos.
- Executar lógica de negócio.
- Configurar o ambiente.

---

# Constants

## Objetivo

Centralizar constantes utilizadas pelo Core.

## Responsabilidades

- Definir valores imutáveis.
- Disponibilizar constantes compartilhadas.

## Não é responsabilidade

- Executar lógica.
- Criar configurações.
- Manipular arquivos.
- Validar dados.

---

# Config

## Objetivo

Centralizar configurações do Core.

## Responsabilidades

- Definir caminhos.
- Disponibilizar configurações compartilhadas.
- Organizar parâmetros utilizados pela Foundation.

## Não é responsabilidade

- Criar diretórios.
- Validar configurações.
- Imprimir mensagens.

---

# Output

## Objetivo

Padronizar a saída de informações.

## Responsabilidades

- Exibir mensagens.
- Padronizar formatos de saída.

## Não é responsabilidade

- Validar dados.
- Manipular arquivos.
- Encerrar a execução do programa.

---

# Validation

## Objetivo

Fornecer validações reutilizáveis.

## Responsabilidades

- Validar parâmetros.
- Validar estados.
- Validar condições utilizadas pela Foundation.

## Não é responsabilidade

- Imprimir mensagens.
- Criar arquivos.
- Alterar configurações.

---

# Filesystem

## Objetivo

Disponibilizar operações genéricas sobre arquivos e diretórios.

## Responsabilidades

- Manipular arquivos.
- Manipular diretórios.
- Consultar informações do sistema de arquivos.

## Não é responsabilidade

- Gerenciar serviços.
- Conhecer a estrutura do HomeServer.
- Implementar regras específicas da Infrastructure.

---

# Evolução

Novos módulos poderão ser adicionados conforme a Foundation evoluir.

Cada novo módulo deverá possuir:

- um objetivo claramente definido;
- responsabilidades bem delimitadas;
- baixo acoplamento;
- alta coesão;
- conformidade com a arquitetura da Foundation.

Módulos existentes não devem acumular responsabilidades que descaracterizem seu propósito original.