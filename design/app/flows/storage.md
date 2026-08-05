# Fluxo 5 — Armazenamento

> Tela: `../wireframes/storage.md` · API: `GET /storage`, `GET /storage/status`, `GET /devices`, `GET /status` (disk)
> Refs: `../references.md` §1 (file managers), §3 (offline-first)
>
> ⚠️ **Gap real (G1)**: a API v1.5 **não navega arquivos** — só expõe status.
> Este fluxo documenta **o que é possível hoje** (Fase 1) e a **visão-alvo** (Fase 2),
> com os requisitos de API que a Fase 2 exige.

## 1. O que a API oferece hoje (v1.5)

| Dado | Endpoint | Payload real |
|---|---|---|
| Status de storage | `GET /api/v1/storage` (ou `/storage/status`) | `root, ready, users, shared, media, documents, devices, users_size, total_size, total_size_human` |
| Disco (geral) | `GET /api/v1/status` → `disk` | `{total, used, available, percent}` |
| Dispositivos USB | `GET /api/v1/devices` | `[{type, label, mountpoint, size}]` |

**O que isto permite hoje**: uma tela de **uso do armazenamento**, não um filebrowser.

## 2. Fase 1 — Tela de uso de armazenamento (implementável)

```
[rota /storage]
    │
    ├─ 1. (paralelo) GET /storage · GET /devices · GET /status (disk)
    │
    ├─ 2. monta painel de uso:
    │       • Disco geral: barra % + usado/disponível (de /status.disk)
    │       • Raiz de dados: root + total_size_human (de /storage)
    │       • Pastas: users / shared / media / documents (+devices) com contagem
    │       • Dispositivos USB: card por device (label + mountpoint)
    │
    └─ 3. falha → empty state + retry
```

### Layout do painel (mobile e desktop)

```
┌──────────────────────────────┐
│ ←  Armazenamento             │
│                              │
│  Disco principal             │
│  ▓▓▓▓▓▓▓▓░░░░░░  38%         │  <- /status.disk
│  usado 1.2 TB de 2 TB        │
│                              │
│  Raiz de dados: /srv/storage │  <- /storage.root
│  total: 23.3 MB · ready: sim │
│                              │
│  Pastas (por usuário)        │
│  users 1 · shared 0 ·        │
│  media 0 · documents 0 ·     │
│  devices 1                   │
│                              │
│  Dispositivos conectados     │
│  ┌────────────────────────┐  │
│  │ 🔌 USB: CCCOMA_...      │  │  <- /devices (label)
│  │    mount: /srv/storage/ │  │
│  │    devices/usb/...      │  │
│  └────────────────────────┘  │
│                              │
│  ⚠ Navegação de arquivos     │
│  não disponível nesta versão │  <- info honesta (G1)
│  [ Ir para FileBrowser → ]   │  <- link externo /files/
│                              │
└──────────────────────────────┘
```

- O **CTA "Ir para FileBrowser"** abre o filebrowser real (`/files/`) em nova aba — ponte honesta enquanto a API não navega arquivos.
- **Admin** vê botão "Ejetar dispositivo" para USB (depende de endpoint — hoje via CLI `hs device eject`; sem endpoint = desabilitado).

## 3. Fase 2 — Visão-alvo (filebrowser nativo)

> Descrita em `../wireframes/storage.md`. Exige novos endpoints na API:

| Requisito de API | Endpoint sugerido | Permite |
|---|---|---|
| Listar diretório | `GET /api/v1/storage/ls?path=` | navegar pastas |
| Metadados | `HEAD/GET /api/v1/storage/stat` | tamanho, tipo, data |
| Upload | `POST /api/v1/storage/upload` (multipart) | enviar arquivos |
| Download | `GET /api/v1/storage/download?path=` | baixar arquivos |
| Criar/renomear/apagar | `PUT/DELETE /api/v1/storage/items` | gerenciar arquivos |
| Mover/copiar | `PATCH /api/v1/storage/items` | organizar |

Enquanto esses endpoints não existem, a Fase 2 **não é implementável** — documentada para o roteiro da v2.0+.

## 4. Comportamento por role

| Elemento | user | admin |
|---|---|---|
| Painel de uso (Fase 1) | ✅ leitura | ✅ leitura |
| CTA "Ir para FileBrowser" | ✅ | ✅ |
| Ejetar USB | oculto | ❌ desabilitado (sem endpoint) |
| Navegação de arquivos (F2) | — | — (futuro) |

## 5. Estados

| Estado | Comportamento |
|---|---|
| Carregando | Skeletons nos blocos de uso |
| `/storage` falha | Bloco com retry; disco ainda vem de `/status` (falha parcial isolada) |
| USB removido | Card desaparece (poll) ou vira "ejetado" |
| Disco sem espaço | Barra em amarelo/vermelho + aviso (cor + texto) |
| Offline PWA | Últimos valores cacheados + badge |

## 6. Checklist de validação

- [ ] Painel Fase 1 usa apenas endpoints reais (storage, status, devices)
- [ ] Honestidade de escopo: aviso claro que navegação não está disponível + CTA FileBrowser
- [ ] Falha parcial isolada (disco continua se storage falhar)
- [ ] Aviso de disco cheio com cor + texto
- [ ] Requisitos da Fase 2 registrados como backlog de API
