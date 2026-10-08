/**
 * Dados de exemplo em memória.
 *
 * Os produtos cobrem deliberadamente todos os estados do briefing §13,
 * inclusive "Publicado" e "Erro", que ainda dependem de integração real.
 * Nada aqui é dado da empresa — é material de demonstração.
 *
 * Substituído por Supabase na etapa de banco; as funções exportadas
 * mantêm a mesma assinatura.
 */
import {
  MARKETPLACES,
  type ContentField,
  type Marketplace,
  type MarketplaceVersion,
  type Product,
  type ProductStatus,
} from './types'

function field(
  value: string,
  status: ContentField['status'] = 'original',
  updatedAt = '2026-10-05T12:00:00.000Z',
): ContentField {
  return { value, status, updatedAt }
}

function emptyVersions(): MarketplaceVersion[] {
  return MARKETPLACES.map((marketplace) => ({
    marketplace,
    status: 'not_configured' as const,
    title: null,
    description: null,
    bulletPoints: [],
    missingFields: [],
    errorMessage: null,
    listingId: null,
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
    category: 'Casa e Cozinha / Panelas e Frigideiras',
    description: field(
      'Frigideira de alumínio com revestimento antiaderente de tripla camada, cabo de madeira maciça e fundo difusor de calor. Indicada para fogão a gás, elétrico e vitrocerâmico.',
      'approved',
      '2026-10-01T09:30:00.000Z',
    ),
    attributes: {
      Material: 'Alumínio',
      Diâmetro: '24 cm',
      Revestimento: 'Antiaderente tripla camada',
      'Compatível com indução': 'Não',
      Peso: '820 g',
    },
    tags: ['frigideira', 'antiaderente', 'cozinha', '24cm', 'cabo de madeira'],
    status: 'complete',
    primaryImageId: 'p1-i1',
    images: [
      { id: 'p1-i1', url: null, altText: 'Frigideira vista superior', position: 0 },
      { id: 'p1-i2', url: null, altText: 'Detalhe do cabo de madeira', position: 1 },
      { id: 'p1-i3', url: null, altText: 'Frigideira em uso', position: 2 },
    ],
    versions: [
      {
        marketplace: 'mercado_livre',
        status: 'published',
        title: field(
          'Frigideira Antiaderente 24cm Cabo Madeira Tripla Camada CasaForte',
          'approved',
          '2026-10-02T14:10:00.000Z',
        ),
        description: field(
          'Frigideira 24cm com antiaderente de tripla camada e cabo de madeira maciça. Serve em fogão a gás, elétrico e vitrocerâmico. Fundo difusor que distribui o calor por igual.',
          'approved',
          '2026-10-02T14:10:00.000Z',
        ),
        bulletPoints: [],
        missingFields: [],
        errorMessage: null,
        listingId: 'MLB3847291055',
        updatedAt: '2026-10-02T14:10:00.000Z',
      },
      {
        marketplace: 'shopee',
        status: 'ready',
        title: field(
          'Frigideira Antiaderente 24cm Cabo de Madeira Premium',
          'edited',
          '2026-10-02T14:12:00.000Z',
        ),
        description: null,
        bulletPoints: [],
        missingFields: [],
        errorMessage: null,
        listingId: null,
        updatedAt: '2026-10-02T14:12:00.000Z',
      },
      {
        marketplace: 'amazon',
        status: 'has_issues',
        title: null,
        description: null,
        bulletPoints: [
          'Revestimento antiaderente de tripla camada',
          'Cabo de madeira maciça que não esquenta',
        ],
        missingFields: ['o código EAN', 'mais 3 bullet points'],
        errorMessage: null,
        listingId: null,
        updatedAt: '2026-10-03T08:20:00.000Z',
      },
    ],
    events: [
      {
        id: 'p1-e5',
        kind: 'published',
        summary: 'Publicado no Mercado Livre',
        detail: 'Anúncio MLB3847291055',
        createdAt: '2026-10-02T14:30:00.000Z',
        actor: 'Gustavo',
      },
      {
        id: 'p1-e4',
        kind: 'content_approved',
        summary: 'Título do Mercado Livre aprovado',
        detail: null,
        createdAt: '2026-10-02T14:10:00.000Z',
        actor: 'Gustavo',
      },
      {
        id: 'p1-e3',
        kind: 'ai_generated',
        summary: 'Título sugerido com IA',
        detail: 'Adaptado para as regras do Mercado Livre',
        createdAt: '2026-10-02T13:55:00.000Z',
        actor: 'Assistente',
      },
      {
        id: 'p1-e2',
        kind: 'image_added',
        summary: '3 imagens adicionadas',
        detail: null,
        createdAt: '2026-10-01T09:40:00.000Z',
        actor: 'Gustavo',
      },
      {
        id: 'p1-e1',
        kind: 'created',
        summary: 'Produto criado',
        detail: null,
        createdAt: '2026-10-01T09:20:00.000Z',
        actor: 'Gustavo',
      },
    ],
    createdAt: '2026-10-01T09:20:00.000Z',
    updatedAt: '2026-10-03T08:20:00.000Z',
  },
  {
    id: 'p2',
    sku: 'ORG-1180',
    name: 'Organizador de Geladeira Transparente 2 Peças',
    internalName: 'Organizador geladeira duplo',
    brand: 'CasaForte',
    category: 'Casa e Cozinha / Organização',
    description: field(
      'Par de organizadores empilháveis em plástico transparente livre de BPA, com alça frontal. Serve em geladeira, armário e despensa.',
      'awaiting_approval',
      '2026-10-06T10:15:00.000Z',
    ),
    attributes: {
      Material: 'Plástico PET livre de BPA',
      'Itens por embalagem': '2',
      Dimensões: '32 x 15 x 10 cm',
    },
    tags: ['organizador', 'geladeira', 'cozinha'],
    status: 'in_review',
    primaryImageId: 'p2-i1',
    images: [
      { id: 'p2-i1', url: null, altText: 'Organizadores empilhados', position: 0 },
      { id: 'p2-i2', url: null, altText: 'Organizador na geladeira', position: 1 },
    ],
    versions: [
      {
        marketplace: 'mercado_livre',
        status: 'error',
        title: field('Organizador de Geladeira Transparente Kit 2 Peças', 'approved'),
        description: null,
        bulletPoints: [],
        missingFields: [],
        errorMessage:
          'Não foi possível sincronizar porque a categoria informada foi descontinuada no Mercado Livre',
        listingId: 'MLB2910384756',
        updatedAt: '2026-10-06T11:02:00.000Z',
      },
      {
        marketplace: 'shopee',
        status: 'has_issues',
        title: null,
        description: null,
        bulletPoints: [],
        missingFields: ['o peso da embalagem'],
        errorMessage: null,
        listingId: null,
        updatedAt: '2026-10-05T16:45:00.000Z',
      },
      {
        marketplace: 'amazon',
        status: 'not_configured',
        title: null,
        description: null,
        bulletPoints: [],
        missingFields: [],
        errorMessage: null,
        listingId: null,
        updatedAt: null,
      },
    ],
    events: [
      {
        id: 'p2-e4',
        kind: 'sync_failed',
        summary: 'Falha ao sincronizar com o Mercado Livre',
        detail: 'Categoria descontinuada',
        createdAt: '2026-10-06T11:02:00.000Z',
        actor: 'Sistema',
      },
      {
        id: 'p2-e3',
        kind: 'ai_generated',
        summary: 'Descrição gerada com IA',
        detail: 'Aguardando revisão',
        createdAt: '2026-10-06T10:15:00.000Z',
        actor: 'Assistente',
      },
      {
        id: 'p2-e2',
        kind: 'image_added',
        summary: '2 imagens adicionadas',
        detail: null,
        createdAt: '2026-10-05T16:40:00.000Z',
        actor: 'Gustavo',
      },
      {
        id: 'p2-e1',
        kind: 'created',
        summary: 'Produto criado',
        detail: null,
        createdAt: '2026-10-05T16:35:00.000Z',
        actor: 'Gustavo',
      },
    ],
    createdAt: '2026-10-05T16:35:00.000Z',
    updatedAt: '2026-10-06T11:02:00.000Z',
  },
  {
    id: 'p3',
    sku: 'LUM-7730',
    name: 'Luminária de Mesa LED Articulável USB',
    internalName: null,
    brand: 'Lumina',
    category: 'Iluminação / Luminárias de Mesa',
    description: null,
    attributes: {
      Alimentação: 'USB 5V',
      Potência: '7 W',
      'Temperatura de cor': '3 níveis',
    },
    tags: [],
    status: 'incomplete',
    primaryImageId: null,
    images: [],
    versions: emptyVersions(),
    events: [
      {
        id: 'p3-e1',
        kind: 'created',
        summary: 'Produto criado',
        detail: null,
        createdAt: '2026-10-06T11:05:00.000Z',
        actor: 'Gustavo',
      },
    ],
    createdAt: '2026-10-06T11:05:00.000Z',
    updatedAt: '2026-10-06T11:05:00.000Z',
  },
  {
    id: 'p4',
    sku: 'TAP-2255',
    name: 'Tapete Antiderrapante para Banheiro 40x60cm',
    internalName: 'Tapete banheiro microfibra',
    brand: 'CasaForte',
    category: 'Casa e Banho / Tapetes',
    description: field(
      'Tapete de microfibra com base antiderrapante em PVC. Absorve água rapidamente e seca em poucas horas. Lavável à máquina.',
      'approved',
      '2026-09-28T14:00:00.000Z',
    ),
    attributes: {
      Material: 'Microfibra',
      Dimensões: '40 x 60 cm',
      Base: 'PVC antiderrapante',
      'Lavável à máquina': 'Sim',
    },
    tags: ['tapete', 'banheiro', 'antiderrapante', 'microfibra'],
    status: 'complete',
    primaryImageId: 'p4-i1',
    images: [
      { id: 'p4-i1', url: null, altText: 'Tapete cinza', position: 0 },
      { id: 'p4-i2', url: null, altText: 'Base antiderrapante', position: 1 },
    ],
    versions: [
      {
        marketplace: 'mercado_livre',
        status: 'published',
        title: field('Tapete Antiderrapante Banheiro 40x60 Microfibra Absorvente', 'approved'),
        description: field('Tapete de microfibra que absorve água rapidamente.', 'approved'),
        bulletPoints: [],
        missingFields: [],
        errorMessage: null,
        listingId: 'MLB4455667788',
        updatedAt: '2026-09-29T10:00:00.000Z',
      },
      {
        marketplace: 'shopee',
        status: 'published',
        title: field('Tapete Banheiro Antiderrapante Microfibra 40x60cm', 'approved'),
        description: null,
        bulletPoints: [],
        missingFields: [],
        errorMessage: null,
        listingId: 'SHP88123455',
        updatedAt: '2026-09-29T10:05:00.000Z',
      },
      {
        marketplace: 'amazon',
        status: 'ready',
        title: field('Tapete Antiderrapante para Banheiro CasaForte, 40x60cm', 'edited'),
        description: null,
        bulletPoints: [
          'Microfibra de alta absorção que seca rápido',
          'Base em PVC antiderrapante para maior segurança',
          'Lavável à máquina sem perder a maciez',
          'Medida 40 x 60 cm, ideal para a saída do box',
        ],
        missingFields: [],
        errorMessage: null,
        listingId: null,
        updatedAt: '2026-10-04T09:00:00.000Z',
      },
    ],
    events: [
      {
        id: 'p4-e3',
        kind: 'channel_updated',
        summary: 'Bullet points da Amazon atualizados',
        detail: null,
        createdAt: '2026-10-04T09:00:00.000Z',
        actor: 'Gustavo',
      },
      {
        id: 'p4-e2',
        kind: 'published',
        summary: 'Publicado no Mercado Livre e Shopee',
        detail: null,
        createdAt: '2026-09-29T10:05:00.000Z',
        actor: 'Gustavo',
      },
      {
        id: 'p4-e1',
        kind: 'created',
        summary: 'Produto criado',
        detail: null,
        createdAt: '2026-09-28T13:40:00.000Z',
        actor: 'Gustavo',
      },
    ],
    createdAt: '2026-09-28T13:40:00.000Z',
    updatedAt: '2026-10-04T09:00:00.000Z',
  },
  {
    id: 'p5',
    sku: 'JOG-9001',
    name: 'Jogo de Facas Inox 6 Peças com Suporte',
    internalName: null,
    brand: 'CasaForte',
    category: null,
    description: null,
    attributes: {},
    tags: [],
    status: 'draft',
    primaryImageId: null,
    images: [],
    versions: emptyVersions(),
    events: [
      {
        id: 'p5-e1',
        kind: 'created',
        summary: 'Produto criado',
        detail: null,
        createdAt: '2026-10-07T15:12:00.000Z',
        actor: 'Gustavo',
      },
    ],
    createdAt: '2026-10-07T15:12:00.000Z',
    updatedAt: '2026-10-07T15:12:00.000Z',
  },
  {
    id: 'p6',
    sku: 'POT-3310',
    name: 'Potes Herméticos de Vidro Kit 5 Peças',
    internalName: 'Kit potes vidro hermético',
    brand: 'Lumina',
    category: 'Casa e Cozinha / Potes e Recipientes',
    description: field(
      'Kit com 5 potes de vidro borossilicato com tampa hermética de bambu e vedação de silicone. Vão ao micro-ondas, forno e lava-louças.',
      'ai_generated',
      '2026-10-07T09:00:00.000Z',
    ),
    attributes: {
      Material: 'Vidro borossilicato',
      Tampa: 'Bambu com vedação de silicone',
      'Itens por embalagem': '5',
    },
    tags: ['potes', 'hermético', 'vidro', 'cozinha'],
    status: 'in_review',
    primaryImageId: 'p6-i1',
    images: [{ id: 'p6-i1', url: null, altText: 'Kit de potes', position: 0 }],
    versions: [
      {
        marketplace: 'mercado_livre',
        status: 'has_issues',
        title: null,
        description: null,
        bulletPoints: [],
        missingFields: ['a capacidade de cada pote'],
        errorMessage: null,
        listingId: null,
        updatedAt: '2026-10-07T09:10:00.000Z',
      },
      {
        marketplace: 'shopee',
        status: 'not_configured',
        title: null,
        description: null,
        bulletPoints: [],
        missingFields: [],
        errorMessage: null,
        listingId: null,
        updatedAt: null,
      },
      {
        marketplace: 'amazon',
        status: 'not_configured',
        title: null,
        description: null,
        bulletPoints: [],
        missingFields: [],
        errorMessage: null,
        listingId: null,
        updatedAt: null,
      },
    ],
    events: [
      {
        id: 'p6-e2',
        kind: 'ai_generated',
        summary: 'Descrição gerada com IA',
        detail: 'A partir das informações do produto',
        createdAt: '2026-10-07T09:00:00.000Z',
        actor: 'Assistente',
      },
      {
        id: 'p6-e1',
        kind: 'created',
        summary: 'Produto criado',
        detail: null,
        createdAt: '2026-10-07T08:50:00.000Z',
        actor: 'Gustavo',
      },
    ],
    createdAt: '2026-10-07T08:50:00.000Z',
    updatedAt: '2026-10-07T09:10:00.000Z',
  },
]

/* ── Consultas ───────────────────────────────────────────── */

export type CatalogFilters = {
  q?: string
  status?: ProductStatus[]
  channel?: Marketplace
  channelStatus?: string[]
}

export async function listProducts(filters: CatalogFilters = {}): Promise<Product[]> {
  let result = [...products]

  const term = filters.q?.trim().toLowerCase()
  if (term) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        (p.brand ?? '').toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term)),
    )
  }

  if (filters.status?.length) {
    result = result.filter((p) => filters.status!.includes(p.status))
  }

  if (filters.channel && filters.channelStatus?.length) {
    result = result.filter((p) => {
      const v = p.versions.find((x) => x.marketplace === filters.channel)
      return v ? filters.channelStatus!.includes(v.status) : false
    })
  }

  return result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
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
    description: null,
    attributes: {},
    tags: [],
    status: 'draft',
    primaryImageId: null,
    images: [],
    versions: emptyVersions(),
    events: [
      {
        id: `${id}-e1`,
        kind: 'created',
        summary: 'Produto criado',
        detail: null,
        createdAt: now,
        actor: 'Gustavo',
      },
    ],
    createdAt: now,
    updatedAt: now,
  }
  products.unshift(product)
  return product
}

/* ── Visão de operação (§10) ─────────────────────────────── */

export type OperationSnapshot = {
  total: number
  byStatus: Record<ProductStatus, number>
  awaitingReview: number
  contentPending: number
  byChannel: Array<{
    marketplace: Marketplace
    published: number
    ready: number
    issues: number
    errors: number
    notConfigured: number
  }>
  recent: Array<{
    productId: string
    productName: string
    sku: string
    event: Product['events'][number]
  }>
}

export async function operationSnapshot(): Promise<OperationSnapshot> {
  const byStatus: Record<ProductStatus, number> = {
    draft: 0,
    incomplete: 0,
    in_review: 0,
    complete: 0,
  }
  for (const p of products) byStatus[p.status]++

  const byChannel = MARKETPLACES.map((marketplace) => {
    const versions = products
      .map((p) => p.versions.find((v) => v.marketplace === marketplace))
      .filter((v): v is MarketplaceVersion => !!v)
    return {
      marketplace,
      published: versions.filter((v) => v.status === 'published').length,
      ready: versions.filter((v) => v.status === 'ready').length,
      issues: versions.filter((v) => v.status === 'has_issues').length,
      errors: versions.filter((v) => v.status === 'error').length,
      notConfigured: versions.filter((v) => v.status === 'not_configured').length,
    }
  })

  const recent = products
    .flatMap((p) =>
      p.events.map((event) => ({
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        event,
      })),
    )
    .sort((a, b) => b.event.createdAt.localeCompare(a.event.createdAt))
    .slice(0, 8)

  return {
    total: products.length,
    byStatus,
    awaitingReview: products.filter((p) => p.status === 'in_review').length,
    contentPending: products.filter(
      (p) => p.description?.status === 'awaiting_approval' || !p.description,
    ).length,
    byChannel,
    recent,
  }
}
