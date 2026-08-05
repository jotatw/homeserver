# Quality Gate — HomeServer

Checklist permanente. **Toda release passa por este documento.**

Estado registrado ao final de cada versão em `planning/health/`.

## Architecture

- [ ] Camadas respeitadas (Foundation → Infrastructure → Adapters → API).
- [ ] Mudanças estruturais têm ADR.
- [ ] Sem duplicação de responsabilidade entre módulos.

## Security

- [ ] Permissões de arquivos corretas (`/srv`, `/storage`, `/backup`, `/config`, `/git`).
- [ ] Containers sem privilégios desnecessários; volumes RW mínimos.
- [ ] Secrets fora do repositório.
- [ ] CORS, headers e autenticação revisados.
- [ ] Threat Model e Security Assumptions atualizados.

## Consistency

- [ ] Nomenclatura por camada (`hs_*` Foundation · `modulo_*` Infra · `filebrowser_*` Adapters).
- [ ] CLI com verbos uniformes.
- [ ] Configuração com padrão de chaves único.
- [ ] Logs com formato `DATA MÓDULO NÍVEL MENSAGEM`.

## Performance

- [ ] Homepage < 1s.
- [ ] API < 100ms.
- [ ] CLI < 300ms.
- [ ] Boot/shutdown/update medidos e registrados.

## Documentation

- [ ] README atualizado.
- [ ] API docs coerentes com a implementação.
- [ ] VISION / PRINCIPLES / ROADMAP consistentes.
- [ ] ADRs cobrindo decisões importantes.

## Testing

- [ ] Suite Core (Foundation + Infrastructure) passa.
- [ ] Testes de API (HTTP ok/data) passam.
- [ ] Testes de CLI passam.
- [ ] Testes de Adapters passam.
- [ ] Smoke tests passam.
- [ ] Regression tests para bugs corrigidos.

## Release

- [ ] CHANGELOG atualizado.
- [ ] Tag `vX.Y.Z` criada.
- [ ] Push para GitHub e Gitea.
- [ ] `hs update check` → em dia após a release.

---

## Resumo da release

| Área | Estado |
|------|--------|
| Architecture | ☐ |
| Security | ☐ |
| Consistency | ☐ |
| Performance | ☐ |
| Documentation | ☐ |
| Testing | ☐ |
| Release | ☐ |
