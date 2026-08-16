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

| Versão | Estado | Observação |
|---|---|---|
| v2.0 | 🟢 | QUICKSTART → INSTALLATION → FIRST_BOOT |

### Critérios

- [x] `docs/install/QUICKSTART.md` permite instalar em ~10 min sem saber programar.
- [x] `docs/install/INSTALLATION.md` detalha pré-requisitos, flags e o que o instalador faz.
- [x] `docs/install/FIRST_BOOT.md` explica o que esperar, validação e primeiras configurações.
- [x] README aponta para o QUICKSTART.

---

## 2. Experiência do usuário

### Pergunta
> Um usuário precisa saber programar?

### Estado

| Versão | Estado | Observação |
|---|---|---|
| v2.0 | 🟢 | instalador assistente: poucas perguntas, tudo detectado/gerado |

### Critérios

- [x] Nenhuma configuração manual necessária após responder poucas perguntas.
- [x] Rede detectada automaticamente (sem hardcode).
- [x] Usuário principal perguntado (default `usuario`, editável).
- [x] `api/.env` gerado pelo instalador (nunca manual).

---

## 3. Instalação automática

### Pergunta
> O `install.sh` realmente instala o HomeServer completo?

### Estado

| Versão | Estado | Observação |
|---|---|---|
| v2.0 | 🟡 | deploy dos módulos validado (4/4); build da API do zero pendente em hardware real |

### O que deve instalar

- [x] Docker (instala se ausente)
- [x] Módulos oficiais (filebrowser, gitea, homepage, caddy) — validado
- [x] API (`/app` + REST) — implantada pelo instalador; build validado em produção
- [x] Core bootstrap (CLI `hs`)
- [x] `.env` da API (senha + token gerados)
- [x] Estrutura `/srv`
- [x] Firewall (rede detectada)
- [x] Backup e agenda de energia (horários coerentes: 22h/07h)

### O que NÃO deve ser necessário

- [x] Nenhum passo manual após `sudo bash install.sh`
- [x] Nenhum ajuste no código-fonte

---

## 4. Primeiro Boot

### Pergunta
> Após a instalação tudo está funcionando?

### Estado

| Versão | Estado | Observação |
|---|---|---|
| v2.0 | 🟡 | health check automático + módulos validados; pendente validação ponta-a-ponta com API |

### Critérios

- [x] Health Check automático ao final da instalação (validado 7/7 em produção).
- [x] Todos os módulos oficiais ativos (validado em Docker limpo).
- [x] Mensagem final de sucesso com URL de acesso e credenciais.

---

## 5. Reprodutibilidade

### Pergunta
> Outra pessoa consegue reproduzir exatamente a instalação?

### Estado

| Versão | Estado | Observação |
|---|---|---|
| v2.0 | 🟢 | instalador idempotente (redeploy limpo); flags para CI |

### Critérios

- [x] Mesmos horários na doc, no instalador e no `scheduler.conf` (22h/07h).
- [x] `--non-interactive` e `--assume-yes` para automação/CI.
- [x] Sem conhecimento implícito (tudo documentado).
- [x] Health Check determinístico.

---

## Resultado do teste de deploy real (2026-08-05)

> Ambiente: container Debian 12 + Docker (Docker-in-Docker), install.sh `--non-interactive`.

| Item | Resultado |
|---|---|
| Instalação do Docker | ✅ já presente no teste (fluxo de instalação via script oficial) |
| Rede detectada | ✅ `172.17.0.0/16` (auto-detectada, sem hardcode) |
| `api/.env` gerado | ✅ (senha + token gerados) |
| filebrowser | ✅ implantado (após correção de permissões UID 1000) |
| gitea | ✅ implantado e ativo |
| homepage | ✅ implantado e **healthy** |
| caddy | ✅ implantado (após correção do `cp -r` do módulo) |
| API build | ⚠️ não validado no DinD (DNS IPv4 de npm/alpine bloqueado no sandbox) |
| Re-instalação | ✅ idempotente (após correção do `rm -rf dst`) |

### Bugs corrigidos pelo teste

1. `_deploy_module` não copiava arquivos auxiliares do módulo (ex.: `Caddyfile`) → `cp -r src/. dst/`.
2. Deploy sobre estado anterior quebrava (dst sujo) → `rm -rf dst` antes de copiar.
3. Diretórios de dados dos serviços ficavam como root (container roda UID 1000) → `_prepare_service_dirs` com `chown` para o usuário principal.

### Pendente para v2.0 (🔴 → 🟢 definitivo)

- [ ] Validar o **build da API do zero** (`docker compose -f api/compose.yaml up -d --build`) em um Debian real/hardware de teste com internet normal.
- [ ] Confirmar a pergunta-mestra respondida com "sim" seguindo apenas o QUICKSTART.

---

## Histórico

| Versão | Resultado | Data | Notas |
|---|---|---|---|
| v1.5 | 🔴 | 2026-08-05 | instalador não implantava API/Docker/.env; horário inconsistente; sem quick start |
| v2.0 | 🟡→🟢 | 2026-08-05 | instalador assistente + QUICKSTART + health check; deploy REAL validado em Docker limpo (módulos 4/4); 3 bugs corrigidos; build da API pendente em hardware real |
