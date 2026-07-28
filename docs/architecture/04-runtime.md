# HomeServer Architecture

# 04 - Defaults

Status: Draft

Version: 1.0

---

# Objetivo

Os Defaults representam a configuração padrão do HomeServer.

Eles definem o comportamento esperado do sistema quando nenhuma personalização
foi realizada.

Todos os valores presentes em Defaults podem ser sobrescritos por Profiles ou
pela configuração Local.

---

# Responsabilidades

Os Defaults são responsáveis por:

- definir valores padrão;
- padronizar o comportamento do sistema;
- evitar duplicação de configuração;
- servir como base para novas instalações.

---

# Não Responsabilidades

Os Defaults nunca devem:

- identificar uma instalação;
- selecionar perfis;
- habilitar funcionalidades;
- registrar serviços;
- armazenar configurações específicas do usuário.

---

# Organização

Os Defaults são organizados por domínio.

config/defaults/

├── homeserver.conf
├── environment.conf
├── network.conf
├── storage.conf
├── api.conf
├── homepage.conf
├── docker.conf
├── security.conf
├── update.conf

Cada arquivo possui apenas uma responsabilidade.

---

# Precedência

Os Defaults possuem a menor prioridade do sistema.

A ordem de resolução é:

Defaults

↓

Profile

↓

Local

↓

Runtime

---

# Regras

Todo valor padrão deve existir apenas uma vez.

Nenhum componente deve depender diretamente de Defaults.

Toda leitura deve ocorrer através do Runtime.

---

# Evolução

Novos arquivos podem ser adicionados.

Arquivos existentes não devem mudar de responsabilidade.

Sempre preferir criar um novo domínio a misturar responsabilidades.