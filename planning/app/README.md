# Planejamento do App

Esta seção reúne direções de produto para as interfaces do HomeServer.

Os documentos desta área não são especificações finais nem listas obrigatórias de funcionalidades. Seu objetivo é registrar o papel de cada interface, prioridades iniciais e critérios para evitar adicionar recursos sem necessidade antes de existir validação prática.

A implementação pode mudar conforme testes, uso real, limitações técnicas e novas necessidades.

## Interfaces

```text
HomeServer
├── Desktop
│   └── gerenciamento principal e completo
│
└── Mobile
    └── acesso rápido às ações mais frequentes
```

As interfaces não precisam possuir exatamente as mesmas funções.

O princípio é adaptar cada uma ao seu contexto de uso:

- **Desktop:** configuração, administração, navegação detalhada e operações complexas.
- **Mobile:** atalhos, transferências rápidas, consultas essenciais e ações remotas controladas.

## Documentos

- [`mobile-direction.md`](mobile-direction.md) — direção inicial para o uso do HomeServer pelo celular, prioridades e limites do primeiro escopo.

## Relação com módulos

O App pode apresentar funcionalidades fornecidas por módulos, mas não deve transformar um módulo opcional em dependência do núcleo da interface.

```text
Core disponível
      ↓
Funções básicas do App
      +
Módulo opcional instalado?
      ↓
Funções adicionais disponíveis
```

A instalação ou remoção de um módulo deve alterar apenas as capacidades relacionadas a ele, preservando o funcionamento das funções independentes.

## Relação com experimentos

Serviços e funcionalidades em avaliação prática podem existir fora da implementação oficial até que sua utilidade e custo estejam suficientemente conhecidos.

O planejamento do App registra possíveis direções, mas não confirma automaticamente a necessidade de implementar ou integrar uma funcionalidade.

## Princípio central

O App deve facilitar o acesso ao HomeServer no contexto de cada dispositivo. O objetivo não é reproduzir todas as funcionalidades em todas as interfaces, mas oferecer o conjunto de recursos que realmente traz vantagem para aquele contexto de uso.
