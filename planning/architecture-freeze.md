# Architecture Freeze

> Documento arquitetural do HomeServer.
> Estado: princípios de camadas preservados; arquitetura modular M1 consolidada como evolução conceitual da base.

A arquitetura principal do HomeServer permanece organizada em camadas. A consolidação M1 não substitui Foundation, Infrastructure, Adapters e API; ela adiciona contratos para permitir que serviços evoluam como módulos desacoplados.

## Referência atual

A base modular consolidada está em:

- [Arquitetura Modular](architecture/README.md)
- [Decisão consolidada M1](architecture/decisions/m1-foundation.md)

## Regras

- Mudanças estruturais exigem decisão arquitetural documentada.
- Novas funcionalidades devem reutilizar Foundation, Infrastructure, Adapters e API quando aplicável.
- Módulos devem respeitar os contratos transversais consolidados na M1.
- Implementações não devem redefinir unilateralmente contratos do módulo.
- Exceções arquiteturais devem possuir justificativa documentada antes da implementação.

## Camadas preservadas

```text
Homepage / App
      │
     API
      │
Module Core / Operation Coordination
      │
  Adapters  ── integrações e implementações externas
      │
Infrastructure  ── recursos internos da plataforma
      │
  Foundation  ── componentes reutilizáveis e contratos base
```

A representação acima é conceitual. A M1 ainda não define a localização física do Module Core na árvore do projeto.

## Arquitetura modular

A evolução de serviços passa a respeitar, conceitualmente:

```text
MODULE DEFINITION
        ≠
MODULE INSTANCE
        ≠
DESIRED STATE
        ≠
OBSERVED STATE
        ≠
IMPLEMENTATION
```

As operações devem ser coordenadas pela plataforma, validadas, verificadas e registradas com evidência proporcional ao risco.

## Nomenclatura e API existentes

As convenções atuais permanecem válidas até que uma decisão arquitetural específica determine sua evolução:

- **Foundation**: `hs_*` (`hs_fs_*`, `hs_cfg_*`, ...).
- **Infrastructure**: prefixo do domínio (`storage_*`, `users_*`, ...).
- **Adapters**: prefixo ou contrato da integração correspondente.
- **CLI**: `hs <comando> <subcomando>`.
- **API**: contratos atuais permanecem compatíveis até revisão explícita.

## Regra de evolução

O termo "freeze" não significa impedir a evolução do projeto. Ele significa que mudanças estruturais não devem ocorrer de forma implícita ou isolada.

Qualquer evolução deve preservar contratos existentes ou declarar explicitamente:

1. impacto arquitetural;
2. compatibilidade;
3. migração quando necessária;
4. validação e evidência;
5. estratégia de recuperação quando aplicável.
