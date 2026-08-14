# Princípios de Segurança do HomeServer

Este documento define regras permanentes de segurança para desenvolvimento, instalação, operação e evolução do HomeServer.

## 1. Segurança por padrão

Toda instalação nova deve iniciar com a configuração menos permissiva compatível com o funcionamento esperado.

## 2. Nenhum segredo padrão

O projeto não deve depender de:

- senhas padrão;
- tokens padrão;
- chaves padrão;
- credenciais embutidas no código;
- valores de exemplo usados como credenciais reais.

Valores de exemplo devem ser claramente identificados como exemplos e nunca utilizados silenciosamente em produção.

## 3. Nenhum dado pessoal hardcoded

O código não deve depender de:

- nome do desenvolvedor;
- usuário pessoal;
- IP pessoal;
- hostname pessoal;
- caminho pessoal;
- configuração específica de uma instalação.

Instalações diferentes devem poder utilizar a mesma base sem modificar o código-fonte para remover dados pessoais.

## 4. Least Privilege

Cada usuário, container, serviço, API, volume e processo deve possuir somente os privilégios necessários para sua função.

Qualquer privilégio adicional deve possuir justificativa técnica e documentação.

## 5. API como autoridade

A interface não é uma barreira de segurança.

Esconder um botão ou uma página não impede uma operação administrativa.

Operações protegidas devem ser verificadas pela API:

```text
App
 ↓
API
 ↓
Authentication
 ↓
Authorization
 ↓
Service
```

## 6. Dados privados por padrão

Usuários não podem acessar dados pertencentes a outros usuários sem uma permissão explícita.

Escopos, permissões de filesystem e autorização da API devem trabalhar em conjunto.

## 7. Secrets fora do Git

Nunca versionar:

- `.env` contendo credenciais reais;
- tokens reais;
- senhas;
- chaves privadas;
- certificados privados;
- backups contendo secrets;
- dumps de bancos contendo dados sensíveis.

Arquivos de exemplo devem utilizar valores fictícios e seguros.

## 8. Logs não podem revelar secrets

Logs não devem registrar:

- senhas;
- tokens;
- cookies de sessão;
- chaves privadas;
- credenciais;
- conteúdo sensível desnecessário.

Mensagens de erro devem fornecer contexto suficiente para diagnóstico sem expor segredos.

## 9. Dry-run deve ser real

Se uma ferramenta oferece `--dry-run`, essa execução não pode produzir alterações persistentes no sistema.

O modo dry-run não deve:

- criar diretórios;
- alterar permissões;
- modificar arquivos de configuração;
- criar credenciais;
- iniciar ou parar serviços;
- criar containers;
- alterar firewall;
- alterar usuários.

Quando uma ação seria executada, ela deve ser apenas apresentada ao usuário.

## 10. Falhar de forma segura

Quando uma configuração obrigatória não puder ser determinada, o sistema deve falhar claramente.

Não é permitido:

- inventar um valor;
- usar credencial padrão insegura;
- usar configuração pessoal do desenvolvedor;
- continuar silenciosamente com estado potencialmente inseguro.

A mensagem de erro deve explicar o problema e, quando possível, indicar como corrigi-lo.

## 11. Repetibilidade e idempotência

Operações administrativas importantes devem ser previsíveis e, quando tecnicamente possível, idempotentes.

Executar uma operação duas vezes não deve:

- duplicar configurações;
- destruir dados;
- criar recursos duplicados inesperados;
- degradar permissões;
- gerar credenciais conflitantes.

## 12. Alterações no sistema devem possuir tratamento de falha

Toda funcionalidade que modifica o sistema deve considerar:

- falha no meio da operação;
- execução repetida;
- permissão insuficiente;
- dependência ausente;
- serviço indisponível;
- configuração existente;
- configuração inválida.

O comportamento esperado deve ser testado antes da release.

## 13. Segurança não depende da documentação

Se uma operação precisa de autenticação ou autorização, o código deve impedir a operação sem a permissão necessária.

A documentação explica a regra; ela não substitui a implementação da regra.

## 14. Evidência antes da release

Uma alteração de segurança ou confiabilidade só é considerada validada quando existe evidência de teste.

> "Funcionou para mim" não é evidência suficiente.

Os critérios de validação estão definidos em `planning/quality/pre-release-test-matrix.md` e o checklist permanente de hardening em `planning/release/hardening.md`.

## 15. Aplicação

Estes princípios se aplicam a:

- Core;
- Infrastructure;
- Adapters;
- API;
- App;
- módulos Docker;
- scripts;
- instalador;
- automações;
- documentação operacional.

Exceções devem ser justificadas e registradas quando afetarem a arquitetura ou a segurança do sistema.
