# MarketHub — Plano do MVP (Catálogo Inteligente)

> Plano de execução derivado de `plano-central-produtos-conteudo(1).md`.
> Objetivo desta fase: **testar com produtos reais da empresa**.

---

## 1. Pergunta que o MVP tem que responder

> "Consigo pegar um produto real, centralizar suas informações e preparar um anúncio melhor e mais rápido do que faço hoje?"

Tudo que não ajuda a responder isso fica fora. Em particular: integração com Bling, publicação em marketplace, vídeo, fiscal completo, multiempresa, permissões.

### Como medimos se deu certo

Critério concreto, não "parece legal":

- 10 produtos reais cadastrados no sistema.
- Tempo por produto medido hoje (manual) vs. no MarketHub. Anotar os dois.
- Quantos textos gerados pela IA foram aproveitados sem reescrever do zero.

Se o tempo não cair e a IA não acertar, o problema está na premissa — melhor descobrir com 10 produtos do que depois de construir integrações.

---

## 2. Escopo do MVP

### Dentro

| # | Item | Por quê |
|---|---|---|
| 1 | Login (Supabase Auth, e-mail/senha) | Precisa rodar hospedado com dados reais |
| 2 | Catálogo visual (grid de produtos, busca) | Tela inicial do dia a dia |
| 3 | Ficha central do produto | O coração do conceito: fonte única de verdade |
| 4 | Upload de imagens + imagem principal | Conteúdo centralizado começa aqui |
| 5 | IA: título, descrição, tags | Onde está o ganho de tempo |
| 6 | Versões por marketplace (ML / Shopee / Amazon) | Prova o conceito de Adapter sem integrar nada |
| 7 | Histórico de alterações | Base de auditoria + mostra o que a IA fez |

O item 6 é a diferença entre "mais um cadastro de produtos" e a ideia do documento. Sem ele o MVP não testa a hipótese central. Mas é **só conteúdo adaptado e copiável** — nenhuma chamada de API de marketplace.

### Fora (explicitamente adiado)

Integração Bling · publicação real em ML/Shopee/Amazon · geração de vídeo · NCM e fiscal · permissões por papel · multiempresa/SaaS · automação de republicação.

---

## 3. Arquitetura

```text
┌─────────────────────────────────────────┐
│  Next.js (App Router) — Vercel          │
│  ├── Server Components: leitura         │
│  ├── Server Actions: escrita            │
│  └── Route Handler: /api/ai/*           │
└───────────────┬─────────────────────────┘
                │
     ┌──────────┴───────────┐
     ▼                      ▼
┌──────────────┐    ┌─────────────────┐
│  Supabase    │    │  Provider de IA │
│  Postgres    │    │  (interface     │
│  Auth        │    │   trocável)     │
│  Storage     │    └─────────────────┘
└──────────────┘
```

### Decisão: sem backend Node separado

O documento original sugeria Next + API Node própria. Não faço isso agora:

- O único consumidor da API seria o próprio frontend. Um serviço separado adiciona deploy, contrato e CORS pra manter sem resolver problema nenhum hoje.
- Integrações futuras (Bling, ML) são **webhooks e jobs**, não "o backend do app". Entram como route handlers ou Supabase Edge Functions quando chegarem, sem tocar no catálogo.
- O que realmente protege o futuro não é a separação de processos, é o **modelo de dados** (seção 4) e o **adapter de IA** (seção 6).

### Decisão: IA atrás de uma interface

Uma função `generate()` com uma interface própria, implementada por um provider. Trocar de modelo/fornecedor = escrever outro provider. É a camada desacoplada que o documento pede, e custa ~30 linhas.

### Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — estilo
- **Supabase** — Postgres, Auth, Storage (RLS ligado desde o início)
- **Zod** — validação de input nas Server Actions
- **Claude API** (`@anthropic-ai/sdk`, modelo `claude-sonnet-5-5`) — geração de conteúdo e leitura de imagem

Claude em vez de OpenAI: o fluxo de "identificar produto a partir da foto" depende de visão, e o modelo lê a imagem direto do Storage. O provider é trocável de qualquer forma.

---

## 4. Modelo de dados

A separação que o documento exige — **produto base / conteúdo / versão por marketplace** — está nas tabelas, não só no conceito.

```text
companies
  └── products ──┬── product_images
                 ├── product_marketplace_versions   (1 por canal)
                 └── product_events                 (histórico)
profiles  (liga auth.users → company)
```

### `companies`
`id`, `name`, `created_at`

### `profiles`
`id` (= `auth.users.id`), `company_id`, `full_name`

Existe só pra responder "de qual empresa é esse usuário?" nas políticas de RLS. Já deixa o caminho multiempresa aberto sem custo hoje.

### `products` — o produto base
`id`, `company_id`, `sku`, `name`, `internal_name`, `brand`, `category`, `base_description`, `attributes` (jsonb), `tags` (text[]), `status` (`draft` | `ready`), `primary_image_id`, `created_at`, `updated_at`

`attributes` como jsonb porque os campos variam por categoria — normalizar isso agora seria adivinhar o schema de produtos que ainda não existem.

Único: `(company_id, sku)`.

### `product_images` — conteúdo
`id`, `product_id`, `storage_path`, `position`, `alt_text`, `created_at`

A imagem principal é `products.primary_image_id`, não um booleano na imagem — evita o estado inválido de duas imagens principais.

### `product_marketplace_versions` — o Adapter
`id`, `product_id`, `marketplace` (`mercado_livre` | `shopee` | `amazon`), `title`, `description`, `bullet_points` (text[]), `fields` (jsonb), `updated_at`

Único: `(product_id, marketplace)`. `bullet_points` existe por causa da Amazon; `fields` absorve o que for específico de cada canal.

Regra: **a versão não duplica o produto**. Campo vazio na versão = usa o do produto base. Isso é o que evita manter três produtos independentes.

### `product_events` — histórico
`id`, `product_id`, `actor_id`, `kind` (`created` | `updated` | `image_added` | `image_removed` | `ai_generated` | `marketplace_updated`), `payload` (jsonb), `created_at`

Append-only. `payload` guarda o que mudou — inclusive qual prompt/modelo gerou um texto, que é o que permite melhorar prompts na Fase 2.

### Segurança

RLS ligado em todas as tabelas desde a primeira migration: um usuário só vê linhas da própria `company_id`. Storage em bucket privado, URLs assinadas. Ligar RLS depois, com dados reais da empresa dentro, é o tipo de dívida que ninguém paga.

---

## 5. Telas

```text
/login                      → e-mail + senha
/                           → catálogo (grid, busca, filtro por status)
/produtos/novo              → criação mínima (nome + SKU)
/produtos/[id]              → ficha central
/produtos/[id]/[marketplace]→ versão adaptada do canal
```

### Ficha central (`/produtos/[id]`)

Três blocos, nessa ordem de prioridade visual:

1. **Imagens** — upload, reordenar, definir principal
2. **Produto base** — nome, SKU, marca, categoria, descrição base, tags, atributos
3. **Versões por marketplace** — três cartões (ML / Shopee / Amazon) com status e link

Lateral ou aba: **histórico** do produto.

Cada campo gerável tem um botão de IA ao lado, e o texto cai no campo **como sugestão editável** — nunca salvo direto. É o princípio "a IA sugere; o usuário valida" implementado na UI, não só escrito no documento.

---

## 6. Camada de IA

### Interface

```ts
type AiTask =
  | { kind: 'identify';    imageUrls: string[] }
  | { kind: 'title';       product: ProductContext; marketplace?: Marketplace }
  | { kind: 'description'; product: ProductContext; marketplace?: Marketplace }
  | { kind: 'tags';        product: ProductContext }
  | { kind: 'improve';     text: string; instruction?: string }

interface AiProvider {
  run(task: AiTask): Promise<AiResult>
}
```

Prompts por marketplace ficam em arquivos de dados separados (`lib/ai/marketplaces/*.ts`), com as regras de cada canal — limite de caracteres do título no ML, estilo da Shopee, bullets da Amazon. Ajustar as regras não é mexer em código de aplicação.

### Regras

- IA roda **sob clique explícito**, nunca em background.
- Resultado chega como sugestão; salvar é ação do usuário.
- Toda geração vira um `product_event` com modelo e prompt usados.
- Chave de API só no servidor (route handler / server action).

---

## 7. Ordem de implementação

Cada etapa deixa o app funcionando — nada de "só funciona no final".

| # | Etapa | Entrega verificável |
|---|---|---|
| 1 | Projeto Next + Tailwind + TS, layout e shell | App roda, navegação visível |
| 2 | Catálogo e ficha com dados em memória | Fluxo e telas validados sem banco |
| 3 | Supabase: migrations, RLS, seed | Schema aplicado |
| 4 | Auth + login + proteção de rotas | Login real funcionando |
| 5 | CRUD de produtos via Server Actions | Produto persiste |
| 6 | Upload de imagens (Storage) + principal | Imagens reais no produto |
| 7 | Camada de IA: título, descrição, tags | Botões de gerar funcionando |
| 8 | Versões por marketplace | Conteúdo adaptado por canal |
| 9 | Histórico | Timeline do produto |
| 10 | Deploy na Vercel | Acessível pra testar na empresa |
| 11 | 10 produtos reais + medição | Resposta à pergunta da seção 1 |

A etapa 2 antes do banco é deliberada: é mais barato descobrir que a ficha está errada mexendo em um array do que em migrations.

---

## 8. Levantamento na empresa (em paralelo)

Isso não depende de código e vale mais que qualquer feature. Responder, do documento original:

- Quanto tempo leva hoje preparar um produto, do zero à publicação?
- Quais dados são digitados manualmente mais de uma vez?
- O que muda de verdade entre ML, Shopee e Amazon? (título? descrição? atributos?)
- Onde acontecem os erros que dão retrabalho?
- De onde vêm as imagens hoje?

Risco real: construir o Catálogo Inteligente e descobrir que o gargalo era outro — imagens, por exemplo, ou aprovação de anúncio. Essas respostas, mesmo informais, reordenam o roadmap.

---

## 9. Riscos

| Risco | Mitigação |
|---|---|
| O gargalo real não é o cadastro | Levantamento da seção 8 antes de construir integrações |
| IA gera texto genérico, ninguém usa | Prompts por canal + medir taxa de aproveitamento na seção 1 |
| Dados reais da empresa expostos | RLS e bucket privado desde a migration 1 |
| Escopo crescer e o MVP nunca sair | Lista "Fora" da seção 2 é fechada até a etapa 11 |
| Dependência do catálogo divergir do Bling | Produto base é o dono do conteúdo; integração futura é sincronização, não cópia |

---

## 10. Depois do MVP

Na ordem do roadmap original: uso interno (Fase 2) → integração Bling e marketplaces (Fase 3) → automação (Fase 4) → plataforma (Fase 5).

A decisão de ir pra Fase 3 depende do resultado da seção 1. Se o tempo por produto não cair, integrar não resolve — só espalha o problema.
