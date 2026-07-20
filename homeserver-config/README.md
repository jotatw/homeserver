# HomeServer

Servidor doméstico desenvolvido como laboratório para estudos de Linux, Docker, Git e Infraestrutura.

---

## Objetivos

- Servidor de arquivos (Samba)
- Interface web para gerenciamento de arquivos (FileBrowser)
- Servidor Git (Gitea)
- Containers Docker
- Backup automatizado
- Monitoramento

---

## Hardware

| Item | Especificação |
|------|---------------|
| Equipamento | MSI MS-AA1511 |
| CPU | Intel Pentium Dual-Core T4500 |
| RAM | 3 GB DDR3 |
| Disco | 320 GB HDD |

---

## Sistema

- Debian 13 (Trixie)
- SSH
- UFW
- Autenticação por chave SSH

---

## Estrutura

```
/srv
├── git
├── docker
├── data
├── backup
├── logs
└── scripts
```

---

## Status

- [x] Debian instalado
- [x] SSH configurado
- [x] Firewall
- [x] Git inicializado
- [ ] Docker
- [ ] Portainer
- [ ] Samba
- [ ] FileBrowser
- [ ] Gitea