# Deploy Operation

**Módulo:** Operations

---

# Objetivo

Automatizar o processo completo de implantação de um serviço do HomeServer.

O deploy deve abstrair toda a complexidade envolvida na preparação, validação e inicialização de um serviço.

---

# Responsabilidades

- Validar parâmetros
- Validar ambiente
- Solicitar o deploy ao Service Layer
- Exibir progresso
- Exibir resultado

---

# Não faz

Esta operação NÃO é responsável por:

- Executar Docker Compose
- Copiar arquivos
- Criar backups
- Validar portas
- Manipular diretórios

Essas responsabilidades pertencem às camadas inferiores.

---

# Dependências

- lib.sh
- service.sh

---

# Fluxo

```
Usuário

↓

deploy.sh homepage

↓

Validação

↓

service_deploy()

↓

Resultado
```

---

# Fluxo Interno

```
deploy.sh

↓

Validação

↓

service_exists()

↓

service_validate()

↓

service_deploy()

↓

service_health()

↓

Resultado
```

---

# Entrada

```
deploy.sh <serviço>
```

Exemplos

```
deploy.sh homepage

deploy.sh filebrowser

deploy.sh gitea
```

---

# Saída

Sucesso

```
Deploy concluído.

Serviço: Homepage

Status: Online
```

Erro

```
Serviço não encontrado.

Deploy cancelado.
```

---

# Casos de Uso

## Novo serviço

Primeira implantação.

---

## Atualização

Recriar containers após alterações.

---

## Recuperação

Reimplantar um serviço após falha.

---

# Convenções

A operação deve:

- Ser idempotente sempre que possível.
- Não conhecer Docker.
- Não conhecer arquivos.
- Não conhecer rede.
- Delegar toda a lógica ao Service Layer.

---

# Futuras Melhorias

- Deploy em lote
- Deploy paralelo
- Rollback automático
- Modo simulação (dry-run)
- Barra de progresso
- Deploy silencioso (--quiet)

---

# Status

🟡 Especificado