# ADR-0008 — Interfaces consumidoras e API como fronteira da plataforma

## Status

Aceito

## Data

2026-08-12

## Decisão

O HomeServer adota contratos como fronteira entre interfaces consumidoras e capacidades internas da plataforma.

O HomeServer App é uma interface importante para operações rápidas e focadas do usuário, mas não representa uma camada arquitetural obrigatória nem a única interface principal do projeto.

O fluxo preferencial é:

```text
Usuário / Automação
        ↓
Interface consumidora
        ↓
Contrato apropriado / API
        ↓
Capacidade da plataforma
        ↓
Infrastructure / Foundation / Adapter
        ↓
Sistema ou serviço externo
```

Exemplos de interfaces consumidoras incluem:

- Homepage ou interface web;
- aplicativo mobile;
- CLI;
- automações;
- integrações futuras.

Cada interface deve permanecer adequada ao seu contexto. Uma interface não deve executar diretamente regras ou detalhes internos que pertencem à capacidade responsável.

---

## Contexto

A base do HomeServer possui capacidades distribuídas entre scripts, CLI, Infrastructure, integrações externas, serviços e API.

Sem uma fronteira explícita, surgem riscos como:

- interfaces conhecerem comandos internos;
- lógica da mesma capacidade ser duplicada;
- dependência de nomes de containers ou serviços específicos;
- mudanças internas quebrarem consumidores;
- cada nova interface criar um caminho próprio de integração;
- aumento do acoplamento entre interface e implementação.

A arquitetura atual separa o consumidor da implementação por contratos quando essa fronteira é necessária.

Isso permite que uma capacidade evolua sem obrigar todas as interfaces a conhecer detalhes como comandos internos, containers, volumes, caminhos ou mecanismos específicos de integração.

---

## Consequências

### Positivas

- reduz o acoplamento entre interfaces e implementação interna;
- permite alterar implementações com menor impacto nos consumidores;
- favorece contratos reutilizáveis por diferentes interfaces;
- reduz duplicação de regras e validações;
- permite experiências diferentes sobre capacidades semelhantes;
- facilita evolução gradual e integração de novas interfaces;
- evita transformar uma interface específica em requisito arquitetural para toda a plataforma.

### Custos e limites

- uma nova fronteira pode exigir trabalho adicional de contrato e integração;
- nem toda operação precisa ser imediatamente exposta por HTTP;
- criar uma API ou camada adicional sem consumidores ou necessidade real pode aumentar complexidade;
- mudanças em contratos compartilhados exigem atenção à compatibilidade e à documentação.

---

## Alternativas consideradas

### 1. Interfaces acessam diretamente scripts, Docker ou serviços

**Não adotada.**

Essa abordagem reduz o trabalho inicial, mas cria acoplamento direto com detalhes de implementação e aumenta o risco de duplicação de regras.

---

### 2. Cada interface implementa sua própria lógica

**Não adotada.**

Implementações separadas para a mesma capacidade criam fontes de verdade concorrentes e aumentam a chance de comportamentos divergentes.

Interfaces diferentes podem oferecer experiências diferentes, mas devem reutilizar responsabilidades e capacidades compartilhadas quando apropriado.

---

### 3. Uma interface obrigatória para todas as operações

**Não adotada.**

O HomeServer possui contextos diferentes de uso. Desktop pode concentrar gerenciamento completo, mobile pode priorizar ações rápidas e CLI pode atender administração, automação, recuperação e desenvolvimento.

Uma única interface não é adequada para todos os contextos.

---

### 4. Exigir uma API HTTP para toda operação interna

**Não adotada.**

Nem toda operação precisa de exposição HTTP. O contrato deve ser apropriado aos consumidores e à fronteira existente.

Criar interfaces públicas sem necessidade real aumentaria a superfície de manutenção e segurança.

---

### 5. Manter interfaces sem uma fronteira explícita

**Não adotada.**

Essa alternativa facilita integrações locais no curto prazo, mas aumenta o acoplamento e torna a evolução das capacidades menos previsível.

---

## Regras resultantes

A partir desta decisão:

1. Interfaces consumidoras devem utilizar contratos apropriados para capacidades compartilhadas.
2. Interfaces não devem depender diretamente de detalhes internos sem necessidade justificada.
3. A mesma capacidade não deve possuir regras de negócio divergentes entre consumidores.
4. A interface adequada depende do contexto de uso; nenhuma interface é uma camada arquitetural obrigatória por si só.
5. Contratos compartilhados devem possuir significado claro e comportamento previsível.
6. Uma API HTTP deve ser utilizada quando houver necessidade real de uma fronteira de rede ou integração externa.
7. Mudanças relevantes nesta fronteira devem considerar consumidores conhecidos, compatibilidade e documentação.
8. A maturidade de uma capacidade deve ser avaliada por evidência prática, não apenas pela existência de código ou endpoint.

---

## Relação com outros documentos

Esta decisão está relacionada a:

- [`../../PRINCIPLES.md`](../../PRINCIPLES.md) — princípios de interfaces, contratos e evolução;
- [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md) — fronteiras atuais da plataforma;
- [`../APPLICATION_API.md`](../APPLICATION_API.md) — relação entre consumidores e contratos;
- [`../API.md`](../API.md) — papel arquitetural da API;
- [`../../api/README.md`](../../api/README.md) — contratos e endpoints concretos.
