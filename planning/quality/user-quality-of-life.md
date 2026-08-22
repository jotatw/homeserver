# Qualidade de Vida do Usuário

## Propósito

Este documento transforma a direção estratégica do HomeServer em critérios práticos de avaliação da experiência.

O objetivo da plataforma não é apenas disponibilizar capacidades. É permitir que uma pessoa utilize as capacidades suportadas com o mínimo possível de conhecimento sobre a infraestrutura interna.

A pergunta central é:

> O usuário consegue concluir sua tarefa sem precisar aprender como a infraestrutura funciona?

Este documento acompanha a evolução entre CLI, API, Desktop e Mobile e serve como guia de priorização e validação contínua.

---

## Princípio de medição

Uma capacidade pode existir tecnicamente e ainda não estar madura para o usuário final.

Por isso, a avaliação distingue:

- **Existe** — a capacidade está implementada em alguma camada.
- **Acessível** — existe uma interface suportada para utilizá-la no contexto adequado.
- **Compreensível** — o usuário entende o objetivo da operação.
- **Operável** — a tarefa pode ser concluída sem conhecimento técnico desnecessário.
- **Recuperável** — falhas apresentam orientação ou um caminho claro para continuar.
- **Validada** — existem evidências suficientes para o critério definido.

Uma capacidade orientada ao usuário final pode evoluir progressivamente por esses níveis. Nem toda capacidade precisa estar disponível em todas as interfaces.

---

## Estados

| Estado | Significado |
|---|---|
| ⚪ Planejado | Direção definida, ainda sem implementação validada. |
| 🔴 Ausente | A capacidade necessária não existe. |
| 🟡 Parcial | Existe, mas possui lacunas de integração, usabilidade, contexto ou recuperação. |
| 🟢 Operacional | Pode ser utilizada de forma suportada no contexto atual. |
| ✅ Validado | Foi testado com evidência suficiente para o critério definido. |

**Importante:** corrigido ou implementado não significa automaticamente validado. Um item só recebe ✅ quando houver evidência de funcionamento de acordo com o critério correspondente.

---

# Matriz de Capacidades

A matriz representa acompanhamento de alto nível. O estado real deve ser atualizado conforme auditorias, testes, uso real e evolução do projeto.

| Capacidade | CLI | API | Desktop/App | Mobile | Terminal necessário para uso normal | Estado | Evidência |
|---|---|---|---|---|---|---|---|
| Ver estado do servidor | Sim | Sim | Parcial | ⚪ | Não, quando a interface suportar o fluxo | 🟡 | Baseline e testes atuais |
| Autenticação | Sim | Sim | Sim | ⚪ | Não | 🟢 | Testes de API e sessão |
| Gerenciar usuários | Sim | Sim | Sim | ⚪ | Não para operações suportadas | 🟢 | CLI/API/App devem permanecer alinhados |
| Acessar arquivos | Serviço | Integração limitada | Serviço externo | Direção futura | Não para acesso normal | 🟡 | Depende do contrato do serviço |
| Gerenciar serviços | Sim | Sim | Parcial | ⚪ | Não, quando operações forem expostas | 🟡 | Auditoria de serviços |
| Dispositivos | Sim | Sim | Parcial | ⚪ | Não, quando fluxo estiver completo | 🟡 | Gaps conhecidos |
| Armazenamento | Sim | Sim | Parcial | ⚪ | Não, quando fluxo estiver completo | 🟡 | Gaps conhecidos e testes |
| Backup | Sim | Conforme capacidade atual | Parcial | ⚪ | Não, quando integrado | 🟡 | Auditoria e smoke tests |
| Energia | Sim | Sim | Sim | ⚪ | Não para operações suportadas | 🟢 | API/App |
| Agendamento | Sim | Conforme capacidade atual | ⚪ | ⚪ | Sim atualmente | ⚪ | Evidências e roadmap ativo |
| Instalação | Sim | N/A | N/A | N/A | Sim, procedimento técnico inicial | 🟡 | Requer validação em ambiente limpo |
| Atualização | Sim | Conforme capacidade atual | Parcial | ⚪ | Não, quando fluxo for suportado | 🟡 | Requer validação operacional |
| Recuperação avançada | Sim | N/A | N/A | N/A | Sim | 🟢 | Interface avançada por definição |

A matriz não afirma que todas as capacidades possuem o mesmo nível de maturidade. Ela torna lacunas explícitas e evita que funcionalidades parcialmente integradas sejam consideradas concluídas.

---

# Critério por tarefa

Uma tarefa normal deve ser avaliada em cinco perguntas.

## 1. Descoberta

O usuário consegue encontrar onde realizar a tarefa?

Critério desejado:

> A capacidade possui um ponto de entrada identificável pela sua intenção.

## 2. Compreensão

O usuário entende o que acontecerá?

A interface deve preferir intenções como:

- Criar usuário;
- Executar backup;
- Reiniciar serviço;
- Montar armazenamento.

Ela não deve exigir conhecimento prévio de comandos, containers ou arquivos de configuração apenas para entender a ação.

Critério desejado:

> O nome, contexto e consequência principal da operação são compreensíveis.

## 3. Execução

O usuário consegue concluir a tarefa sem detalhes técnicos desnecessários?

A sequência desejada é:

```text
Intenção
   ↓
Interface adequada ao contexto
   ↓
Validação
   ↓
API / contrato, quando aplicável
   ↓
Capacidade da plataforma
   ↓
Resultado
```

O usuário não deve precisar executar uma sequência adicional no terminal para concluir uma tarefa que a própria interface declara como suportada.

Critério desejado:

> Uma operação suportada é concluída pela interface em que foi iniciada.

## 4. Feedback

Uma operação deve permitir identificar, quando aplicável:

- que foi iniciada;
- que está em andamento;
- que foi concluída;
- que falhou;
- qual foi o resultado;
- qual é a próxima ação possível.

O sucesso não deve depender de o usuário interpretar logs técnicos.

Critério desejado:

> O resultado é compreensível sem depender do terminal.

## 5. Recuperação

Quando uma operação falha, o usuário deve receber uma forma de continuar.

A ordem desejada é:

```text
Falha detectada
      ↓
Explicação compreensível
      ↓
Impacto
      ↓
Ação possível
      ↓
Nova tentativa / recuperação
      ↓
Detalhes técnicos, quando necessários
```

Critério desejado:

> A primeira resposta à falha orienta a recuperação; o detalhe técnico é complementar.

---

# Regra do Terminal

O objetivo não é eliminar o terminal do HomeServer.

O terminal permanece apropriado para:

- instalação inicial;
- diagnóstico avançado;
- recuperação de falhas graves;
- desenvolvimento;
- automação;
- manutenção técnica;
- operações ainda não suportadas por uma interface adequada.

Para uso normal, a plataforma deve reduzir a necessidade de conhecimento técnico quando existir uma interface que declare suporte à tarefa.

Uma capacidade não deve ser marcada como plenamente suportada em uma interface se o usuário ainda precisa obrigatoriamente executar comandos adicionais para concluir seu fluxo normal.

---

# Interfaces adequadas ao contexto

Desktop e Mobile possuem papéis diferentes.

O Desktop é a interface principal para gerenciamento e operações que exigem mais contexto ou controle. O Mobile prioriza acesso rápido às ações frequentes e não precisa reproduzir automaticamente todas as funcionalidades do Desktop.

A ausência de uma capacidade no Mobile não representa, por si só, uma falha de qualidade. A pergunta é se aquela capacidade realmente beneficia o contexto de uso mobile.

---

# Qualidade de Integração

Uma capacidade disponível em mais de uma interface deve preservar uma fonte de verdade.

O modelo desejado é:

```text
Desktop ───────┐
               │
Mobile ────────┼──► API / contrato ───► Capacidade da Plataforma
               │
CLI ───────────┘
```

As interfaces podem oferecer experiências diferentes, mas não devem manter regras de negócio divergentes para a mesma capacidade.

---

# Critério para considerar uma capacidade pronta para o usuário

Uma capacidade pode ser considerada pronta para operação normal quando, conforme seu contexto:

- [ ] possui responsabilidade e fonte de verdade definidas;
- [ ] possui um fluxo suportado de entrada e execução;
- [ ] valida entradas relevantes;
- [ ] apresenta sucesso e falha de maneira compreensível;
- [ ] não exige conhecimento técnico desnecessário;
- [ ] não exige terminal para concluir o fluxo quando a interface declara suporte;
- [ ] possui tratamento ou orientação básica de recuperação;
- [ ] possui testes adequados ao seu nível de risco;
- [ ] possui documentação quando necessária;
- [ ] possui evidência de validação.

O atendimento parcial não deve ser confundido com conclusão.

---

# Métricas e evidências

A qualidade de vida deve ser medida por evidência, não apenas pela existência de uma tela ou endpoint.

Fontes de evidência incluem:

- testes automatizados;
- smoke tests;
- testes de instalação limpa;
- testes de atualização quando aplicável;
- testes de reboot e recuperação quando aplicável;
- validação manual de fluxos nas interfaces;
- auditorias arquiteturais;
- logs e health checks;
- cenários de usuário novo;
- uso real no ambiente previsto.

Quando um item for promovido para ✅, a evidência deve indicar onde o resultado foi validado.

---

# Cenário de referência: usuário novo

O cenário principal para avaliar a experiência é uma pessoa que não conhece a estrutura interna do projeto.

Essa pessoa deve conseguir, no contexto das capacidades declaradas como suportadas:

1. seguir o processo de instalação documentado;
2. acessar o HomeServer;
3. identificar o estado básico da plataforma;
4. realizar login;
5. localizar as capacidades disponíveis;
6. entender o objetivo das ações;
7. executar operações normais sem conhecer detalhes internos;
8. compreender o resultado das operações;
9. receber orientação quando algo falhar.

A pergunta de validação é:

> A pessoa precisou abrir o código, pesquisar nomes internos ou aprender um comando técnico para concluir uma tarefa que deveria ser normal naquela interface?

Se a resposta for sim, existe uma oportunidade de melhoria ou a capacidade ainda não está madura para ser considerada plenamente suportada naquele contexto.

---

# Uso na evolução contínua

Este documento deve ser atualizado quando novas evidências alterarem a maturidade de uma capacidade.

Para uma mudança relevante, registrar preferencialmente:

1. capacidade trabalhada;
2. interfaces disponíveis antes e depois;
3. necessidade de terminal antes e depois, quando aplicável;
4. evidência de validação;
5. limitações restantes;
6. decisão de consolidar, melhorar, manter experimental ou remover.

O objetivo é acompanhar uma evolução como:

```text
Técnico
   ↓
Disponível
   ↓
Integrado
   ↓
Compreensível
   ↓
Operável no contexto adequado
   ↓
Validado
```

---

# Relação com outros documentos

- `planning/strategy.md` define qualidade de vida como direção estratégica.
- `docs/reference/PRINCIPLES.md` define os princípios permanentes.
- `docs/reference/ARCHITECTURE.md` define as fronteiras entre as camadas.
- `planning/roadmap/evolution.md` organiza as áreas e prioridades de evolução.
- `planning/release/baseline-v0.1.0.md` registra o estado de referência e suas evidências.
- `planning/foundations/` define fundamentos gerais de evolução e validação.
- `planning/app/` define a direção das interfaces.
- `planning/quality/` contém outros critérios, checklists e evidências de qualidade.
