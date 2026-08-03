# HomeServer Strategy

> **Como chegaremos lá.**
>
> A estratégia define a ordem de evolução. Diferente da visão (onde queremos
> chegar) e do roadmap (o que faremos na próxima versão), a estratégia muda
> pouco: ela estabelece **como** o HomeServer cresce.

---

## Evolução incremental

O HomeServer evolui por etapas. Cada etapa fortalece a plataforma antes da
próxima, garantindo que novas funcionalidades sejam construídas sobre uma
base sólida, simples e organizada.

A ordem é:

```text
Infraestrutura
     ↓
Experiência
     ↓
Ecossistema
     ↓
Integrações
```

1. **Infraestrutura primeiro** — a base (Foundation, Infrastructure, API)
   precisa estar estável antes de qualquer funcionalidade de valor.
2. **Experiência depois** — polir o que existe antes de adicionar recursos.
3. **Ecossistema** — os dispositivos passam a conversar com a plataforma.
4. **Integrações** — serviços externos são adicionados como adaptadores
   opcionais, desacoplados do núcleo.

---

## Evolução da Plataforma

```text
Fundação
   ↓
Plataforma
   ↓
Modularidade
   ↓
Módulos Oficiais
   ↓
Ecossistema
   ↓
Consolidação
```

### Fase 1 — Fundação

Construir uma base sólida para todo o projeto: arquitetura, core, sistema de
testes, documentação e estrutura de desenvolvimento.

### Fase 2 — Plataforma

Disponibilizar um HomeServer utilizável: homepage, configuração, interface de
gerenciamento e operação simplificada.

### Fase 3 — Modularidade

Permitir que a plataforma cresça sem aumentar a complexidade do Core: sistema
de módulos, instalação, atualização, remoção e versionamento.

### Fase 4 — Módulos Oficiais

Disponibilizar funcionalidades através de módulos independentes (storage,
media, development, network, backup, monitoring, etc.). Cada usuário instala
apenas o que necessita.

### Fase 5 — Ecossistema

Transformar o HomeServer em uma plataforma de integração doméstica:
dispositivos, sincronização, compartilhamento, automações e serviços
distribuídos.

### Fase 6 — Consolidação

Garantir estabilidade e maturidade: documentação, otimizações, comunidade e
manutenção de longo prazo.

---

## Regras de priorização

- Nenhuma nova funcionalidade entra antes que a anterior esteja realmente
  utilizável.
- Cada nova versão deve entregar melhorias perceptíveis ao usuário.
- Arquitetura estável é mais importante que quantidade de funcionalidades.
- Funcionalidades que dependem obrigatoriamente de um serviço externo são
  tratadas como **integrações opcionais**, nunca como requisito do núcleo.
