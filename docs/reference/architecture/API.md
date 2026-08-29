# API

A API é a fronteira oficial para clientes externos e interfaces que precisam acessar capacidades do HomeServer.

Seu objetivo é oferecer contratos previsíveis sem expor detalhes internos da implementação.

Este documento descreve **o papel arquitetural da API**. Endpoints, autenticação concreta, variáveis de ambiente e exemplos de uso ficam na [referência da API](../../../api/README.md).

## Papel da API

A relação preferencial é:

```text
Cliente / Interface
        ↓
API
        ↓
Capacidade da plataforma
        ↓
Infrastructure / Foundation / Adapter
        ↓
Sistema ou serviço externo
```

Exemplos de consumidores podem incluir:

- Homepage;
- aplicativo mobile;
- ferramentas de administração;
- automações;
- integrações autorizadas.

Nem toda interface precisa necessariamente utilizar HTTP para todas as operações. O princípio é que consumidores externos não dependam diretamente de detalhes internos quando existe um contrato apropriado para a capacidade solicitada.

---

## Responsabilidades da API

Quando uma capacidade é exposta pela API, ela é responsável por aspectos como:

- receber e validar solicitações;
- autenticar o solicitante quando necessário;
- aplicar autorização adequada;
- encaminhar a solicitação para a capacidade responsável;
- retornar resultados previsíveis;
- evitar expor detalhes internos desnecessários.

A API não deve concentrar a lógica completa de cada capacidade apenas porque é o ponto de entrada HTTP.

```text
API
→ contrato, segurança e coordenação da solicitação

Capacidade da plataforma
→ comportamento principal da operação
```

---

## Serviços externos

Clientes não devem precisar conhecer diretamente a implementação de serviços externos utilizados internamente pelo HomeServer.

Quando apropriado:

```text
Cliente
   ↓
API
   ↓
Capacidade da plataforma
   ↓
Adapter
   ↓
Serviço externo
```

Isso permite substituir ou alterar uma integração sem transformar detalhes do serviço em contrato para todos os clientes.

A separação deve ser proporcional: nem toda dependência pequena exige uma camada adicional se isso apenas aumentar a complexidade sem reduzir acoplamento real.

---

## Contratos

Uma operação exposta deve possuir significado claro e comportamento previsível para seus consumidores.

Quando aplicável, os contratos devem definir:

- entrada esperada;
- resultado de sucesso;
- erros relevantes;
- requisitos de autenticação;
- requisitos de autorização;
- efeitos importantes da operação.

A forma concreta das respostas é definida na documentação da API e pode evoluir de maneira planejada sem alterar o princípio arquitetural deste documento.

---

## Autenticação e autorização

A API é uma fronteira importante de segurança, mas os detalhes de autenticação não devem ser confundidos com autorização.

```text
Autenticação
→ quem está fazendo a solicitação?

Autorização
→ essa identidade pode executar esta operação?
```

Operações expostas devem aplicar os controles adequados ao seu impacto.

Sessões, tokens, papéis e outros mecanismos concretos pertencem à documentação operacional e de segurança correspondente.

---

## Resultados e erros

Clientes devem receber informações suficientes para compreender o resultado sem depender de mensagens ou estruturas internas.

Quando aplicável, diferencie entre:

- solicitação inválida;
- autenticação necessária ou inválida;
- autorização negada;
- recurso não encontrado;
- estado incompatível com a operação;
- dependência indisponível;
- falha interna.

Informações sensíveis de diagnóstico não devem ser expostas ao cliente apenas para tornar o erro mais detalhado.

---

## Evolução da API

A API é um contrato compartilhado. Antes de realizar mudanças relevantes:

1. identifique consumidores conhecidos;
2. avalie compatibilidade;
3. evite alterar silenciosamente o significado de operações existentes;
4. documente mudanças de contrato;
5. atualize testes relevantes;
6. avalie a necessidade de um ADR.

Mudanças planejadas são possíveis. O objetivo é evitar que consumidores sejam quebrados por alterações internas não comunicadas.

---

## Relação com outros documentos

```text
API.md
→ papel arquitetural da fronteira HTTP/API

APPLICATION_API.md
→ relação entre aplicações consumidoras e contratos

api/README.md
→ endpoints, contratos e operação concreta

security/
→ premissas, riscos e referências de segurança
```

Referências:

- [`APPLICATION_API.md`](APPLICATION_API.md);
- [`../../../api/README.md`](../../../api/README.md);
- [`../../security/`](../security/);
- [`adr/`](adr/).

Voltar para [Referência de arquitetura](README.md).