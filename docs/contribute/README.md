# Personalizar e desenvolver

O HomeServer não tenta definir uma única configuração ideal para todas as pessoas. Cada instalação pode ter necessidades diferentes.

A ideia é simples: **a base fornece uma estrutura estável, e cada pessoa pode adaptar o que faz sentido para seu próprio uso**.

## Qual caminho devo seguir?

```text
Quero adaptar meu próprio HomeServer
        ↓
PERSONALIZAÇÃO
        ↓
CONTRIBUTING.md

Quero desenvolver uma funcionalidade dentro da arquitetura
        ↓
DEVELOPMENT.md

Quero validar uma alteração
        ↓
TESTING.md
```

## Personalização

Use [`CONTRIBUTING.md`](CONTRIBUTING.md) como guia principal para modificar a sua própria instalação.

Ele ajuda a decidir:

- o que pode ser adaptado localmente;
- quando uma mudança pode ficar fora do repositório principal;
- quando uma capacidade merece ser incorporada à arquitetura;
- como evitar acoplamentos desnecessários;
- o que verificar antes de adicionar um serviço ou automação.

Você não precisa transformar toda personalização em uma contribuição oficial ao projeto.

```text
Necessidade pessoal
      ↓
Teste local
      ↓
Funciona para o seu uso?
      ├── sim → pode permanecer como personalização local
      └── não → ajustar ou remover

A solução se torna reutilizável e estável?
      └── então pode ser avaliada para integração ao projeto
```

## Desenvolvimento

Use [`DEVELOPMENT.md`](DEVELOPMENT.md) quando a alteração precisar seguir ou modificar componentes da arquitetura do HomeServer.

Esse documento trata de responsabilidades, padrões e decisões técnicas.

## Testes

Use [`TESTING.md`](TESTING.md) para validar mudanças antes de considerá-las confiáveis.

A quantidade de testes deve ser proporcional ao risco e ao impacto da alteração.

## Princípio geral

```text
Personalização local não precisa ser genérica.

Uma solução só deve entrar na base principal quando tiver utilidade,
comportamento e manutenção suficientemente claros.
```

Isso permite que o HomeServer continue simples na base, sem impedir que cada instalação evolua de forma diferente.

Voltar ao [índice da documentação](../README.md).