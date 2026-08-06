# Auditoria de Instalação

> Check-list reutilizável de prontidão de instalação — aplicado a cada versão.
> Pergunta central:

> **Se eu formatar o servidor hoje e seguir apenas a documentação oficial do
> repositório, conseguirei chegar a um HomeServer totalmente funcional sem
> consultar o código-fonte ou fazer ajustes manuais?**

> Se a resposta for **"sim"**, o HomeServer está pronto para a versão em questão.
> Este é o critério de lançamento (ex.: v2.0).

---

## 1. Documentação

### Pergunta
> A documentação conduz o usuário do início ao fim?

### Estado

<!-- status: 🟢 Sim / 🟡 Parcial / 🔴 Não -->

| Versão | Estado | Observação |
|---|---|---|
| v2.0 | 🟢 | QUICKSTART → INSTALLATION → FIRST_BOOT |

### Critérios

- [ ] `QUICKSTART.md` permite instalar em ~10 min sem saber programar.
- [ ] `docs/INSTALLATION.md` detalha pré-requisitos, flags e o que o instalador faz.
- [ ] `docs/FIRST_BOOT.md` explica o que esperar, validação e primeiras configurações.
- [ ] README aponta para o QUICKSTART.

---

## 2. Experiência do usuário

### Pergunta
> Um usuário precisa saber programar?

### Estado

<!-- status -->

### Critérios

- [ ] Nenhuma configuração manual necessária após responder poucas perguntas.
- [ ] Rede detectada automaticamente (sem hardcode).
- [ ] Usuário principal perguntado (sem assumir `usuario`).
- [ ] `api/.env` gerado pelo instalador (nunca manual).

---

## 3. Instalação automática

### Pergunta
> O `install.sh` realmente instala o HomeServer completo?

### Estado

<!-- status -->

### O que deve instalar

- [ ] Docker (se ausente)
- [ ] Módulos oficiais (filebrowser, gitea, homepage, caddy)
- [ ] API (`/app` + REST)
- [ ] Core bootstrap (CLI `hs`)
- [ ] `.env` da API
- [ ] Estrutura `/srv`
- [ ] Firewall (rede detectada)
- [ ] Backup e agenda de energia (horários coerentes)

### O que NÃO deve ser necessário

- [ ] Nenhum passo manual após `sudo bash install.sh`
- [ ] Nenhum ajuste no código-fonte

---

## 4. Primeiro Boot

### Pergunta
> Após a instalação tudo está funcionando?

### Estado

<!-- status -->

### Critérios

- [ ] Health Check automático ao final da instalação.
- [ ] Todos os módulos oficiais ativos.
- [ ] Mensagem final de sucesso com URL de acesso e credenciais.

---

## 5. Reprodutibilidade

### Pergunta
> Outra pessoa consegue reproduzir exatamente a instalação?

### Estado

<!-- status -->

### Critérios

- [ ] Mesmos horários na doc, no instalador e no `scheduler.conf`.
- [ ] `--non-interactive` e `--assume-yes` para automação/CI.
- [ ] Sem conhecimento implícito (tudo documentado).
- [ ] Health Check determinístico.

---

## Histórico

| Versão | Resultado | Data | Notas |
|---|---|---|---|
| v1.5 | 🔴 | 2026-08-05 | instalador não implantava API/Docker/.env; horário inconsistente; sem quick start |
| v2.0 | 🟡→🟢 | 2026-08-05 | instalador assistente + QUICKSTART + health check (validação pendente em ambiente limpo) |
