# MarketHub — Branding e Design System

> Documento vivo. Escrito a partir do que está implementado em
> `src/app/globals.css` e `src/components/ui.tsx`.
> Mudou o visual? Atualize aqui junto com o código.

---

## 1. O que o MarketHub é

Ferramenta **interna de operação**. Quem usa é a pessoa que prepara produtos
para marketplace, muitas horas por dia, olhando muitos produtos seguidos.

Isso define o tom visual: não é landing page, não precisa convencer ninguém.
Precisa ser **legível, denso e previsível**.

### Princípios

1. **O conteúdo do produto é o protagonista.** A interface é moldura. Nenhum
   elemento de UI deve competir com a foto ou o texto do produto.
2. **Densidade sem aperto.** A pessoa compara produtos; cabe mais de um na tela.
3. **Estado sempre visível.** Rascunho vs. pronto, adaptado vs. herdando. Quem
   olha a tela sabe o que falta fazer sem clicar.
4. **IA é sugestão, nunca fato.** Conteúdo gerado aparece visualmente como
   proposta a revisar, não como dado salvo.
5. **Nada decorativo.** Animação, sombra e gradiente só quando comunicam algo
   (carregando, foco, hierarquia).

---

## 2. Nome e voz

**MarketHub** — sempre uma palavra, com H maiúsculo.
Subtítulo de produto: *Catálogo Inteligente*.

### Voz na interface

- Português do Brasil, direto, sem jargão de software.
- Rótulos são substantivos (`Produto base`, `Imagens`, `Histórico`).
- Botões são verbos no infinitivo (`Criar produto`, `Gerar com IA`).
- Erros dizem o que fazer: "Já existe um produto com o SKU FRT-4201" —
  não "Erro de validação".
- Vazio explica o próximo passo: "Cadastre o primeiro produto para começar."

### Vocabulário fixo

| Use | Não use |
|---|---|
| Produto base | produto master, produto pai |
| Versão / canal | variação, clone |
| Rascunho / Pronto | incompleto, publicado |
| Herdando | vazio, sem dados |
| Gerar com IA | automatizar, criar sozinho |

"Herdando" é importante: comunica que o campo vazio **funciona**, usando o
produto base — não que falta preencher.

---

## 3. Cor

Tokens em `:root` em `globals.css`, com tema escuro por `prefers-color-scheme`.
Tailwind v4 expõe cada um como classe via `@theme inline`.

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--background` | `#f6f7f9` | `#0e1014` | Fundo da página |
| `--surface` | `#ffffff` | `#171a20` | Cards, header, inputs |
| `--foreground` | `#16181d` | `#e9ebef` | Texto principal |
| `--muted` | `#646b7a` | `#99a1b0` | Rótulos, metadados |
| `--border` | `#e3e6eb` | `#262b34` | Divisórias, contornos |
| `--accent` | `#2f5fe0` | `#5b86f5` | Ação primária, foco |

Regras:

- **Fundo cinza, card branco.** O produto fica no branco; a página recua.
- **Azul é só ação.** Botão primário, borda de foco, hover de card. Nunca
  decoração nem texto corrido.
- **Nunca cor fixa (`bg-white`, `text-gray-500`) em componente.** Só tokens —
  é o que faz o tema escuro funcionar de graça.

### Cores de estado

Semânticas, com opacidade baixa no fundo para não gritar na grade:

| Estado | Cor | Onde |
|---|---|---|
| Pronto / adaptado | `emerald` | `StatusBadge`, status do canal |
| Rascunho | `amber` | `StatusBadge` |
| Erro | `red` | Mensagens de validação |

Sempre com variante `dark:` no texto, porque o tom claro de emerald/amber não
tem contraste suficiente no fundo escuro.

---

## 4. Tipografia

- **Geist Sans** (`--font-sans`) — toda a interface.
- **Geist Mono** (`--font-mono`) — exclusivamente SKU e identificadores.

SKU em mono não é estética: alinha os dígitos e deixa `FRT-4201` e `FRT-4210`
visivelmente diferentes numa lista.

| Papel | Classes |
|---|---|
| Título de página | `text-xl font-semibold tracking-tight` |
| Título de seção | `text-sm font-semibold tracking-tight` |
| Nome de produto (card) | `text-sm font-medium leading-snug` |
| Corpo / descrição | `text-sm leading-relaxed` |
| Rótulo de campo | `text-xs text-muted` |
| Metadado / data | `text-xs text-muted` |

Escala curta de propósito: `xs` para apoio, `sm` para conteúdo, `xl` para
título de página. Sem tamanhos intermediários — mantém a hierarquia estável
entre telas.

---

## 5. Layout

- Container: `max-w-6xl`, `px-4`. Header fixo de `h-14`.
- Ficha de produto: `lg:grid-cols-[1fr_280px]` — conteúdo + histórico lateral,
  que empilha no mobile.
- Catálogo: 1 / 2 / 3 colunas (`sm:` / `lg:`).
- Espaçamento entre cards: `gap-4`; dentro do card: `p-5`; entre seções: `gap-6`.
- Raio: `rounded-xl` em cards, `rounded-lg` em controles, `rounded-md` em tags,
  `rounded-full` em badges. Quanto menor o elemento, menor o raio.
- Imagens: `aspect-4/3` no card do catálogo, `aspect-square` na ficha.

---

## 6. Componentes

Em [src/components/ui.tsx](../src/components/ui.tsx):

| Componente | Papel |
|---|---|
| `Card` | Superfície de seção. Toda seção é um card. |
| `SectionTitle` | Título + `hint` opcional explicando a regra da seção |
| `Field` | Par rótulo/valor; mostra `—` em cinza quando vazio |
| `StatusBadge` | Rascunho / Pronto |
| `ImagePlaceholder` | Vaga de imagem (temporário até a etapa 6) |

O `hint` do `SectionTitle` carrega as regras do modelo — "Campo vazio herda do
produto base — nada é duplicado". É documentação dentro da UI, no lugar onde a
dúvida aparece.

### Padrões

- **Campo vazio não é erro.** `—` em `text-muted`, nunca vermelho.
- **Interativo mostra que é interativo:** `transition-colors hover:border-accent`
  em card clicável, `focus:border-accent` em input.
- **Carregando preserva o layout:** skeleton com a altura final
  (`h-64 animate-pulse`), não spinner centralizado — evita o salto de conteúdo.
- **Ação indisponível explica por quê:** botão desabilitado diz
  "Gerar com IA (etapa 7)" em vez de só apagar.

### Conteúdo de IA (etapa 7)

Quando a geração entrar, o padrão é:

- Resultado aparece em área de sugestão **visivelmente distinta** do campo salvo.
- Dois botões explícitos: aplicar e descartar.
- Nunca grava sem clique. Nunca gera em background.

É o princípio "a IA sugere; o usuário valida" como regra de interface.

---

## 7. Acessibilidade

- Contraste mínimo AA em ambos os temas. `--muted` é o limite — não clarear mais.
- Todo input tem `<label htmlFor>`.
- Erro de formulário com `role="alert"`.
- Foco visível em tudo que recebe teclado (via `focus:border-accent`).
- `<html lang="pt-BR">`.
- Nunca usar cor como único sinal: o badge tem texto ("Pronto"), não só verde.
