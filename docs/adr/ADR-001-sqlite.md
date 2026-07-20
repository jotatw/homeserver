# ADR-001 — Banco de dados do Gitea

## Status

Aceito

## Contexto

O HomeLab terá inicialmente apenas 2 ou 3 usuários.

Os repositórios serão pequenos e haverá poucos acessos simultâneos.

## Decisão

Utilizar SQLite como banco de dados do Gitea.

## Consequências

### Positivas

- Menor consumo de memória.
- Backup simples.
- Configuração mínima.
- Excelente desempenho para o cenário atual.

### Negativas

- Não é indicado para muitos usuários simultâneos.

## Futuro

Caso o HomeLab cresça significativamente, será avaliada a migração para PostgreSQL.