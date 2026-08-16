# Core Platform

## Objetivo

Reúne os módulos e capacidades que formam a base de coordenação do HomeServer. Este grupo sustenta o gerenciamento centralizado da plataforma e reduz dependências diretas entre interface e tecnologias específicas.

## Escopo planejado

- catálogo e descoberta de módulos;
- registro de Definitions e Instances;
- resolução de dependências e capabilities;
- desired state e observed state;
- coordenação de operações;
- persistência dos metadados centrais;
- contratos e validação compartilhada.

## Fronteira

O Core coordena contratos e operações. Ele não deve incorporar detalhes específicos de Docker, systemd, Caddy ou de um serviço concreto.

## Dependências e integrações

Os mecanismos concretos devem ser acessados por adapters/implementations. A interface do App deve solicitar operações ao Core, sem acesso privilegiado direto aos serviços.

## Estado

Planejamento arquitetural fechado. Persistência concreta, APIs e localização física do Core permanecem como decisões de implementação registradas na M1.
