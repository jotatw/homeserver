# Caddy — Unified Access

## Descrição

Reverse proxy que esconde a infraestrutura do HomeServer atrás de um único
ponto de entrada: `homeserver.local`.

## Objetivo

> Um único ponto de entrada para todo o HomeServer.

O usuário nunca vê portas nem endereços IP.

## Rotas

| Caminho | Backend |
|---------|---------|
| `/` | Homepage (:3000) |
| `/files` | FileBrowser (:80) |
| `/git` | Gitea (:3000) |
| `/api/v1` | API (:8000) |

Path-based (sem subdomínios) para reforçar a identidade de um único sistema.

## Instalação

```bash
cd modules/caddy
docker compose up -d
```

## Dependências

- Rede `homeserver` (Docker)
- mDNS/Avahi no host (`homeserver.local`)
- Backends: homepage, filebrowser, gitea, api

## Atualização

```bash
docker compose pull && docker compose up -d
```

## Backup

Backup do volume `caddy_data` (certificados/estado).

## mDNS (Avahi)

Para `homeserver.local` resolver na LAN, o host precisa do Avahi restrito à
interface de rede local:

```bash
apt install avahi-daemon
# /etc/avahi/avahi-daemon.conf → [server] allow-interfaces=enp7s0
systemctl restart avahi-daemon
```

## HTTPS local (CA interna)

O Caddy usa os certificados da **CA interna do HomeServer** (gerados por
`hs tls init` em `/srv/config/tls`, montados em `/etc/tls`). Não usa
certificado auto-assinado descartável.

Para o navegador parar de bloquear as páginas, instale a CA **uma vez por
dispositivo** (guia completo: `../../docs/install/tls-local.md`):

```bash
# baixe a CA (pré-trust, porta 80)
curl -k http://192.168.0.10/hs-ca.pem -o hs-ca.pem   # ou homeserver.local
```

- Linux: copiar `hs-ca.pem` para `/usr/local/share/ca-certificates/` e rodar
  `sudo update-ca-certificates`.
- Windows/macOS/Android/iOS: ver `../../docs/install/tls-local.md`.

Acesso após a instalação:

- `https://homeserver.local`
- `https://192.168.0.10` (o IP está no SAN do certificado)

O certificado é renovado automaticamente (tarefa `tls-renew` do scheduler,
semanal) e o Caddy é recarregado sem interrupção.
