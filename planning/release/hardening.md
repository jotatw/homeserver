# HomeServer — Release Hardening

> Checklist permanente de validação do estado atual antes de uma release.

Este documento deriva da auditoria realizada durante a preparação da linha v2.0, mas deixa de estar vinculado a uma versão específica. Seu objetivo é identificar, documentar, corrigir e validar problemas que possam comprometer instalação, atualização, inicialização, operação, segurança, dados, recuperação, experiência de usuário e manutenção.

## Regra de freeze

Durante o hardening de uma release são permitidos apenas:

- correções de bugs;
- correções de segurança;
- correções de documentação;
- correções de testes e CI;
- melhorias necessárias para confiabilidade;
- ajustes de configuração necessários para instalação segura.

Novas funcionalidades, serviços, redesigns ou mudanças arquiteturais não essenciais devem ir para o backlog.

## Estados

```text
IDENTIFICADO → DOCUMENTADO → TESTE_PENDENTE → FALHOU
→ CORRIGINDO → RETESTE → VALIDADO
```

Estados adicionais: `BLOQUEADO` quando uma dependência impede o teste.

## Severidade

### CRÍTICO
Bloqueia a release: perda de dados, credenciais expostas, bypass de autenticação, privilégio indevido, backup irrecuperável, update destrutivo ou configuração insegura por padrão.

### ALTO
Bloqueia sem mitigação documentada: serviço essencial quebrado após reboot, permissões indevidas, instalação não reproduzível ou operação administrativa sem proteção.

### MÉDIO
Corrigir antes da release sempre que possível.

### BAIXO
Pode seguir para backlog se não afetar segurança ou confiabilidade.

## Checklist

### Instalação
- [ ] clone funciona
- [ ] instalador inicia
- [ ] dependências são verificadas
- [ ] usuário e rede são detectados/configurados corretamente
- [ ] nenhuma configuração pessoal é usada
- [ ] diretórios e permissões são corretos
- [ ] Docker é configurado quando necessário
- [ ] serviços iniciam
- [ ] Health Check passa
- [ ] acesso local funciona

### Dry Run
- [ ] não altera `/etc`
- [ ] não altera Samba
- [ ] não altera UFW
- [ ] não cria `.env`
- [ ] não gera credenciais
- [ ] não inicia containers
- [ ] não cria timers
- [ ] não pede credenciais
- [ ] informa as ações previstas

### Non-interactive
- [ ] não pede entrada interativa
- [ ] não possui senhas padrão
- [ ] não possui usuário pessoal padrão
- [ ] não possui rede pessoal padrão
- [ ] valores obrigatórios ausentes falham claramente
- [ ] execução é determinística

### Idempotência
- [ ] segunda instalação não duplica configuração
- [ ] não duplica shares
- [ ] não recria credenciais desnecessariamente
- [ ] não destrói dados
- [ ] não duplica containers
- [ ] não duplica timers
- [ ] estado final permanece válido

### Upgrade
- [ ] dados preservados
- [ ] usuários preservados
- [ ] configurações preservadas
- [ ] volumes preservados
- [ ] containers atualizados
- [ ] serviços essenciais funcionais
- [ ] update já aplicado tratado corretamente
- [ ] falhas de rede/imagem/configuração tratadas corretamente

### Reboot
- [ ] Docker sobe
- [ ] containers sobem
- [ ] API responde
- [ ] Homepage responde
- [ ] Caddy responde
- [ ] serviços essenciais respondem
- [ ] timers permanecem ativos
- [ ] mounts permanecem corretos
- [ ] nenhum restart loop

### Authentication / Authorization
- [ ] login válido
- [ ] senha inválida
- [ ] usuário inexistente
- [ ] body inválido
- [ ] token inexistente/malformado
- [ ] token expirado
- [ ] logout invalida sessão
- [ ] sessão pós-reboot possui comportamento documentado
- [ ] usuário comum não acessa administração
- [ ] API retorna 401 sem autenticação
- [ ] API retorna 403 sem permissão

### Storage
- [ ] estrutura `/srv` correta
- [ ] ownership correto
- [ ] isolamento entre usuários
- [ ] `shared` possui comportamento esperado
- [ ] backup separado
- [ ] FileBrowser respeita scopes
- [ ] containers possuem somente acesso necessário
- [ ] volumes RW são justificados
- [ ] arquivos sensíveis não ficam expostos

### Docker
Para cada container registrar nome, imagem, usuário, volumes, portas, capabilities, privileged, restart policy, rede e secrets.

- [ ] nenhum `privileged` desnecessário
- [ ] volumes RW somente quando necessários
- [ ] portas desnecessárias não são publicadas
- [ ] secrets não ficam na imagem
- [ ] `.env` não entra no Git
- [ ] restart policy adequada
- [ ] containers não executam como root sem necessidade
- [ ] acesso ao host é mínimo

### API
- [ ] validação de entrada
- [ ] status HTTP correto
- [ ] resposta `ok/data` ou `ok/error`
- [ ] exceções não expõem stack trace
- [ ] logs não expõem credenciais
- [ ] CORS correto
- [ ] autenticação correta
- [ ] autorização correta
- [ ] timeout apropriado
- [ ] operações administrativas protegidas

### Backup / Recovery
- [ ] backup criado
- [ ] conteúdo esperado presente
- [ ] secrets desnecessários excluídos
- [ ] permissões adequadas
- [ ] restauração funciona
- [ ] procedimento documentado
- [ ] falhas de API/container/Docker/reboot são recuperáveis

### Zero Knowledge
- [ ] pessoa que não participou da implementação consegue instalar, acessar e utilizar o sistema apenas com a documentação pública

## Evidência obrigatória

Todo teste deve registrar:

```text
Data:
Versão:
Ambiente:
Comando:
Resultado:
Logs:
Evidência:
Problema:
Issue:
Correção:
Reteste:
```

Nunca marcar PASS apenas por observação informal.

## Critério de aprovação

A release não pode ser aprovada com item CRÍTICO aberto, vulnerabilidade de autenticação/autorização, instalação quebrada, perda de dados, upgrade quebrado, reboot quebrado, backup não restaurável, Zero Knowledge Test falhando ou Quality Gate vermelho.

Itens ALTO somente podem permanecer com mitigação documentada, justificativa e decisão explícita.

---

## Anexo — Log de hardening

> Registro das correções aplicadas no código-base. Estado por item segundo o
> fluxo IDENTIFICADO → … → VALIDADO.

### 2026-08-14 — Agendamento de energia: eliminar timers duplicados

**Fenômeno:** o servidor não religava sozinho pelo RTC após o night-off —
ficava indisponível até o acionamento manual do botão de força.

**Causa raiz (ALTO):** o timer legado `homeserver-night-off.timer` coexistia
com o `hs-task-night-off.timer` do scheduler (ambos às 22:00). Duas invocações
de `power-schedule.sh` rodavam em corrida: um processo restaurava os wakes
(NIC/USB) **enquanto** o outro suspendia → despertar imediato (~5s), alarme RTC
consumido e ciclo 22h/07h perdido. O mesmo risco existia para o backup
(`homeserver-backup.timer` + `hs-task-backup.timer`, ambos 03:00).

**Correção (VALIDADO 2026-08-14):**

- `systemctl disable --now homeserver-night-off.timer homeserver-backup.timer`
  — permanecem ativos apenas `hs-task-night-off.timer` e `hs-task-backup.timer`;
- `/srv/scripts/power-schedule.sh` sincronizado com o repositório;
- teste controlado S3: `rtcwake -m mem` +90s → religou em ~91s (`exit 0`),
  wakes restaurados e wakealarm consumido.

**Regressão:** `install.sh` configura backup/energia via `hs scheduler
init` + `hs scheduler enable` — sem timers legados.
