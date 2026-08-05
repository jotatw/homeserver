# Wireframe — Armazenamento (Storage)

> App: HomeServer (v2.0) · Tela: "Arquivos" (subset de Meu espaço)
> Refs: `../references.md` §1 (file managers self-hosted, Immich como referência de fluidez); §3 (offline-first com sync)
> Telas alvo: mobile (480px) e desktop (1280px).
>
> ⚠️ **Gap real (v1.5)**: a API hoje só expõe `GET /storage(+/status)` → uso de disco.
> Não há listagem/navegação/upload de arquivos (ver `../flows/README.md` §6 G1).
> Este wireframe descreve a visão alvo; será marcado como **não implementável nesta versão**
> até a API expor navegação de FS, OU fica como especificação do filebrowser nativo da v2.0+.

## Objetivo

Navegar pelos arquivos do servidor (FS real via API `/storage`), fazer upload/download e ver uso de disco. É o "filebrowser" nativo do App.

## Variante mobile (480×800)

```
┌──────────────────────────────┐
│ ←  Arquivos    ⚡ sync:ok    │  <- sync status + refresh
│   //home/usuario                 │  <- breadcrumb (scroll horizontal)
│                              │
│  [ ✕ Nova pasta ] [ ⬆ Enviar ]│  <- ações principais (48dp)
│                              │
│  ┌────────────────────────┐  │
│  │ 📁 documentos          │  │
│  │    128 itens · 34 MB   │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 🎞️ fotos               │  │
│  │    2.4k itens · 8.2 GB │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 🎵 music               │  │
│  │    890 itens · 3.1 GB  │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 📄 notas.txt     34 KB │  │  <- arquivo (menu "⋯" à direita)
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  ✕ selecionar      ⋯         │  <- multi-select + menu
│  ┌─────────┬────────┬──────┐ │
│  │ Home ▓▓ │ Apps   │ +    │ │
│  └─────────┴────────┴──────┘ │
└──────────────────────────────┘
```

## Variante desktop (1280×800)

```
┌──────┬──────────────────────────────────────────────────────┐
│ ≡    │  Arquivos                      🔍  Buscar no diretório│
│      ├──────────────────────────────────────────────────────┤
│ ▓●▓  │  ⬆ Upload   ➕ Nova pasta   🗑  (após seleção)        │
│ Home │                                                      │
│      │  //home/usuario > documentos >                            │
│ Apps │  ┌────────────────────────────────────────────────┐  │
│      │  │ ☐ Nome        Tipo    Tamanho  Modificado     │  │
│ Arq. │  │ ☐ 📁 docs      pasta   —        12/05 08:00   │  │  <- table
│      │  │ ☐ 📄 relatorio.pdf 3.4 MB  11/05 21:14         │  │
│ Admin│  │ ☐ 🖼️ foto.jpg       2.1 MB  11/05 19:02         │  │
│      │  └────────────────────────────────────────────────┘  │
│ Sist.│                                                      │
│      │  Uso do disco (essa pasta)                           │
│      │  ▓▓▓▓▓▓▓▓░░░░░░  62% de 2 TB                         │
│      │                                                      │
│      │  3 itens · 5.5 MB          [ ⬇ Baixar seleção ]      │
│      │                                                      │
│      │  Rascunhos off-line: 2 arquivos (sync pending) ⚡     │
│      │                                                      │
└──────┴──────────────────────────────────────────────────────┘
```

## Estados

| Estado | Comportamento |
|---|---|
| Carregando | Lista skeleton; breadcrumb visível |
| Upload | Barra de progresso inline + agrupamento na lista (ref §3: "saved, will sync") |
| Offline | Badge "pendente de sync" nos itens locais; fila visível |
| Erro | Toast "Falha ao carregar" + retry no cabeçalho |

## Anotações de design

- **Listas longas**: virtualization (ref §3 Patterns.dev) — pastas com milhares de itens.
- **Multi-seleção** por checkbox no desktop; no mobile via "✕ selecionar" (modo seleção, ref §2 M3).
- **Offline-first parcial**: leitura de arquivos grandes pode ser lenta; manter cache de metadados (IndexedDB) e marcar uploads pendentes.
- **Drag-and-drop** para upload no desktop (ref §1: drag-and-drop é padrão Homarr/Flame).
- Segurança: permissões do FS são as do usuário na API; nunca exibir caminhos internos absolutos fora do breadcrumb.
