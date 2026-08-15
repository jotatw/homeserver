# Planejamento de Módulos

Este diretório registra as decisões arquiteturais para a modularização do HomeServer.

O planejamento separa deliberadamente módulo, capacidade, implementação e serviço. O objetivo é permitir que funcionalidades sejam instaladas, ativadas, desativadas, atualizadas, removidas e, quando aplicável, tenham suas implementações substituídas sem comprometer dados da plataforma ou do usuário.

## Documento consolidado

- [Fundamentos da modularização](fundamentos.md)

## Escopo fechado

O documento `fundamentos.md` consolida as decisões fechadas nas etapas M1.1 a M1.6:

1. informações mínimas que o Core precisa conhecer sobre um módulo;
2. separação entre serviço, módulo, capacidade e implementação;
3. descoberta, catálogo e registro conceitual;
4. dependências e validação pelo Core;
5. lifecycle administrativo, operacional e de operações;
6. propriedade, persistência e remoção segura de dados.

## Próximas etapas

As decisões abaixo permanecem em planejamento e não devem ser tratadas como implementação fechada:

- M1.7 — Integrações entre módulos e plataforma;
- formato do manifesto ou contrato de módulo;
- localização física do catálogo e do estado da instância;
- schema e validação formal;
- API de gerenciamento de módulos;
- adapters concretos para Docker, systemd ou outros mecanismos;
- inventário definitivo de recursos e dados dos serviços atuais.
