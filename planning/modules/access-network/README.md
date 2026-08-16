# Access and Network

## Objetivo

Agrupa capacidades de acesso à plataforma, exposição de serviços, roteamento e conectividade.

## Módulos e capacidades previstas

- proxy e roteamento;
- gestão de endpoints e exposição controlada;
- acesso administrativo e futuro modelo de identidade/autorização;
- integração de rede necessária aos serviços instalados.

## Princípios

Detalhes de Caddy, portas, redes de containers e outras tecnologias permanecem nas implementations/adapters. O contrato deve declarar necessidades e políticas sem tornar a tecnologia atual parte da identidade do módulo.

## Operações relevantes

Mudanças de exposição ou acesso devem ser tratadas como operações com validação e verificação, especialmente quando afetarem serviços existentes.

## Estado

Planejamento funcional fechado; políticas concretas de autenticação e mecanismos de rede serão detalhados nas fases correspondentes.
