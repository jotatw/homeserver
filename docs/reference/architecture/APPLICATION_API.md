# Application API

Este documento descreve o papel dos contratos utilizados por aplicações e interfaces consumidoras do HomeServer.

O nome histórico `Applications` não representa uma camada obrigatória da arquitetura atual. O foco é a fronteira entre **quem solicita uma capacidade** e **como essa capacidade é implementada internamente**.

## Objetivo

Aplicações como CLI, Homepage, App ou futuras interfaces devem solicitar capacidades por contratos apropriados sempre que a operação fizer parte da plataforma.

A direção desejada é:

```text
Interface consumidora
        ↓
Contrato / API
        ↓
Capacidade da plataforma
        ↓
Infrastructure / Foundation / Adapter
        ↓
Sistema ou serviço externo
```

Nem toda operação precisa atravessar todas essas camadas. A separação representa responsabilidades e evita que consumidores dependam diretamente de detalhes internos desnecessários.

---

## O que é uma Application API?

É a fronteira utilizada por aplicações consumidoras para solicitar operações da plataforma sem precisar conhecer sua implementação interna.

Exemplos de consumidores:

- CLI `hs`;
- Homepage;
- aplicativo mobile;
- automações;
- integrações futuras.

O contrato pode ser exposto pela API da plataforma ou por outra interface interna apropriada ao contexto.

---

## Responsabilidade dos consumidores

Um consumidor deve descrever **o que precisa fazer**, não como a infraestrutura executará a operação.

Preferencialmente, ele não deve depender diretamente de:

- comandos Docker;
- arquivos Compose específicos;
- caminhos físicos internos;
- permissões de implementação;
- nomes ou formatos internos de ferramentas;
- detalhes particulares de um Adapter.

Exemplo conceitual:

```text
Consumidor
→ solicitar inicialização de uma capacidade

Plataforma
→ decidir como localizar, validar e executar
```

Isso permite alterar a implementação sem exigir mudanças em todas as interfaces consumidoras.

---

## Contratos orientados à capacidade

Prefira contratos que expressem uma intenção ou capacidade clara.

```text
service start
service stop
service status
service logs
```

A operação deve ter significado estável para o consumidor mesmo que a implementação interna evolua.

Isso não significa que todas as capacidades devem possuir imediatamente uma API ampla. Um contrato deve existir quando há consumidores ou fronteiras reais que justificam sua manutenção.

---

## Fluxo de uma operação

Um fluxo típico pode ser:

```text
Solicitação
    ↓
Validação do contrato e permissões necessárias
    ↓
Resolução da capacidade responsável
    ↓
Execução pela implementação apropriada
    ↓
Resultado estruturado
```

Etapas adicionais dependem da operação. Não existe uma sequência universal como verificar Docker ou Compose antes de toda solicitação.

Por exemplo, uma operação de consulta pode não depender de Docker, enquanto outra pode depender de um serviço externo.

---

## Resultado e erros

Contratos devem retornar resultados compreensíveis para seus consumidores.

Quando aplicável, um resultado deve permitir distinguir entre:

- operação concluída;
- entrada ou solicitação inválida;
- recurso não encontrado;
- estado que impede a operação;
- falha interna ou dependência indisponível.

Detalhes internos podem ser registrados para diagnóstico sem obrigar toda interface a conhecer a implementação que produziu a falha.

---

## Evolução dos contratos

Antes de alterar uma operação compartilhada:

1. identifique os consumidores conhecidos;
2. avalie compatibilidade;
3. evite alterar silenciosamente o significado de uma operação;
4. atualize a documentação;
5. ajuste testes relevantes;
6. registre uma decisão arquitetural quando necessário.

O contrato deve ser mais estável que detalhes internos, mas não precisa ser imutável. Mudanças podem ocorrer quando planejadas e justificadas.

---

## Relação com a API do HomeServer

A referência concreta de endpoints e contratos expostos fica em [`../../api/README.md`](../../api/README.md).

Este documento descreve o princípio arquitetural da fronteira entre aplicações consumidoras e capacidades da plataforma.

```text
APPLICATION_API.md
→ como consumidores devem se relacionar com contratos

api/README.md
→ quais contratos e endpoints existem concretamente
```

---

## Relação com interfaces

Cada interface deve permanecer adequada ao seu contexto.

```text
Desktop
→ gerenciamento completo

Mobile
→ ações rápidas e focadas

CLI
→ administração e automação
```

Interfaces diferentes podem consumir capacidades semelhantes sem duplicar a lógica central da operação.

---

## Referências relacionadas

- [`API.md`](API.md) — fronteira geral da API;
- [`CORE.md`](CORE.md) — capacidades compartilhadas da plataforma;
- [`Infrastructure.md`](Infrastructure.md) — operações internas e ambiente;
- [`../../api/README.md`](../../api/README.md) — referência concreta da API;
- [`../../reference/ARCHITECTURE.md`](../ARCHITECTURE.md) — visão geral.

Voltar para [Referência de arquitetura](README.md).