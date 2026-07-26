# Workspace Worker

## Objetivo

Materializar e validar a estrutura física do Workspace do HomeServer.

---

## Responsabilidades

- Criar diretórios.
- Validar estrutura.
- Sincronizar o Workspace.
- Delegar operações para a Infrastructure.

---

## Não Responsabilidades

- Ler manifestos.
- Interpretar YAML.
- Resolver dependências.
- Executar Docker.
- Planejar operações.

---

## API Pública

- workspace_worker_execute
- workspace_worker_create
- workspace_worker_validate
- workspace_worker_sync

---

## Dependências

- Foundation
- Infrastructure (Filesystem)

---

## Testes

Ver `tests/`.

---

## Roadmap

- [ ] Create
- [ ] Validate
- [ ] Sync
- [ ] Report