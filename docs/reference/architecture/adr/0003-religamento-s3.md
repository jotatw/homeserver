# ADR-0003 — Religamento automático por agendamento de energia

## Status

Aceito

## Data

2026-08-05

## Decisão

O HomeServer deve permitir um ciclo automático de economia de energia com horário configurável para suspensão e retorno à operação.

No hardware atualmente validado, a implementação utiliza suspensão para RAM com despertar programado pelo RTC:

```text
Horário configurado
        ↓
Preparar fontes de wake necessárias
        ↓
Suspender o sistema
        ↓
RTC atinge o horário programado
        ↓
Retomar a operação
```

A escolha concreta de mecanismo depende da capacidade real do hardware. `rtcwake -m mem` é a implementação validada para o equipamento atual, não um requisito universal para futuras instalações.

## Contexto

O HomeServer é executado em hardware que permanece disponível por longos períodos, mas não precisa necessariamente operar continuamente.

Era necessário permitir uma rotina configurável de economia de energia com retorno automático, sem depender obrigatoriamente de outro equipamento na rede.

Os testes realizados no hardware atual mostraram que diferentes mecanismos possuem comportamentos distintos:

| Mecanismo testado | Resultado observado |
|---|---|
| `rtcwake -m off` | não retornou automaticamente no hardware testado |
| `rtcwake -m mem` | retornou pelo RTC após controlar fontes de wake inesperadas |
| `s2idle` | não retornou corretamente pelo RTC no teste realizado |

O comportamento também mostrou que fontes de wake, como dispositivos USB e rede, podem impedir a permanência esperada no estado de suspensão.

## Consequências

### Positivas

- permite reduzir consumo durante períodos sem necessidade de uso;
- o retorno pode ocorrer automaticamente em um horário configurado;
- a estratégia é baseada em comportamento validado no hardware real;
- outros mecanismos podem ser avaliados para instalações com capacidades diferentes.

### Custos e limites

- suspensão não equivale necessariamente a desligamento completo;
- o consumo durante standby depende do hardware;
- suporte a wake por RTC varia entre equipamentos;
- fontes de wake podem exigir configuração específica;
- a rotina precisa de privilégios adequados para controlar energia e wake;
- a estratégia validada em um equipamento não garante comportamento idêntico em outro.

## Alternativas consideradas

### 1. Desligamento completo com wake pelo RTC

**Não adotada para o hardware atual.**

O mecanismo testado não retornou automaticamente de forma confiável. Pode ser reavaliado em equipamentos que ofereçam suporte adequado.

### 2. Suspend-to-RAM com despertar pelo RTC

**Adotada para o hardware atual.**

Foi o mecanismo que apresentou retorno automático após controlar fontes de wake que causavam retomada prematura.

### 3. WOL com dispositivo externo

**Não adotada como requisito padrão.**

É uma alternativa possível, mas adiciona dependência de outro equipamento ou serviço na rede.

### 4. BIOS/firmware com agendamento de retorno

**Não adotada como requisito da plataforma.**

Pode ser mais apropriada em determinados equipamentos, mas depende de recursos específicos e acesso à configuração do hardware.

## Implementação atual

Detalhes como dispositivos de wake específicos, horários padrão, comandos concretos e comportamento observado durante os testes pertencem à documentação operacional e à implementação da capacidade de energia.

O ADR fixa apenas a decisão arquitetural: a plataforma suporta agendamento de economia de energia e retorno automático, escolhendo o mecanismo compatível com o hardware em que está instalada.

## Relação com outros documentos

- [ADR-0004](0004-nomenclatura.md) — organização e nomenclatura da implementação;
- documentação da capacidade de energia — configuração e comportamento operacional;
- CLI `hs power` — interface administrativa para a capacidade.
