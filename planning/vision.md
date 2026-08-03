# HomeServer Vision

O HomeServer evolui em fases de valor.

Cada fase resolve um problema real antes de introduzir novas funcionalidades.

O objetivo é manter o sistema simples, consistente e fácil de evoluir.

---

## O que é

O HomeServer é uma plataforma pessoal que centraliza **armazenamento,
serviços, dispositivos e automações** em uma experiência única, simples e
modular.

Construído para reutilizar hardware antigo, o HomeServer separa
infraestrutura, serviços e dados, priorizando simplicidade, organização e
documentação.

---

## Princípios

### Autonomia local

> O HomeServer deve ser utilizável **completamente dentro da rede local**, sem
> depender de serviços em nuvem.

Integrações externas (Telegram, e-mail, GitHub) são **opcionais** — nunca um
requisito do núcleo. A plataforma continua funcional mesmo sem acesso à
internet.

### Descoberta na rede

> O HomeServer deve ser **facilmente descoberto dentro da rede local**.

Através de mDNS (`homeserver.local`), sem configuração manual nos
dispositivos.

### Foco no usuário

> A Homepage mostra o **ambiente do usuário** (workspace), não apenas módulos.

Cada usuário vê seu espaço: arquivos, projetos, integrações, dispositivos e
preferências.

---

## Fases de valor

Cada versão responde a uma pergunta:

| Fase | Pergunta |
|------|----------|
| 1. Core | O sistema funciona? |
| 2. Produto | É agradável de usar? |
| 3. Unified Access | É simples de acessar? |
| 4. Ecossistema | Os dispositivos conversam? |
| 5. Integrações | Os serviços conversam? |
| 6. Automação | O sistema trabalha sozinho? |
| 7. Identidade | A experiência acompanha o usuário? |
| 8. Plataforma | Tudo parece um único produto? |

---

## Visão de longo prazo

> **"Um sistema operacional para a sua infraestrutura doméstica."**

Não no sentido de substituir o Linux, mas de oferecer uma camada de
organização acima dele: o Linux continua sendo o sistema operacional; o
HomeServer passa a ser a plataforma que unifica armazenamento, serviços,
usuários, dispositivos e automações em uma experiência única.

Esse objetivo é compatível com a filosofia original do projeto: **começar
pequeno, crescer por módulos e fazer com que cada nova versão entregue valor
perceptível sem aumentar desnecessariamente a complexidade**.
