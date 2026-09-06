# Security Assumptions — HomeServer

> Hipóteses de segurança aceitas (v1.5 Sprint 2).
> Estas premissas orientam decisões; alterá-las exige revisão do Threat Model.

## Assumptions

1. **Servidor somente LAN** — o servidor não é exposto diretamente à
   internet; acesso é pela rede local (homeserver.local / IP local).
   **Acesso remoto via Tailscale (2026-09)**: a tailnet funciona como
   extensão confiável da LAN — tráfego criptografado ponto a ponto entre
   dispositivos autenticados na mesma conta; o UFW não é atravessado.
   O servidor continua sem qualquer porta exposta à internet.

2. **Usuário administrador único** — existe um admin (usuario) com acesso
   pleno; demais usuários têm escopo restrito.

3. **Sem autenticação externa (OIDC/SSO)** — a autenticação é local
   (login/token da API); integração externa fica para v2.0+.

4. **HTTPS interno** — o tráfego usa TLS interno via Caddy (`tls internal`),
   com certificados locais (não públicos).

5. **Confiança na rede local** — dispositivos na LAN são considerados
   parcialmente confiáveis; ainda assim, a API exige autenticação.
   **Homepage sem login (2026-09-06)**: o portal (`/`) abre sem
   autenticação para quem já está na LAN ou tailnet; a proteção é de rede
   (UFW + Tailscale). Conteúdo exposto é de baixa sensibilidade (atalhos,
   status de serviços, temperatura). Se assumptions (1) ou (8) falharem,
   reavaliar basic auth no Caddy.

6. **Docker sem privileged** — containers rodam sem privilégios elevados;
   a API usa apenas `CAP_SYS_RAWIO` (leitura de hardware/smartmontools).
   Exceções operacionais executam comandos no host via `nsenter` em
   container efêmero (`docker run --privileged --pid host`), sempre
   mediados pelo executor com allowlist e validação de argumentos.

7. **Secrets fora do git** — arquivos `.env` e credenciais não são
   versionados. Chaves públicas de host (ex.: `api/ssh/known_hosts`,
   pinadas do GitHub) são a exceção documentada — dados públicos e
   verificáveis por fingerprint.

8. **Exposição de portas em camadas** — serviços internos (API :8000,
   FileBrowser :8080, Homepage :3000, Gitea :3001, chat-web :3002) escutam
   em `0.0.0.0` porque o acesso tailnet dos dispositivos móveis depende
   do bind no host. A restrição real vem do UFW: policy `DROP` no INPUT e
   liberação apenas para a sub-rede LAN (`192.168.0.0/24`) e interfaces
   tailnet/docker específicas. Porta de entrada unificada: Caddy (:80/:443).

## Impacto se uma assumption falhar

- (1) Expor à internet sem autenticação reforçada → risco crítico.
- (2) Múltiplos admins sem controle → revisão de escopos.
- (4) TLS público sem renovação → certificado inválido.
- (6) Container privilegiado → escalada de privilégios.
- (8) Remoção das regras de sub-rede no UFW → serviços internos visíveis
  em toda a rede; manter o `DROP` como padrão e revisar regras ao adicionar
  serviços.

## Revisão

Revisar a cada release, junto ao Threat Model e ao Quality Gate
(`planning/quality/review-checklist.md`).
