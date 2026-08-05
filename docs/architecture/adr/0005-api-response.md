# ADR-0005 — Padronização da resposta da API

- **Status**: Aceito
- **Data**: 2026-08-05 (v1.5.0)
- **Decisão**: Respostas padronizadas `{ok, data}` / `{ok, error}`.

## Contexto

As rotas da API respondiam em formatos inconsistentes (dados diretos, `{error}`,
`{ok:true}` etc.), dificultando o consumo pelo App.

## Decisão

- Sucesso: `{"ok":true,"data":<payload>}`.
- Erro: `{"ok":false,"error":"<mensagem>"}`.
- Pipeline único: `Request → Validação → Service → Resposta`.
- Todos os endpoints usam `sendOk`/`sendError` (`utils/respond.ts`).

## Consequências

- Positivas: contrato previsível; App trata todos os endpoints igualmente.
- Negativas: quebra de contrato exigiu atualizar consumidores (App auth.js,
  homepage custom.js, widgets services.yaml).

## Alternativas consideradas

- Manter formato heterogêneo: rejeitado (dificultaria o App na v2.0).
