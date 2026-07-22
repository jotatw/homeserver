# HomeServer Vision

## Visão

O HomeServer é um projeto de infraestrutura voltado para ambientes domésticos, criado para oferecer uma plataforma simples, prática e confiável para armazenamento, compartilhamento de arquivos, mídia, desenvolvimento e administração de serviços.

O objetivo não é construir um laboratório de tecnologias, mas sim um servidor que possa ser utilizado diariamente por qualquer pessoa, independentemente do seu nível de conhecimento técnico.

Toda a complexidade da infraestrutura deve permanecer transparente para o usuário final.

---

# Missão

Disponibilizar serviços domésticos modernos utilizando tecnologias abertas e consolidadas, mantendo uma experiência de uso simples, intuitiva e segura.

O administrador deve encontrar um ambiente organizado e padronizado.

O usuário deve encontrar apenas os serviços de que precisa.

---

# Público-alvo

O HomeServer foi projetado para atender:

- Residências
- Famílias
- Estudantes
- Pequenos escritórios
- Profissionais autônomos
- Entusiastas que desejam controlar seus próprios dados

Não é um projeto voltado para ambientes corporativos ou alta disponibilidade.

---

# Filosofia

A tecnologia deve servir ao usuário.

Docker, Linux, containers e automação são ferramentas utilizadas para atingir esse objetivo, nunca o objetivo principal do projeto.

Sempre que existir mais de uma solução possível, será adotada aquela que oferecer:

- maior simplicidade;
- maior estabilidade;
- menor necessidade de manutenção;
- melhor experiência para o usuário.

---

# Princípios

## Simplicidade

Toda funcionalidade deve ser fácil de entender.

O usuário nunca deve precisar conhecer Docker, Linux ou redes para utilizar o servidor.

---

## Praticidade

Os serviços devem estar acessíveis em poucos cliques.

A Homepage será o ponto central de acesso ao ambiente.

---

## Organização

Toda a infraestrutura seguirá um padrão único.

Cada serviço possuirá:

- compose.yaml
- .env
- .env.example
- README.md
- diretórios de configuração
- diretórios de persistência

---

## Modularidade

Cada serviço deve ser independente.

Ele poderá ser:

- instalado;
- atualizado;
- removido;
- restaurado;

sem impactar os demais serviços.

---

## Confiabilidade

O servidor deve permanecer funcional após:

- reinicializações;
- atualizações;
- backups;
- restaurações.

---

## Escalabilidade

Novos serviços poderão ser adicionados sem alterar a organização do projeto.

A arquitetura deverá permanecer consistente independentemente da quantidade de serviços instalados.

---

# Experiência do usuário

O HomeServer deve esconder a complexidade técnica.

O usuário deve enxergar apenas funcionalidades como:

- Arquivos
- Filmes
- Fotos
- Documentos
- Backups
- Projetos

A infraestrutura permanecerá restrita ao administrador.

---

# Arquitetura

O projeto é dividido em três camadas.

## Infraestrutura

Responsável pelo funcionamento do servidor.

Exemplos:

- Docker
- Redes
- Volumes
- Backup
- Segurança

---

## Serviços

Aplicações executadas sobre a infraestrutura.

Exemplos:

- Homepage
- FileBrowser
- Gitea
- Jellyfin
- Samba

---

## Dados

Arquivos permanentes produzidos pelos serviços.

Todo dado persistente será armazenado separadamente dos containers.

---

# Processo de desenvolvimento

Todo novo serviço seguirá o mesmo fluxo.

1. Estudo da documentação oficial
2. Planejamento
3. Documentação
4. Configuração
5. Implantação
6. Testes
7. Homologação
8. Integração com a Homepage

Nenhum serviço será considerado concluído antes de passar por todas essas etapas.

---

# Critério para novas funcionalidades

Antes de adicionar qualquer recurso ao projeto, será feita uma pergunta simples:

> Esta funcionalidade torna o HomeServer mais útil para seus usuários?

Se a resposta for não, sua inclusão deverá ser reavaliada.

---

# Objetivo final

Criar um servidor doméstico simples, organizado, confiável e duradouro, capaz de crescer ao longo dos anos sem perder sua facilidade de uso nem sua facilidade de manutenção.