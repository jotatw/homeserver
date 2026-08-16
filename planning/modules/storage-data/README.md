# Storage and Data

## Objetivo

Agrupa capacidades relacionadas a armazenamento persistente, arquivos, dados compartilhados e sua preservação durante a evolução dos módulos.

## Módulos previstos

- Files / gerenciamento de arquivos;
- Storage / armazenamento e bindings;
- Backup de dados persistentes;
- capacidades futuras de sincronização ou dados compartilhados.

## Decisões principais

- uso não implica ownership;
- dados persistentes devem sobreviver ao uninstall quando a política determinar;
- recursos compartilhados e externos não podem ser removidos implicitamente;
- purge exige escopo destrutivo explícito;
- migrations devem declarar impacto sobre formatos e dados.

## Integrações

Pode fornecer capacidades para outros grupos e integrar-se ao App como gerenciamento centralizado de arquivos e armazenamento.

## Estado

Planejamento funcional fechado. Topologia física, drivers, formatos e implementação concreta serão definidos por módulo durante a implementação.
