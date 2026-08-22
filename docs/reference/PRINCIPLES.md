# Princípios Arquiteturais

> Princípios permanentes do HomeServer.
>
> Estes princípios registram decisões arquiteturais e de experiência que orientam a evolução do projeto. Eles servem como referência para manter a coerência da plataforma sem precisar revisitar discussões passadas.

Os princípios representam decisões duradouras. Implementações podem mudar, mas mudanças que contrariem estes princípios devem ser avaliadas explicitamente e, quando relevantes, registradas por meio de ADR.

---

## 1. Simplicidade para o usuário

O HomeServer deve reduzir a complexidade técnica necessária para operar um servidor doméstico. O usuário não deve precisar conhecer Linux, Docker, systemd, comandos de terminal, permissões ou detalhes internos da infraestrutura para realizar operações normais.

Cada funcionalidade adicionada deve justificar a complexidade que introduz. A plataforma prefere uma solução simples e compreensível a uma solução repleta de recursos desnecessários.

---

## 2. Interfaces adequadas ao contexto

O HomeServer pode oferecer interfaces com papéis diferentes conforme o contexto de uso.

O Desktop é a interface principal para gerenciamento e operações que exigem mais contexto ou controle. O Mobile prioriza acesso rápido às ações frequentes e não precisa reproduzir automaticamente todas as funcionalidades do Desktop.

As interfaces utilizam capacidades da plataforma por contratos apropriados. Uma capacidade pode ser disponibilizada gradualmente em diferentes interfaces conforme sua utilidade e maturidade.

---

## 3. Intent-First

O usuário interage com objetivos e tarefas, não com detalhes da implementação.

A interface deve representar intenções como criar usuário, acessar arquivos, conectar dispositivo, executar backup, verificar serviços, reiniciar um serviço ou agendar uma operação.

A implementação interna necessária para concluir essas tarefas não deve ser exposta como requisito para o usuário. Por exemplo, uma ação de reiniciar serviço não deve exigir que o usuário conheça o nome do container, o comando Docker ou a localização do compose correspondente.

---

## 4. Uma responsabilidade por componente

Cada componente possui uma responsabilidade bem definida. Componentes pequenos, focados e desacoplados são mais fáceis de manter, testar e evoluir.

A responsabilidade deve estar clara independentemente de o componente pertencer à Foundation, Infrastructure, Adapters, Applications ou Modules.

---

## 5. Foundation nunca depende de Infrastructure

A Foundation é a biblioteca base e não conhece a Infrastructure, os módulos ou qualquer serviço específico. As dependências sempre apontam das camadas superiores para as inferiores.

---

## 6. Infrastructure nunca depende de Modules

A Infrastructure gerencia capacidades genéricas, como armazenamento, usuários, dispositivos e serviços. Ela não deve depender do conhecimento de módulos específicos instalados.

---

## 7. Toda integração externa passa por Adapters

A Infrastructure não deve conversar diretamente com serviços externos como FileBrowser ou Gitea. Toda integração externa passa pela camada de Adapters, permitindo substituir um componente sem reescrever a lógica central.

---

## 8. API como fronteira da plataforma

A API representa a fronteira entre as interfaces externas e a infraestrutura interna do HomeServer.

As interfaces de usuário não devem depender diretamente de comandos internos, nomes de containers, caminhos internos, volumes Docker, units do systemd ou scripts específicos.

A API expõe contratos estáveis para as capacidades da plataforma e encaminha operações para as camadas apropriadas. Uma mudança interna não deve exigir mudança na experiência do usuário quando o contrato puder permanecer compatível.

As APIs devem permanecer previsíveis e consistentes, seguindo contratos documentados por recurso.

---

## 9. Complexidade encapsulada

As camadas internas são responsáveis pelos detalhes técnicos necessários para executar uma operação.

```text
Usuário
   ↓
Interface adequada ao contexto
   ↓
API
   ↓
Core / Infrastructure / Adapters
   ↓
Sistema e Serviços
```

Cada camada deve conhecer apenas as responsabilidades necessárias para cumprir sua função. Detalhes de uma camada inferior não devem vazar desnecessariamente para as camadas superiores.

---

## 10. Serviços com responsabilidade clara

Cada serviço deve possuir responsabilidade definida e dependências explícitas.

Sempre que possível, um serviço deve possuir:

- configuração própria;
- dados persistentes identificáveis;
- dependências documentadas;
- lifecycle definido;
- mecanismo de health ou verificação de estado;
- contrato claro de integração com a plataforma.

Um serviço não deve depender de detalhes internos de outro serviço quando um contrato ou interface apropriada puder ser utilizado.

---

## 11. Storage pertence ao HomeServer, nunca aos módulos

Os dados persistentes do HomeServer ficam centralizados em `/srv/storage`, enquanto os backups ficam separados em `/srv/backup`. Infraestrutura de containers, código e configuração ficam em seus respectivos diretórios: `/srv/docker`, `/srv/git` e `/srv/config`.

Módulos não devem criar estruturas de dados paralelas fora do modelo oficial.

---

## 12. Modularidade opcional e preservação de dados

O núcleo da plataforma não deve depender do conhecimento antecipado de todos os módulos que poderão existir no futuro.

Novos módulos devem reutilizar contratos e capacidades existentes sempre que possível. A adição de um módulo não deve exigir alterações arbitrárias em múltiplas camadas apenas para reconhecer sua existência.

Quando um módulo for opcional, sua instalação, indisponibilidade ou remoção não deve comprometer o Core nem dados que não pertençam à responsabilidade declarada do módulo.

O objetivo é evoluir em direção a uma arquitetura onde módulos possam declarar claramente:

- sua identidade;
- suas dependências;
- sua configuração;
- seus dados;
- suas capacidades;
- seu estado ou health;
- seus pontos de integração;
- sua política de instalação, remoção e preservação de dados.

O contrato concreto de modularidade deve ser definido, validado e documentado antes de novas suposições serem tratadas como comportamento oficial.

---

## 13. Automações são desacopladas por hooks

Automações vivem em `automation/hooks/<evento>/`. Cada evento executa os scripts registrados em sua pasta. Novas automações devem poder ser adicionadas sem alterar o código do núcleo.

Automações experimentais podem permanecer fora da base principal enquanto sua utilidade, custo e comportamento ainda estão sendo avaliados.

---

## 14. Falha isolada não deve derrubar a plataforma

O HomeServer deve continuar utilizável mesmo com um módulo indisponível, quando a dependência não for essencial para a operação solicitada.

A falha de um módulo não deve derrubar a plataforma. O estado indisponível deve ser reportado claramente.

---

## 15. Uma fonte de verdade por responsabilidade

Uma responsabilidade deve possuir uma fonte de verdade claramente definida.

Devem ser evitadas duplicações de configuração, estado ou regras de negócio entre App, API, CLI, scripts, serviços e arquivos de configuração.

Interfaces diferentes podem oferecer acesso à mesma capacidade, mas não devem manter implementações divergentes dessa capacidade.

---

## 16. Feedback compreensível

Uma operação deve produzir informações compreensíveis sobre seu resultado.

A plataforma deve permitir que interfaces respondam claramente:

- o que está acontecendo;
- se a operação foi concluída;
- o que mudou;
- quando uma operação falhou;
- qual é a próxima ação possível.

Detalhes técnicos podem ser disponibilizados para diagnóstico, mas não devem ser a única explicação apresentada ao usuário final.

---

## 17. Recuperação antes de complexidade

Quando uma operação puder falhar, a plataforma deve preferir fornecer um caminho claro de recuperação em vez de exigir diagnóstico técnico imediato do usuário.

Sempre que possível, uma falha deve permitir:

1. identificar o problema;
2. explicar seu impacto;
3. indicar uma ação possível;
4. permitir nova tentativa ou recuperação;
5. disponibilizar detalhes técnicos quando necessários.

---

## 18. CLI como interface avançada

O CLI continua sendo uma interface importante do HomeServer, utilizada principalmente para instalação, automação, testes, diagnóstico, recuperação e manutenção avançada.

O CLI pode oferecer capacidades antes das interfaces visuais durante a evolução da plataforma. Porém, funcionalidades consideradas parte da operação normal do usuário final devem ser avaliadas para exposição por contratos apropriados e pelas interfaces em que realmente façam sentido.

---

## 19. Evolução por contratos

Novas funcionalidades devem preferir contratos explícitos a dependências implícitas entre componentes.

Antes de introduzir uma dependência entre serviços ou módulos, deve ser possível responder:

- qual capacidade está sendo utilizada?
- qual é o contrato dessa capacidade?
- quem é responsável por ele?
- quais consumidores dependem dele?
- a implementação pode mudar sem quebrar os consumidores?

Mudanças estruturais relevantes devem ser avaliadas e registradas conforme a política de ADR do projeto.

---

## 20. Validação antes de consolidação

Código implementado não é, por si só, evidência de que uma solução está consolidada.

Novas capacidades devem ser avaliadas por implementação, testes, documentação e, quando aplicável, uso no ambiente real. Evidências podem justificar consolidar, melhorar, refatorar, continuar experimentando ou remover uma solução.

---

## 21. Melhorias justificadas

Cada mudança deve justificar seu custo técnico e operacional. Uma nova funcionalidade pode ser válida quando melhora diretamente a experiência, confiabilidade, segurança, manutenção ou capacidade de evolução.

Funcionalidades não devem ser adicionadas apenas porque poderiam existir.

---

## 22. Estabilidade sobre quantidade

Arquitetura estável é mais importante que quantidade de funcionalidades. Mudanças estruturais devem ser justificadas e avaliadas antes de introduzir novos acoplamentos ou complexidade permanente.

---

## Definição de módulo

> Um módulo é um componente opcional ou independente que amplia uma capacidade do HomeServer, reutilizando contratos da plataforma e podendo ser instalado ou removido conforme sua política sem exigir alterações arbitrárias na Foundation ou Infrastructure.

A classificação concreta entre módulos de produto, serviços e outras extensões deve seguir os contratos arquiteturais definidos pelo projeto.

---

## Aplicação dos princípios

Durante planejamento, implementação e revisão, mudanças relevantes devem ser avaliadas pelas seguintes perguntas:

1. Isso reduz ou aumenta a complexidade para o usuário final?
2. O usuário precisa conhecer detalhes técnicos para concluir a tarefa?
3. A capacidade possui um contrato claro?
4. A interface depende de contratos, e não da implementação interna?
5. Existe duplicação de responsabilidade?
6. Um serviço ou módulo está excessivamente acoplado a outro?
7. A implementação pode evoluir sem alterar desnecessariamente outras camadas?
8. Em caso de falha, existe informação e recuperação compreensíveis?
9. A complexidade adicionada é proporcional ao benefício?
10. Existe evidência suficiente para consolidar a solução ou ela ainda deve permanecer experimental?

Uma resposta negativa não impede automaticamente uma implementação, mas o compromisso arquitetural e suas consequências devem ser explícitos.

---

## Relação com outros documentos

Este documento define os princípios.

- `ARCHITECTURE.md` define a organização das camadas e componentes.
- ADRs registram decisões arquiteturais específicas e relevantes.
- `planning/foundations/` registra fundamentos gerais de evolução e validação.
- `planning/strategy.md` define a direção estratégica do projeto.
- `planning/roadmap/evolution.md` define as fases e áreas de evolução.
- `planning/quality/user-quality-of-life.md` mede como esses princípios se refletem na experiência do usuário.
