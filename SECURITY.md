# Política de Segurança

## Versões suportadas

O projeto segue a linha de versões publicada no `CHANGELOG.md`.

| Versão | Suporte |
|---|---|
| v2.x | Suportada |
| v1.x | Manutenção enquanto a v2.0 é finalizada |
| Versões anteriores | Não suportadas |

Correções de segurança devem ser aplicadas preferencialmente à versão mais recente suportada.

## Reportando uma vulnerabilidade

Não abra uma issue pública do GitHub para uma vulnerabilidade de segurança ainda não divulgada.

Reporte o problema de forma privada pelo canal de segurança disponível no repositório. Inclua:

- versão afetada;
- componente ou arquivo afetado;
- passos para reproduzir;
- comportamento esperado e comportamento observado;
- possível impacto;
- mitigação sugerida, se conhecida.

Não inclua senhas, tokens de API, chaves privadas, dados pessoais ou outros segredos no relatório.

## Escopo

Relatórios podem envolver o Core, API, instalador, autenticação, mecanismo de atualização, configuração Docker, permissões de armazenamento ou outros componentes mantidos neste repositório.

Serviços de terceiros integrados ao HomeServer podem possuir suas próprias políticas de segurança. Quando apropriado, vulnerabilidades também devem ser reportadas ao projeto responsável pelo serviço.

## Orientações gerais

O HomeServer foi projetado principalmente para redes locais confiáveis. Não exponha a API ou interfaces administrativas diretamente à internet pública sem configurar deliberadamente uma camada de segurança adequada.

Mantenha o sistema atualizado, utilize credenciais próprias para cada instalação e nunca versione arquivos `.env`, tokens ou chaves privadas.
