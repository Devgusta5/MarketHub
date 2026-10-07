---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/produtos/[id]/page.tsx","src/app/produtos/novo/page.tsx"]
---

## Scope

Superfícies: catálogo (`/`), ficha do produto (`/produtos/[id]`), criação (`/produtos/novo`).
Modo do visitante: **Operate**. Dois ritmos confirmados pelo usuário: triagem em lote
(catálogo denso) e foco num produto (ficha espaçosa).

## Audience and task

Assistente de marketplace, várias horas por dia, desktop. Varre dezenas de SKUs para
achar o que falta, depois mergulha num produto até ficar pronto. Vocabulário fixo em
PRODUCT.md (produto base, herdando, adaptado).

## Direction contract

THESIS: O produto é um despacho. O catálogo é o painel de partidas — linhas vivas
rankeadas, estado que acende e permanece aceso até ser notado — e a ficha é o cartão de
embarque segmentado, campos rotulados em blocos perfurados. Recusa a disposição padrão da
categoria: barra lateral + grade de cartões com sombra + azul funcional, onde todo produto
parece igualmente pronto e nada diz o que falta fazer.

OWN-WORLD: Fundo quase preto (#0B0D11) com painéis (#15181F); tinta de papel (#F4F5F7)
para dados; UM âmbar (#FFC107) reservado exclusivamente para "precisa de ação" — nunca
decorativo, nunca em texto corrido. Cada canal tem tinta própria e constante no sistema
inteiro (ML, Shopee, Amazon), herdada da disciplina do diagrama de metrô. Figuras tabulares
em tudo que é número ou código. Colunas de largura fixa, réguas de 1px, zero sombra, zero
gradiente, raio mínimo: é painel e cartão, não cartão flutuante. Blocos de cartão separados
por linha perfurada. Reconhecível com todo o conteúdo removido pela grade de colunas e pela
faixa âmbar.

STORY: A pessoa abre e em um olhar sabe quantos SKUs existem, quantos estão pendentes e
quais linhas exigem ação — sem clicar. Escolhe uma linha acesa, entra na ficha, vê o cartão
com os três canais e entende imediatamente o que é herdado e o que foi adaptado. Trabalha o
produto e volta ao painel, onde aquela linha mudou de estado.

FIRST VIEWPORT: Barra de despacho no topo, largura total: "MARKETHUB · DESPACHO" à
esquerda, contagem viva à direita (47 SKU · 12 PENDENTES) em figuras tabulares. Abaixo, o
campo de busca como campo de código (mono, retangular, sem borda arredondada). Então o
painel ocupando toda a largura restante: cabeçalho de colunas em caixa alta com tracking
(SKU · PRODUTO · ML SHP AMZ · ESTADO · ATUALIZADO), e as linhas de produto, altura compacta,
réguas separando. Linhas que precisam de ação levam barra âmbar de 2px na borda esquerda e
o estado em âmbar. A ação primária (+ PRODUTO) fica no topo à direita, em âmbar sólido —
o único botão preenchido da tela.

FORM: Cartão de embarque segmentado + painel de portão ao vivo
(`vernacular-ephemera-boarding-pass-and-gate-board`). Desafiante vencedor sobre a direção
sorteada (índice 5, Torre de Triagem), vencendo nos dois eixos: identificação (quem trabalha
com expedição e códigos reconhece o artefato) e clareza (estado de linha expressa "herdando"
melhor que barra de progresso). Seed key: 3e039bb2.

RAISES (doações, nomeadas):
- do mapa de metrô (recusado): tinta reservada e constante por canal, nunca cor genérica.
- do mapa de orientação (recusado): camada base fixa + camada de adaptação por cima, que é
  como "herdando" fica visível.
- do split-flap (competitivo): a mudança de estado acontece na própria linha e fica acesa;
  a linha nunca some e reaparece em outro lugar.

SIGNATURE INTERACTION: a fita de canais. Em cada linha do painel, três células fixas
(ML SHP AMZ) mostram o estado do canal como bloco preenchido (adaptado), contornado
(herdando) ou vazado (sem conteúdo base). É lido em lote, sem abrir nada, e reaparece
ampliado no cartão da ficha — o mesmo vocabulário em duas escalas.

MOTION GRAMMAR: transições curtas (120-160ms) só em mudança de estado e foco. Nenhuma
entrada animada, nenhum fade decorativo. Uma linha que muda de estado acende e desacende
em 2s, nunca se reordena sob o olho.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Constraints

- Next 16 + React 19 + Tailwind v4, Cache Components ligado (dados atrás de Suspense).
- Conteúdo e funções preservados: nada do PLANO.md muda por causa do visual.
- Dados de exemplo são fictícios e assim devem permanecer rotulados no código.
- Contraste AA nos dois temas; estado nunca só por cor (o bloco de canal tem forma + rótulo).

## Unresolved

- Tema claro: o mundo nasce escuro (operação, uso prolongado). Um tema claro fiel ao
  mundo (painel de papel/cartão impresso) fica para depois do veredicto do usuário.
