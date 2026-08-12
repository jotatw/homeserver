# Qualidade de Vida do Usuário

## Propósito

Este documento transforma a direção estratégica do HomeServer em critérios
práticos de avaliação.

O objetivo da plataforma não é apenas disponibilizar capacidades. É permitir
que uma pessoa utilize essas capacidades com o mínimo possível de conhecimento
sobre a infraestrutura interna.

A pergunta central é:

> O usuário consegue concluir sua tarefa sem precisar aprender como a infraestrutura funciona?

Este documento acompanha a evolução da experiência entre CLI, API e App e
serve como guia de priorização para a linha v1.0.

---

## Princípio de medição

Uma capacidade pode existir tecnicamente e ainda não estar madura para o
usuário final.

Por isso, a avaliação deve distinguir:

- **Existe** — a capacidade está implementada em alguma camada.
- **Acessível** — existe uma interface suportada para utilizá-la.
- **Compreensível** — o usuário entende o objetivo da operação.
- **Operável** — a tarefa pode ser concluída sem conhecimento técnico
  desnecessário.
- **Recuperável** — falhas apresentam orientação ou um caminho claro para
  continuar.

Uma capacidade orientada ao usuário final deve evoluir progressivamente por
esses níveis.

---

## Estados

Os itens deste documento utilizam:

| Estado | Significado |
|---|---|
| ⚪ Planejado | Direção definida, ainda sem implementação validada. |
| 🔴 Ausente | A capacidade necessária não existe. |
| 🟡 Parcial | Existe, mas possui lacunas de integração, usabilidade ou recuperação. |
| 🟢 Operacional | Pode ser utilizada de forma suportada no contexto atual. |
| ✅ Validado | Foi testado com evidência suficiente para o critério definido. |

**Importante:** corrigido ou implementado não significa automaticamente
validado. Um item só recebe ✅ quando houver evidência de funcionamento de
acordo com o critério correspondente.

---

# Matriz de Capacidades

A matriz abaixo representa o acompanhamento de alto nível. O estado real deve
ser atualizado conforme auditorias, testes e fases do roadmap.

| Capacidade | CLI | API | App | Terminal necessário para uso normal | Estado | Evidência |
|---|---|---|---|---|---|---|
| Ver estado do servidor | Sim | Sim | Parcial | Não, quando App estiver maduro | 🟡 | Baseline e testes atuais |
| Autenticação | Sim | Sim | Sim | Não | 🟢 | Testes de API e sessão |
| Gerenciar usuários | Sim | Sim | Sim | Não para operações suportadas | 🟢 | CLI/API/App devem permanecer alinhados |
| Acessar arquivos | Serviço | Integração limitada | Serviço externo | Não para acesso normal | 🟡 | Depende do contrato do serviço |
| Gerenciar serviços | Sim | Sim | Parcial | Não, quando operações forem expostas | 🟡 | Auditoria de serviços |
| Dispositivos | Sim | Sim | Parcial | Não, quando fluxo estiver completo | 🟡 | Gaps conhecidos |
| Armazenamento | Sim | Sim | Parcial | Não, quando fluxo estiver completo | 🟡 | Gaps G1-G5 |
| Backup | Sim | Conforme capacidade atual | Parcial | Não, quando integrado | 🟡 | Auditoria e smoke tests |
| Energia | Sim | Sim | Sim | Não para operações suportadas | 🟢 | API/App |
| Agendamento | Sim | Conforme capacidade atual | ⚪ | Sim atualmente | ⚪ | Roadmap v1.0 |
| Instalação | Sim | N/A | N/A | Sim, procedimento técnico inicial | 🟡 | Requer validação em ambiente limpo |
| Atualização | Sim | Conforme capacidade atual | ⚪ | Sim atualmente | 🟡 | Requer validação entre versões |
| Recuperação avançada | Sim | N/A | N/A | Sim | 🟢 | Interface avançada por definição |

A matriz não afirma que todas as capacidades possuem atualmente o mesmo nível
de maturidade. Ela é uma ferramenta para tornar as lacunas explícitas e evitar
que funcionalidades parcialmente integradas sejam consideradas concluídas.

---

# Critério por tarefa

Uma tarefa normal do usuário deve ser avaliada em cinco perguntas.

## 1. Descoberta

O usuário consegue encontrar onde realizar a tarefa?

Exemplos de falha:

- a função existe, mas está escondida em um comando não documentado;
- é necessário conhecer previamente o nome técnico do serviço;
- o usuário precisa procurar no código para descobrir como operar algo.

Critério desejado:

> A capacidade possui um ponto de entrada identificável pela sua intenção.

---

## 2. Compreensão

O usuário entende o que acontecerá?

A interface deve preferir ações como:

- Criar usuário;
- Executar backup;
- Reiniciar serviço;
- Montar armazenamento.

Ela não deve exigir conhecimento prévio de comandos, containers ou arquivos de
configuração apenas para entender a ação.

Critério desejado:

> O nome, contexto e consequência principal da operação são compreensíveis.

---

## 3. Execução

O usuário consegue concluir a tarefa sem detalhes técnicos desnecessários?

A sequência ideal é:

```text
Intenção
   ↓
Interface
   ↓
Validação
   ↓
API / contrato
   ↓
Capacidade da plataforma
   ↓
Resultado
```

O usuário não deve precisar executar uma sequência adicional no terminal para
concluir uma tarefa que a própria interface anuncia como suportada.

Critério desejado:

> Uma operação suportada é concluída pela interface em que foi iniciada.

---

## 4. Feedback

A plataforma deve informar o resultado de maneira compreensível.

Uma operação deve permitir identificar, quando aplicável:

- que foi iniciada;
- que está em andamento;
- que foi concluída;
- que falhou;
- qual foi o resultado;
- qual é a próxima ação possível.

O sucesso não deve depender de o usuário interpretar logs técnicos.

Critério desejado:

> O resultado é compreensível sem abrir o terminal.

---

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

> A primeira resposta à falha orienta a recuperação; o detalhe técnico é
> complementar.

---

# Regra do Terminal

O objetivo não é eliminar o terminal do HomeServer.

O terminal permanece necessário e apropriado para:

- instalação inicial;
- diagnóstico avançado;
- recuperação de falhas graves;
- desenvolvimento;
- automação;
- manutenção técnica;
- operações ainda não maduras no App.

Para uso normal, a plataforma deve reduzir progressivamente a necessidade de
terminal.

Uma capacidade não deve ser marcada como centralizada no App se o usuário ainda
precisa, obrigatoriamente, executar comandos adicionais para completar seu
fluxo normal.

---

# Qualidade de Integração

Uma capacidade que aparece em mais de uma interface deve preservar uma fonte
de verdade.

O modelo desejado é:

```text
                ┌── App ──────┐
                │             │
Usuário ────────┤             ▼
                │            API
                └── CLI ──────┤
                              ▼
                    Capacidade da Plataforma
```

CLI e App podem oferecer experiências diferentes, mas não devem manter regras
de negócio divergentes para a mesma capacidade.

Sempre que possível, uma capacidade deve possuir um contrato identificável que
possa ser reutilizado pelas interfaces.

---

# Critério para considerar uma capacidade pronta para o usuário

Uma capacidade pode ser considerada pronta para operação normal quando:

- [ ] possui responsabilidade e fonte de verdade definidas;
- [ ] possui um fluxo suportado de entrada e execução;
- [ ] valida entradas relevantes;
- [ ] apresenta sucesso e falha de maneira compreensível;
- [ ] não exige conhecimento técnico desnecessário;
- [ ] não exige terminal para concluir o fluxo normal, quando o App declara
      suporte à capacidade;
- [ ] possui tratamento ou orientação básica de recuperação;
- [ ] possui testes adequados ao seu nível de risco;
- [ ] possui documentação quando necessária;
- [ ] possui evidência de validação.

O atendimento parcial não deve ser confundido com conclusão.

---

# Métricas e evidências

A qualidade de vida deve ser medida por evidência, não apenas por percepção de
que uma tela ou endpoint existe.

Fontes de evidência incluem:

- testes automatizados;
- smoke tests;
- testes de instalação limpa;
- testes de upgrade;
- testes de reboot;
- validação manual de fluxos no App;
- auditorias arquiteturais;
- logs e health checks;
- cenários de usuário novo.

Quando um item for promovido para ✅, a evidência deve indicar onde o resultado
foi validado.

---

# Cenário de referência: usuário novo

O cenário principal para avaliar a experiência é uma pessoa que não conhece a
estrutura interna do projeto.

Essa pessoa deve conseguir, no contexto das capacidades declaradas como
suportadas:

1. seguir o processo de instalação documentado;
2. acessar o HomeServer;
3. identificar o estado básico da plataforma;
4. realizar login;
5. localizar as capacidades disponíveis;
6. entender o objetivo das ações;
7. executar operações normais sem conhecer comandos internos;
8. compreender o resultado das operações;
9. receber orientação quando algo falhar.

A pergunta de validação é:

> A pessoa precisou abrir o código, pesquisar nomes internos ou aprender um
> comando de terminal para concluir uma tarefa que deveria ser normal?

Se a resposta for sim, existe uma oportunidade de melhoria de qualidade de
vida ou a capacidade ainda não está madura para ser considerada centralizada.

---

# Uso no Roadmap

Durante as fases da v1.0, este documento deve ser atualizado junto com as
capacidades entregues.

Para cada fase, registrar preferencialmente:

1. capacidade trabalhada;
2. interface disponível antes da mudança;
3. interface disponível depois da mudança;
4. necessidade de terminal antes/depois;
5. evidência de validação;
6. limitações restantes.

O objetivo é criar um histórico claro da evolução:

```text
Técnico
   ↓
Disponível
   ↓
Integrado
   ↓
Compreensível
   ↓
Operável sem terminal
   ↓
Validado
```

---

# Relação com outros documentos

- `planning/strategy.md` define qualidade de vida como direção estratégica.
- `docs/PRINCIPLES.md` define os princípios permanentes.
- `docs/ARCHITECTURE.md` define as fronteiras entre as camadas.
- `planning/roadmap/v1.0.md` define as fases de evolução.
- `planning/release/baseline-v0.1.0.md` registra o estado inicial e suas
  evidências.
- `planning/quality/` contém outros critérios, checklists e evidências de
  qualidade.
