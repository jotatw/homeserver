# Pre-Release Test Matrix

## Objetivo

Nenhuma versão do HomeServer deve ser publicada sem validação de:

- instalação;
- atualização;
- inicialização;
- segurança;
- operação;
- recuperação;
- documentação.

## Regra fundamental

Uma funcionalidade funcional não é suficiente para considerar uma versão pronta.

A versão precisa ser:

- instalável;
- atualizável;
- recuperável;
- segura;
- documentada;
- utilizável por uma pessoa sem conhecimento do código.

## Obrigatório antes de qualquer release

### Instalação

- [ ] instalação limpa;
- [ ] instalação repetida;
- [ ] dry-run;
- [ ] non-interactive;
- [ ] dependências ausentes;
- [ ] configuração inválida.

### Operação

- [ ] serviços;
- [ ] API;
- [ ] Homepage;
- [ ] App;
- [ ] autenticação;
- [ ] autorização;
- [ ] storage.

### Recuperação

- [ ] reboot;
- [ ] container parado;
- [ ] serviço parado;
- [ ] configuração inválida;
- [ ] backup;
- [ ] restauração.

### Segurança

- [ ] credenciais;
- [ ] permissões;
- [ ] exposição de portas;
- [ ] autenticação;
- [ ] autorização;
- [ ] secrets;
- [ ] Docker;
- [ ] logs.

### Upgrade

- [ ] versão anterior → versão atual;
- [ ] dados preservados;
- [ ] configuração preservada;
- [ ] rollback/mitigação documentado quando aplicável.

### Documentação

- [ ] README;
- [ ] Quick Start;
- [ ] instalação;
- [ ] primeiro acesso;
- [ ] FAQ;
- [ ] perguntas;
- [ ] changelog;
- [ ] documentação da API.

## Critério de bloqueio

Qualquer falha crítica de segurança, integridade de dados, instalação, atualização ou recuperação bloqueia a release.

## Evidência

Todo PASS deve possuir evidência verificável.

> "Funcionou para mim" não é evidência suficiente.

## Pós-release

Problemas descobertos depois da publicação devem ser classificados por severidade e tratados conforme a política de segurança e o processo de release.
