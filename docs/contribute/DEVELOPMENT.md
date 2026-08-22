# Desenvolvimento do HomeServer

Este documento explica **como implementar mudanças dentro da arquitetura do HomeServer**.

Se você quer apenas adaptar sua própria instalação, comece por [`CONTRIBUTING.md`](CONTRIBUTING.md). Personalizações locais não precisam seguir toda a complexidade de uma mudança destinada à base principal.

## Antes de começar

Faça três perguntas:

```text
1. Isso precisa entrar na base principal?
2. Qual componente é responsável por esse comportamento?
3. Qual é a forma mais simples de implementar sem criar dependências desnecessárias?
```

Depois de identificar que a mudança pertence à plataforma, siga as convenções deste documento.

---

## 1. Filosofia de implementação

O desenvolvimento segue princípios simples:

- comece pequeno;
- evolua com base em evidências;
- mantenha responsabilidades separadas;
- prefira código simples a abstrações desnecessárias;
- valide mudanças antes de consolidá-las;
- registre limitações conhecidas em vez de escondê-las;
- permita revisar decisões quando a experiência prática mostrar uma alternativa melhor.

Em resumo:

```text
Problema claro
    ↓
Menor solução responsável
    ↓
Implementação
    ↓
Teste
    ↓
Uso ou validação prática
    ↓
Documentação
```

---

## 2. Escolha a camada correta

Antes de criar um arquivo, identifique sua responsabilidade.

| Área | Responsabilidade |
|---|---|
| `core/foundation/` | componentes básicos e reutilizáveis, sem conhecimento da plataforma específica |
| `core/infrastructure/` | capacidades internas do HomeServer |
| `core/adapters/` | integração isolada com serviços externos |
| `api/` | contratos e operações expostas pela plataforma |
| `modules/` | serviços e capacidades implantáveis conforme a arquitetura |
| `automation/` | automações e hooks, quando presentes |
| `scripts/` | ferramentas auxiliares, deploy, manutenção e validação |
| `docs/` | documentação de uso, operação e desenvolvimento |
| `planning/` | fundamentos, decisões e direção futura |

Evite colocar uma funcionalidade em uma camada apenas porque ela é conveniente. A localização deve refletir sua responsabilidade.

### Regra prática

```text
Código genérico e reutilizável?       → Foundation
Capacidade do HomeServer?             → Infrastructure
Integra serviço externo?              → Adapter
Expõe operação para clientes?         → API
É componente opcional implantável?    → Module
Ajuda desenvolvimento/operação?       → Script ou Automation
```

---

## 3. Foundation

A Foundation fornece componentes reutilizáveis para outras partes do projeto.

Ela:

- não imprime mensagens de interface;
- não conhece módulos opcionais;
- não depende de serviços específicos;
- não contém regras particulares de FileBrowser, Gitea ou outros serviços;
- não deve acumular comportamento específico da instalação.

Seu objetivo é fornecer APIs reutilizáveis.

### Estrutura dos arquivos

Quando aplicável, arquivos da Foundation seguem esta organização:

```bash
#!/usr/bin/env bash

########################################
# Public API
########################################

########################################
# Private
########################################
```

---

## 4. Convenções de código

### Nomenclatura por camada

Cada camada utiliza nomes que indiquem sua responsabilidade.

| Camada | Convenção | Exemplos |
|---|---|---|
| Foundation | `hs_*` | `hs_fs_*`, `hs_cfg_*`, `hs_val_*`, `hs_out_*` |
| Infrastructure | prefixo da capacidade | `storage_*`, `users_*`, `devices_*`, `hardware_*`, `backup_*` |
| Adapters | prefixo do serviço | `filebrowser_login`, `filebrowser_create_user` |
| CLI | `hs <comando> <subcomando>` | `hs user create`, `hs system status` |

### Funções públicas

Use o prefixo correspondente à camada ou capacidade responsável.

### Funções privadas

Funções internas devem iniciar com `_`.

### Uma responsabilidade por função

Cada função deve possuir um objetivo claro. Evite funções que misturem descoberta, alteração de estado, interface e integração sem necessidade.

---

## 5. Implementando uma mudança

Um fluxo recomendado é:

### 1. Defina o comportamento

Descreva primeiro:

- qual problema será resolvido;
- qual é o comportamento esperado;
- o que acontece em caso de erro;
- quais dados são alterados;
- quais componentes serão afetados.

### 2. Preserve fronteiras

Não faça uma interface depender diretamente de detalhes internos que podem mudar.

A direção preferencial é:

```text
Capacidade da plataforma
        ↓
Contrato apropriado
        ↓
API, quando exposta externamente
        ↓
App / CLI / Integrações
```

### 3. Implemente a menor solução necessária

Evite antecipar funcionalidades que ainda não possuem um caso de uso validado.

### 4. Trate falhas previsíveis

Erros devem permitir identificar o problema sem depender de comportamento implícito.

### 5. Valide

Execute os testes aplicáveis e, quando necessário, valide no ambiente real.

---

## 6. Alterando contratos

Uma API ou interface compartilhada possui consumidores. Antes de alterar um contrato:

1. identifique os consumidores conhecidos;
2. avalie compatibilidade;
3. evite alterar silenciosamente o significado de uma operação;
4. atualize a documentação;
5. ajuste os testes de regressão;
6. avalie um ADR quando a decisão for arquiteturalmente relevante.

A implementação interna pode evoluir desde que preserve o contrato suportado ou que a mudança seja planejada explicitamente.

---

## 7. Testes e validação

Toda mudança deve receber validação proporcional ao seu risco.

Quando aplicável:

```bash
bash core/tests/run_all.sh
bash scripts/health-check.sh
```

O fluxo mínimo é:

```text
Preparação
    ↓
Execução
    ↓
Validação
    ↓
Limpeza
```

Para mudanças que afetam o uso diário, testes automatizados não substituem completamente a validação prática.

Consulte [`TESTING.md`](TESTING.md) para critérios e estratégias detalhadas.

---

## 8. Documentação e decisões

Atualize a documentação quando o comportamento mudar.

A documentação deve explicar, conforme necessário:

- o que mudou;
- como funciona;
- limitações conhecidas;
- decisões importantes;
- evidências relevantes para manutenção futura.

Comentários no código devem complementar a implementação, não repetir o que já é evidente.

Decisões arquiteturais relevantes devem ser avaliadas para registro em `../reference/architecture/adr/`.

---

## 9. Commits

Prefira commits pequenos e coerentes.

Exemplos:

```text
feat(foundation): add filesystem helper
test(foundation): add filesystem tests
refactor(foundation): simplify filesystem api
fix(api): correct authentication flow
docs: clarify local TLS setup
```

Uma mudança grande pode ser dividida quando isso tornar revisão, teste ou reversão mais simples.

---

## 10. Evolução contínua

O roadmap em `planning/roadmap/evolution.md` orienta a evolução do projeto, mas suas fases não representam uma sequência automática de releases.

Uma mudança pode exigir, conforme seu impacto:

1. implementação;
2. testes;
3. documentação;
4. evidência;
5. validação em uso real;
6. avaliação de recursos, segurança e manutenção;
7. registro das limitações restantes.

Uma fase posterior não deve esconder uma pendência crítica anterior.

Quando novas evidências demonstrarem que uma decisão não foi adequada, ela pode ser revisada.

Referências principais:

- `planning/foundations/` — princípios gerais de evolução e decisão;
- `planning/roadmap/evolution.md` — direção operacional;
- `planning/release/` — critérios para futuras releases oficiais.

---

## Resumo

```text
A mudança pertence à plataforma?
        ↓
Identifique a camada responsável
        ↓
Preserve as fronteiras
        ↓
Implemente a menor solução necessária
        ↓
Teste e valide
        ↓
Documente o comportamento
        ↓
Consolide somente quando estiver claro e sustentável
```

O objetivo é manter o HomeServer modular, compreensível e fácil de evoluir sem transformar cada nova necessidade em complexidade permanente.
