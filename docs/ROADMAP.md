# HomeServer Roadmap

## Objetivo

Este documento descreve o planejamento de desenvolvimento do HomeServer.

O projeto evolui de forma incremental. Cada etapa é concluída antes do início da próxima, garantindo estabilidade, documentação atualizada e redução de retrabalho.

---

# Estado Atual

| Área | Status |
|------|--------|
| Foundation | ✅ Concluído |
| Infrastructure | 🚧 Em planejamento |
| Applications | ⏳ Não iniciado |
| Provisioning | ⏳ Não iniciado |
| Services | ⏳ Não iniciado |
| Documentação | 🚧 Em desenvolvimento |

---

# Fases do Projeto

## Sprint 0 — Foundation

**Status:** ✅ Concluído

### Objetivo

Construir a base reutilizável do HomeServer Core.

### Entregas

- Arquitetura da Foundation
- Documentação da Foundation
- Bootstrap
- Loader
- Constants
- Config
- Output
- Validation
- Filesystem
- Testes unitários
- Auditoria técnica

### Resultado

Foundation estável e aprovada para servir como base das próximas camadas.

---

## Sprint 1 — Infrastructure

**Status:** 🚧 Em planejamento

### Objetivo

Implementar a camada responsável pela interação com o sistema operacional.

### Escopo

- Filesystem avançado
- Environment
- Docker
- Docker Compose
- Gerenciamento de serviços
- Workspace
- Provisionamento básico

### Critérios de conclusão

- Todos os módulos documentados
- Testes automatizados
- Auditoria técnica
- ShellCheck sem erros

---

## Sprint 2 — Applications

**Status:** ⏳ Planejado

### Objetivo

Construir aplicações reutilizáveis utilizando a Infrastructure.

### Aplicações previstas

- Homepage
- FileBrowser
- Gitea

---

## Sprint 3 — Services

**Status:** ⏳ Planejado

### Objetivo

Padronizar a instalação e gerenciamento dos serviços do HomeServer.

### Escopo inicial

- Estrutura de serviços
- Configuração padronizada
- Persistência de dados
- Atualização de serviços

---

## Sprint 4 — Provisioning

**Status:** ⏳ Planejado

### Objetivo

Automatizar a preparação completa do ambiente.

### Escopo

- Instalação
- Configuração
- Inicialização
- Atualização

---

## Sprint 5 — Qualidade

**Status:** ⏳ Planejado

### Objetivo

Consolidar qualidade e estabilidade do projeto.

### Escopo

- Testes de integração
- Cobertura de testes
- Revisão arquitetural
- Revisão da documentação

---

## Sprint 6 — Release 1.0

**Status:** ⏳ Planejado

### Objetivo

Publicar a primeira versão estável do HomeServer.

### Requisitos

- Arquitetura consolidada
- Documentação completa
- Testes aprovados
- Serviços principais funcionando
- Processo de instalação reproduzível

---

# Princípios de Evolução

Cada Sprint segue o mesmo ciclo de desenvolvimento:

1. Planejamento
2. Documentação
3. Implementação
4. Testes
5. Auditoria técnica
6. Aprovação
7. Liberação

Nenhuma etapa é considerada concluída sem atender a esse fluxo.

---

# Próximos Passos

Após a conclusão da Foundation, o foco do projeto passa a ser:

1. Documentação da Infrastructure
2. Auditoria dos módulos da Infrastructure
3. Consolidação da camada
4. Desenvolvimento das Applications