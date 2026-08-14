# FileBrowser — Fim de Vida e Plano de Transição

## Status

**Classificação:** 🔴 Dependência sem suporte futuro

O FileBrowser entrou em processo de encerramento. O projeto informa que o repositório será arquivado em **2026-09-01**, não haverá novas releases nem correções de segurança, e nenhuma versão 2.x recebe suporte de segurança.

Este documento registra o risco para o HomeServer e define a resposta arquitetural. Ele não substitui uma futura decisão sobre qual serviço será utilizado como sucessor.

## Fontes externas

- Site oficial: File Browser — aviso de arquivamento em 2026-09-01.
- Política oficial de segurança — nenhuma versão recebe correções; última release planejada já foi publicada.
- README oficial — classes conhecidas de problemas que permanecerão sem correção.

As fontes devem ser revisadas antes de qualquer mudança na avaliação do risco.

## Impacto conhecido no HomeServer

A dependência está atualmente presente em:

- `modules/filebrowser/compose.yaml` — implantação do serviço;
- `modules/filebrowser/.env.example` — configuração da porta e ambiente;
- `modules/filebrowser/README.md` — documentação do serviço;
- `core/adapters/filebrowser.sh` — integração de autenticação e usuários;
- `core/infrastructure/users.sh` — operações relacionadas a usuários e storage;
- integrações de API e App que utilizam capacidades de arquivos ou usuários relacionadas ao serviço.

O mapeamento completo deve ser mantido atualizado durante a auditoria de impacto.

## Riscos conhecidos

### 1. Ausência de correções futuras

Uma vulnerabilidade descoberta após o encerramento não receberá correção oficial.

### 2. Execução de comandos, runners e hooks

O projeto mantém classes conhecidas de problemas relacionadas à execução de comandos, runners e hooks. Esses recursos devem permanecer desabilitados.

### 3. Sessões e JWT

O projeto informa limitações conhecidas no modelo de sessão/JWT: tokens emitidos podem continuar válidos até a expiração mesmo após eventos como logout ou alteração de senha, conforme o comportamento documentado pelo próprio projeto.

### 4. Dependência operacional

O HomeServer atualmente depende do FileBrowser para uma parte da experiência de gerenciamento de arquivos e para integrações de usuários.

## Política temporária

Enquanto o FileBrowser continuar instalado:

- não adicionar novas dependências diretas ao FileBrowser fora de seu adapter;
- não permitir que a Infrastructure execute comandos específicos do FileBrowser;
- não expor nomes de containers, paths internos ou detalhes exclusivos do FileBrowser como contrato público;
- manter recursos de execução de comandos desabilitados;
- não utilizar hooks de execução sem uma decisão de segurança explícita;
- limitar volumes ao mínimo necessário;
- não conceder acesso irrestrito ao filesystem do host;
- executar com privilégios mínimos compatíveis com a implantação;
- preferir exposição através da fronteira de rede definida pelo HomeServer;
- registrar a versão exata utilizada e revisar qualquer atualização antes da implantação.

O uso de `latest` é proibido para novas alterações relacionadas ao FileBrowser. A versão em uso deve ser pinada após validação.

## Direção arquitetural

O FileBrowser deve ser tratado como uma implementação de integração, não como a definição da capacidade de arquivos do HomeServer.

Direção desejada:

```text
Capacidade de arquivos / storage
            ↓
      Contrato apropriado
            ↓
     Adapter de integração
            ↓
        FileBrowser
```

A troca futura deve seguir:

```text
Capacidade / contrato
            ↓
       Novo adapter
            ↓
      Novo serviço
```

O objetivo é permitir a substituição do serviço sem reescrever a lógica de negócio do HomeServer.

## Plano de transição

### Fase 1 — Auditoria

- [ ] Mapear todos os consumidores diretos e indiretos.
- [ ] Mapear dados persistentes, configuração e volumes.
- [ ] Mapear dependências de autenticação e usuários.
- [ ] Mapear integrações da API e do App.
- [ ] Registrar versão exata atualmente implantada.

### Fase 2 — Hardening

- [ ] Confirmar execução com recursos de command runner desabilitados.
- [ ] Confirmar ausência de hooks de execução.
- [ ] Confirmar volumes mínimos.
- [ ] Confirmar exposição de rede necessária.
- [ ] Confirmar privilégios mínimos.
- [ ] Remover `latest` e pin ar uma versão validada.

### Fase 3 — Desacoplamento

- [ ] Eliminar comandos diretos específicos do FileBrowser fora do adapter.
- [ ] Consolidar a integração do serviço atrás de uma fronteira única.
- [ ] Evitar contratos públicos com detalhes exclusivos do FileBrowser.
- [ ] Definir quais capacidades pertencem ao HomeServer e quais pertencem apenas à implementação atual.

### Fase 4 — Avaliação de sucessores

- [ ] Definir requisitos do sucessor.
- [ ] Pesquisar projetos candidatos.
- [ ] Avaliar manutenção, segurança, compatibilidade e migração.
- [ ] Testar candidatos isoladamente.
- [ ] Registrar a decisão em ADR.

### Fase 5 — Migração

- [ ] Implementar o novo adapter.
- [ ] Migrar dados e configuração necessários.
- [ ] Executar testes de regressão.
- [ ] Validar fluxos de usuário.
- [ ] Remover a dependência antiga após validação.

## Critério de saída

O risco não será considerado resolvido apenas porque o FileBrowser foi atualizado ou substituído por outro software.

A transição estará concluída quando:

1. a capacidade de arquivos possuir uma fronteira documentada;
2. o Core não depender diretamente de detalhes do FileBrowser;
3. consumidores utilizarem contratos da plataforma;
4. o substituto estiver validado nos fluxos necessários;
5. os dados e configurações necessários tiverem sido migrados;
6. o FileBrowser puder ser removido sem reescrever consumidores da capacidade.
