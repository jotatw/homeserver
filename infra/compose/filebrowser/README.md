# FileBrowser

## Objetivo

O FileBrowser é o gerenciador de arquivos do HomeLab.

Seu objetivo é fornecer uma interface web para administração do armazenamento do servidor, permitindo navegar, enviar, baixar e organizar arquivos sem necessidade de acesso SSH.

O FileBrowser não é responsável pelos dados. Ele apenas fornece acesso às camadas de armazenamento definidas pela arquitetura do HomeLab.

---

# Função no HomeLab

Categoria:

Storage

Responsabilidade:

Administrar arquivos através da interface web.

---

# Dependências

Obrigatórias

- Docker
- Docker Compose
- Rede homeserver

---

# Integração

Homepage

- Atalho para acesso web.

Storage Layer

- Storage Principal
- Storage Backup (futuro)
- Storage Removível (futuro)
- Storage Arquivo (futuro)

Backup

- Permite verificar arquivos de backup.

Samba

- Compartilha os mesmos diretórios.

---

# Estrutura de Dados

Persistência

/srv/data/filebrowser

Banco

/srv/data/filebrowser/database

Configuração

/srv/data/filebrowser/config

Storage Principal

/srv/data

---

# Acesso

Interface Web

http://IP_DO_SERVIDOR:PORTA

---

# Segurança

O FileBrowser nunca deve possuir acesso irrestrito ao sistema operacional.

Diretórios permitidos:

- /srv/data
- /mnt/backup (futuro)
- /mnt/removable (futuro)
- /mnt/archive (futuro)

Diretórios proibidos:

- /etc
- /boot
- /root
- /home
- /srv/docker
- /srv/git

---

# Backup

Os dados do FileBrowser ficam em:

/srv/data/filebrowser

O conteúdo administrado permanece em:

/srv/data

---

# Status

- [ ] Estrutura criada
- [ ] Compose criado
- [ ] Deploy realizado
- [ ] Configurado
- [ ] Homepage integrado
- [ ] Testado