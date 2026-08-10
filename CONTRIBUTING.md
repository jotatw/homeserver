# Contributing — HomeServer

Obrigado por contribuir com o HomeServer.

O projeto prioriza simplicidade, arquitetura estável e evolução incremental.

## Antes de alterar o código

1. Leia o `README.md`, `QUICKSTART.md` e `QUESTIONS.md`.
2. Consulte `docs/PRINCIPLES.md`.
3. Verifique se já existe um ADR relacionado em `docs/architecture/adr/`.
4. Identifique a camada correta para a alteração.
5. Evite criar uma nova abstração quando uma camada existente já atende à responsabilidade.

## Camadas

- `core/foundation/` — componentes básicos e reutilizáveis.
- `core/infrastructure/` — recursos internos do HomeServer.
- `core/adapters/` — integração com serviços externos.
- `api/` — interface oficial da plataforma.
- `modules/` — serviços implantáveis.
- `automation/` — automações e hooks.
- `scripts/` — ferramentas auxiliares.
- `docs/` — documentação do sistema.
- `planning/` — planejamento e evolução futura.

## Arquitetura

A arquitetura principal é considerada estável.

Mudanças estruturais devem ser justificadas e documentadas por ADR. Novas funcionalidades devem reutilizar as camadas existentes sempre que possível.

O App deve conversar com a plataforma exclusivamente pela API oficial. Serviços externos não devem ser acessados diretamente pelo App.

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

## Documentação

Uma alteração que muda comportamento deve atualizar a documentação correspondente.

Dúvidas recorrentes devem ser avaliadas para inclusão em `docs/FAQ.md` e no índice `QUESTIONS.md`.

Decisões arquiteturais devem ser registradas em `docs/architecture/adr/`.

Exemplos e documentação devem evitar nomes de usuários, IPs, caminhos pessoais ou outras configurações específicas de uma instalação. Use placeholders como `<USUARIO_ADMIN>` e `<IP_DO_SERVIDOR>` quando necessário.

## Commits

Use mensagens curtas e descritivas, preferencialmente no formato:

```text
feat(api): add ...
fix(core): correct ...
docs: update ...
test(api): add ...
refactor(core): simplify ...
ci: update ...
```

## Releases

Releases passam pelo Quality Gate e pelos critérios definidos em `planning/release/`.

A linha v1.x pode receber correções e pequenas melhorias compatíveis enquanto a v2.0 é desenvolvida. Mudanças estruturais devem seguir o roadmap e as decisões arquiteturais da v2.0.

Depois de uma Release Candidate, somente alterações de correção, documentação, testes e CI devem entrar no branch da release.
