# Instalar o HomeServer

Este é o ponto de entrada para instalar o HomeServer. Escolha o guia conforme o que você precisa fazer.

## Qual guia devo seguir?

```text
Quero instalar agora e seguir o caminho mais simples
                    ↓
              QUICKSTART.md

Quero entender requisitos, opções e cada etapa
                    ↓
             INSTALLATION.md

Já terminei a instalação e quero começar a usar
                    ↓
              FIRST_BOOT.md

O navegador mostra aviso de certificado ou quero confiar no HTTPS local
                    ↓
              tls-local.md
```

## 1. Instalação rápida

Use [`QUICKSTART.md`](QUICKSTART.md) se quer instalar o HomeServer seguindo o caminho recomendado, sem precisar conhecer todos os detalhes antes.

Você precisa basicamente de:

- um computador com Debian 12;
- acesso com `sudo`;
- internet durante a instalação;
- outro dispositivo na mesma rede para acessar o servidor.

## 2. Instalação detalhada

Use [`INSTALLATION.md`](INSTALLATION.md) se quiser saber exatamente:

- quais são os requisitos;
- o que o instalador faz;
- quais opções de instalação existem;
- o que é criado no sistema;
- como lidar com problemas comuns.

## 3. Depois da instalação

A instalação terminou? Continue em [`FIRST_BOOT.md`](FIRST_BOOT.md).

Esse guia mostra como:

- verificar se o HomeServer está funcionando;
- acessar pelo navegador;
- entender Homepage, App e CLI;
- verificar os serviços;
- encontrar os primeiros comandos de administração.

## 4. HTTPS local

O HomeServer usa HTTPS dentro da rede local. Na primeira vez que um dispositivo acessa o servidor, pode ser necessário instalar a CA local para que o navegador reconheça os certificados como confiáveis.

Use [`tls-local.md`](tls-local.md) para configurar cada computador ou celular que você deseja usar sem avisos de certificado.

## Caminho recomendado

Para uma primeira instalação:

```text
QUICKSTART
    ↓
FIRST_BOOT
    ↓
HOW_IT_WORKS
    ↓
Homepage / App / CLI
```

O guia [`HOW_IT_WORKS.md`](../use/HOW_IT_WORKS.md) explica a organização geral depois que o ambiente estiver funcionando.

Voltar ao [índice da documentação](../README.md).