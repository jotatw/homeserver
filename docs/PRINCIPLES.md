# HomeServer Principles

> Princípios permanentes do HomeServer.
>
> Estes princípios registram as decisões arquiteturais do projeto. Eles servem
> como referência para manter a coerência da arquitetura durante a evolução,
> sem precisar revisitar discussões passadas.

---

## 1. Simplicidade acima de funcionalidades.

O HomeServer prefere uma solução simples e compreensível a uma repleta de
recursos. Cada funcionalidade adicionada deve justificar a complexidade que
introduz.

## 2. Uma responsabilidade por módulo.

Cada módulo possui uma única responsabilidade bem definida. Módulos pequenos,
focados e desacoplados são mais fáceis de manter, testar e evoluir.

## 3. Foundation nunca depende de Infrastructure.

A Foundation é a biblioteca base e não conhece a Infrastructure, os módulos
ou qualquer serviço específico. As dependências sempre apontam das camadas
superiores para as inferiores.

## 4. Infrastructure nunca depende de Modules.

A Infrastructure gerencia armazenamento, usuários, dispositivos e serviços de
forma genérica. Ela não conhece os módulos específicos instalados.

## 5. Toda integração externa passa por Adapters.

A Infrastructure nunca conversa diretamente com serviços externos
(FileBrowser, Gitea, etc.). Toda integração passa pela camada de adaptadores,
permitindo substituir um componente sem reescrever a lógica central.

## 6. Toda funcionalidade possui testes.

Cada funcionalidade do Core deve ter cobertura de testes. A suíte é executada
em CI (shellcheck + testes) e deve permanecer verde antes de cada entrega.

## 7. APIs são padronizadas por recurso.

Toda API segue o padrão `recurso` + `/status` (ex.: `/storage` e
`/storage/status`). Isso mantém a interface estável e previsível entre versões.

## 8. Storage pertence ao HomeServer, nunca aos módulos.

Os dados persistentes do HomeServer ficam centralizados em `/srv/storage`,
enquanto os backups ficam separados em `/srv/backup`. Infraestrutura de
containers, código e configuração ficam em seus respectivos diretórios:
`/srv/docker`, `/srv/git` e `/srv/config`.

Módulos não devem criar estruturas de dados paralelas fora do modelo oficial.

## 9. Automações são desacopladas por hooks.

Automações vivem em `automation/hooks/<evento>/`. Cada evento executa todos
os scripts da sua pasta. Novas automações são adicionadas sem alterar o código
do núcleo.

## 10. O HomeServer deve continuar utilizável mesmo com um módulo indisponível.

A falha de um módulo não pode derrubar a plataforma. O Core permanece
funcional e o estado do módulo indisponível é apenas reportado.

## 11. Maturidade antes de novas funcionalidades.

Nenhuma nova funcionalidade entra antes que a anterior esteja realmente
utilizável. Uma versão só é entregue quando o que ela promete funciona de fato.

## 12. Melhorias perceptíveis.

Cada nova versão deve entregar melhorias perceptíveis ao usuário. Se o
usuário não percebe a diferença ao abrir a Homepage, a versão não está pronta.

## 13. Estabilidade sobre quantidade.

Arquitetura estável é mais importante que quantidade de funcionalidades.
Mudanças estruturais são evitadas após a consolidação da arquitetura.

---

## Definição de Módulo

> Um módulo é qualquer componente que possa ser **instalado, atualizado ou
> removido sem alterar a Foundation nem a Infrastructure** do HomeServer.

| Item | É módulo? |
|------|-----------|
| Homepage, FileBrowser, Gitea, Jellyfin, Caddy | ✅ módulo |
| Telegram, GitHub, Discord | ❌ adaptador |
| Storage, Users, Devices | ❌ Infrastructure |

Esta definição diferencia os **módulos de produto** (`modules/`) das camadas
do Core (`core/foundation`, `core/infrastructure`, `core/adapters`).

---

> Estes princípios orientam todas as decisões de arquitetura do HomeServer.
> Em caso de conflito, os princípios mais acima têm prioridade.
