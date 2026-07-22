# HomeServer Scripts

Biblioteca de scripts utilizada para instalar, administrar e manter o HomeServer.

O objetivo é fornecer uma interface simples para tarefas comuns, reduzindo a necessidade de executar comandos Docker ou Linux manualmente.

---

# Estrutura

```
scripts/
├── common/
├── install/
├── maintenance/
├── backup/
└── update/
```

---

# Organização

Cada diretório possui uma responsabilidade específica.

## common/

Bibliotecas compartilhadas entre todos os scripts.

Exemplos:

- output.sh
- validation.sh
- config.sh
- filesystem.sh
- docker.sh
- service.sh
- backup.sh
- system.sh
- network.sh
- lib.sh

---

## install/

Scripts responsáveis pela instalação e implantação de serviços.

Exemplos:

- deploy.sh
- install.sh

---

## maintenance/

Scripts de manutenção.

Exemplos:

- restart.sh
- logs.sh
- status.sh
- doctor.sh

---

## backup/

Scripts relacionados a backup e restauração.

Exemplos:

- backup.sh
- restore.sh

---

## update/

Atualização do sistema e dos serviços.

Exemplos:

- update.sh
- upgrade.sh

---

# Filosofia

Todos os scripts seguem os mesmos princípios.

- Uma única responsabilidade.
- Comentários apenas onde agregam valor.
- Funções reutilizáveis.
- Código modular.
- Saída padronizada.
- Tratamento de erros.
- Documentação antes da implementação.

---

# Fluxo de desenvolvimento

Toda nova biblioteca segue o mesmo processo.

1. Definir a responsabilidade.
2. Definir o que não faz.
3. Especificar a API pública.
4. Implementar.
5. Testar.
6. Documentar.

---

# Estrutura das bibliotecas

Cada biblioteca possui sua própria documentação.

```
docs/scripts/common/

output.md
validation.md
config.md
filesystem.md
docker.md
service.md
backup.md
system.md
network.md
```

---

# Convenções

## Organização

Cada biblioteca possui apenas uma responsabilidade.

## Comentários

Comentários devem explicar a intenção do código, e não repetir o que ele faz.

## Nomenclatura

As funções utilizam nomes descritivos.

Exemplo:

```
create_directory()
copy_file()
compose_up()
service_restart()
```

---

# Objetivo

Automatizar a administração do HomeServer de forma simples, organizada e reutilizável.

---

# Roadmap

## Biblioteca Base

- [x] output.sh
- [x] validation.sh
- [x] config.sh
- [ ] filesystem.sh
- [ ] docker.sh
- [ ] service.sh
- [ ] backup.sh
- [ ] system.sh
- [ ] network.sh
- [ ] lib.sh

## Scripts

- [ ] deploy.sh
- [ ] install.sh
- [ ] restart.sh
- [ ] stop.sh
- [ ] status.sh
- [ ] logs.sh
- [ ] update.sh
- [ ] backup.sh
- [ ] restore.sh