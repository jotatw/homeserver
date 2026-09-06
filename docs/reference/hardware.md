# Hardware do servidor — guia de referência

> Referência do host onde o HomeServer roda em produção. Útil para decisões de
> performance, limites de carga, tuning de containers e diagnóstico de sensores.
>
> Dados coletados em 2026-09-06 (Debian 13, kernel 6.12). Sem identificadores
> únicos (MAC, seriais) — apenas especificações.

## Resumo

| Componente | Especificação |
|---|---|
| CPU | Intel Pentium Dual-Core T4500 @ 2.30 GHz (2 núcleos / 2 threads) |
| RAM | 2.7 GiB |
| Disco do sistema | WDC WD3200AAJS (320 GB, SATA, 7200 rpm) — `/dev/sda` |
| Disco de backup | SanDisk Cruzer Blade (15 GB, USB) — `/dev/sdb`, monta em `/srv/backup` |
| Unidade óptica | HL-DT-ST DVDRAM GT30N (SATA) |
| GPU | NVIDIA C79 [ION] — driver `nouveau` (sem aceleração em uso) |
| Rede cabeada | `enp7s0` (interface principal, UP) |
| Rede sem fio | `wlp8s0` (DOWN — não utilizada) |
| VPN | `tailscale0` (acesso remoto, ver docs de Tailscale) |
| OS | Debian GNU/Linux 13 (trixie) |
| Kernel | 6.12 (amd64) |
| Boot | `/dev/sda1` (ext4, ~295 GB) + swap 2.7 GB (`/dev/sda5`) |

## Partições

```text
sda  298.1G  WDC WD3200AAJS
├─sda1 295.3G ext4   /            (sistema + /srv/git + /srv/storage)
├─sda2     1K                     (estendida)
└─sda5   2.7G swap   [SWAP]
sdb   14.9G  Cruzer Blade (USB)
└─sdb1 14.9G ext4   /srv/backup  (backups diários)
```

## Particularidades e limites do host

Estes pontos afetam decisões operacionais. Foram todos verificados no
ambiente real — não são suposições.

### Temperatura — usar apenas o sensor `coretemp`

O sensor da GPU (`nouveau`, C79 ION) reporta **~98 °C irreais** neste host.
Qualquer leitura de temperatura deve filtrar por `hwmon` com `name=coretemp`
(somente CPU). O `scripts/health-check.sh` já aplica esse filtro (ver
CHANGELOG, seção Corrigido).

### RAM — 2.7 GiB é o teto prático

- A pilha completa (5 containers + host) opera com ~1.2 GiB usados.
- Upload/download grande no FileBrowser consome pouco RAM (pico medido
  ~51 MiB, streaming em chunks).
- Evite serviços com heap alto (JVM, Elasticsearch etc.) neste host.

### Wake-on-LAN e suspensão (night-off)

- O servidor suspende em S3 às 22h e acorda por RTC de manhã (ver
  `planning/` e script de energia).
- O `ethtool` **não está instalado**, então o `wol d` do script falha
  silenciosamente e o WOL **permanece ativo** — o acordar via magic packet
  funciona (testado: ~64 s para voltar ao ar).
- Se instalar o `ethtool`, trocar `wol d` por `wol g` no script de energia,
  senão o acordar remoto quebra.

### Boot — HDD mecânico

O sistema inicia do HDD (`sda`), não do pendrive. O pendrive Cruzer Blade é
exclusivamente o alvo de backup (`/srv/backup`). Boot medido: ~1 min 12 s
(kernel ~4.5 s + userspace).

### CPU — 2 núcleos sem hyper-threading

- Load aceitável observado: 0.5–0.8.
- Build da API (`tsc` + testes) é o processo mais pesado do dia a dia;
  rode preferencialmente no notebook, não no servidor.

## Métricas de referência

Medições históricas detalhadas ficam em `planning/health/`. Resumo:

| Métrica | Valor medido |
|---|---|
| API (local) | ~3.5 ms |
| Homepage TTFB | ~5–70 ms (com cache) |
| CLI `hs version` | ~118 ms |
| CLI `hs status` | ~196 ms |
| CLI `hs update check` | ~963 ms (depende da rede) |

## Manutenção deste documento

- Atualizar após qualquer troca de hardware (disco, RAM, placa).
- Não incluir MAC, seriais ou identificadores únicos — este arquivo é público.
- Re-medir as métricas a cada Health Survey (início de versão maior).
