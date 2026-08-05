# Design Principles

O HomeServer utiliza um design funcional.

Cada elemento deve ter uma finalidade clara.

A interface privilegia:

- **Simplicidade** — menos elementos, mais clareza.
- **Legibilidade** — texto legível, contraste adequado.
- **Consistência** — mesmos padrões em toda a interface.
- **Baixo ruído visual** — nada decorativo sem função.
- **Navegação previsível** — o usuário sabe onde está e o que pode fazer.

O usuário deve reconhecer rapidamente onde está e o que pode fazer.

## Papel das superfícies

- A **Homepage** acolhe, orienta e direciona (portal de entrada).
- O **HomeServer App** administra e concentra a experiência diária.
- Nenhuma superfície expõe infraestrutura técnica desnecessária.

## Regra de ouro

> Um novo componente só entra se responde a uma destas perguntas:
> ajudar a executar uma ação, informar um estado importante, ou
> facilitar o acesso a algo frequente. Caso contrário, fica no App.
