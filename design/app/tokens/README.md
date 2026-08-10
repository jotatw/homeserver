# Design Tokens — HomeServer App (v2.0)

> A API visual do HomeServer App. Os tokens definem aparência, espaço e estrutura sem acoplar o design a uma plataforma específica.

Toda a UI deve consumir tokens `--hs-*`; valores de cor, espaçamento, tipografia e elevação não devem ser espalhados diretamente pelos componentes sem justificativa documentada.

## Princípios

1. **Poucos tokens, usados de forma consistente.**
2. **Mobile e desktop compartilham a linguagem visual**, mas podem usar layouts diferentes.
3. **Mobile usa drawer; desktop usa sidebar colapsável.** Não existe bottom navigation obrigatória nesta versão.
4. **Identidade vem da combinação dos tokens**, não de efeitos decorativos.
5. **Estados são semânticos** e nunca dependem apenas de cor.
6. **Leveza é requisito:** evitar animações, sombras e efeitos que não acrescentem informação.
7. **Acessibilidade faz parte do token:** contraste, foco e áreas de toque devem ser previsíveis.

## Como consumir

Tokens são definidos como CSS custom properties (`--hs-*`). O App mantém os temas `dark` e `light`, com dark como padrão atual.

```css
:root, [data-theme="dark"] {
  --hs-bg: #0f172a;
  --hs-surface: #1e293b;
}
```

Componentes devem referenciar tokens semânticos em vez de valores hexadecimais diretamente.

## Grupos

| Grupo | Arquivo | Responsabilidade |
|---|---|---|
| Cores | `colors.md` | fundos, superfícies, texto, ações e estados |
| Tipografia | `typography.md` | família, escala, pesos e leitura |
| Espaçamento | `spacing.md` | escala, gaps e alvos de toque |
| Layout | `layout.md` | containers, grid, sidebar, drawer e breakpoints |
| Cantos | `radius.md` | hierarquia de superfícies |
| Elevação | `elevation.md` | sombras e foco |
| Movimento | `motion.md` | duração, easing e redução de movimento |

## Estado atual

Os tokens existentes são uma **base de design**, não uma implementação final. Antes de alterar o CSS da aplicação, os tokens serão revisados em conjunto com os wireframes mobile e desktop.

### Já definido

- paleta dark/light;
- cor primária e estados;
- tipografia baseada no sistema;
- escala de espaçamento;
- alvo mínimo de toque de 48px;
- sidebar expandida/recolhida;
- drawer mobile;
- largura máxima de conteúdo;
- escala de radius;
- elevação discreta.

### Ainda precisa de validação visual

- paleta final e personalidade da cor primária;
- contraste entre superfícies;
- escala final de títulos;
- densidade dos cards;
- comportamento dos ícones;
- aparência de foco, hover e active;
- aplicação dos tokens nos wireframes reais.

## Regras de ouro

1. Estado nunca é representado somente por cor.
2. Texto normal deve buscar contraste WCAG AA.
3. Alvos de toque devem ter pelo menos 48px quando possível.
4. Inputs mobile usam tamanho de texto que evite zoom automático indesejado.
5. Dark e light são temas completos.
6. `prefers-reduced-motion` deve ser respeitado.
7. Alterar um token deve mudar a linguagem visual de forma previsível sem exigir refatoração de cada componente.
8. Não criar token para uma exceção isolada sem necessidade.

## Próxima etapa

Com a arquitetura de navegação definida, o próximo trabalho é validar estes tokens visualmente em um **wireframe/protótipo do Dashboard**, primeiro mobile e depois desktop. A implementação do CSS definitivo deve esperar essa validação.
