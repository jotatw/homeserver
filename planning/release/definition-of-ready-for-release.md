# Definition of Ready for Release

> Critérios **permanentes** para lançar qualquer versão do HomeServer.
> Todos os itens devem estar **verdes** antes da tag.

## Critérios

- [ ] **Instalação em servidor limpo validada** (install.sh → servidor funcional).
- [ ] **Upgrade a partir da versão anterior validado** (`hs update`).
- [ ] **Reboot validado** — tudo sobe sozinho.
- [ ] **Documentação atualizada** (README, guias, API, CHANGELOG).
- [ ] **Quality Gate aprovado** (`bash core/tests/run_ci.sh`).
- [ ] **Testes automatizados verdes** (Foundation, Infrastructure, Session, API).
- [ ] **Smoke tests aprovados** (`scripts/smoke-test.sh`).
- [ ] **Acceptance tests aprovados** (matriz + cenários).
- [ ] **Zero Knowledge Test aprovado** (instalação seguindo apenas a documentação).
- [ ] **Nenhuma funcionalidade nova após a RC** (apenas fix/docs/test/ci).
- [ ] **CHANGELOG completo** (com Known Issues quando houver).
- [ ] **Publish validado** (imagem publicada + release criada).
- [ ] **Rollback documentado**.

## Critério final

> A versão está pronta quando um usuário consegue **instalar o HomeServer em
> uma máquina limpa, utilizar todas as funcionalidades principais e
> compreender como o sistema funciona utilizando apenas a documentação
> oficial, sem consultar o código-fonte ou buscar ajuda externa.**
