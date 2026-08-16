# ADR-0002 — Sistema de auto-update

- **Status**: Aceito
- **Data**: 2026-08-04 (v1.3.0)
- **Decisão**: Auto-update via git (tags de release) com backup e pull fast-forward.

## Contexto

O HomeServer precisa ser atualizável de forma simples para quem o utiliza.
Cada implementação é lançada como release (tag `vX.Y.Z`) no GitHub e no Gitea.

## Decisão

- Versão atual = última tag alcançável do HEAD (`git describe --tags`).
- `hs update check` compara com a última tag do remote.
- `hs update apply`: backup (tag `pre-update-*`) → `git pull --ff-only` →
  reimplante opcional (`install.sh`).
- Branch `main` sempre acompanha as releases.

## Consequências

- Positivas: atualização com um comando; rollback via tag de backup; integrado
  ao CLI e à API (`/api/v1/update`).
- Negativas: exige git/ssh no container da API (adicionado ao Dockerfile);
  `update check` depende de rede.

## Alternativas consideradas

- Binários pré-compilados: não aplicável (projeto é scripts + API).
- Script único de download: menos rastreável que tags git.
