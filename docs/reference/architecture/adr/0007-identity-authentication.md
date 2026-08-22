# ADR-0007 — Identidade e autenticação na fronteira da plataforma

## Status

Aceito

Esta decisão substitui o modelo inicial registrado no [ADR-0001](0001-authentication.md).

## Data

2026-08-06

## Decisão

A identidade e a autenticação dos consumidores do HomeServer são tratadas na fronteira oficial da plataforma.

Serviços externos podem participar da implementação quando necessário, mas não devem se tornar a fronteira de identidade conhecida pelas interfaces consumidoras.

O modelo preferencial é:

```text
Interface consumidora
        ↓
API / contrato de autenticação
        ↓
Capacidade de identidade e autenticação
        ↓
Adapter, quando necessário
        ↓
Serviço ou sistema externo
```

A autenticação e a autorização possuem responsabilidades distintas:

```text
Autenticação
→ confirma a identidade da solicitação

Autorização
→ verifica se a identidade pode executar a operação
```

Interfaces consumidoras devem depender do resultado da identidade autenticada e não consultar diretamente detalhes internos ou serviços externos para decidir permissões.

---

## Contexto

A solução inicial utilizava o FileBrowser como parte direta do fluxo de autenticação. Essa decisão está preservada no ADR-0001 como registro histórico.

Com a evolução da plataforma, tornou-se necessário evitar que a escolha de um serviço externo definisse o contrato de identidade de todas as interfaces.

Sem essa separação, surgiriam riscos como:

- App ou outras interfaces conhecerem diretamente o serviço utilizado para autenticação;
- consumidores dependerem de formatos internos de usuários ou sessões;
- autorização ser implementada de forma diferente em cada rota ou interface;
- substituição de uma dependência externa exigir alterações em múltiplos consumidores;
- identidade e implementação de um serviço externo se tornarem a mesma responsabilidade.

A decisão estabelece a fronteira da plataforma sem exigir, neste momento, um sistema de identidade maior que as necessidades reais.

---

## Consequências

### Positivas

- interfaces dependem de contratos da plataforma, não de um serviço externo específico;
- autenticação e autorização possuem responsabilidades explícitas;
- informações de identidade podem ser resolvidas de forma centralizada;
- regras de acesso podem ser reutilizadas entre diferentes operações;
- uma integração externa pode evoluir com menor impacto nos consumidores;
- evita criar uma camada de identidade independente apenas por antecipação.

### Custos e limites

- a plataforma passa a manter explicitamente a fronteira e os contratos de autenticação;
- mudanças em contratos de identidade precisam considerar consumidores existentes;
- mecanismos de sessão e persistência continuam sendo decisões de implementação;
- mudanças de permissão ou identidade podem exigir regras explícitas de atualização e invalidação.

---

## Detalhes deliberadamente não fixados

Este ADR não define como contrato arquitetural permanente:

- duração específica de sessão;
- renovação deslizante ou fixa;
- armazenamento em memória, arquivo ou banco de dados;
- formato exato de tokens;
- campos específicos retornados por endpoints;
- serviço externo utilizado para validar credenciais;
- formato concreto das respostas HTTP.

Esses detalhes pertencem à implementação e à documentação operacional da API, salvo quando uma futura decisão arquitetural justificar formalizá-los.

---

## Alternativas consideradas

### 1. Expor diretamente o serviço externo de autenticação às interfaces

**Não adotada.**

Aumentaria o acoplamento e transformaria detalhes de implementação em dependências de cada consumidor.

### 2. Criar imediatamente um sistema independente e completo de identity provider

**Não adotada.**

Não existem requisitos concretos que justifiquem adicionar persistência, federação, múltiplos provedores ou outros mecanismos antecipadamente.

### 3. Centralizar a fronteira de identidade e permitir integrações internas

**Adotada.**

Preserva contratos estáveis para consumidores e mantém liberdade para a implementação evoluir conforme necessidades reais.

---

## Relação com outros documentos

- [ADR-0001](0001-authentication.md) — solução inicial substituída;
- [`../API.md`](../API.md) — papel arquitetural da API;
- [`../APPLICATION_API.md`](../APPLICATION_API.md) — consumidores e contratos;
- [`../../api/README.md`](../../api/README.md) — autenticação e contratos concretos;
- [`../../security/`](../../security/) — referências e requisitos de segurança.
