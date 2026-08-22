# Testes e validação

Este documento explica **como verificar se uma mudança realmente funciona** no HomeServer.

Executar um teste sem erro é importante, mas não significa sozinho que uma funcionalidade está pronta. Dependendo da mudança, também pode ser necessário verificar integração, ambiente real, segurança, documentação e manutenção.

## A ideia principal

Use o nível de validação proporcional ao impacto:

```text
Mudança pequena e isolada
        ↓
Teste específico

Mudança entre componentes
        ↓
Teste de integração

Mudança que depende do servidor real
        ↓
Validação no ambiente

Capacidade importante ou em consolidação
        ↓
Testes + ambiente real + documentação + avaliação prática
```

---

## 1. Testar não é apenas executar uma suíte

Uma validação pode responder perguntas diferentes:

| Pergunta | Tipo de validação |
|---|---|
| Esta função funciona? | Teste unitário ou específico |
| Os componentes funcionam juntos? | Teste de integração |
| O servidor possui os requisitos necessários? | Teste de ambiente |
| O fluxo funciona no HomeServer real? | Validação prática |
| A mudança continua segura e sustentável? | Revisão técnica e testes aplicáveis |

Nem toda alteração precisa de todos os níveis.

---

## 2. Testes unitários

Use testes unitários ou específicos para validar uma responsabilidade isolada.

Um bom teste responde a uma pergunta clara, por exemplo:

```text
Uma entrada inválida é rejeitada?
O arquivo esperado é criado?
Uma função retorna o estado correto?
Um erro previsível é tratado corretamente?
```

Sempre que possível, o teste deve ser independente e não depender de estado deixado por outro teste.

---

## 3. Testes de integração

Use quando uma mudança depende da interação entre componentes.

Exemplos:

```text
Services → Compose
Compose  → Docker
Adapter  → Serviço externo
API      → Capacidade da plataforma
App      → API
```

O objetivo é verificar se as fronteiras continuam funcionando juntas conforme o comportamento esperado.

---

## 4. Testes de ambiente

Algumas capacidades dependem do sistema onde o HomeServer está instalado.

Exemplos:

- Docker disponível;
- Docker Compose disponível;
- permissões adequadas;
- diretórios necessários existentes;
- serviços ativos quando exigidos;
- configurações obrigatórias presentes.

Esses testes verificam se o ambiente pode executar a funcionalidade, mas não substituem testes do comportamento da própria funcionalidade.

---

## 5. Validação no ambiente real

Quando uma mudança afeta o uso diário, hardware, rede, containers ou serviços externos, valide no HomeServer real quando possível.

Verifique:

- o problema original foi resolvido;
- o fluxo funciona como esperado;
- erros são compreensíveis;
- uma falha não interrompe capacidades independentes sem necessidade;
- reinicializações preservam o comportamento esperado;
- a operação continua simples de manter.

Essa etapa é especialmente importante para funcionalidades que podem parecer corretas em testes isolados, mas dependem do ambiente real.

---

## 6. Testes automáticos do projeto

Quando aplicável, execute:

```bash
bash core/tests/run_all.sh
bash scripts/health-check.sh
```

Os comandos disponíveis podem evoluir. Para consultar a interface atual da CLI:

```bash
bash core/hs.sh --help
```

Um comando bem-sucedido significa apenas que aquela validação passou. Interprete o resultado junto com o escopo da mudança.

---

## 7. ShellCheck

Scripts Shell devem permanecer compatíveis com o ShellCheck dentro do escopo aplicável.

Problemas relevantes devem ser corrigidos ou, quando existir uma exceção consciente, documentados com justificativa suficiente para manutenção futura.

---

## 8. Boas práticas para testes

Cada teste deve, quando aplicável:

- possuir um objetivo claro;
- ser independente;
- preparar apenas o estado necessário;
- validar o resultado esperado;
- limpar recursos temporários;
- produzir falhas compreensíveis;
- evitar depender de ordem implícita entre testes.

O fluxo básico é:

```text
Preparação
    ↓
Execução
    ↓
Validação
    ↓
Limpeza
```

---

## 9. Quando uma mudança está suficientemente validada?

Não existe um único comando que responda isso para todo o projeto.

Use uma avaliação proporcional ao impacto.

### Mudança pequena

Normalmente:

```text
Implementação
    ↓
Teste específico
    ↓
Revisão do resultado
```

### Nova capacidade ou mudança entre componentes

Normalmente:

```text
Implementação
    ↓
Testes específicos
    ↓
Integração
    ↓
Health check ou validação equivalente
    ↓
Documentação
```

### Funcionalidade usada no servidor real

Normalmente:

```text
Testes automatizados
    ↓
Validação no ambiente real
    ↓
Uso prático
    ↓
Avaliação de falhas e manutenção
    ↓
Registro das limitações restantes
```

Uma capacidade não precisa ser considerada definitiva apenas porque funciona pela primeira vez. O uso contínuo pode revelar problemas, custos ou melhorias que não eram visíveis inicialmente.

---

## 10. Critérios para consolidar uma capacidade

Quando uma funcionalidade estiver sendo considerada parte estável da base, avalie:

- [ ] O comportamento principal foi validado.
- [ ] Os erros previsíveis foram considerados.
- [ ] Os testes relevantes passam.
- [ ] A integração necessária foi validada.
- [ ] O ambiente real foi testado quando aplicável.
- [ ] Problemas relevantes do ShellCheck foram tratados.
- [ ] A documentação descreve o comportamento atual.
- [ ] Limitações conhecidas foram registradas.
- [ ] Segurança e impacto operacional foram avaliados quando aplicável.
- [ ] O custo de manutenção continua aceitável.

Nem todos os itens possuem o mesmo peso para toda alteração. O objetivo é evitar tanto a validação insuficiente quanto burocracia desnecessária para mudanças simples.

---

## Relação com outros documentos

```text
CONTRIBUTING.md
    ↓
Decido se a mudança deve permanecer local ou ser consolidada

DEVELOPMENT.md
    ↓
Implemento na camada correta

TESTING.md
    ↓
Valido proporcionalmente ao impacto
```

Depois da validação, a mudança pode continuar em observação, ser consolidada ou ser revisada conforme os resultados do uso real.
