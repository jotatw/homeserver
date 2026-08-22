# Personalizar e contribuir — HomeServer

O HomeServer foi feito para ser uma **base adaptável**, não uma configuração genérica que tenta atender todos os usos possíveis.

Cada pessoa pode utilizar o projeto de uma forma diferente. Por isso, uma modificação útil para uma instalação não precisa automaticamente virar uma funcionalidade oficial do projeto.

## Primeiro: qual é o seu objetivo?

```text
Quero adaptar meu próprio servidor
        ↓
Personalização local

Quero criar ou alterar uma capacidade do HomeServer
        ↓
Desenvolvimento da plataforma

Quero propor uma mudança para a base principal
        ↓
Contribuição ao projeto
```

Este documento começa pela **personalização**, porque esse é o caminho mais comum para quem utiliza o HomeServer como sua própria base.

Para regras e detalhes de implementação arquitetural, consulte também [`DEVELOPMENT.md`](DEVELOPMENT.md).

---

## 1. Personalize para o seu uso

Você pode adaptar sua instalação conforme sua necessidade.

Exemplos:

- adicionar um serviço que você utiliza;
- criar uma automação pessoal;
- ajustar a organização de arquivos;
- integrar um dispositivo da sua casa;
- testar uma nova forma de sincronização;
- criar scripts auxiliares;
- modificar a interface para o seu fluxo de uso.

A pergunta principal não é **"isso serve para todos?"**. Primeiro pergunte:

> **Isso resolve uma necessidade real da minha instalação?**

Se a resposta for sim, a personalização pode ser válida mesmo que ninguém mais precise dela.

### Um fluxo simples

```text
Tenho uma necessidade
        ↓
Faço uma personalização pequena
        ↓
Testo no meu ambiente
        ↓
Funciona e vale a manutenção?
        ├── sim → mantenho como personalização local
        └── não → ajusto ou removo
```

Não é necessário tentar transformar uma ideia pessoal em uma solução genérica antes de saber se ela funciona na prática.

---

## 2. Onde devo colocar minha modificação?

Prefira manter personalizações separadas da base sempre que isso for possível.

```text
HomeServer
├── base principal
│   ├── core/
│   ├── api/
│   └── componentes oficialmente integrados
│
└── personalizações locais
    ├── serviços pessoais
    ├── automações experimentais
    ├── scripts auxiliares
    └── integrações específicas
```

A localização concreta pode variar conforme a instalação. O princípio é evitar alterar componentes centrais apenas para atender uma necessidade que pertence exclusivamente ao seu ambiente.

### Antes de alterar o Core

Pergunte:

- isso realmente precisa fazer parte do comportamento central?
- consigo resolver com um módulo, adapter, automação ou script separado?
- essa alteração cria dependência entre partes que antes eram independentes?
- conseguirei atualizar a base sem perder minha personalização?

Se uma solução separada resolver o problema, ela normalmente deve ser preferida inicialmente.

---

## 3. Personalizações podem ficar fora do repositório principal

Uma funcionalidade em teste não precisa entrar imediatamente em `main`.

Isso é especialmente útil para:

- novos serviços;
- sincronização experimental;
- automações pessoais;
- integrações com dispositivos específicos;
- fluxos que ainda não foram testados por tempo suficiente.

O objetivo é primeiro descobrir:

```text
É útil?
Funciona de forma confiável?
Vale o custo de manutenção?
Interfere em outros componentes?
Ainda faz sentido depois de algum tempo de uso?
```

Somente depois faz sentido avaliar se a capacidade deve ser integrada de forma mais profunda.

---

## 4. Quando considerar levar algo para a base?

Uma personalização pode ser candidata à integração quando seu comportamento estiver mais claro.

Antes de mover uma solução para a base principal, avalie:

- resolve um problema identificável da plataforma?
- possui responsabilidade clara?
- funciona sem depender de detalhes pessoais da sua instalação?
- seus dados e configurações possuem uma fonte de verdade definida?
- pode ser instalada, removida ou substituída de forma previsível?
- possui custo de manutenção aceitável?
- pode ser testada e documentada?
- adiciona valor suficiente para justificar sua complexidade?

Não é necessário que uma solução seja universal. O importante é que, quando entrar na base, sua responsabilidade e comportamento estejam claros.

---

## 5. Antes de adicionar um serviço ou módulo

Um serviço deve possuir uma responsabilidade identificável. Avalie:

- [ ] O problema que o serviço resolve está definido.
- [ ] A responsabilidade não pertence a uma capacidade existente.
- [ ] As dependências necessárias estão documentadas.
- [ ] A configuração possui localização e fonte de verdade definidas.
- [ ] Os dados persistentes possuem localização definida.
- [ ] O lifecycle de instalação, inicialização, parada e atualização está definido.
- [ ] Existe uma forma de verificar health ou estado quando aplicável.
- [ ] Falhas do serviço não derrubam componentes independentes sem necessidade.
- [ ] A integração utiliza uma fronteira ou contrato claro.
- [ ] O App não depende diretamente de nomes de containers ou comandos internos do serviço.
- [ ] A remoção ou substituição futura foi considerada.
- [ ] Se for opcional, sua remoção não compromete o Core ou dados fora de sua responsabilidade.
- [ ] Testes e documentação necessários foram identificados.

> Este checklist não obriga todo experimento a virar módulo. Ele serve principalmente quando uma solução está sendo considerada para integração mais estável.

---

## 6. Desenvolvimento dentro da arquitetura

Quando uma alteração fizer parte da plataforma, identifique a camada correta:

- `core/foundation/` — componentes básicos e reutilizáveis.
- `core/infrastructure/` — recursos internos do HomeServer.
- `core/adapters/` — integração com serviços externos.
- `api/` — fronteira oficial da plataforma.
- `modules/` — componentes e serviços implantáveis conforme os contratos do projeto.
- `automation/` — automações e hooks.
- `scripts/` — ferramentas auxiliares.
- `docs/` — documentação.
- `planning/` — fundamentos, planejamento e evolução futura.

A direção preferencial é:

```text
Capacidade da Plataforma
        ↓
Contrato apropriado
        ↓
API, quando exposta externamente
        ↓
App / CLI / Integrações
```

Para convenções, responsabilidades e decisões de implementação, consulte [`DEVELOPMENT.md`](DEVELOPMENT.md).

---

## 7. Antes de alterar um contrato

Quando uma mudança afetar uma API ou outra interface compartilhada:

1. identifique os consumidores conhecidos;
2. avalie compatibilidade;
3. evite mudanças implícitas de comportamento;
4. atualize a documentação do contrato;
5. adicione ou ajuste testes de regressão;
6. registre um ADR quando a mudança alterar uma decisão arquitetural relevante.

Uma implementação interna pode evoluir livremente desde que preserve o contrato suportado ou que a mudança seja planejada explicitamente.

---

## 8. Teste antes de consolidar

A quantidade de validação deve ser proporcional ao risco da mudança.

Para alterações aplicáveis, execute:

```bash
bash core/tests/run_all.sh
bash scripts/health-check.sh
```

Além dos testes automáticos, mudanças destinadas ao uso diário devem ser usadas e avaliadas na prática quando possível.

Uma implementação não deve ser considerada consolidada apenas porque um comando executou sem erro. Pergunte também:

- resolveu o problema original?
- o fluxo continua simples?
- uma falha é compreensível?
- existe um caminho de recuperação?
- a manutenção futura continua aceitável?

Consulte [`TESTING.md`](TESTING.md) para a estratégia completa.

---

## 9. Documente o que muda

Atualize a documentação quando uma alteração mudar o comportamento do HomeServer.

Dúvidas recorrentes podem ser adicionadas à [`FAQ`](../use/FAQ.md) e ao índice [`QUESTIONS.md`](../use/QUESTIONS.md).

Decisões arquiteturais relevantes devem ser avaliadas para registro em `../reference/architecture/adr/`.

Evite exemplos com dados pessoais de uma instalação. Use placeholders como:

```text
<USUARIO_ADMIN>
<IP_DO_SERVIDOR>
<NOME_DO_SERVIÇO>
```

---

## 10. Contribuições para o projeto principal

Se uma modificação estiver madura e você quiser levá-la para a base principal:

1. confirme o problema que ela resolve;
2. identifique a camada responsável;
3. avalie dependências e impacto arquitetural;
4. execute os testes relevantes;
5. atualize a documentação necessária;
6. registre um ADR quando aplicável;
7. descreva claramente o que mudou e por quê.

Mensagens de commit podem seguir, por exemplo:

```text
feat(api): adicionar ...
fix(core): corrigir ...
docs: atualizar ...
test(api): adicionar ...
refactor(core): simplificar ...
```

---

## Princípio final

```text
Primeiro resolva a necessidade real.
Depois valide na prática.
Só então decida se vale consolidar.
```

O HomeServer pode permanecer simples na base justamente porque não exige que toda necessidade individual seja transformada em funcionalidade global.
