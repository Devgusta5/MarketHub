/**
 * Dados em memória para a etapa 2 do PLANO.md.
 *
 * Deliberadamente temporário: é mais barato descobrir que a ficha está errada
 * mexendo em um array do que em migrations. A etapa 3 troca este módulo por
 * consultas ao Supabase, mantendo as mesmas funções.
 */
import { MARKETPLACES, type Marketplace, type Product } from './types'

function emptyVersions(): Product['versions'] {
  return MARKETPLACES.map((marketplace) => ({
    marketplace,
    title: null,
    description: null,
    bulletPoints: [],
    updatedAt: null,
  }))
}

const products: Product[] = [
  {
    id: 'p1',
    sku: 'FRT-4201',
    name: 'Frigideira Antiaderente 24cm Cabo de Madeira',
    internalName: 'Frigideira 24 linha premium',
    brand: 'CasaForte',
    category: 'Casa e Cozinha / Panelas',
    baseDescription:
      'Frigideira de alumínio com revestimento antiaderente de tripla camada, cabo de madeira maciça e fundo difusor de calor. Indicada para fogão a gás, elétrico e vitrocerâmico.',
    attributes: {
      Material: 'Alumínio',
      Diâmetro: '24 cm',
      Revestimento: 'Antiaderente tripla camada',
      'Compatível com indução': 'Não',
    },
    tags: ['frigideira', 'antiaderente', 'cozinha', '24cm'],
    status: 'ready',
    primaryImageId: 'p1-i1',
    images: [
      { id: 'p1-i1', storagePath: '', altText: 'Frigideira vista superior', position: 0 },
      { id: 'p1-i2', storagePath: '', altText: 'Detalhe do cabo', position: 1 },
    ],
    versions: [
      {
        marketplace: 'mercado_livre',
        title: 'Frigideira Antiaderente 24cm Cabo Madeira Tripla Camada CasaForte',
        description:
          'Frigideira 24cm com antiaderente de tripla camada e cabo de madeira maciça. Serve em fogão a gás, elétrico e vitrocerâmico. Fundo difusor que distribui o calor por igual.',
        bulletPoints: [],
        updatedAt: '2026-10-02T14:10:00.000Z',
      },
      {
        marketplace: 'shopee',
        title: 'Frigideira Antiaderente 24cm Cabo de Madeira',
        description: null,
        bulletPoints: [],
        updatedAt: '2026-10-02T14:12:00.000Z',
      },
      {
        marketplace: 'amazon',
        title: null,
        description: null,
        bulletPoints: [],
        updatedAt: null,
      },
    ],
    events: [
      {
        id: 'p1-e3',
        kind: 'marketplace_updated',
        summary: 'Título do Mercado Livre atualizado',
        createdAt: '2026-10-02T14:10:00.000Z',
      },
      {
        id: 'p1-e2',
        kind: 'ai_generated',
        summary: 'Descrição base gerada por IA',
        createdAt: '2026-10-01T09:30:00.000Z',
      },
      {
        id: 'p1-e1',
        kind: 'created',
        summary: 'Produto criado',
        createdAt: '2026-10-01T09:20:00.000Z',
      },
    ],
    updatedAt: '2026-10-02T14:10:00.000Z',
  },
  {
    id: 'p2',
    sku: 'ORG-1180',
    name: 'Organizador de Geladeira Transparente 2 Peças',
    internalName: null,
    brand: 'CasaForte',
    category: 'Casa e Cozinha / Organização',
    baseDescription:
      'Par de organizadores empilháveis em plástico transparente livre de BPA, com alça frontal. Serve em geladeira, armário e despensa.',
    attributes: {
      Material: 'Plástico PET livre de BPA',
      'Itens por embalagem': '2',
      Dimensões: '32 x 15 x 10 cm',
    },
    tags: ['organizador', 'geladeira', 'cozinha'],
    status: 'draft',
    primaryImageId: 'p2-i1',
    images: [
      { id: 'p2-i1', storagePath: '', altText: 'Organizadores empilhados', position: 0 },
    ],
    versions: emptyVersions(),
    events: [
      {
        id: 'p2-e2',
        kind: 'image_added',
        summary: '1 imagem adicionada',
        createdAt: '2026-10-05T16:40:00.000Z',
      },
      {
        id: 'p2-e1',
        kind: 'created',
        summary: 'Produto criado',
        createdAt: '2026-10-05T16:35:00.000Z',
      },
    ],
    updatedAt: '2026-10-05T16:40:00.000Z',
  },
  {
    id: 'p3',
    sku: 'LUM-7730',
    name: 'Luminária de Mesa LED Articulável USB',
    internalName: 'Luminária LED articulável',
    brand: 'Lumina',
    category: 'Iluminação / Luminárias',
    baseDescription: null,
    attributes: {
      Alimentação: 'USB 5V',
      Potência: '7 W',
      'Temperatura de cor': '3 níveis',
    },
    tags: [],
    status: 'draft',
    primaryImageId: null,
    images: [],
    versions: emptyVersions(),
    events: [
      {
        id: 'p3-e1',
        kind: 'created',
        summary: 'Produto criado',
        createdAt: '2026-10-06T11:05:00.000Z',
      },
    ],
    updatedAt: '2026-10-06T11:05:00.000Z',
  },
]

export async function listProducts(search?: string): Promise<Product[]> {
  const term = search?.trim().toLowerCase()
  const result = term
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          (p.brand ?? '').toLowerCase().includes(term),
      )
    : products
  return [...result].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function getProduct(id: string): Promise<Product | null> {
  return products.find((p) => p.id === id) ?? null
}

export async function skuExists(sku: string): Promise<boolean> {
  return products.some((p) => p.sku.toLowerCase() === sku.trim().toLowerCase())
}

export async function createProduct(input: { name: string; sku: string }): Promise<Product> {
  const id = `p${Date.now().toString(36)}`
  const now = new Date().toISOString()
  const product: Product = {
    id,
    sku: input.sku,
    name: input.name,
    internalName: null,
    brand: null,
    category: null,
    baseDescription: null,
    attributes: {},
    tags: [],
    status: 'draft',
    primaryImageId: null,
    images: [],
    versions: emptyVersions(),
    events: [{ id: `${id}-e1`, kind: 'created', summary: 'Produto criado', createdAt: now }],
    updatedAt: now,
  }
  products.unshift(product)
  return product
}

type BaseFields = Pick<
  Product,
  'name' | 'sku' | 'brand' | 'category' | 'baseDescription' | 'internalName' | 'tags' | 'status'
>

export async function updateProductBase(
  id: string,
  patch: Partial<BaseFields>,
): Promise<Product | null> {
  const product = products.find((p) => p.id === id)
  if (!product) return null
  Object.assign(product, patch)
  product.updatedAt = new Date().toISOString()
  product.events.unshift({
    id: `${id}-e${product.events.length + 1}`,
    kind: 'updated',
    summary: 'Produto base atualizado',
    createdAt: product.updatedAt,
  })
  return product
}

export async function updateVersion(
  id: string,
  marketplace: Marketplace,
  patch: { title?: string | null; description?: string | null; bulletPoints?: string[] },
): Promise<Product | null> {
  const product = products.find((p) => p.id === id)
  if (!product) return null
  const version = product.versions.find((v) => v.marketplace === marketplace)
  if (!version) return null
  Object.assign(version, patch)
  version.updatedAt = new Date().toISOString()
  product.updatedAt = version.updatedAt
  product.events.unshift({
    id: `${id}-e${product.events.length + 1}`,
    kind: 'marketplace_updated',
    summary: `Versão ${marketplace} atualizada`,
    createdAt: version.updatedAt,
  })
  return product
}
