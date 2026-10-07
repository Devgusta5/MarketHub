---
name: MarketHub — Despacho
description: Painel de partidas e cartão de embarque segmentado para preparar conteúdo de produto por canal.
colors:
  deep: "#0b0d11"
  panel: "#15181f"
  panel-raised: "#1c212b"
  rule: "#1f2530"
  rule-strong: "#2c3442"
  ink: "#f2f4f7"
  ink-dim: "#8a94a6"
  ink-faint: "#5b6577"
  alert: "#ffc107"
  alert-ink: "#1a1403"
  ml: "#ffe14d"
  shopee: "#ff6b35"
  amazon: "#4dd0e1"
  ready: "#4ade80"
typography:
  display:
    fontFamily: "Saira Condensed, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "normal"
  title:
    fontFamily: "Saira Condensed, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Saira Condensed, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  data:
    fontFamily: "Martian Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.08em"
    fontFeature: "tnum 1"
  label:
    fontFamily: "Martian Mono, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.14em"
rounded:
  none: "0"
spacing:
  xs: "4px"
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.alert}"
    textColor: "{colors.alert-ink}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  button-primary-block:
    backgroundColor: "{colors.alert}"
    textColor: "{colors.alert-ink}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    height: "40px"
    width: "100%"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-faint}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  input-search:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    height: "36px"
    padding: "0 12px"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    height: "42px"
  card-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  board-row:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "56px"
    padding: "12px 16px"
  board-row-hover:
    backgroundColor: "{colors.panel-raised}"
  channel-cell-adapted:
    backgroundColor: "{colors.ml}"
    textColor: "{colors.deep}"
    rounded: "{rounded.none}"
    width: "34px"
    height: "17px"
  channel-cell-adapted-lg:
    backgroundColor: "{colors.ml}"
    textColor: "{colors.deep}"
    rounded: "{rounded.none}"
    width: "46px"
    height: "22px"
  chip-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
---

# Design System: MarketHub — Despacho

## Overview

**Creative North Star: "O Despacho"**

O produto é uma sala de operação, não um painel de administração. O catálogo é o
**painel de partidas** de um aeroporto: linhas rankeadas, altura compacta, réguas
de 1px separando SKUs, e um estado que acende na borda da linha e permanece aceso
até alguém notar. A ficha do produto é o **cartão de embarque segmentado**: talões
rotulados, separados por linha perfurada, cada campo com sua etiqueta impressa em
caixa alta. O mesmo vocabulário aparece em duas escalas — o que se lê em lote no
painel se lê ampliado no cartão.

O mundo nasceu escuro e só existe escuro. `color-scheme: dark` está declarado e
nenhum tema claro foi construído: o fundo é quase preto (`deep`), os painéis são
um degrau acima (`panel`), e a profundidade vem de camadas tonais e réguas, nunca
de sombra. O sistema é deliberadamente plano e ortogonal: zero sombra, zero
gradiente, zero raio de canto. Um retângulo é um retângulo. Isso é o que separa
este mundo da disposição padrão da categoria — barra lateral, grade de cartões
flutuantes com sombra e azul funcional, onde todo produto parece igualmente
pronto e nada diz o que falta fazer.

A densidade é dupla, porque o trabalho é duplo. Em triagem, a linha do painel tem
56px de altura mínima e seis colunas de largura fixa. Em foco, o cartão abre com
talões generosos e descrição em 68ch. A tipografia carrega essa divisão: uma
condensada técnica para o que é texto humano e uma mono desenhada para grade em
tudo que é código, número ou rótulo. Figuras tabulares estão ligadas globalmente,
no `body` — é um painel de dados, os números alinham em coluna.

**Key Characteristics:**

- Escuro-exclusivo: nenhum tema claro existe no build.
- Âmbar único e reservado para "precisa de ação".
- Tinta constante por canal (ML, Shopee, Amazon) em todo o sistema.
- Zero sombra, zero gradiente, zero raio de canto.
- Figuras tabulares globais (`tabular-nums` + `tnum`).
- Estado sempre por forma + rótulo, nunca só por cor.
- Linha perfurada como divisória de talão.
- Superfícies do navegador tematizadas, não deixadas no default.

## Colors

Paleta de sala escura com uma única voz quente: cinzas azulados frios para
estrutura e dado, um âmbar que só fala quando há trabalho a fazer, e três tintas
de canal que nunca mudam de significado.

### Primary

- **Âmbar de Ação** (`alert`): o único acento do sistema. Aparece na faixa de 2px
  na borda esquerda da linha pendente, no texto do motivo da pendência, no botão
  de ação primária (o único botão preenchido da interface), no anel de foco, no
  `::selection`, no ponto de contagem viva e no evento de IA no histórico. Nunca
  em texto corrido, nunca como decoração, nunca para colorir um cabeçalho.
- **Tinta sobre Âmbar** (`alert-ink`): marrom quase preto, usado só como texto
  sobre âmbar sólido. Nunca aparece sobre outro fundo.

### Secondary

As tintas de canal. São identificação, não hierarquia — cada uma pertence a um
marketplace e a nenhum outro papel.

- **Amarelo Mercado Livre** (`ml`): identifica MEL. Preenchimento da célula
  adaptada, contorno da célula herdando, sigla no talão de embarque.
- **Laranja Shopee** (`shopee`): identifica SHP, nos mesmos três lugares.
- **Ciano Amazon** (`amazon`): identifica AMZ, nos mesmos três lugares.

### Tertiary

- **Verde Pronto** (`ready`): estado terminal positivo. Aparece no rótulo `PRONTO`
  do painel e da ficha, e no ponto de contagem quando nada está pendente. Nunca é
  usado como acento geral nem como cor de sucesso de formulário.

### Neutral

- **Quase Preto de Operação** (`deep`): fundo da página, fora do painel. Também é
  a tinta do texto dentro da célula de canal preenchida e a borda de 3px que
  separa o polegar da barra de rolagem.
- **Cinza de Painel** (`panel`): o painel, o cartão, a barra de despacho, as
  linhas da tabela, os talões de embarque, o histórico. É a superfície onde o
  conteúdo vive.
- **Cinza Elevado** (`panel-raised`): hover da linha do painel e fundo da vaga de
  imagem ocupada. É o único feedback de superfície do sistema.
- **Régua Fina** (`rule`): divisória entre linhas do painel, entre segmentos
  internos do cartão e entre eventos do histórico. 1px.
- **Régua Forte** (`rule-strong`): moldura do painel e do cartão, divisórias de
  bloco, borda de campo, contorno da célula de canal sem base, polegar da barra
  de rolagem, e a tinta das linhas perfuradas e pontilhadas.
- **Tinta de Papel** (`ink`): dado principal — nome do produto, SKU, valor de
  atributo, descrição presente.
- **Tinta Apagada** (`ink-dim`): rótulo, metadado, estado neutro (`RASCUNHO`),
  contagem de SKU, link de volta ao painel, texto de canal herdando.
- **Tinta Fraca** (`ink-faint`): ausência e segundo plano — placeholder, `——` de
  campo vazio, número de ranque, data de atualização, marca, nota de rodapé,
  botão desabilitado, texto da célula de canal sem base.

### Named Rules

**A Regra do Âmbar Reservado.** `alert` significa exatamente uma coisa: *precisa
de ação*. Faixa de linha pendente, motivo da pendência, ação primária, foco e
seleção. Se um elemento em âmbar não representa trabalho pendente nem o caminho
para criar trabalho, está errado. Teste: remova todo o conteúdo da tela; cada
mancha de âmbar restante deve apontar para algo que alguém precisa fazer.

**A Regra da Tinta de Canal.** Cada marketplace tem tinta própria e constante no
sistema inteiro, definida uma vez em `CHANNEL_INK`. A cor identifica o canal e
nada mais: ela nunca expressa estado, severidade ou progresso. Um canal nunca
aparece em cinza genérico, e nenhuma outra coisa no sistema usa essas três cores.

**A Regra dos Dois Vocabulários Separados.** Identidade e estado falam em tintas
diferentes para não se confundirem. No talão de embarque a sigla do canal usa a
tinta do canal, mas a palavra de estado (`ADAPTADO` / `HERDANDO` / `SEM BASE`)
fala em tinta neutra (`ink-dim` / `ink-faint`).

**A Regra do Estado Nunca Só Por Cor.** Todo estado carrega forma ou palavra além
da cor. A célula de canal combina preenchimento, estilo de borda e sigla; a linha
pendente combina faixa, cor de SKU e motivo escrito; a contagem combina ponto
colorido e número. Contraste AA é mínimo, não meta.

## Typography

**Display Font:** Saira Condensed (com `sans-serif`), carregada via
`next/font/google` nos pesos 400/500/600/700 e exposta em `--font-display`.
**Body Font:** Saira Condensed — a mesma família; o sistema não tem face de corpo
separada.
**Label/Mono Font:** Martian Mono (com `monospace`), pesos 400/500/600, exposta em
`--font-data`.

**Character:** Uma condensada técnica que cabe muita coluna sem apertar a leitura,
pareada com uma mono desenhada para grade. A divisão não é decorativa: a
condensada carrega linguagem humana (nome do produto, descrição, resumo de
evento), a mono carrega tudo que é código, número, sigla, estado ou etiqueta
impressa. Nenhuma face de display de sistema é usada em nenhum lugar.

### Hierarchy

- **Display** (400, 22px, 1.35): o nome do produto no talão superior do cartão.
  É o maior texto do sistema; não existe hero.
- **Title** (400, 15px, 1.3): nome do produto na linha do painel, truncado em uma
  linha.
- **Body** (400, 14px, 1.6): descrição base (máx. 68ch), resumo de evento no
  histórico, texto de estado vazio, subtítulo de criação e mensagem de erro.
- **Data** (400–600, 9–13px, `0.02em`–`0.18em`, mono): SKU, siglas de canal,
  estados em caixa alta, datas, contagens, ranque, atributos, tags e botões. O
  tracking abre conforme o texto encurta — 13px/`0.18em` na marca da barra de
  despacho, 11px/`0.08em` nos estados, 10px/`0.1em` nos rótulos de evento.
- **Label** (400, 10px, `0.14em`, caixa alta, mono, `ink-dim`): a classe `.label`.
  É a etiqueta impressa do cartão: cabeçalho de coluna do painel, rótulo de
  segmento, rótulo de campo de formulário, títulos de seção (`embarques`,
  `histórico`) e legenda da fita.

### Named Rules

**A Regra das Figuras Tabulares.** `font-variant-numeric: tabular-nums` e
`font-feature-settings: "tnum" 1` estão no `body`, globalmente. Todo número do
sistema alinha em coluna. Nenhuma superfície desliga isso.

**A Regra da Mono para Dado.** Se o texto é código, número, sigla, estado ou
etiqueta, é mono. Se é linguagem que uma pessoa escreveu, é condensada. Um SKU em
condensada e uma descrição em mono são ambos erros.

**A Regra da Caixa Alta Curta.** Caixa alta só com tracking aberto e só em texto
curto — rótulo, sigla, estado, botão. Nunca em frase, nunca em descrição.

## Layout

O sistema tem três larguras de contêiner, uma por ritmo de trabalho: **1400px**
para o painel (triagem em lote, precisa de todas as colunas), **1100px** para a
ficha (foco em um produto) e **560px** para a criação (dois campos, nada mais).
Todos centrados, com padding horizontal de 16px que vira 24px a partir de `sm`.

A barra de despacho tem altura fixa de 48px, largura total, fundo `panel` e borda
inferior em `rule-strong`. Ela se repete nas três superfícies — no painel com a
marca e a contagem viva, na ficha e na criação com o link `← PAINEL`.

O painel é uma grade de seis colunas de largura fixa a partir de `lg`:
`34px 108px minmax(0,1fr) 136px 116px 72px` — ranque, SKU, produto, canais,
estado, atualização — com `gap: 16px` e altura mínima de linha de 56px. Abaixo de
`lg` a mesma linha se reempilha em três faixas via `order`: SKU e estado na
primeira, nome do produto em largura total na segunda, fita de canais e data na
terceira. O cabeçalho de colunas (32px) só aparece onde as colunas existem.

O cartão da ficha é uma pilha de talões. Cada talão é uma grade própria
(`1fr 200px 140px` na identificação, quatro colunas nos dados de base,
`0.85fr 1fr` em tags/atributos), e os talões são separados por linha perfurada.
Abaixo de `sm` as grades colapsam para duas colunas ou uma, e as divisórias
trocam de vertical (`border-l`) para horizontal (`border-t`). Os três talões de
embarque formam uma grade de 3 colunas construída com `gap: 1px` sobre fundo
`rule-strong` — a régua é o próprio vão.

O ritmo de espaçamento é curto e múltiplo de 2: 4px e 6px entre células de canal,
12px/16px de padding de segmento, 20px na barra de ferramentas, 40px entre o
cartão e cada seção seguinte. Breakpoints usados: `sm` (640px) e `lg` (1024px).

### Named Rules

**A Regra da Grade que Não Desloca.** A faixa de pendência tem largura constante
de 2px e fica transparente quando não há pendência, para que acender uma linha
nunca empurre a grade. Qualquer indicador de estado em linha segue essa regra:
reserve o espaço, troque a cor.

**A Regra do Contêiner por Ritmo.** A largura do contêiner é escolhida pelo ritmo
de trabalho da superfície, não por uniformidade: triagem pede 1400px, foco pede
1100px, entrada mínima pede 560px.

## Elevation & Depth

**Este sistema não tem sombras.** Nenhuma. Não existe `box-shadow` em nenhum
arquivo do build, nem `filter: drop-shadow`, nem gradiente de superfície. Também
não existe `backdrop-filter`. É painel e cartão impresso, não cartão flutuante.

A profundidade vem de duas coisas: **degraus tonais** e **réguas de 1px**. São
três degraus de superfície, do mais fundo ao mais próximo: `deep` (a página),
`panel` (a superfície de conteúdo) e `panel-raised` (hover de linha e vaga de
imagem ocupada). Acima disso, a hierarquia é feita por peso de régua —
`rule-strong` molda blocos e contêineres, `rule` separa itens dentro de um bloco.
Uma moldura em `rule-strong` é o que faz um painel ser um objeto.

O único gradiente do sistema é funcional e nunca decorativo: `repeating-linear-gradient`
usado para desenhar as linhas perfuradas e o pontilhado que liga rótulo a valor
nos atributos.

### Named Rules

**A Regra Sem Sombra.** Nada neste sistema projeta sombra, em nenhum estado,
incluindo hover e foco. Profundidade é degrau tonal mais régua. Se uma superfície
precisa parecer mais próxima, ela sobe um degrau de fundo ou ganha moldura mais
forte.

**A Regra do Gradiente Funcional.** Gradiente só para desenhar perfuração e
pontilhado. Nunca para preencher superfície, botão ou texto.

## Shapes

**Raio zero em tudo.** Nenhum `border-radius` positivo existe no build; o único
`border-radius` declarado é `0`, no polegar da barra de rolagem, para desfazer o
arredondamento do navegador. Botões, campos, células de canal, vagas de imagem,
tags, painéis e cartões são todos retângulos de canto vivo.

A linguagem de forma é a borda. Tudo que é objeto tem contorno de 1px: `rule-strong`
para molduras e campos, `rule` para divisórias internas. O estilo da borda carrega
significado — `solid` é presença, `dashed` é herança ou vaga vazia. Dois elementos
usam borda tracejada: a célula de canal no estado *herdando* e a vaga de imagem
livre.

As silhuetas recorrentes são três: a **linha** (56px de altura mínima, seis
colunas, faixa de 2px à esquerda), o **talão** (bloco rotulado com padding de
12px/16px, fechado por perfuração) e a **célula de canal** (retângulo achatado de
34×17px no painel, 46×22px na ficha, contendo três letras).

### Named Rules

**A Regra do Canto Vivo.** Raio é sempre 0. Nenhuma exceção foi aberta no build,
nem para botão, nem para campo, nem para avatar ou miniatura.

**A Regra da Perfuração.** Talões do cartão são separados por `.perforation`
(traço horizontal de 4px a cada 9px, 1px de altura); divisórias verticais internas
de campo usam `.perforation-v`. A perfuração separa blocos de significado dentro
de um mesmo objeto; a régua sólida separa objetos.

## Components

### Buttons

- **Shape:** retângulo de canto vivo (raio 0), sem sombra em nenhum estado.
- **Primary:** âmbar sólido com tinta quase preta, mono semibold em caixa alta com
  tracking. Dois formatos: inline na barra de ferramentas (`+ PRODUTO`, 11px,
  `0.12em`, padding 10px/16px) e bloco no formulário (`ABRIR TALÃO`, 11px,
  `0.14em`, 40px de altura, largura total). É o único botão preenchido do sistema;
  há no máximo um por tela.
- **Hover / Focus:** hover reduz a opacidade para 85% com `transition-opacity`.
  Foco usa o anel global: `outline: 2px solid` em âmbar com `outline-offset: 1px`.
- **Ghost / Secondary:** contorno em `rule-strong` com tinta `ink-faint`, mono 10px
  em caixa alta (`GERAR · IA`). Fundo transparente. No build este botão só existe
  desabilitado, aguardando a etapa de IA.
- **Disabled:** opacidade 50% no botão primário; o ghost já nasce em tinta fraca.
- **Nota de responsivo:** abaixo de `sm` o botão primário do painel troca o rótulo
  por `+` e mantém o nome acessível em `.sr-only`.

### Chips

- **Style:** tag de produto como retângulo contornado — borda de 1px em
  `rule-strong`, fundo transparente, texto `ink` em mono 10px com `0.06em` de
  tracking, padding 4px/8px, espaçadas em 6px.
- **State:** as tags não têm estado selecionado no build; são exibição, não filtro.

### Cards / Containers

- **Corner Style:** raio 0.
- **Background:** `panel` sobre página em `deep`.
- **Shadow Strategy:** nenhuma; ver Elevation & Depth.
- **Border:** moldura externa de 1px em `rule-strong`; divisórias internas em
  `rule`; separação de talão por `.perforation`.
- **Internal Padding:** 12px vertical / 16px horizontal no segmento padrão
  (`Segment`), 16px no talão de embarque, 24px/64px no estado vazio do painel.
- **Skeleton:** o carregamento é um retângulo da altura final (480px no cartão) ou
  cinco linhas de 56px com opacidade decrescente de 1 a 0.36 no painel. Sem
  animação de pulso.

### Inputs / Fields

- **Style:** campo sem caixa própria — fundo transparente dentro de um contêiner
  contornado, `outline: none` no elemento. A busca é um contêiner com borda
  `rule-strong` e fundo `panel`, contendo o rótulo `.label` (`buscar`), uma
  `.perforation-v` e o input em mono 12px, 36px de altura,
  `min(260px, 60vw)` de largura. Os campos do formulário são blocos de 42px com
  `.label` acima, separados por `.perforation`.
- **Focus:** anel global em âmbar (2px, offset 1px) via `:focus-visible`. O campo
  não muda de borda nem de fundo.
- **Placeholder:** `ink-faint`, definido globalmente em `::placeholder`.
- **Error:** mensagem em âmbar, 14px, em bloco próprio com `role="alert"`,
  separada do campo por perfuração.
- **Nota:** o campo de SKU força `text-transform: uppercase` e mono.

### Navigation

A barra de despacho é a única navegação: 48px de altura, largura total, fundo
`panel`, borda inferior `rule-strong`. No painel carrega a marca (`MARKETHUB` em
mono 13px semibold, `0.18em`) com o descritor `despacho` em `.label` ao lado, e a
contagem viva à direita (`NN SKU` · ponto de 5px + `NN PENDENTES`, mono 11px,
figuras tabulares). Nas superfícies internas carrega apenas `← PAINEL` em mono
11px `0.14em` em `ink-dim`, que clareia para `ink` no hover. Não existe barra
lateral, menu suspenso nem abas.

### Fita de Canais (componente-assinatura)

Três células fixas (MEL, SHP, AMZ) lidas em lote na linha do painel e ampliadas no
cartão da ficha — o mesmo vocabulário em duas escalas. Cada célula é um retângulo
de canto vivo com a sigla de três letras em mono, `0.08em` de tracking: 34×17px e
9px de texto no painel, 46×22px e 11px na ficha.

O estado se expressa por **preenchimento e estilo de borda**, com a tinta do canal
sempre presente:

- **Adaptado:** fundo na tinta do canal, borda sólida na tinta do canal, texto em
  quase preto, peso 600. O canal tem camada própria.
- **Herdando:** fundo transparente, borda **tracejada** na tinta do canal, texto na
  tinta do canal, peso 400. Existe base, e o canal está usando a camada de baixo.
- **Sem base:** fundo transparente, borda sólida em `rule-strong`, texto em
  `ink-faint`. Não há o que herdar — a célula é vazada e sai do vocabulário de cor
  do canal.

Cada célula carrega `title` com o nome do canal e o estado em palavras. A legenda
(`ChannelLegend`) fica no selo de rodapé do painel e explica as três formas em
tinta neutra — a tela ensina o próprio vocabulário.

### Linha do Painel

Caractere: densa, posicionada, viva. Fundo `panel`, borda inferior `rule`
(removida na última), hover para `panel-raised` com `transition-colors`. Altura
mínima de 56px. O ranque (`01`, `02`) em `ink-faint` diz que a linha está
posicionada, não só ordenada. Quando há pendência, três coisas mudam juntas:
faixa esquerda de 2px em âmbar, SKU em âmbar e motivo da pendência escrito em
âmbar e caixa alta no lugar do estado. O painel fecha com um selo de lote:
legenda da fita à esquerda, `NN LINHAS · NN A FAZER` em mono 10px à direita.

### Talão de Embarque por Canal

Um bloco por marketplace, em grade de 3 colunas feita de vãos de 1px. Topo: sigla
na tinta do canal (mono 12px semibold) à esquerda, palavra de estado em tinta
neutra (mono 9px) à direita. Abaixo, o nome completo do canal em `.label` e o
título efetivo. Quando o canal está *herdando*, o título é mostrado em itálico e
em `ink-dim`: o texto vem da camada de baixo, e a ausência de camada própria fica
visível.

### Superfícies do Navegador

Tratadas como parte do design, não como default. `::selection` é âmbar com tinta
`alert-ink`. A barra de rolagem é fina, com polegar em `rule-strong` (clareando
para `ink-faint` no hover), trilha transparente, 10px de espessura, borda de 3px
em `deep` para folga e raio 0. `::placeholder` é `ink-faint`. `:focus-visible` é
anel âmbar de 2px com offset de 1px.

### Motion

Movimento quase ausente, e só reativo. Apenas `transition-colors` (hover de linha
e de link, célula de canal) e `transition-opacity` (botões). Nenhuma animação de
entrada, nenhum fade decorativo, nenhum skeleton pulsante. O build respeita
`prefers-reduced-motion: reduce` reduzindo toda animação e transição a 0.01ms
globalmente.

## Do's and Don'ts

### Do:

- **Do** reservar o âmbar (`alert`) exclusivamente para "precisa de ação": faixa de
  linha pendente, motivo da pendência, ação primária, foco e seleção.
- **Do** usar a tinta constante do canal (`CHANNEL_INK`) sempre que um marketplace
  é identificado, em qualquer escala e qualquer superfície.
- **Do** expressar estado por forma mais palavra além da cor — preenchido/
  tracejado/vazado com sigla, faixa com motivo escrito, ponto com número.
- **Do** manter raio 0 em toda forma nova: botão, campo, miniatura, célula, painel.
- **Do** construir profundidade com os três degraus de superfície (`deep`,
  `panel`, `panel-raised`) e com os dois pesos de régua (`rule`, `rule-strong`).
- **Do** separar talões dentro de um mesmo objeto com `.perforation` /
  `.perforation-v`, e objetos distintos com régua sólida.
- **Do** mandar todo código, número, sigla, estado e rótulo para a mono
  (Martian Mono), e todo texto humano para a condensada (Saira Condensed).
- **Do** usar `.label` para rótulo de coluna, de segmento, de campo e de seção:
  mono 10px, caixa alta, `0.14em`, `ink-dim`.
- **Do** reservar espaço constante para indicadores de estado em linha, deixando-os
  transparentes quando inativos, para a grade não deslocar.
- **Do** escolher a largura do contêiner pelo ritmo da superfície: 1400px para
  triagem, 1100px para foco, 560px para entrada mínima.
- **Do** tematizar superfícies do navegador em qualquer superfície nova — seleção,
  rolagem, placeholder e foco já têm valor de sistema.

### Don't:

- **Don't** usar âmbar como decoração, como cor de cabeçalho, em texto corrido ou
  para qualquer coisa que não seja trabalho pendente.
- **Don't** usar as tintas de canal (`ml`, `shopee`, `amazon`) para expressar
  estado, severidade ou progresso, nem para colorir qualquer coisa que não seja um
  canal.
- **Don't** aplicar `box-shadow`, `drop-shadow` ou `backdrop-filter` em nada, em
  nenhum estado, incluindo hover e foco.
- **Don't** usar gradiente para preencher superfície, botão ou texto; gradiente só
  desenha perfuração e pontilhado.
- **Don't** introduzir `border-radius` positivo em nenhum elemento.
- **Don't** colocar mais de um botão preenchido em âmbar por tela.
- **Don't** sinalizar estado apenas por cor, e não deixar nenhum estado abaixo de
  contraste AA — o uso é de várias horas por dia.
- **Don't** escrever frase ou descrição em caixa alta; caixa alta é só para rótulo,
  sigla, estado e botão.
- **Don't** desligar figuras tabulares em nenhuma superfície.
- **Don't** animar entrada de conteúdo, nem adicionar fade decorativo ou skeleton
  pulsante; movimento só responde a hover, foco e mudança de estado.
- **Don't** reordenar uma linha do painel sob o olho de quem está lendo: o estado
  muda no lugar.
- **Don't** assumir tema claro. O sistema é escuro-exclusivo (`color-scheme: dark`)
  e nenhum valor claro foi definido.
