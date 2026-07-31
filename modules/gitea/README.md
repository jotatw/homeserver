# Gitea

## Objetivo

Servidor Git auto-hospedado do HomeLab.

## Dependências

- Docker
- Rede homeserver

## Portas

- HTTP: 3001
- SSH: 2222

## Dados

/srv/data/gitea

## Compose

/srv/docker/compose/gitea

## Status

[x] Compose criado
[x] .env criado
[x] README criado
[x] Deploy
[ ] Configuração inicial
[ ] Testes
[ ] Homepage
[ ] Backup validado

## Acesso

Web:
http://IP_DO_SERVIDOR:3001

SSH:
ssh -p 2222 git@IP_DO_SERVIDOR

## Backup

Dados persistidos em:

/srv/data/gitea

## Autenticação Git

Durante a configuração inicial foi utilizado um Token de Acesso para validar o funcionamento do serviço.

Após a configuração das chaves SSH, todas as operações Git passarão a utilizar SSH.