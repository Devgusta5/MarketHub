# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Assistente de marketplace de uma empresa de Peruíbe (SP) — a pessoa que prepara
e publica produtos nos canais de venda. Uso intenso, várias horas por dia, em
desktop.

Dois ritmos de trabalho confirmados, e o produto precisa servir aos dois:

1. **Triagem em lote** — varrer o catálogo para achar o que falta fazer, em
   dezenas de produtos de uma vez.
2. **Foco em um produto** — abrir um produto e trabalhar nele até ficar bom.

No MVP é um usuário só (quem construiu). A estrutura prevê mais usuários da
mesma empresa depois.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. Supabase
(Postgres, Auth, Storage) a partir da etapa 3. Sem backend separado: o único
consumidor seria o próprio frontend. Deploy na Vercel.

## Product Purpose

Centralizar a preparação de conteúdo de produto para marketplaces. Hoje a mesma
informação é recriada manualmente para Mercado Livre, Shopee e Amazon — o que
gera retrabalho, inconsistência e perda de tempo.

Cada produto tem **uma ficha central** (fonte única de verdade). As versões por
canal são adaptações dessa ficha, não cópias independentes.

Sucesso no MVP é medido, não estimado: 10 produtos reais cadastrados, tempo por
produto antes vs. depois, e quantos textos gerados por IA foram aproveitados
sem reescrever.

## Positioning

Camada complementar ao Bling, não substituto. O Bling continua responsável pelo
que já faz na operação; o MarketHub cuida de conteúdo, preparação e adaptação
por canal — a parte que hoje é manual.

A diferença mecânica: **o campo vazio na versão de um canal não é pendência, é
herança do produto base.** É isso que elimina a duplicação, e nenhuma
ferramenta de cadastro comum faz isso.

## Operating Context

- Canais: Mercado Livre, Shopee, Amazon. Cada um com regras próprias de título,
  descrição e campos (a Amazon usa bullet points; o ML tem limite de título).
- Bling permanece na operação, em paralelo.
- O trabalho envolve texto, imagens e, no futuro, vídeo (fora do MVP).
- Produtos chegam à empresa de forma contínua; preparar o anúncio é a tarefa
  recorrente.
- Dados fiscais (NCM etc.) existem na operação, mas estão fora do MVP.

## Capabilities and Constraints

Confirmado no MVP (ordem de prioridade em BRIEFING §20): catálogo com busca e
filtros, página do produto com completude e pendências acionáveis, separação
produto base × adaptação por canal, estados essenciais, design system base,
temas claro/escuro, IA contextual.

Fora do MVP, deliberadamente: integração com Bling, publicação real em qualquer
marketplace, geração de vídeo, sistema fiscal, permissões por papel,
multiempresa.

Restrição de dados: conteúdo real de produtos da empresa. RLS por empresa e
bucket privado desde a primeira migration.

### Terminologia (vocabulário do produto)

| Termo | Significa |
|---|---|
| Produto base | A ficha central, fonte única de verdade |
| Versão / canal | A adaptação do produto para um marketplace |
| Herdado da base | Campo vazio no canal, usando o valor do produto base |
| Completude | Quantas das 10 informações essenciais estão preenchidas |
| Pendência | O que falta, dito de forma concreta e acionável |

Estados, conforme BRIEFING §13 — três eixos independentes:

- **Produto:** Rascunho · Incompleto · Em revisão · Completo
- **Canal:** Não configurado · Com pendências · Pronto · Publicado · Erro
- **Conteúdo:** Original · Gerado com IA · Editado · Aguardando aprovação · Aprovado

## Brand Commitments

Definidos em `docs/BRIEFING.md`, que é a autoridade de marca e direção:

- Nome **MarketHub** (uma palavra, H maiúsculo). No wordmark, "Hub" recebe a
  cor de destaque; a leitura do nome continua imediata.
- Direção estética: software operacional + SaaS premium + ferramenta de
  produtividade. Referências de qualidade: Linear, Vercel, Stripe, Notion,
  Shopify — nunca copiadas.
- Grafite + laranja `#F97316` como assinatura, com temas claro, escuro e
  sistema, e cor de destaque escolhível pelo usuário.
- Tipografia Geist; iconografia Lucide.
- A evitar: SaaS genérico de cards arredondados e gradientes, neon/cyberpunk,
  dashboard congestionado de gráficos inúteis, carrinho/sacola como símbolo,
  IA como protagonista.
- Tagline em exploração: "Centralize. Otimize. Publique."

Voz: direta, profissional, clara, objetiva e contemporânea. Rótulos são
substantivos; botões são verbos; erros dizem a causa e o próximo passo.

**Ainda em aberto:** símbolo próprio (letra M + ideia de hub). Por ora só o
wordmark, por decisão do usuário.

## Evidence on Hand

- `docs/BRIEFING.md` — briefing de branding, UI/UX e frontend. **Autoridade de
  direção visual e de experiência.**
- `plano-central-produtos-conteudo(1).md` — documento de concepção do usuário.
- `PLANO.md` — plano de execução do MVP (escopo, modelo de dados, etapas).
- Produtos de exemplo em `src/lib/store.ts` são **fictícios plausíveis**, criados
  para desenvolvimento. Não são dados reais da empresa.

Não existe ainda: produto real cadastrado, medição de tempo, integração
funcionando, usuário além do próprio autor. Nada disso deve ser apresentado como
pronto.

## Product Principles

1. **Uma fonte de verdade por produto.** Canal é adaptação, nunca cópia.
2. **A IA sugere; a pessoa valida.** Nada gerado entra como fato salvo.
3. **Estado sempre visível.** Quem olha a tela sabe o que falta sem clicar.
4. **Não substituir o que já funciona.** O Bling fica.
5. **Provar antes de integrar.** Se o tempo por produto não cair, integrar só
   espalha o problema.

## Accessibility & Inclusion

Uso prolongado diário em desktop: contraste AA mínimo nos dois temas, foco
visível em tudo que recebe teclado, e estado nunca sinalizado só por cor.
Interface em `pt-BR`.
