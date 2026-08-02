# Próximas etapas

## Concluído

- [x] Debian 13
- [x] SSH por chave
- [x] Firewall UFW
- [x] Docker + Docker Compose
- [x] FileBrowser
- [x] Gitea
- [x] Homepage (layout em abas + resumo do servidor)
- [x] API (`/api/v1/status`, `/api/v1/users`)
- [x] Samba
- [x] Backup diário
- [x] Agendamento liga/desliga
- [x] Sistema de módulos ativáveis
- [x] Perfis de usuários (Gitea + FileBrowser + pasta própria)

## Login na homepage

- [ ] Ativar OIDC (Gitea) quando a versão do Homepage suportar autenticação
- [ ] Config já preparada em `modules/homepage/.env.example`

## Futuro (módulos)

- [ ] Uptime Kuma (monitoramento)
- [ ] Jellyfin (mídia)
- [ ] Portainer: ativar quando necessário
- [ ] Backup externo (Synology / HD removível)
- [ ] Autenticação na API (API key)

## Qualidade

- [ ] CI (GitHub Actions) rodando a suíte de testes
- [ ] Testes de API
- [ ] Documentação da API (OpenAPI)
