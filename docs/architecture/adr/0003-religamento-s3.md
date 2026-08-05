# ADR-0003 — Religamento automático via suspend (S3)

- **Status**: Aceito
- **Data**: 2026-08-05 (v1.3.0 / corrigido na v1.5.0-rc.5)
- **Decisão**: Religar o servidor às 07:00 usando `rtcwake -m mem` (suspend-to-RAM),
  com desativação dos wake sources (NIC + USB) antes de suspender.

## Contexto

O servidor (MSI MS-AA1511, ~2010) deve desligar às 22:00 e religar sozinho às 07:00.
Testes mostraram que o hardware não suporta religamento confiável de todos os modos.

## Descobertas (testes no hardware real)

| Modo | Comportamento |
|------|---------------|
| `rtcwake -m off` (S5) | Não religa — RTC não gera IRQ de wake do poweroff |
| `rtcwake -m mem` (S3) | Acordava imediatamente (~5s) — wakes USB/NIC |
| `s2idle` | Não acordava pelo RTC — servidor ficava preso |

## Decisão

- Usar `rtcwake -m mem -t <epoch>` (S3 **deep** — único modo funcional).
- **Desabilitar wakes** antes de suspender: `ethtool wol d` (NIC) + USB
  (USB0, US15, US12 em `/proc/acpi/wakeup`).
- **Restaurar wakes** após o resume (WOL permanece disponível).

## Consequências

- Positivas: religamento automático às 07:00 validado (suspend 90s → resume em ~91s).
- Negativas: suspend-to-RAM consome energia em standby (não é desligamento total);
  depende do script `power-schedule.sh` rodar como root.

## Alternativas consideradas

- BIOS "Resume by Alarm": mais robusta, mas exige acesso físico.
- WOL com waker externo: viável, mas depende de outro dispositivo na rede.
