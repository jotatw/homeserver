# Dependências e Lifecycle

## Dependências

Uma dependência declara uma necessidade arquitetural. Ela pode existir no contexto de instalação, runtime ou de uma operação específica.

Quando possível, módulos devem depender de capacidades, não de tecnologias concretas.

```text
MODULE
    requires
        storage.persistent

CORE
    resolves
        provider / resource / binding
```

Dependência não é sinônimo de integração. A existência de uma rota ou item de interface não cria automaticamente dependência existencial.

## Capabilities

Capabilities representam funcionalidades oferecidas à plataforma. Um provider pode mudar sem exigir alteração da identidade funcional do consumidor, desde que o contrato permaneça compatível.

## Lifecycle

A intenção administrativa e o estado operacional permanecem separados.

Operações principais incluem `install`, `enable`, `disable`, `start`, `stop`, `restart`, `update`, `uninstall` e `purge` conforme o contrato aplicável.

`update` deve preservar a intenção administrativa. Atualizar uma Instance desabilitada não deve habilitá-la implicitamente.

## Validação central

Antes de mudanças relevantes, o Core avalia dependências, dependentes e impacto. A camada que executa uma tecnologia concreta não decide isoladamente se uma operação é arquiteturalmente permitida.

## Invariantes

- depender de uma capacidade não concede controle irrestrito sobre seu provider;
- integração não implica dependência existencial;
- estado administrativo não implica saúde;
- `uninstall` não implica `purge`;
- falha operacional não deve reescrever automaticamente a intenção administrativa.
