# ADR-0008 — App como Centro de Operação e API como Fronteira da Plataforma

## Status

Aceito

## Data

2026-08-12

## Decisão

O HomeServer adota o **HomeServer App como interface principal para operações
normais do usuário final** e a **API como fronteira pública entre interfaces e
as capacidades internas da plataforma**.

O fluxo arquitetural preferencial passa a ser:

```text
Usuário
   ↓
HomeServer App
   ↓
API
   ↓
Capacidade da Plataforma
   ↓
Core / Infrastructure / Adapters
   ↓
Serviços / Sistema
```

O App não deve executar diretamente regras de infraestrutura nem depender de
detalhes como comandos internos, containers Docker, volumes, caminhos internos
ou units do systemd.

A API é responsável por fornecer contratos para que clientes utilizem
capacidades da plataforma sem conhecer esses detalhes.

O CLI permanece uma interface oficial e importante, especialmente para:

- instalação;
- recuperação;
- automação;
- desenvolvimento;
- testes;
- diagnóstico e manutenção avançados.

A existência de uma operação no CLI não impede sua futura exposição pela API e
pelo App. Pelo contrário, capacidades destinadas à operação normal do usuário
final devem ser avaliadas para esse fluxo.

---

## Contexto

A base do HomeServer possui capacidades distribuídas entre scripts, CLI,
Infrastructure, Adapters, serviços Docker e API.

Essa organização permite operar o servidor tecnicamente, mas uma plataforma
voltada ao usuário final não pode exigir que cada operação normal dependa do
conhecimento dessas camadas.

O objetivo estratégico da linha v1.0 é aumentar a qualidade de vida do usuário
e centralizar progressivamente as operações normais no App.

Sem uma fronteira explícita, surgem riscos como:

- o App conhecer comandos internos;
- lógica de negócio duplicada entre App e CLI;
- dependência de nomes de containers ou serviços específicos;
- mudanças internas quebrarem a interface;
- cada nova funcionalidade criar um caminho próprio de integração;
- aumento do acoplamento entre interface e infraestrutura.

A decisão cria uma direção única para evolução da plataforma: primeiro definir
ou reutilizar uma capacidade, depois expor um contrato quando necessário e, por
fim, integrá-la à experiência do usuário.

---

## Consequências

### Positivas

- reduz o acoplamento entre App e infraestrutura;
- permite alterar implementações internas com menor impacto nos clientes;
- favorece contratos reutilizáveis por App, CLI e futuras integrações;
- centraliza regras e validações em responsabilidades apropriadas;
- reduz a necessidade de terminal para operações normais ao longo da v1.0;
- facilita a evolução para módulos e serviços desacoplados;
- permite medir a maturidade de cada capacidade independentemente da interface;
- melhora a previsibilidade para novos desenvolvedores e futuros consumidores
  da plataforma.

### Custos e limites

- novas capacidades expostas ao usuário podem exigir trabalho adicional de
  contrato e integração antes de aparecerem no App;
- nem toda operação existente no CLI será imediatamente transferida para a API;
- o App não deve ser tratado como uma camada alternativa para contornar
  contratos ausentes;
- capacidades parcialmente implementadas devem permanecer explicitamente
  marcadas como parciais até possuírem fluxo completo;
- mudanças em contratos públicos exigem atenção à compatibilidade e à
  documentação.

---

## Alternativas consideradas

### 1. App acessa diretamente scripts, Docker ou serviços

**Não adotada.**

Essa abordagem reduz o trabalho inicial, mas cria acoplamento direto com a
implementação. A interface passaria a conhecer detalhes internos e mudanças em
serviços poderiam exigir alterações no App.

Também aumentaria o risco de duplicação de validações e regras.

---

### 2. Cada interface implementa sua própria lógica

**Não adotada.**

Manter implementações separadas no App, API e CLI cria fontes de verdade
concorrentes e aumenta a chance de comportamentos divergentes.

Interfaces diferentes devem poder oferecer experiências diferentes, mas devem
reutilizar as capacidades e responsabilidades definidas pela plataforma sempre
que possível.

---

### 3. Eliminar o CLI e centralizar tudo exclusivamente no App

**Não adotada.**

O terminal continua necessário para instalação, recuperação e administração
avançada. Eliminá-lo reduziria opções importantes de manutenção e automação.

A decisão é centralizar o **uso normal**, não eliminar interfaces técnicas.

---

### 4. Manter a organização atual sem uma fronteira arquitetural explícita

**Não adotada.**

Essa alternativa permite crescimento rápido no curto prazo, mas não fornece
uma regra clara para futuras integrações e módulos.

A ausência de fronteiras explícitas tende a aumentar o acoplamento conforme o
número de capacidades cresce.

---

## Regras resultantes

A partir desta decisão:

1. O App deve utilizar contratos da API para capacidades da plataforma.
2. O App não deve depender diretamente de detalhes internos da infraestrutura.
3. Uma capacidade destinada ao uso normal deve ser avaliada para exposição pela
   API e pelo App.
4. CLI e App não devem manter regras de negócio divergentes para a mesma
   capacidade.
5. O CLI permanece suportado como interface técnica e avançada.
6. A maturidade de uma capacidade deve ser avaliada por evidência, não apenas
   pela existência de código ou endpoint.
7. Operações declaradas como suportadas pelo App devem buscar um fluxo completo
   sem exigir terminal para concluir a tarefa normal.
8. Mudanças relevantes nesta fronteira arquitetural exigem novo ADR ou revisão
   explícita desta decisão.

---

## Relação com outros documentos

Esta decisão concretiza:

- `docs/PRINCIPLES.md` — App-First Administration, API como fronteira e
  evolução por contratos;
- `docs/ARCHITECTURE.md` — responsabilidades entre App, API e plataforma;
- `planning/strategy.md` — qualidade de vida e operação centralizada;
- `planning/quality/user-quality-of-life.md` — critérios de maturidade e
  necessidade de terminal.
