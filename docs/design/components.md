# Componentes

Padrões visuais reutilizáveis entre Homepage e HomeServer App.

## Card de ação

Card clicável que representa uma **ação**, não um software.

```text
┌─────────────────────────┐
│ [ícone]  Arquivos        │   ← nome = ação
│          Gerenciar arquivos  ← descrição = o que fazer
└─────────────────────────┘
```

- Título: `1.05rem`, peso 600.
- Descrição: `0.82rem`, `text-muted`.
- Hover: leve elevação (`translateY(-2px)`) + sombra.
- O software (FileBrowser, Gitea) nunca aparece como título.

## Card de serviço (Aplicações)

Mesmo card de ação, mas com **dot de status** no canto:

```text
┌─────────────────────────────┐
│ [ícone]  Gitea        ● Online │
└─────────────────────────────┘
```

- Só status (dot). Sem métricas.
- Métricas técnicas pertencem ao grupo Sistema.

## Card técnico (Sistema)

Card compacto com widget (customapi):

```text
┌──────────────────────────┐
│ Sensores           28°C  │
│                       31°C  │
└──────────────────────────┘
```

- Padding menor, raio 8px, sem sombra.
- Sem descrição; o widget fala por si.

## Seletor de modos

Barra fixa no topo direito:

```text
[Usuário | Administrador | Sistema] [Abrir App]
```

- Botões sem borda, `text-muted`, ativo com `primary` sólido.
- "Abrir App" é um atalho destacado (borda `primary`, link direto).

## Botões

| Variante | Estilo |
|----------|--------|
| Primário | `bg: primary`, texto branco, raio 8px |
| Secundário | `bg: surface`, borda `border`, texto normal |
| Perigo | Texto `danger-text`, fundo `rgba(248,113,113,0.12)` |

## Estado de carregamento

Spinner de 36px (`loader-bar`) centralizado durante o fetch de cada view.

## Estado vazio

`text-muted` + ícone 📭 + mensagem curta ("Nenhum usuário encontrado.").

## Estado de erro

`danger-text` + ícone ⚠️ + mensagem da falha (nunca um 500 cru).

## Rodapé

`text-faint`, `0.75rem`, separado por `border-top`:

```text
HomeServer v1.4.4 · 04/08/2026 · Servidor online
```
