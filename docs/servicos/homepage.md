# Homepage

## Descrição
Dashboard principal do HomeServer.

## Porta
3000

## URL
http://192.168.1.114:3000

## Arquivos
- compose.yml
- .env
- config/

## Observações

Versões recentes do Homepage validam o cabeçalho HTTP Host.

Se aparecer o erro:

Host validation failed

adicione ao compose.yml:

```yaml
environment:
  HOMEPAGE_ALLOWED_HOSTS: 192.168.1.114:3000
```

Depois execute:

```bash
docker compose up -d --force-recreate
```