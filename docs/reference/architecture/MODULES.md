# Modules

Módulos são capacidades opcionais ou independentes que podem ampliar o HomeServer sem se tornarem requisitos do Core.

O objetivo da modularidade é permitir instalar, testar, evoluir ou remover capacidades com impacto limitado ao seu próprio escopo.

Este documento descreve o conceito arquitetural de módulos. A estrutura e os módulos concretamente disponíveis podem evoluir.

## Princípio principal

Um módulo não deve se tornar uma dependência obrigatória do funcionamento normal da plataforma apenas por estar instalado.

A relação desejada é:

```text
Core
 │
 ├── funciona sem o módulo
 │
 ▼
Módulo opcional
 │
 ▼
Capacidade adicional
```

Sempre que possível:

```text
Instalar módulo
→ adiciona uma capacidade

Remover módulo
→ remove apenas essa capacidade

Core
→ continua funcional
```

---

## O que caracteriza um módulo?

Uma capacidade é candidata a módulo quando:

- é opcional para a plataforma principal;
- possui uma responsabilidade relativamente independente;
- pode possuir seu próprio ciclo de instalação ou configuração;
- não precisa ser carregada como requisito pelo Core;
- pode evoluir sem alterar desnecessariamente capacidades centrais.

A pergunta prática é:

> **Se esta capacidade não existir nesta instalação, o HomeServer ainda pode cumprir suas responsabilidades principais?**

Se sim, ela pode ser candidata a módulo.

---

## Módulo não é apenas uma pasta

Separar arquivos em um diretório chamado `modules/` não garante modularidade.

Um módulo precisa preservar sua independência também nas dependências:

```text
Módulo
   ↓ usa capacidades necessárias
Core / contratos estáveis

Core
   ✕ não depende do módulo opcional
```

Evite situações como:

```text
Core inicia apenas se módulo X estiver instalado

Core importa diretamente detalhes internos do módulo

Outras capacidades exigem o módulo sem necessidade real
```

Essas relações transformam uma capacidade supostamente opcional em dependência estrutural.

---

## Ciclo de vida

Quando aplicável, um módulo pode possuir operações como:

```text
Instalar
Configurar
Ativar
Consultar estado
Atualizar
Desativar
Remover
```

Nem todo módulo precisa implementar todas essas operações.

O ciclo de vida deve ser definido pelo que a capacidade realmente necessita, evitando interfaces artificiais apenas para manter uma aparência uniforme.

---

## Relação com Infrastructure

Módulos e Infrastructure possuem responsabilidades diferentes.

```text
Infrastructure
→ capacidades internas necessárias para operar a plataforma

Module
→ capacidade adicional e opcional
```

Um módulo pode utilizar a Infrastructure.

Por exemplo:

```text
Módulo
   ↓
Infrastructure
   ↓
Foundation
   ↓
Sistema / runtime
```

Mas a Infrastructure não deve depender de um módulo opcional para cumprir sua própria responsabilidade.

---

## Relação com Adapters e serviços externos

Um módulo pode integrar um serviço externo.

Quando essa integração possui detalhes próprios relevantes, ela deve permanecer isolada de forma apropriada:

```text
Módulo
   ↓
Capacidade do módulo
   ↓
Adapter
   ↓
Serviço externo
```

Não é necessário criar múltiplas camadas para toda integração pequena. O isolamento deve justificar a complexidade adicionada.

---

## Dados e configuração

Cada módulo deve deixar claro, quando aplicável:

- quais configurações controla;
- onde mantém seus dados;
- qual é sua fonte de verdade;
- quais recursos externos utiliza;
- o que acontece com seus dados durante atualização ou remoção.

O módulo não deve assumir que dados pertencentes a outras capacidades podem ser alterados livremente.

---

## Falhas e isolamento

Uma falha em um módulo não deve comprometer capacidades independentes sem necessidade.

Quando possível, o estado do módulo deve permitir distinguir entre:

```text
Não instalado
Instalado
Configurado
Ativo
Indisponível / com erro
```

Os estados concretos podem variar conforme o módulo. O importante é fornecer diagnóstico suficiente sem transformar todos os módulos em implementações idênticas.

---

## Adicionando um novo módulo

Antes de criar um módulo, avalie:

1. Qual capacidade adicional ele oferece?
2. Ela realmente precisa ser opcional?
3. Pode ser removida sem comprometer o Core?
4. Quais capacidades existentes ela utiliza?
5. Existe uma integração externa que deve permanecer isolada?
6. Quais dados e configurações passam a existir?
7. Como será validado seu ciclo de vida?
8. Qual será o custo de manutenção?

Se a capacidade for pequena e ainda estiver sendo experimentada, ela não precisa ser imediatamente consolidada como módulo formal.

```text
Experimento
    ↓
Uso prático
    ↓
Responsabilidade clara?
    ├── não → permanece experimental ou é revisado
    └── sim → avaliar consolidação como módulo
```

---

## Evolução

A modularidade deve ser demonstrada na prática.

Antes de considerar um módulo consolidado, avalie:

- instalação independente;
- remoção segura quando aplicável;
- dependências explícitas;
- isolamento de falhas razoável;
- documentação do comportamento;
- validação no ambiente real quando necessária.

O objetivo não é transformar todas as funcionalidades em plugins. Modularidade deve ser usada quando reduz acoplamento e melhora a capacidade de evoluir ou adaptar o HomeServer.

---

## Referências relacionadas

- [`CORE.md`](CORE.md) — núcleo técnico compartilhado;
- [`Infrastructure.md`](Infrastructure.md) — capacidades internas da plataforma;
- [`FOUNDATION.md`](FOUNDATION.md) — componentes reutilizáveis;
- [`../../contribute/CONTRIBUTING.md`](../../contribute/CONTRIBUTING.md) — personalização e consolidação;
- [`../../contribute/TESTING.md`](../../contribute/TESTING.md) — validação proporcional ao impacto.

Voltar para [Referência de arquitetura](README.md).