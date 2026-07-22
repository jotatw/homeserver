# Core Loader (lib.sh)

Biblioteca responsável por inicializar o HomeServer Core.

O arquivo `lib.sh` é o ponto único de entrada para todas as bibliotecas do Core.

Todo script do HomeServer deve carregar apenas este arquivo.

---

# Objetivo

Inicializar o ambiente do Core carregando automaticamente todas as bibliotecas necessárias.

O objetivo é simplificar o desenvolvimento, garantindo que todos os scripts utilizem a mesma estrutura e inicialização.

---

# Responsabilidades

- Inicializar o Core
- Carregar bibliotecas
- Garantir a ordem correta de carregamento
- Evitar carregamentos duplicados
- Disponibilizar uma interface única para os scripts

---

# Não faz

Esta biblioteca NÃO é responsável por:

- Executar comandos Docker
- Manipular arquivos
- Gerenciar serviços
- Executar backups
- Validar regras de negócio

Ela apenas inicializa o ambiente.

---

# Dependências

Nenhuma.

Este é o primeiro arquivo carregado pelos scripts.

---

# Fluxo de Inicialização

```
Script

↓

lib.sh

↓

constants.sh

↓

config.sh

↓

output.sh

↓

validation.sh

↓

Infrastructure

↓

Services
```

---

# Ordem de carregamento

A ordem de carregamento é obrigatória.

1. constants.sh
2. config.sh
3. output.sh
4. validation.sh
5. filesystem.sh
6. docker.sh
7. network.sh
8. system.sh
9. backup.sh
10. service.sh

---

# Interface Pública

O único requisito para utilizar o Core é:

```bash
source common/lib.sh
```

Após isso todas as funções estarão disponíveis.

---

# Convenções

Todo script do HomeServer deve carregar apenas o lib.sh.

Nunca carregar bibliotecas individualmente.

Correto:

```bash
source common/lib.sh
```

Evitar:

```bash
source output.sh
source docker.sh
source filesystem.sh
```

---

# Futuras melhorias

- Carregamento sob demanda (Lazy Loading)
- Verificação automática de dependências
- Controle de versão do Core
- Plugins
- Inicialização modular

---

# Utilizado por

Todos os scripts do HomeServer.

---

# Status

🟡 Especificado