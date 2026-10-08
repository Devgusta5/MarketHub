# MarketHub — Sistema de Design

> Derivado de `docs/BRIEFING.md` e do código em `src/`.
> O briefing é a autoridade de direção; este documento registra como ela
> foi implementada. Mudou o código? Atualize aqui junto.

---

## 1. Princípio que atravessa tudo

**A cor de destaque escolhida pelo usuário controla marca, ação e foco —
nunca o significado de erro, sucesso, atenção ou pendência.**

Os tokens semânticos (`--success`, `--warning`, `--danger`, `--info`) são
independentes de `--accent`. A tela de Configurações → Aparência demonstra
isso: trocando a cor, os badges de estado continuam verde/âmbar/vermelho.

---

## 2. Cor

Tokens em `src/app/globals.css`, trocados por `data-theme` no `<html>`.

### Superfícies e texto

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--background` | `#fbfbfc` | `#0d0f11` | Fundo da aplicação |
| `--surface` | `#ffffff` | `#15181c` | Sidebar, cards, painéis |
| `--surface-raised` | `#ffffff` | `#1c2025` | Menus, dropdowns |
| `--surface-sunken` | `#f4f5f7` | `#101316` | Cabeçalho de tabela, hover |
| `--border` | `#e4e7eb` | `#2a3037` | Divisórias |
| `--border-strong` | `#d2d7de` | `#3a424b` | Hover de borda, scrollbar |
| `--text-primary` | `#15181c` | `#f4f6f8` | Texto principal |
| `--text-secondary` | `#5c6672` | `#a6afb8` | Rótulos, apoio |
| `--text-tertiary` | `#8a94a0` | `#727d88` | Ausência, placeholder |

Grafite, nunca preto absoluto, conforme §7 do briefing.

### Semânticas

| Token | Claro | Escuro | Significa |
|---|---|---|---|
| `--success` | `#15803d` | `#4ade80` | Publicado, completo, aprovado |
| `--warning` | `#b45309` | `#fbbf24` | Com pendências, incompleto |
| `--danger` | `#b91c1c` | `#f87171` | Erro de sincronização |
| `--info` | `#1d4ed8` | `#60a5fa` | Em revisão, pronto |

Cada uma tem par `-surface` com 8% (claro) / 12% (escuro) de opacidade,
para fundos de badge e alerta.

### Destaque

Laranja é o padrão (`#f97316`). Alternativas: azul, violeta, verde,
turquesa — trocadas por `data-accent`.

`--accent-text` existe à parte: no tema escuro o laranja puro sobre
grafite não tem contraste suficiente para texto pequeno (§17), então o
traço clareia 18% enquanto o preenchimento sólido continua o mesmo.

---

## 3. Tipografia

**Geist** (`--font-geist-sans`) para interface, **Geist Mono** para SKU e
identificadores. SKU em mono alinha dígitos e distingue `FRT-4201` de
`FRT-4210` numa lista.

`font-variant-numeric: tabular-nums` no `body`: é uma ferramenta de
catálogo, números têm que alinhar em coluna.

| Papel | Tamanho |
|---|---|
| Título de página | `text-xl font-semibold tracking-tight` |
| Título de seção | `text-sm font-semibold tracking-tight` |
| Corpo / linha de tabela | `13px` |
| Rótulo de campo | `text-xs` em `--text-secondary` |
| Metadado | `11px` em `--text-tertiary` |

Escala curta de propósito. Sem pesos concorrentes: `font-medium` e
`font-semibold` bastam.

---

## 4. Forma e elevação

- Raio: `--radius-xl` (12px) em cards, `--radius-lg` (8px) em controles
  grandes, `--radius-md` (6px) em botões, inputs e badges.
- Sombra: três níveis, todos com deslocamento e desfoque reais
  (`--shadow-sm/md/lg`). Card usa `sm`, dropdown usa `md`, modal usa `lg`.
- Sem gradiente na interface. O gradiente da marca (§7) fica reservado
  para peças de identidade, não para fundo de aplicação.

---

## 5. Densidade

`data-density` controla `--row-h` e `--cell-y`:

| | Confortável | Compacta |
|---|---|---|
| Altura de linha | 56px | 42px |

---

## 6. Componentes

Em [src/components/ui.tsx](src/components/ui.tsx):

| Componente | Estados |
|---|---|
| `Button` / `ButtonLink` | `primary`, `secondary`, `ghost`, `danger` × `sm`, `md` + hover, foco, desabilitado |
| `Card` | Superfície padrão de seção |
| `SectionHeading` | Título + dica + ação opcional |
| `Badge` | 6 tons, com ícone opcional |
| `ProductStatusBadge` | Os 4 estados de produto |
| `ChannelStatusBadge` | Os 5 estados de canal |
| `ContentStatusBadge` | Os 5 estados de conteúdo |
| `Field` | Par rótulo/valor, `—` quando vazio |
| `EmptyState` | Ícone + o que é + qual ação iniciar |
| `Skeleton` | Carregamento em área de conteúdo previsível |
| `ProgressBar` | Completude, com `aria-valuenow` |

Shell em [src/components/shell.tsx](src/components/shell.tsx);
aparência em [src/components/appearance.tsx](src/components/appearance.tsx).

### Regras

- **Estado nunca só por cor** (§13, §17): todo badge tem ícone e texto.
  Os chips de canal no catálogo combinam símbolo (`●◐▲✕○`), sigla e
  `sr-only` com o estado por extenso.
- **Campo vazio não é erro**: `—` em `--text-tertiary`, nunca vermelho.
- **Erro orienta a ação** (§18): mensagens dizem a causa conhecida e o
  próximo passo. O botão de publicar bloqueado leva à primeira pendência
  em vez de ficar morto.
- **Ícones**: Lucide, traço 2, tamanho 12–18 conforme o contexto.
  Nunca emoji no lugar de ícone.

---

## 7. Os três eixos de estado

Separados de propósito (§13) — respondem perguntas diferentes:

| Eixo | Valores |
|---|---|
| **Produto** | Rascunho · Incompleto · Em revisão · Completo |
| **Canal** | Não configurado · Com pendências · Pronto · Publicado · Erro |
| **Conteúdo** | Original · Gerado com IA · Editado · Aguardando aprovação · Aprovado |

Um produto pode estar **Completo** na base e ainda ter pendência de canal.
Por isso `pendings()` carrega `scope: 'base' | 'channel'` e a interface
mostra os dois grupos separados — misturar os dois mente sobre o trabalho
que falta.

---

## 8. Produto base × versão de canal

A distinção precisa ser inequívoca (§12). Na interface:

- Campo da versão vazio → usa o conteúdo base, marcado com o rótulo
  **"herdado da base"** e renderizado em `--text-tertiary`.
- Campo preenchido → é conteúdo próprio do canal, em tinta normal.

`isInherited()` em `src/lib/types.ts` é a função única que decide isso.

---

## 9. IA

A IA aparece onde resolve a tarefa, nunca como chatbot (§14):

- Botão contextual ao lado do campo que ela preenche.
- Resultado chega como sugestão, com prévia; aplicar é ação do usuário.
- `ContentStatus` distingue **gerado** de **editado** de **aprovado**.
- Conteúdo aprovado nunca é sobrescrito em silêncio.
- Toda geração entra no histórico com o autor "Assistente".

No MVP os botões estão desabilitados e a rota `/assistente` explica onde
cada ação vai aparecer.

---

## 10. Movimento

Transições de 120–220ms (§16), só em hover, foco e mudança de estado.
`--ease-out` para entradas. Nada de efeito elástico ou gradiente animado.
`prefers-reduced-motion` reduz tudo a 0.01ms.

---

## 11. Acessibilidade

- Contraste AA nos dois temas; `--accent-text` existe por causa disso.
- Foco visível via `:focus-visible` com `outline-offset`.
- Todo input tem `<label htmlFor>`; erro com `role="alert"` e
  `aria-describedby` apontando para a mensagem.
- Estado comunicado por texto + ícone, além da cor.
- `aria-current="page"` no item ativo da navegação.
- `<html lang="pt-BR">`.

---

## 12. Superfícies do navegador

Tematizadas a partir da paleta, não deixadas no padrão:
`::selection`, `::placeholder`, scrollbar (track transparente, polegar em
`--border-strong`), `:focus-visible`.
