# Definition of Ready for Release

> Critérios permanentes para publicar uma **release oficial** do HomeServer.
> Eles não exigem a criação de Tags ou Releases durante a fase normal de consolidação e experimentação.

## Quando aplicar

Durante a evolução do projeto, commits, documentação, testes e validação prática registram o progresso. Uma nova tag não deve ser criada apenas para marcar uma etapa intermediária.

Este documento passa a ser aplicado quando existir uma decisão explícita de publicar uma versão oficial, começando pela futura `v1.0.0`.

## Critérios

Todos os itens aplicáveis à release devem estar verdes antes da tag:

- [ ] **Instalação em servidor limpo validada** (install.sh → servidor funcional).
- [ ] **Upgrade validado**, quando existir uma versão oficial anterior suportada.
- [ ] **Reboot validado** — tudo sobe sozinho.
- [ ] **Documentação atualizada** (README, guias, API, CHANGELOG).
- [ ] **Quality Gate aprovado** (`bash core/tests/run_ci.sh`) no estado final da release.
- [ ] **Testes automatizados verdes** (Foundation, Infrastructure, Session, API).
- [ ] **Smoke tests aprovados** (`scripts/smoke-test.sh`), quando aplicável à estrutura final.
- [ ] **Acceptance tests aprovados** (matriz + cenários relevantes).
- [ ] **Zero Knowledge Test aprovado** (instalação seguindo apenas a documentação).
- [ ] **Nenhuma funcionalidade nova após o freeze da release** (apenas fix/docs/test/ci).
- [ ] **CHANGELOG completo** (com Known Issues quando houver).
- [ ] **Publicação validada** (artefatos aplicáveis + tag + GitHub Release).
- [ ] **Rollback ou estratégia de recuperação documentada**, quando aplicável.

## Critério final

> Uma versão está pronta quando representa um estado que o projeto deseja preservar como referência, foi validada no ambiente real e um usuário consegue instalar o HomeServer em uma máquina limpa, utilizar as funcionalidades principais e compreender como o sistema funciona utilizando apenas a documentação oficial, sem consultar o código-fonte ou buscar ajuda externa.

## Observação sobre a primeira release

A primeira release oficial não precisa seguir uma sequência de versões experimentais anteriores. A `v1.0.0` será criada somente quando a base atual estiver suficientemente consolidada e houver uma decisão explícita de transformá-la na primeira referência oficial do projeto.
