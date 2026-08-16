# Threat Model — HomeServer

> Documento de segurança (v1.5 Sprint 2).
> Estado: registrado. Revisar a cada release.

## Fluxo de confiança

```text
LAN (rede local)
     │
     ▼
 Homepage / App
     │
     ▼
     API  (auth, rate limit, helmet, HTTPS via Caddy)
     │
     ▼
     CLI (hs) / Core
     │
     ▼
  Containers  (Docker, sem privileged)
     │
     ▼
   Storage / Backup / Git
```

## Ameaças consideradas

| # | Ameaça | Vetor | Mitigação atual | Estado |
|---|--------|-------|-----------------|--------|
| T1 | Acesso não autorizado à API | Rede LAN | Auth (login/token TTL 24h) + rotas protegidas | ✅ |
| T2 | Brute-force de login | `/api/v1/auth/login` | Rate limit 5/min por IP | ✅ |
| T3 | Exfiltração de dados | Endpoint público | `/version` público apenas; demais exigem auth | ✅ |
| T4 | Abuso de recursos (DoS) | Todos endpoints | Rate limit global 300/min | ✅ |
| T5 | Ataque via navegador (clickjacking/XSS) | Homepage/App | Helmet (CSP, X-Frame-Options, nosniff) | ✅ |
| T6 | Interceptação em trânsito | HTTP | HTTPS via Caddy `tls internal` (homeserver.local) | ✅ |
| T7 | Credenciais vazadas | fb-credentials.env | Arquivo 600, fora do git | ✅ |
| T8 | Container comprometido | Docker | Sem `privileged`; volumes RW mínimos | ✅ |
| T9 | Exposição na internet | WAN | Não exposto; firewall UFW LAN-only | ✅ |

## Ameaças futuras (registro)

| # | Ameaça | Planejado para |
|---|--------|----------------|
| T10 | Exposição externa (reverse proxy público) | v2.0+ (requer Caddy com TLS público, autenticação reforçada) |
| T11 | Vazamento de secrets em logs | Revisão contínua |
| T12 | Supply chain (imagens/npm) | Pin de versões (v1.5 dependencies.md) |
