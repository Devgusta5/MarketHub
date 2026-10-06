export const MARKETPLACES = ['mercado_livre', 'shopee', 'amazon'] as const

export type Marketplace = (typeof MARKETPLACES)[number]

export const MARKETPLACE_LABELS: Record<Marketplace, string> = {
  mercado_livre: 'Mercado Livre',
  shopee: 'Shopee',
  amazon: 'Amazon',
}

export type ProductStatus = 'draft' | 'ready'

export type ProductImage = {
  id: string
  storagePath: string
  altText: string | null
  position: number
}

/**
 * Versão adaptada por canal. Campo vazio significa "usa o do produto base" —
 * é isso que evita manter três produtos independentes.
 */
export type MarketplaceVersion = {
  marketplace: Marketplace
  title: string | null
  description: string | null
  bulletPoints: string[]
  updatedAt: string | null
}

export type ProductEventKind =
  | 'created'
  | 'updated'
  | 'image_added'
  | 'image_removed'
  | 'ai_generated'
  | 'marketplace_updated'

export type ProductEvent = {
  id: string
  kind: ProductEventKind
  summary: string
  createdAt: string
}

export type Product = {
  id: string
  sku: string
  name: string
  internalName: string | null
  brand: string | null
  category: string | null
  baseDescription: string | null
  attributes: Record<string, string>
  tags: string[]
  status: ProductStatus
  primaryImageId: string | null
  images: ProductImage[]
  versions: MarketplaceVersion[]
  events: ProductEvent[]
  updatedAt: string
}

export function primaryImage(product: Product): ProductImage | null {
  return (
    product.images.find((image) => image.id === product.primaryImageId) ??
    product.images[0] ??
    null
  )
}

/** O título que o canal realmente usa: o adaptado, ou o do produto base. */
export function effectiveTitle(product: Product, marketplace: Marketplace): string {
  const version = product.versions.find((v) => v.marketplace === marketplace)
  return version?.title?.trim() || product.name
}

export function effectiveDescription(
  product: Product,
  marketplace: Marketplace,
): string {
  const version = product.versions.find((v) => v.marketplace === marketplace)
  return version?.description?.trim() || product.baseDescription || ''
}
