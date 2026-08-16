# Contributing — HomeServer

Obrigado por contribuir com o HomeServer.

O projeto prioriza simplicidade, arquitetura estável, qualidade de vida do usuário e evolução incremental.

## Antes de alterar o código

1. Leia o [`README.md`](../../README.md), o [`QUICKSTART.md`](../install/QUICKSTART.md) e as [`QUESTIONS.md`](../use/QUESTIONS.md).
2. Consulte `../reference/PRINCIPLES.md`.
3. Consulte `../reference/ARCHITECTURE.md`.
4. Verifique se já existe um ADR relacionado em `../reference/architecture/adr/`.
5. Identifique a camada correta para a alteração.
6. Evite criar uma nova abstração quando uma camada existente já atende à responsabilidade.
7. Quando a mudança afetar o usuário final, verifique também `planning/quality/user-quality-of-life.md`.

## Camadas

- `core/foundation/` — componentes básicos e reutilizáveis.
- `core/infrastructure/` — recursos internos do HomeServer.
- `core/adapters/` — integração com serviços externos.
- `api/` — fronteira oficial da plataforma.
- `modules/` — espaço para componentes e serviços implantáveis conforme os contratos arquiteturais evoluírem.
- `automation/` — automações e hooks.
- `scripts/` — ferramentas auxiliares.
- `docs/` — documentação do sistema.
- `planning/` — planejamento, qualidade e evolução futura.

## Arquitetura

A arquitetura principal é considerada estável.

Mudanças estruturais devem ser justificadas e documentadas por ADR. Novas funcionalidades devem reutilizar as camadas existentes sempre que possível.

O App utiliza a plataforma pela API oficial. O App não deve acessar diretamente scripts internos, Docker, containers, volumes, paths de configuração ou serviços externos quando existir uma capacidade ou contrato apropriado na plataforma.

Serviços e componentes devem possuir responsabilidade clara, dependências explícitas e integração por contratos. A adição de um novo serviço não deve exigir alterações arbitrárias na Foundation ou Infrastructure apenas para que sua existência seja reconhecida.

## Antes de adicionar uma capacidade

Antes de implementar uma nova capacidade, responda:

- Qual problema ou tarefa do usuário ela resolve?
- Ela já existe parcialmente em outra camada?
- Qual componente é responsável pela lógica?
- Qual é a fonte de verdade para estado e configuração?
- Existe um contrato reutilizável ou será necessário definir um?
- Quem consumirá essa capacidade hoje e no futuro?
- O App precisa conhecer algum detalhe interno para utilizá-la?
- A implementação pode mudar sem quebrar os consumidores?
- Como a operação informa sucesso, andamento ou falha?
- Como o usuário se recupera quando algo falha?

Uma nova capacidade não deve duplicar regras existentes apenas porque uma nova interface precisa utilizá-la.

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

Nem toda capacidade precisa nascer simultaneamente no App, mas funcionalidades destinadas à operação normal do usuário devem ser avaliadas para integração progressiva.

## Antes de adicionar um serviço

Um serviço deve possuir uma responsabilidade identificável. Antes de adicioná-lo, preencha este checklist:

- [ ] O problema que o serviço resolve está definido.
- [ ] A responsabilidade não pertence a um serviço ou capacidade existente.
- [ ] A identidade do serviço é clara e não depende de detalhes da instalação.
- [ ] As dependências necessárias estão documentadas.
- [ ] A configuração possui localização e fonte de verdade definidas.
- [ ] Os dados persistentes possuem localização definida e seguem o modelo oficial de storage.
- [ ] O lifecycle de instalação, inicialização, parada e atualização está definido.
- [ ] Existe uma forma de verificar health ou estado quando aplicável.
- [ ] Falhas do serviço não derrubam componentes independentes sem necessidade.
- [ ] A integração com a plataforma utiliza uma fronteira ou contrato claro.
- [ ] O App não depende diretamente de nomes de containers, compose files ou comandos específicos do serviço.
- [ ] A remoção ou substituição futura do serviço foi considerada.
- [ ] Testes e documentação necessários foram identificados.

A existência desse checklist não cria automaticamente um sistema de módulos ou plugins. O contrato concreto de modularidade será definido quando houver necessidade real e decisão arquitetural correspondente.

## Antes de alterar um contrato

Quando uma mudança afetar uma API ou outra interface compartilhada:

1. identifique os consumidores conhecidos;
2. avalie compatibilidade;
3. evite mudanças implícitas de comportamento;
4. atualize a documentação do contrato;
5. adicione ou ajuste testes de regressão;
6. registre um ADR quando a mudança alterar uma decisão arquitetural relevante.

Uma implementação interna pode evoluir livremente desde que preserve o contrato suportado ou que a mudança seja explicitamente planejada e comunicada.

## Qualidade de vida do usuário

Para mudanças destinadas ao uso normal, valide:

- [ ] O usuário consegue encontrar a capacidade.
- [ ] O objetivo da ação é compreensível.
- [ ] A tarefa pode ser concluída sem conhecimento técnico desnecessário.
- [ ] O resultado é apresentado de forma compreensível.
- [ ] Uma falha fornece orientação ou um caminho de recuperação.
- [ ] Se o App declara suporte ao fluxo, o terminal não é necessário para concluí-lo normalmente.

A implementação de uma tela ou endpoint não é, por si só, evidência de que a capacidade está pronta para o usuário final.

## Convenções

### Foundation

Funções da Foundation usam o prefixo `hs_*`, por exemplo:

```text
hs_fs_*
hs_cfg_*
hs_val_*
hs_out_*
hs_const_*
hs_registry_*
```

### Infrastructure

Funções usam o prefixo correspondente ao módulo:

```text
storage_*
users_*
devices_*
hardware_*
backup_*
scheduler_*
power_*
compose_*
```

### Adapters

Integrações utilizam o prefixo do serviço, por exemplo `filebrowser_*`.

Funções sem prefixo pertencentes à Foundation devem ser eliminadas em favor do padrão oficial.

## Testes

Toda alteração deve manter os testes existentes funcionando.

Quando aplicável, execute:

```bash
bash core/tests/run_all.sh
bash scripts/health-check.sh
```

Alterações na API devem incluir testes de HTTP. Correções de bugs devem, quando possível, incluir um teste de regressão.

Capacidades novas devem possuir evidência proporcional ao seu risco e escopo. Quando alterarem fluxos de usuário, considere testes de integração, smoke tests ou validação manual documentada além dos testes unitários.

## Documentação

Uma alteração que muda comportamento deve atualizar a documentação correspondente.

Dúvidas recorrentes devem ser avaliadas para inclusão em `../use/FAQ.md` e no índice `../use/QUESTIONS.md`.

Decisões arquiteturais devem ser registradas em `../reference/architecture/adr/`.

Exemplos e documentação devem evitar nomes de usuários, IPs, caminhos pessoais ou outras configurações específicas de uma instalação. Use placeholders como `<USUARIO_ADMIN>` e `<IP_DO_SERVIDOR>` quando necessário.

## Commits

Use mensagens curtas e descritivas. O projeto aceita histórico híbrido em português e inglês. Para mudanças com escopo técnico identificável, prefira um formato consistente, por exemplo:

```text
feat(api): adicionar ...
fix(core): corrigir ...
docs: atualizar ...
test(api): adicionar ...
refactor(core): simplificar ...
ci: atualizar ...
```

## Releases

Releases passam pelo Quality Gate e pelos critérios definidos em `planning/release/`.

A linha atual segue o roadmap `planning/roadmap/v1.0.md`. Roadmaps e versões anteriores permanecem como histórico em `planning/archive/`.

Antes de uma release, mudanças relevantes devem possuir testes, documentação e evidências proporcionais ao seu risco. Depois de uma Release Candidate, somente correções, documentação, testes e CI devem entrar no escopo da release.