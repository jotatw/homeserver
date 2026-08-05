# Security Assumptions — HomeServer

> Hipóteses de segurança aceitas (v1.5 Sprint 2).
> Estas premissas orientam decisões; alterá-las exige revisão do Threat Model.

## Assumptions

1. **Servidor somente LAN** — o servidor não é exposto diretamente à
   internet; acesso é pela rede local (homeserver.local / IP local).

2. **Usuário administrador único** — existe um admin (joao) com acesso
   pleno; demais usuários têm escopo restrito.

3. **Sem autenticação externa (OIDC/SSO)** — a autenticação é local
   (login/token da API); integração externa fica para v2.0+.

4. **HTTPS interno** — o tráfego usa TLS interno via Caddy (`tls internal`),
   com certificados locais (não públicos).

5. **Confiança na rede local** — dispositivos na LAN são considerados
   parcialmente confiáveis; ainda assim, a API exige autenticação.

6. **Docker sem privileged** — containers rodam sem privilégios elevados;
   a API usa apenas `CAP_SYS_RAWIO` (leitura de hardware/smartmontools).

7. **Secrets fora do git** — arquivos `.env` e credenciais não são
   versionados.

## Impacto se uma assumption falhar

- (1) Expor à internet sem autenticação reforçada → risco crítico.
- (2) Múltiplos admins sem controle → revisão de escopos.
- (4) TLS público sem renovação → certificado inválido.
- (6) Container privilegiado → escalada de privilégios.

## Revisão

Revisar a cada release, junto ao Threat Model e ao Quality Gate
(`planning/quality/review-checklist.md`).
