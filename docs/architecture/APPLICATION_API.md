# HomeServer
## Application API v1

A camada Applications implementa os casos de uso do HomeServer.

Ela representa a API pública utilizada pela CLI (`hs`) e por qualquer
interface futura.

Applications nunca acessa Docker diretamente.

Applications nunca manipula arquivos diretamente.

Toda interação ocorre através da camada Infrastructure.

----------------------------------------------------------

Fluxo

CLI
 │
 ▼
Applications
 │
 ▼
Infrastructure
 │
 ▼
Foundation
 │
 ▼
Sistema Operacional

----------------------------------------------------------

Operações

Lifecycle

- start
- stop
- restart
- status
- logs

Maintenance

- validate
- check
- pull
- update

Information

- info

----------------------------------------------------------

Fluxo padrão

Toda operação deve seguir o fluxo abaixo.

Verificar ambiente

↓

Verificar Docker

↓

Verificar serviço

↓

Executar operação

↓

Retornar resultado

----------------------------------------------------------

Princípios

- Nunca acessar Docker diretamente.

- Nunca acessar docker-compose.yml diretamente.

- Nunca conhecer caminhos físicos.

- Nunca duplicar lógica da Infrastructure.

- Toda operação deve trabalhar apenas com o nome do serviço.

----------------------------------------------------------

Exemplo

application_start("homepage")

↓

compose_up("homepage")

↓

service_directory("homepage")

↓

docker compose up -d

----------------------------------------------------------

Operações futuras

backup
restore

enable
disable

install
uninstall

shell

exec

terminal