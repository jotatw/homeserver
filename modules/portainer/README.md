# Portainer

## Descrição

Interface web para gerenciamento dos containers Docker.

## Módulo opcional

O Portainer é um **módulo opcional**. Ele não é iniciado por padrão para
manter o consumo de recursos baixo (hardware antigo).

Para ativá-lo:

```bash
bash core/hs.sh service enable portainer
bash core/hs.sh service start portainer
```

Acesso:

https://192.168.0.10:9443

## Dados

/srv/docker/volumes/portainer
