/**
 * Modelo de domínio do MarketHub.
 *
 * Os três eixos de estado vêm do briefing §13 e são deliberadamente
 * separados: produto, canal e conteúdo respondem perguntas diferentes.
 */

export const MARKETPLACES = ['mercado_livre', 'shopee', 'amazon'] as const
export type Marketplace = (typeof MARKETPLACES)[number]

export const MARKETPLACE_LABELS: Record<Marketplace, string> = {
  mercado_livre: 'Mercado Livre',
  shopee: 'Shopee',
  amazon: 'Amazon',
}

/** Siglas de largura parecida, para a coluna de canais não desalinhar. */
export const MARKETPLACE_SHORT: Record<Marketplace, string> = {
  mercado_livre: 'ML',
  shopee: 'SHP',
  amazon: 'AMZ',
}

/* ── §13 Estado do produto ───────────────────────────────── */

export const PRODUCT_STATUSES = ['draft', 'incomplete', 'in_review', 'complete'] as const
export type ProductStatus = (typeof PRODUCT_STATUSES)[number]

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  draft: 'Rascunho',
  incomplete: 'Incompleto',
  in_review: 'Em revisão',
  complete: 'Completo',
}

/* ── §13 Estado do canal ─────────────────────────────────── */

export const CHANNEL_STATUSES = [
  'not_configured',
  'has_issues',
  'ready',
  'published',
  'error',
] as const
export type ChannelStatus = (typeof CHANNEL_STATUSES)[number]

export const CHANNEL_STATUS_LABELS: Record<ChannelStatus, string> = {
  not_configured: 'Não configurado',
  has_issues: 'Com pendências',
  ready: 'Pronto',
  published: 'Publicado',
  error: 'Erro',
}

/* ── §13 Estado do conteúdo ──────────────────────────────── */

export const CONTENT_STATUSES = [
  'original',
  'ai_generated',
  'edited',
  'awaiting_approval',
  'approved',
] as const
export type ContentStatus = (typeof CONTENT_STATUSES)[number]

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  original: 'Original',
  ai_generated: 'Gerado com IA',
  edited: 'Editado',
  awaiting_approval: 'Aguardando aprovação',
  approved: 'Aprovado',
}

/* ── Entidades ───────────────────────────────────────────── */

export type ProductImage = {
  id: string
  url: string | null
  altText: string | null
  position: number
}

/** Texto com proveniência: §14 exige distinguir gerado de aprovado. */
export type ContentField = {
  value: string
  status: ContentStatus
  updatedAt: string
}

/**
 * Versão por canal. Campo ausente = herda do produto base.
 * É isso que evita manter três produtos independentes.
 */
export type MarketplaceVersion = {
  marketplace: Marketplace
  status: ChannelStatus
  title: ContentField | null
  description: ContentField | null
  bulletPoints: string[]
  /** Campos exigidos pelo canal que ainda faltam. Alimenta as pendências. */
  missingFields: string[]
  /** Mensagem quando status === 'error'. */
  errorMessage: string | null
  listingId: string | null
  updatedAt: string | null
}

export type ProductEventKind =
  | 'created'
  | 'updated'
  | 'image_added'
  | 'image_removed'
  | 'ai_generated'
  | 'content_approved'
  | 'channel_updated'
  | 'published'
  | 'sync_failed'

export type ProductEvent = {
  id: string
  kind: ProductEventKind
  summary: string
  detail: string | null
  createdAt: string
  actor: string
}

export type Product = {
  id: string
  sku: string
  name: string
  internalName: string | null
  brand: string | null
  category: string | null
  description: ContentField | null
  attributes: Record<string, string>
  tags: string[]
  status: ProductStatus
  primaryImageId: string | null
  images: ProductImage[]
  versions: MarketplaceVersion[]
  events: ProductEvent[]
  createdAt: string
  updatedAt: string
}

/* ── Completude e pendências (§12) ───────────────────────── */

export type Pending = {
  /** Campo ao qual a pendência leva — vira âncora na página do produto. */
  field: string
  label: string
  /** O que fazer, em linguagem concreta (§13). */
  action: string
  severity: 'required' | 'recommended'
  /**
   * 'base' falta no produto; 'channel' falta para um canal específico.
   * Um produto pode estar completo na base e ainda ter pendência de canal.
   */
  scope: 'base' | 'channel'
}

/** Os 10 campos essenciais que compõem "8 de 10 informações". */
const ESSENTIAL: Array<{
  field: string
  label: string
  action: string
  has: (p: Product) => boolean
}> = [
  { field: 'name', label: 'Nome', action: 'Informe o nome do produto', has: (p) => !!p.name.trim() },
  { field: 'sku', label: 'SKU', action: 'Informe o SKU', has: (p) => !!p.sku.trim() },
  { field: 'brand', label: 'Marca', action: 'Informe a marca', has: (p) => !!p.brand?.trim() },
  {
    field: 'category',
    label: 'Categoria',
    action: 'Escolha a categoria do produto',
    has: (p) => !!p.category?.trim(),
  },
  {
    field: 'description',
    label: 'Descrição',
    action: 'Escreva ou gere a descrição base',
    has: (p) => !!p.description?.value.trim(),
  },
  {
    field: 'images',
    label: 'Imagens',
    action: 'Adicione pelo menos uma imagem',
    has: (p) => p.images.length > 0,
  },
  {
    field: 'primaryImage',
    label: 'Imagem principal',
    action: 'Defina qual imagem é a principal',
    has: (p) => !!p.primaryImageId,
  },
  {
    field: 'attributes',
    label: 'Atributos',
    action: 'Informe os atributos do produto',
    has: (p) => Object.keys(p.attributes).length > 0,
  },
  {
    field: 'tags',
    label: 'Tags',
    action: 'Adicione palavras-chave para busca',
    has: (p) => p.tags.length > 0,
  },
  {
    field: 'internalName',
    label: 'Nome interno',
    action: 'Informe o nome usado internamente',
    has: (p) => !!p.internalName?.trim(),
  },
]

export type Completeness = { filled: number; total: number; percent: number }

export function completeness(product: Product): Completeness {
  const filled = ESSENTIAL.filter((f) => f.has(product)).length
  return {
    filled,
    total: ESSENTIAL.length,
    percent: Math.round((filled / ESSENTIAL.length) * 100),
  }
}

/**
 * Pendências acionáveis: o que falta, dito de forma concreta,
 * apontando para o campo correspondente (§12, §13).
 */
export function pendings(product: Product): Pending[] {
  const list: Pending[] = []

  for (const f of ESSENTIAL) {
    if (!f.has(product)) {
      list.push({
        field: f.field,
        label: f.label,
        action: f.action,
        // Os quatro primeiros bloqueiam qualquer publicação.
        severity: ['name', 'sku', 'description', 'images'].includes(f.field)
          ? 'required'
          : 'recommended',
        scope: 'base',
      })
    }
  }

  for (const version of product.versions) {
    if (version.status === 'error' && version.errorMessage) {
      list.push({
        field: `channel-${version.marketplace}`,
        label: MARKETPLACE_LABELS[version.marketplace],
        action: version.errorMessage,
        severity: 'required',
        scope: 'channel',
      })
      continue
    }
    for (const missing of version.missingFields) {
      list.push({
        field: `channel-${version.marketplace}`,
        label: MARKETPLACE_LABELS[version.marketplace],
        action: `Falta ${missing}`,
        severity: 'required',
        scope: 'channel',
      })
    }
  }

  if (product.description?.status === 'awaiting_approval') {
    list.push({
      field: 'description',
      label: 'Descrição',
      action: 'Revise a descrição gerada com IA',
      severity: 'recommended',
      scope: 'base',
    })
  }

  return list
}

/* ── Leitura ─────────────────────────────────────────────── */

export function primaryImage(product: Product): ProductImage | null {
  return (
    product.images.find((i) => i.id === product.primaryImageId) ?? product.images[0] ?? null
  )
}

export function version(
  product: Product,
  marketplace: Marketplace,
): MarketplaceVersion | undefined {
  return product.versions.find((v) => v.marketplace === marketplace)
}

/** O título que o canal usa: o adaptado, ou o do produto base. */
export function effectiveTitle(product: Product, marketplace: Marketplace): string {
  return version(product, marketplace)?.title?.value.trim() || product.name
}

export function effectiveDescription(product: Product, marketplace: Marketplace): string {
  return (
    version(product, marketplace)?.description?.value.trim() ||
    product.description?.value ||
    ''
  )
}

/** true quando o canal está usando o conteúdo do produto base. */
export function isInherited(
  product: Product,
  marketplace: Marketplace,
  field: 'title' | 'description',
): boolean {
  return !version(product, marketplace)?.[field]?.value.trim()
}

/** Só o que falta no produto base. */
export function basePendings(product: Product): Pending[] {
  return pendings(product).filter((p) => p.scope === 'base')
}

/** Só o que falta para os canais. */
export function channelPendings(product: Product): Pending[] {
  return pendings(product).filter((p) => p.scope === 'channel')
}
