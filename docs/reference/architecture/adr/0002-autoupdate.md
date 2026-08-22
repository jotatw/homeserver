# ADR-0002 — Estratégia de atualização do HomeServer

## Status

Aceito

Esta decisão substitui a estratégia anterior baseada obrigatoriamente em tags e releases.

## Data

2026-08-22

## Contexto

A implementação anterior tratava tags `vX.Y.Z` como a única referência para verificar e aplicar atualizações.

Isso não representa o estado atual do projeto. O HomeServer permanece em desenvolvimento contínuo e mudanças ainda são validadas no ambiente real antes de uma versão estável ser consolidada.

Nesse cenário, existem dois problemas principais:

```text
Tags/releases ausentes ou antigas
→ não representam necessariamente o código atual

main
→ pode avançar mesmo sem uma nova versão formal
```

A estratégia anterior também misturava conceitos diferentes:

```text
Atualização do código do HomeServer
≠ atualização dos pacotes do sistema operacional
```

Além disso, o HomeServer incentiva personalização. Uma atualização automática não deve sobrescrever silenciosamente modificações locais ou tentar resolver divergências de Git sem informar o administrador.

## Decisão

O HomeServer separa **atualização de código** de **atualização do sistema operacional**.

### Código do HomeServer

Enquanto não existir uma linha estável de releases, a referência padrão para atualização é o commit remoto da branch acompanhada, atualmente `main`.

```text
Instalação local
        ↓
git fetch
        ↓
Comparar HEAD com origem acompanhada
        ↓
Estado conhecido
        ├── atualizado
        ├── atrás do remoto
        ├── modificações locais
        ├── commits locais
        └── histórico divergente
```

A atualização não depende da existência de uma tag.

### Sistema operacional

Atualizações de pacotes continuam sendo uma operação independente:

```text
Atualização do HomeServer
→ código, dependências e componentes do projeto

Atualização do sistema
→ pacotes gerenciados pelo sistema operacional
```

Uma operação não deve assumir automaticamente que deve executar a outra.

---

## Estados de atualização

Antes de aplicar uma atualização, o sistema deve identificar pelo menos:

```text
Atualizado
→ HEAD já corresponde ao destino acompanhado

Atualização disponível
→ destino remoto possui commits à frente

Modificado localmente
→ existem alterações não confirmadas

À frente do remoto
→ existem commits locais ainda não presentes no destino

Divergente
→ instalação local e destino remoto possuem históricos diferentes

Destino indisponível
→ não foi possível consultar a origem remota
```

Esses estados devem ser informados ao consumidor. Um simples `update: true/false` não é suficiente para explicar se uma atualização é realmente segura.

---

## Aplicação da atualização

O fluxo preferencial é:

```text
1. Consultar origem remota
        ↓
2. Identificar estado do repositório
        ↓
3. Validar se atualização automática é segura
        ↓
4. Registrar ponto de recuperação local
        ↓
5. Atualizar somente por fast-forward
        ↓
6. Executar etapas necessárias da atualização
        ↓
7. Validar resultado
        ↓
8. Informar estado final
```

A aplicação automática deve ocorrer apenas quando o repositório estiver em condição segura para fast-forward.

Por padrão, a operação deve recusar aplicar automaticamente quando houver:

- alterações locais não confirmadas;
- histórico divergente;
- conflitos que exigiriam merge manual;
- destino remoto indisponível.

Commits locais devem ser identificados explicitamente. Uma futura estratégia para instalações personalizadas poderá definir um fluxo próprio para rebase, branches de personalização ou outra forma de manutenção, mas isso não deve ser resolvido silenciosamente pelo mecanismo padrão.

---

## Ponto de recuperação

Antes de uma atualização de código, deve existir uma referência local que permita identificar o commit anterior.

O mecanismo concreto pode evoluir, mas deve preservar:

```text
origem da atualização
commit anterior
commit de destino
momento da operação
resultado
```

O ponto de recuperação não significa que todo rollback pode ser executado automaticamente.

Se uma atualização alterar dados, configurações persistentes ou executar migrações, retornar apenas o código pode não restaurar o estado completo do sistema.

Por isso:

```text
Recuperação de código
≠ rollback universal do ambiente
```

Rollback automático só deve ser introduzido quando suas consequências forem conhecidas e validadas.

---

## Pós-atualização

Uma atualização pode exigir etapas adicionais, como:

- atualização de dependências;
- reconstrução ou reinício de componentes;
- instalação ou atualização de módulos;
- migração explícita;
- verificação de saúde.

Essas etapas não devem ser executadas apenas porque existe um comando chamado `update`.

A implementação deve saber quais etapas são necessárias para a mudança aplicada ou utilizar um processo de atualização claramente definido.

Após a operação, deve existir uma validação proporcional ao impacto, por exemplo:

```text
Código atualizado
        ↓
Componente necessário reiniciado/reimplantado
        ↓
Verificação básica de saúde
        ↓
Resultado informado
```

---

## Evolução para releases estáveis

Quando o projeto possuir uma linha estável consolidada, tags e releases podem voltar a ser utilizadas como **destinos de atualização estáveis**.

O modelo poderá então ser:

```text
Desenvolvimento
→ branch acompanhada por instalações experimentais

Estável
→ release/tag explícita
```

A existência de um mecanismo por branch agora não impede a criação futura de canais estáveis.

A mudança para esse modelo deve ocorrer quando existir uma versão suficientemente consolidada, em vez de criar tags apenas para marcar estados intermediários ou experimentais.

---

## Consequências

### Positivas

- funciona durante o desenvolvimento sem depender de releases frequentes;
- representa diretamente o estado real da origem acompanhada;
- separa atualização do projeto e do sistema operacional;
- evita sobrescrever modificações locais silenciosamente;
- torna divergências visíveis antes da aplicação;
- preserva atualizações simples por fast-forward;
- prepara a transição futura para canais estáveis por release;
- evita tratar uma tag como sinônimo de código necessariamente utilizável.

### Custos e limites

- instalações personalizadas exigem atenção ao estado do Git;
- uma atualização por branch pode trazer mudanças ainda em validação;
- não existe rollback universal automático;
- o mecanismo precisa identificar mais estados do que apenas "há atualização";
- etapas pós-atualização precisam ser explicitamente definidas e validadas.

---

## Alternativas consideradas

### 1. Continuar dependendo exclusivamente de tags e releases

**Não adotada no estado atual.**

O projeto ainda evolui entre marcos estáveis e não utiliza releases para representar cada mudança validada.

### 2. Sempre executar `git pull` independentemente do estado local

**Não adotada.**

Pode falhar, sobrescrever expectativas do administrador ou esconder a necessidade de resolver personalizações e divergências.

### 3. Atualizar sempre com `reset --hard`

**Não adotada.**

Descartaria alterações locais e é incompatível com uma plataforma que permite personalização.

### 4. Branch acompanhada com verificação de estado e fast-forward seguro

**Adotada.**

Permite desenvolvimento contínuo agora, mantém o processo simples e pode coexistir com futuros canais estáveis por release.

### 5. Criar imediatamente um sistema completo de canais, manifests e atualizações diferenciais

**Não adotada.**

Não há necessidade prática suficiente para justificar essa complexidade neste momento.

---

## Relação com outros documentos

- [`../../PRINCIPLES.md`](../../PRINCIPLES.md) — evolução baseada em evidência prática;
- [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md) — organização atual da plataforma;
- [`../../../contribute/CONTRIBUTING.md`](../../../contribute/CONTRIBUTING.md) — personalização e modificações locais;
- [`../../../contribute/TESTING.md`](../../../contribute/TESTING.md) — validação após mudanças;
- [`0006-architecture-freeze.md`](0006-architecture-freeze.md) — estabilidade com evolução controlada.
