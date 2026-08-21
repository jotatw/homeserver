# Personalizando o HomeServer

O HomeServer foi projetado para ser uma base que cada pessoa pode adaptar ao próprio servidor, hardware e forma de uso.

Este guia não exige que você se torne um colaborador do projeto. O objetivo principal é mostrar como **modificar, experimentar e personalizar sua própria instalação** de forma organizada.

## O que pode ser personalizado

Dependendo da necessidade, você pode adaptar:

- serviços e módulos instalados;
- configurações do ambiente;
- armazenamento e dispositivos;
- automações e agendamentos;
- Homepage e HomeServer App;
- integrações com serviços externos;
- aparência e fluxos de uso;
- scripts e extensões próprias.

Antes de modificar um componente, procure entender sua responsabilidade e seus limites na arquitetura. A documentação em [`docs/`](docs/README.md) e os documentos de planejamento explicam como as partes do sistema se relacionam.

## Comece sem alterar o projeto principal

Sempre que possível, prefira personalizações que fiquem separadas do núcleo:

```text
HomeServer oficial
      │
      ├── configuração
      ├── módulos opcionais
      ├── automações próprias
      └── extensões/personalizações
```

Isso reduz conflitos durante atualizações e facilita manter suas próprias alterações.

Evite editar diretamente arquivos gerados, dados persistentes ou componentes centrais quando uma configuração, módulo, adapter ou extensão puder resolver o problema.

## Faça mudanças pequenas e verificáveis

Para uma alteração maior:

1. entenda o comportamento atual;
2. registre o objetivo da personalização;
3. altere uma parte por vez;
4. teste o comportamento relacionado;
5. documente a alteração local;
6. mantenha uma forma simples de voltar ao estado anterior.

Quando possível, use branches do Git para experimentar sem misturar mudanças em andamento com uma versão estável da sua instalação.

## Ferramentas úteis

O HomeServer incentiva o uso de ferramentas que ajudem você a entender e modificar o projeto. A ferramenta depende do tipo de alteração.

### Git e GitHub

Use para:

- manter sua própria cópia das alterações;
- criar branches para experiências;
- comparar mudanças;
- voltar a uma versão anterior;
- manter um fork caso queira desenvolver uma variante própria.

### Editor e ambiente de desenvolvimento

Um editor com suporte ao projeto pode ajudar a:

- navegar pela estrutura;
- pesquisar referências;
- editar arquivos;
- executar comandos e testes;
- revisar alterações antes de aplicá-las.

Ferramentas como VS Code, editores compatíveis com terminal e ambientes de desenvolvimento assistidos podem ser usadas conforme sua preferência.

### Ferramentas de assistência ao desenvolvimento

Ferramentas de IA e análise de código podem ser usadas para:

- explicar componentes desconhecidos;
- localizar onde uma funcionalidade é implementada;
- planejar alterações antes de executá-las;
- revisar uma mudança;
- sugerir testes e documentação;
- ajudar a criar extensões próprias.

Essas ferramentas não substituem testes e revisão. Antes de aplicar uma alteração, confirme quais arquivos serão modificados e valide o resultado no seu ambiente.

### Testes e CI

Antes de considerar uma personalização concluída, execute os testes aplicáveis. O GitHub Actions também executa verificações automatizadas para mudanças enviadas ao repositório.

Os procedimentos atuais estão em [`docs/contribute/TESTING.md`](docs/contribute/TESTING.md).

## Mantendo suas personalizações

Se sua instalação divergir do projeto principal, mantenha claro:

- o que foi modificado;
- por que foi modificado;
- quais arquivos ou módulos foram afetados;
- como testar a alteração;
- como desfazer ou recuperar a versão anterior.

Uma personalização pequena pode começar apenas com um arquivo de notas. Para mudanças maiores, considere manter documentação própria e commits pequenos e descritivos.

## Quer contribuir com o projeto principal?

Personalizar sua própria instalação não obriga você a enviar alterações de volta ao HomeServer.

Se uma melhoria for genérica e puder beneficiar outras instalações, você pode propor a mudança ao projeto. Nesse caso, consulte:

- [`docs/contribute/CONTRIBUTING.md`](docs/contribute/CONTRIBUTING.md) — fluxo para alterações no projeto principal;
- [`docs/contribute/DEVELOPMENT.md`](docs/contribute/DEVELOPMENT.md) — arquitetura, padrões e convenções;
- [`docs/contribute/TESTING.md`](docs/contribute/TESTING.md) — testes e Quality Gate.
