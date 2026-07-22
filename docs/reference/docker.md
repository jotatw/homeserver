# Docker

## Instalação

Instalado a partir do repositório oficial do Docker.

## Componentes

- Docker Engine
- Docker Compose Plugin
- Buildx
- containerd

## Estrutura

/srv/docker

- compose/
- volumes/
- configs/
- networks/
- secrets/

## Status

Instalado e operacional.

## Rede

Nome: homeserver

Todos os containers utilizam esta rede para comunicação interna.

## Estrutura

/srv/docker
├── compose
├── volumes
├── backups
└── scripts

## Política

- Um diretório por serviço
- Um compose.yml por serviço
- Volumes persistentes separados
- Containers ligados à rede homeserver