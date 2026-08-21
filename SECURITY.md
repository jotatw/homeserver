# Política de Segurança

## Versões suportadas

O HomeServer está em desenvolvimento ativo.

Relatos de segurança devem ser considerados principalmente contra a versão mais recente da branch `main` ou contra a release estável mais recente quando ela existir.

Versões antigas podem receber correções quando necessário, mas não possuem garantia de suporte contínuo.

## Reportando uma vulnerabilidade

Não publique detalhes de uma vulnerabilidade ainda não corrigida em uma Issue pública, Pull Request público ou Discussion.

Use o recurso **Private Security Advisory** do GitHub neste repositório quando ele estiver disponível. Caso não seja possível utilizar esse recurso, entre em contato com o mantenedor pelo canal indicado no perfil do GitHub.

Inclua, quando possível:

- versão, commit ou branch afetada;
- componente ou arquivo afetado;
- descrição do problema;
- passos para reproduzir;
- comportamento esperado e observado;
- possível impacto;
- mitigação ou correção sugerida, se conhecida.

Não inclua senhas, tokens, chaves privadas, dados pessoais ou outros segredos no relatório.

## O que acontece após o reporte

O problema será analisado antes da divulgação pública de detalhes técnicos.

Quando aplicável, o processo será:

```text
Relato privado
      ↓
Análise e reprodução
      ↓
Classificação do impacto
      ↓
Correção
      ↓
Testes e validação
      ↓
Atualização de segurança
      ↓
Divulgação responsável
```

O prazo de resposta ou correção depende da gravidade, complexidade e disponibilidade do mantenedor. Como o projeto é atualmente mantido por uma única pessoa, não há SLA formal.

## Escopo

Relatórios podem envolver componentes mantidos neste repositório, incluindo:

- Core e Foundation;
- API e autenticação;
- sessões e autorização;
- operações privilegiadas no host;
- instalador e mecanismo de atualização;
- configuração de Docker e containers;
- permissões e armazenamento;
- backup e recuperação;
- automações e módulos mantidos pelo projeto.

Serviços de terceiros integrados ao HomeServer podem possuir suas próprias políticas de segurança. Quando a vulnerabilidade pertencer ao serviço externo, ela também deve ser reportada ao projeto responsável.

## Uso seguro

O HomeServer foi projetado principalmente para uso em redes locais. Não exponha a API, interfaces administrativas ou serviços internos diretamente à internet pública sem configurar deliberadamente as camadas de segurança necessárias.

Recomendações básicas:

- mantenha o sistema e o HomeServer atualizados;
- utilize credenciais próprias e não reutilize senhas administrativas;
- nunca versione arquivos `.env`, tokens ou chaves privadas;
- revise cuidadosamente mudanças que adicionem comandos, permissões ou operações privilegiadas;
- mantenha backups e teste a recuperação periodicamente.

## Desenvolvimento

Mudanças que afetem autenticação, autorização, sessões, execução de operações privilegiadas, armazenamento ou exposição de serviços devem incluir validação proporcional ao risco.

A política detalhada de hardening e as evidências técnicas do projeto estão em:

- `planning/security/hardening-plan.md`
- `planning/security/validation.md`
