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

Os dados ficam centralizados em `/srv/storage` e `/srv/services`. Módulos não
possuem dados próprios; eles utilizam o storage do HomeServer.

## 9. Automações são desacopladas por hooks.

Automações vivem em `automation/hooks/<evento>/`. Cada evento executa todos os
scripts da sua pasta. Novas automações são adicionadas sem alterar o código do
núcleo.

## 10. O HomeServer deve continuar utilizável mesmo com um módulo indisponível.

A falha de um módulo não pode derrubar a plataforma. O Core permanece
funcional e o estado do módulo indisponível é apenas reportado.

---

> Estes princípios orientam todas as decisões de arquitetura do HomeServer.
> Em caso de conflito, os princípios mais acima têm prioridade.
