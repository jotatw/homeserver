# Release Process

> Processo usado quando existir uma decisão explícita de publicar uma **release oficial** do HomeServer.
>
> Durante a consolidação normal, o projeto pode evoluir por planejamento, implementação, testes e validação prática sem criar Tags ou GitHub Releases intermediárias.
>
> O Quality Gate valida o **código**; este processo valida o **lançamento**.

## Política de versionamento durante a consolidação

Antes da primeira release oficial:

- `main` representa o estado atual em evolução;
- commits e branches registram e isolam mudanças;
- documentação registra decisões e aprendizados;
- testes e validação prática fornecem evidências;
- baselines podem existir como referências documentais;
- Tags e Releases não são usadas apenas para marcar progresso.

A primeira Tag e GitHub Release serão criadas somente quando houver uma decisão explícita de publicar uma referência oficial, atualmente planejada como a futura `v1.0.0`.

Depois da primeira release, este processo deve ser aplicado a cada nova versão oficial publicada.

## Pergunta central

> A versão representa um estado que desejamos preservar como referência e está pronta para que um usuário consiga instalar o HomeServer em uma máquina limpa, utilizar as funcionalidades principais e compreender o sistema usando apenas a documentação oficial — sem consultar o código-fonte ou buscar ajuda externa?

## Etapas

### 0. Decisão de release

Antes de iniciar o processo:

- definir explicitamente qual estado será candidato à release;
- confirmar que não se trata apenas de um marco intermediário;
- revisar `definition-of-ready-for-release.md`;
- criar ou atualizar o checklist específico da versão;
- definir o freeze e os critérios aplicáveis.

### 1. Audits e validação final

**Release Audit**

| Check | Critério |
|---|---|
| Instalação | `install.sh` em servidor limpo → servidor funcional |
| Upgrade | versão oficial anterior → atual, quando aplicável |
| Reinicialização | reboot → tudo sobe sozinho (`restart: unless-stopped`) |
| Logs | sem erros críticos conhecidos |
| Docker | sem restart loop inesperado |
| Interface principal | abre e responde conforme esperado |

**Compatibility Audit**

| Ambiente | Estado |
|---|---|
| Navegadores suportados | testar conforme escopo da release |
| Desktop | testar conforme escopo da release |
| Mobile | testar conforme escopo da release |
| Safari/outros | registrar quando relevante |

### 2. Funcionalidades condicionais

Validar apenas os recursos presentes ou afetados pela release.

#### PWA

Quando aplicável:

- `manifest.json` válido;
- comportamento do service worker compatível com o escopo declarado;
- validação prática de instalação, abertura e sessão quando suportado;
- auditoria adicional quando necessária.

#### Polling / dados em tempo real

Quando aplicável:

- intervalo conservador;
- refresh ao retornar ao contexto relevante;
- sem polling duplicado;
- timers limpos ao navegar ou desmontar a interface.

### 3. Contrato App ↔ API

- endpoints e contratos relevantes documentados;
- mudanças incompatíveis avaliadas;
- regra mantida: **toda comunicação entre App e HomeServer ocorre através da API oficial**, salvo uma exceção arquitetural explicitamente documentada.

### 4. Versão e identificação

Quando a versão oficial estiver definida:

- metadados da aplicação alinhados à release;
- mecanismos que dependem da versão testados no estado final;
- a Tag Git é criada somente após os critérios definidos para publicação estarem atendidos.

A ausência de uma tag durante a consolidação não deve ser tratada como falha.

### 5. Acceptance Tests

Criar uma matriz com `PASS | Tempo | Observações` para os cenários relevantes da versão:

| Item | PASS | Tempo | Observações |
|---|---|---|---|
| Login | | | |
| Interface principal | | | |
| Arquivos | | | |
| Usuários | | | |
| Energia | | | |
| Serviços | | | |
| Logout | | | |
| Tema | | | |
| Mobile | | | |

Os cenários devem ser adaptados ao escopo real da release. Exemplos:

1. **Instalação limpa** — servidor sem instalação anterior → documentação → sistema funcional.
2. **Fluxo principal** — executar as funções que representam o uso esperado.
3. **Upgrade** — versão oficial anterior → versão candidata, quando aplicável.
4. **Reboot** — tudo continua funcionando.
5. **Zero Knowledge Test** — máquina limpa, usando apenas a documentação oficial.

### 6. Freeze e Release Candidate

Quando a estabilidade justificar uma etapa de freeze:

- após o freeze, apenas `fix`/`docs`/`test`/`ci` devem ser aceitos;
- nenhuma funcionalidade nova entra sem reiniciar a avaliação do escopo;
- se necessário, uma Release Candidate pode ser criada;
- RC → bug → correção → nova RC ou nova validação;
- RC aprovada → versão final.

Uma RC é opcional quando o porte da release não justificar essa etapa.

### 7. Publish, Tag e Release

Somente após aprovação final:

1. executar as validações finais;
2. atualizar documentação, CHANGELOG e Known Issues;
3. preparar os artefatos aplicáveis;
4. criar a Tag da versão;
5. publicar os artefatos necessários;
6. criar a GitHub Release;
7. registrar a estratégia de rollback ou recuperação aplicável.

A publicação automatizada pode usar tags `v*` quando o workflow estiver configurado para isso. A automação não substitui os critérios de prontidão.

### 8. Rollback e recuperação

Antes da publicação, registrar como retornar a um estado conhecido quando isso for aplicável:

```text
Problema após publicação
        ↓
Avaliar impacto
        ↓
Corrigir e republicar
        ou
Restaurar referência oficial anterior
        ↓
Registrar a decisão e as consequências
```

A estratégia concreta depende da arquitetura e dos artefatos da versão.

### 9. Documentos da release

Para cada release oficial:

- CHANGELOG atualizado, incluindo Known Issues quando houver;
- checklist específico da versão;
- release notes voltadas ao usuário;
- evidências das validações relevantes;
- referência para a Tag e GitHub Release após publicação.

---

## Definition of Ready for Release

Critérios permanentes: `definition-of-ready-for-release.md`.

## Relação com o baseline

Baselines são referências documentais e não criam automaticamente Tags, Releases ou contratos de estabilidade.

## Política de suporte

Quando existir política de suporte por versão, consultar `planning/support/support-policy.md`.
