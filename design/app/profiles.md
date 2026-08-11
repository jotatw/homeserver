# HomeServer App — Perfis de acesso

## Objetivo

Definir uma experiência baseada em dois perfis iniciais: **Usuário comum** e **Administrador**.

A diferenciação deve ser simples e baseada nas permissões reais do sistema. Não serão criadas duas interfaces independentes.

## Usuário comum

Perfil destinado ao uso cotidiano do HomeServer.

### Objetivo

Permitir que a pessoa utilize os recursos do servidor sem precisar conhecer detalhes de administração ou infraestrutura.

### Prioridades

- acessar arquivos;
- utilizar aplicações disponibilizadas pelo servidor;
- imprimir;
- consultar informações básicas relevantes;
- executar tarefas permitidas pelo administrador.

### O que deve ficar oculto por padrão

- gerenciamento de usuários;
- tokens de API;
- configurações administrativas;
- ações de manutenção;
- informações técnicas que não ajudam na tarefa comum.

O usuário comum não deve sentir que está usando um painel técnico apenas porque o servidor por trás da interface é técnico.

## Administrador

Perfil destinado à manutenção e gerenciamento do HomeServer.

### Objetivo

Permitir administrar o servidor sem precisar acessar diretamente cada ferramenta ou terminal para tarefas comuns.

### Prioridades

- visualizar o estado do servidor;
- gerenciar usuários;
- administrar serviços e aplicações quando suportado;
- gerenciar armazenamento e dispositivos;
- configurar e utilizar impressão;
- executar ações administrativas;
- consultar informações técnicas necessárias para diagnóstico.

### Conteúdo adicional

O administrador pode visualizar áreas que não aparecem para o usuário comum, como:

- Administração;
- Sistema;
- configurações;
- diagnóstico;
- gerenciamento de usuários;
- ações de manutenção.

## Regras de apresentação

### 1. Não duplicar telas sem necessidade

Uma tela pode existir para ambos os perfis e simplesmente apresentar menos ações ao usuário comum.

### 2. Não esconder o estado por segurança visual

Informações importantes sobre indisponibilidade ou erro de um serviço devem continuar sendo comunicadas quando forem relevantes para o usuário.

### 3. Ações administrativas devem ser claramente identificadas

Operações destrutivas, de manutenção ou que afetem outros usuários devem possuir confirmação e feedback adequado.

### 4. Permissão vem do backend

A interface não será responsável por garantir segurança. Elementos ocultos ou desabilitados são uma consequência da permissão, enquanto a API deve continuar validando autorização no servidor.

### 5. O perfil deve ser reconhecível

O usuário deve conseguir entender qual perfil está ativo sem ocupar espaço excessivo na interface.

## Evolução futura

A arquitetura deve permitir novos níveis de permissão posteriormente, mas a interface inicial será mantida deliberadamente simples com apenas dois perfis.

Possíveis extensões futuras:

- permissões por recurso;
- grupos;
- permissões delegadas;
- perfis personalizados.

Essas extensões não fazem parte da primeira implementação dos perfis.
