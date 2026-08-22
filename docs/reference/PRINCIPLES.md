# Princípios do HomeServer

> Princípios duradouros que orientam decisões sobre experiência, arquitetura e evolução.

Este documento registra ideias que devem continuar válidas mesmo quando a implementação concreta mudar. Ele não define caminhos específicos, nomes de diretórios, mecanismos de hooks ou detalhes de serviços.

Quando uma mudança contrariar um princípio, isso deve ser uma decisão consciente. Mudanças arquiteturais relevantes podem exigir registro em `architecture/adr/`.

---

## 1. Simplicidade para o usuário

O HomeServer deve reduzir a complexidade técnica necessária para operar um servidor doméstico.

O usuário não deve precisar conhecer Linux, Docker, systemd, comandos de terminal, permissões ou detalhes internos para realizar operações normais.

Cada funcionalidade deve justificar a complexidade que introduz. A plataforma prefere uma solução simples e compreensível a recursos adicionados sem necessidade real.

---

## 2. Interfaces adequadas ao contexto

Uma mesma plataforma pode oferecer interfaces diferentes para necessidades diferentes.

O Desktop é voltado para gerenciamento e tarefas que exigem mais contexto ou controle. O Mobile prioriza acesso rápido às ações frequentes e não precisa reproduzir automaticamente todas as funções do Desktop.

Uma capacidade pode aparecer gradualmente nas interfaces conforme sua utilidade e maturidade.

---

## 3. Intent-First

O usuário interage com objetivos, não com detalhes de implementação.

A plataforma deve representar intenções como:

- criar um usuário;
- acessar arquivos;
- conectar um dispositivo;
- executar um backup;
- verificar serviços;
- reiniciar uma capacidade;
- agendar uma operação.

Os detalhes técnicos necessários para concluir a tarefa devem permanecer encapsulados sempre que possível.

---

## 4. Responsabilidades claras

Cada componente deve possuir uma responsabilidade identificável.

A separação de responsabilidades facilita:

- compreensão;
- testes;
- manutenção;
- substituição de implementações;
- evolução independente.

Componentes não precisam ser artificialmente pequenos. O objetivo é evitar responsabilidades confusas ou misturadas sem necessidade.

---

## 5. Dependências respeitam fronteiras

Dependências devem seguir responsabilidades claras.

Camadas de base não devem depender de capacidades mais específicas. Componentes genéricos não devem conhecer antecipadamente serviços, módulos ou interfaces que não pertencem à sua responsabilidade.

A organização concreta dessas camadas está definida em [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## 6. Integrações devem ser isoladas

Detalhes de componentes externos devem permanecer isolados por fronteiras apropriadas.

A plataforma deve evitar espalhar conhecimento específico de uma integração por várias partes do sistema quando uma camada ou contrato pode concentrar essa responsabilidade.

Isso reduz o impacto de substituir, atualizar ou remover uma integração externa.

---

## 7. Contratos antes de detalhes internos

Interfaces e consumidores devem depender de contratos, não de detalhes internos arbitrários.

Uma mudança interna deve, sempre que possível, preservar o comportamento esperado pelos consumidores.

Devem ser evitadas dependências diretas de detalhes como:

- comandos internos;
- nomes privados de processos ou containers;
- caminhos internos;
- arquivos de implementação;
- mecanismos específicos que não fazem parte do contrato público.

---

## 8. Complexidade encapsulada

Cada camada deve conhecer apenas o necessário para cumprir sua responsabilidade.

Detalhes de camadas inferiores não devem vazar desnecessariamente para usuários ou consumidores de nível superior.

O objetivo é permitir que uma intenção seja expressa de forma simples enquanto a plataforma administra os detalhes técnicos necessários.

---

## 9. Modularidade sem dependência desnecessária

O núcleo da plataforma não deve depender antecipadamente de todas as extensões que poderão existir.

Uma capacidade opcional deve possuir responsabilidade clara e não comprometer componentes independentes apenas por estar indisponível ou ser removida.

A definição concreta de módulos e seus contratos pertence à arquitetura. Este princípio define apenas a direção: **extensões devem ampliar a plataforma sem criar acoplamento desnecessário no núcleo**.

---

## 10. Dados com responsabilidade e fonte de verdade claras

Dados, configuração, estado e regras devem possuir responsáveis identificáveis.

Devem ser evitadas duplicações de fonte de verdade entre interfaces, API, CLI, scripts e serviços.

A localização física dos dados pode evoluir. O princípio permanente é que sua responsabilidade, persistência e recuperação sejam claras.

---

## 11. Falhas devem ser isoladas quando possível

A falha de uma capacidade não deve tornar indisponíveis outras capacidades independentes sem necessidade.

Quando algo falhar, o sistema deve preservar o que continua funcionando e informar claramente a indisponibilidade.

Dependências realmente essenciais podem exigir outro comportamento, mas essa relação deve ser explícita.

---

## 12. Feedback e recuperação compreensíveis

Uma operação deve permitir entender:

- o que está acontecendo;
- se foi concluída;
- o que mudou;
- quando falhou;
- qual é a próxima ação possível.

Quando possível, a plataforma deve oferecer um caminho de recuperação antes de exigir diagnóstico técnico detalhado.

Detalhes técnicos continuam importantes para manutenção e diagnóstico, mas não devem ser a única explicação disponível ao usuário.

---

## 13. Interfaces diferentes não duplicam a mesma lógica

Desktop, Mobile, CLI e outras interfaces podem oferecer acesso à mesma capacidade, mas não devem manter implementações divergentes da mesma regra sem necessidade.

A lógica deve permanecer na fronteira responsável, permitindo que diferentes interfaces reutilizem o comportamento de forma consistente.

---

## 14. Evolução por evidências

Código implementado não é, por si só, prova de que uma solução está consolidada.

Novas capacidades podem precisar de:

- implementação;
- testes;
- documentação;
- validação no ambiente real;
- uso prático;
- avaliação de segurança, impacto e manutenção.

As evidências podem justificar consolidar, melhorar, refatorar, manter em experimentação ou remover uma solução.

---

## 15. Melhorias precisam justificar sua complexidade

Uma nova capacidade pode ser válida quando melhora diretamente a experiência, confiabilidade, segurança, manutenção ou evolução futura.

Funcionalidades não devem ser adicionadas apenas porque poderiam existir.

A pergunta principal é:

> O benefício real justifica o custo técnico e operacional?

---

## 16. Estabilidade sobre quantidade

Uma base estável é mais importante que acumular funcionalidades.

Mudanças estruturais devem ser justificadas antes de introduzir novos acoplamentos ou complexidade permanente.

Quando a experiência prática demonstrar que uma decisão anterior não foi adequada, ela pode ser revisada conscientemente.

---

## Aplicação dos princípios

Durante planejamento, implementação ou revisão, perguntas úteis incluem:

1. Isso reduz ou aumenta a complexidade para o usuário?
2. O usuário precisa conhecer detalhes técnicos para concluir a tarefa?
3. A responsabilidade está clara?
4. Existe um contrato ou fronteira apropriada?
5. Há duplicação de estado, configuração ou lógica?
6. A mudança cria acoplamento desnecessário?
7. Uma implementação pode evoluir sem quebrar consumidores desnecessariamente?
8. Uma falha afeta apenas o que realmente depende dela?
9. O usuário consegue entender o resultado e recuperar-se de erros previsíveis?
10. A complexidade adicionada é proporcional ao benefício?
11. Existe evidência suficiente para consolidar a solução?

Uma resposta negativa não impede automaticamente uma implementação. O importante é que o compromisso e suas consequências sejam explícitos.

---

## Relação com outros documentos

```text
PRINCIPLES.md
→ princípios duradouros

ARCHITECTURE.md
→ organização e fronteiras atuais

architecture/
→ contratos e detalhes arquiteturais

architecture/adr/
→ decisões estruturais específicas

planning/
→ estratégia, fundamentos e evolução futura
```

Detalhes concretos de armazenamento, automações, módulos, TLS, serviços e outras implementações devem permanecer em seus documentos específicos.