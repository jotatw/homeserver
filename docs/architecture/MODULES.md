# Modules

> Os módulos são a principal forma de expansão do HomeServer.

Eles permitem adicionar novas funcionalidades sem aumentar a complexidade do Core, mantendo a plataforma leve, organizada e preparada para crescer conforme as necessidades do usuário.

---

# Objetivo

O sistema de módulos existe para desacoplar funcionalidades da infraestrutura principal.

Enquanto o Core fornece os recursos fundamentais da plataforma, os módulos adicionam capacidades específicas de forma independente.

---

# Filosofia

O HomeServer adota uma arquitetura baseada em um núcleo mínimo e módulos opcionais.

Esse modelo permite que cada instalação contenha apenas os recursos necessários.

O Core permanece pequeno.

Os módulos evoluem independentemente.

---

# Responsabilidades

Os módulos são responsáveis por implementar funcionalidades voltadas ao usuário.

Exemplos:

- armazenamento;
- mídia;
- desenvolvimento;
- rede;
- backup;
- monitoramento;
- automação.

Nenhuma dessas funcionalidades deve fazer parte do Core.

---

# Arquitetura

```text
                 HomeServer

                      │

                      ▼

                   Core

                      │

               Module Manager

                      │

        ┌─────────────┼─────────────┐

        ▼             ▼             ▼

   Official      Community    Experimental
```

---

# Ciclo de Vida

Todo módulo possui um ciclo de vida comum.

```text
Criar

↓

Instalar

↓

Configurar

↓

Executar

↓

Atualizar

↓

Remover
```

Esse ciclo será implementado de forma padronizada pela plataforma.

---

# Categorias

Os módulos oficiais poderão ser organizados por categoria.

```text
Storage

Media

Development

Network

Security

Automation

Backup

Monitoring
```

As categorias existem apenas para organização.

O comportamento dos módulos permanece o mesmo.

---

# Relação com o Core

Os módulos dependem do Core para utilizar infraestrutura comum.

O Core nunca depende dos módulos.

Essa separação garante baixo acoplamento e facilita manutenção.

---

# Evolução

Novas funcionalidades devem, sempre que possível, ser implementadas como módulos.

A inclusão de novos recursos diretamente no Core deve ser tratada como exceção.

---

# Documentação Relacionada

- ARCHITECTURE.md
- CORE.md
- SERVICES.md
- docs/developer/modules/
- docs/reference/