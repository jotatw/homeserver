# Homepage

## Descrição

Dashboard para centralizar o acesso aos serviços do Home Server.

## Recursos

- Dashboard responsivo
- Widgets
- Integração com Docker
- Bookmarks
- Agrupamento de serviços
- Ícones personalizados
- Tema claro/escuro

## Estrutura

config/
icons/
compose.yaml
.env
.env.example

## Variáveis

| Variável | Descrição |
|----------|-----------|
| TZ | Timezone |
| HOMEPAGE_PORT | Porta HTTP |

## Volumes

| Host | Container |
|------|-----------|
| config | /app/config |
| icons | /app/public/icons |

## Porta

3000/tcp

## Instalação

docker compose pull
docker compose up -d

## Atualização

docker compose pull
docker compose up -d

## Backup

Backup da pasta config/

## Restauração

Restaurar a pasta config/

## Troubleshooting

### Homepage não abre

...

### Widget Docker não funciona

...

### Ícones não aparecem

...