# Bootstrap

**Status:** 🟡 Em Consolidação

## Missão

Inicializar o Core do HomeServer de forma previsível, segura e controlada.

O Bootstrap é o ponto de entrada da plataforma. Sua função é preparar o ambiente de execução, carregar os componentes essenciais e transferir o controle para a aplicação.

---

## Responsabilidade

O Bootstrap é responsável por:

- Localizar a raiz do projeto.
- Preparar o ambiente de execução.
- Carregar os componentes essenciais do Core.
- Controlar a ordem de inicialização.
- Encerrar a execução quando ocorrer um erro crítico durante a inicialização.

---

## Não Responsabilidades

O Bootstrap nunca deve:

- Ler configurações da aplicação.
- Manipular arquivos do usuário.
- Executar operações da plataforma.
- Gerenciar serviços.
- Conhecer módulos opcionais.
- Acessar diretamente Docker ou Docker Compose.
- Implementar regras de negócio.

---

## API Pública

O Bootstrap possui apenas um ponto de entrada.

bootstrap

---

## API Interna

As funções internas existem apenas para organizar a implementação.

Exemplos:

_prepare_environment()

_load_core()

_initialize_core()

_validate_bootstrap()

Essas funções não fazem parte da API pública.

---

## Dependências

O Bootstrap depende apenas da Foundation.

Bootstrap
│
├── Lib
├── Constants
├── Config
├── Validation
└── Output

Nenhuma outra camada do sistema deve ser conhecida diretamente.

---

## Fluxo

Bootstrap

↓

Preparar ambiente

↓

Carregar Foundation

↓

Carregar Infrastructure

↓

Carregar Operations

↓

Carregar Services

↓

Validar inicialização

↓

Entregar controle

---

## Tratamento de erros

Qualquer falha durante a inicialização deve interromper imediatamente o processo.

O Bootstrap nunca deve tentar recuperar automaticamente erros críticos.

---

## Estado esperado após execução

Ao terminar sua execução, espera-se que:

- o ambiente esteja preparado;
- os componentes fundamentais estejam carregados;
- o Core esteja pronto para ser utilizado;
- o controle seja devolvido para a aplicação.

---

## Critérios de Consolidação

O componente será considerado consolidado quando:

- possuir responsabilidade única;
- possuir fluxo simples e previsível;
- possuir dependências mínimas;
- expor apenas uma API pública;
- não possuir lógica de negócio;
- estar alinhado com a arquitetura do Core.

---

## Evolução Futura

Itens previstos, mas não implementados nesta fase:

- Revisar o componente após a consolidação do Lib.
- Avaliar a renomeação de `lib.sh` para `loader.sh`.
- Integrar a suíte de testes durante a Sprint de Certificação.
