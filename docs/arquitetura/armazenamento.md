# Arquitetura de Armazenamento

## Objetivo

Definir a organização do armazenamento do HomeLab.

O objetivo é separar dados, infraestrutura e dispositivos físicos, permitindo crescimento sem alterar a arquitetura.

---

# Camadas

## Storage Principal

Local onde ficam os dados permanentes do HomeLab.

Caminho:

/srv/data

Exemplos:

- Projetos
- Documentos
- Arquivos compartilhados
- Dados dos serviços

---

## Storage de Backup

Destino para backups.

Caminho padrão:

/mnt/backup

Pode ser:

- HD USB
- SSD externo
- Disco interno

---

## Storage Removível

Dispositivos conectados temporariamente.

Caminho padrão:

/mnt/removable

Exemplos:

- Pendrive
- Cartão SD
- HD USB

---

## Storage de Arquivamento

Arquivos históricos.

Caminho padrão:

/mnt/archive

Exemplos:

- Fotos antigas
- Backups antigos
- Projetos encerrados

---

# Estrutura do Storage Principal

/srv/data

├── backups
├── documents
├── downloads
├── media
├── projects
├── shared
├── temp
├── gitea
└── filebrowser

---

# Responsabilidades

## FileBrowser

Pode acessar:

- Storage Principal
- Storage Backup
- Storage Removível
- Storage Arquivo

Nunca acessa:

- /etc
- /root
- /boot
- /srv/docker
- /srv/git

---

## Samba

Compartilha apenas diretórios autorizados.

Inicialmente:

/srv/data/shared

---

## Gitea

Utiliza apenas:

/srv/data/gitea

---

## Backup

Origem:

/srv/data

Destino:

/mnt/backup

---

# Filosofia

Os dados pertencem ao HomeLab.

Os containers apenas utilizam esses dados.

Nenhum container deve ser considerado dono do armazenamento.

---

# Evolução

Novos dispositivos devem ser adicionados através das camadas existentes.

Nunca alterando a estrutura dos serviços.