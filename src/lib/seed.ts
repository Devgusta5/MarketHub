/**
 * Dados de demonstração — os 24 produtos do protótipo v2.
 *
 * Nenhum dado real de empresa atendida. Os estados cobrem os casos que a
 * interface precisa mostrar: cadastrado, em produção, revisão, ajuste e
 * aprovado (§6.10, §15.2).
 */
import { artwork } from './artwork'
import {
  MARKETPLACES,
  MATERIAL_LABELS,
  type Client,
  type Marketplace,
  type Material,
  type MaterialKind,
  type Product,
  type ProductState,
} from './domain'

export const CLIENTS: Client[] = [
  {
    id: "cli-motorbrands",
    name: "Motorbrands"
  },
  {
    id: "cli-papelaria",
    name: "Papelaria"
  },
  {
    id: "cli-new-nutri",
    name: "New Nutri"
  },
  {
    id: "cli-day-calcados",
    name: "Day Calçados"
  },
  {
    id: "cli-thor-bikes",
    name: "Thor Bikes"
  },
  {
    id: "cli-rs-info",
    name: "RS Info"
  },
  {
    id: "cli-me-arames",
    name: "ME Arames"
  }
]

type Row = { name: string; client: string; sku: string; kind: string; category: string }

const ROWS: Row[] = [
  {
    name: "Canote Selim Alumínio 31,6 × 400 mm",
    client: "cli-motorbrands",
    sku: "CAN-316-400",
    kind: "seatpost",
    category: "Ciclismo"
  },
  {
    name: "Riva Block 42 Peças",
    client: "cli-papelaria",
    sku: "RIVA-042",
    kind: "blocks",
    category: "Brinquedos"
  },
  {
    name: "Vitamina C em Gotas 20 ml",
    client: "cli-new-nutri",
    sku: "VIT-C20",
    kind: "vitamin",
    category: "Suplementos"
  },
  {
    name: "Sandália Ramarim Preta",
    client: "cli-day-calcados",
    sku: "RAM-2555",
    kind: "sandal",
    category: "Moda"
  },
  {
    name: "Roda Livre 7 Velocidades",
    client: "cli-thor-bikes",
    sku: "RL-007",
    kind: "wheel",
    category: "Ciclismo"
  },
  {
    name: "Shampoo Automotivo AUTO90",
    client: "cli-motorbrands",
    sku: "AUTO-500",
    kind: "spray",
    category: "Automotivo"
  },
  {
    name: "Fone Bluetooth Wireless",
    client: "cli-rs-info",
    sku: "FONE-BT",
    kind: "headset",
    category: "Eletrônicos"
  },
  {
    name: "Caderno Universitário 10 Matérias",
    client: "cli-papelaria",
    sku: "CAD-010",
    kind: "notebook",
    category: "Papelaria"
  },
  {
    name: "Complexo B 300",
    client: "cli-new-nutri",
    sku: "COMP-B",
    kind: "bottle",
    category: "Suplementos"
  },
  {
    name: "Bicicleta Urbana Aro 26",
    client: "cli-thor-bikes",
    sku: "BIKE-026",
    kind: "bike",
    category: "Ciclismo"
  },
  {
    name: "Capacitor WEG 25 µF",
    client: "cli-me-arames",
    sku: "CAP-025",
    kind: "capacitor",
    category: "Industrial"
  },
  {
    name: "Tênis Casual Feminino",
    client: "cli-day-calcados",
    sku: "TEN-021",
    kind: "shoe",
    category: "Moda"
  },
  {
    name: "Caminhão Brinquedo Infantil",
    client: "cli-papelaria",
    sku: "TOY-814",
    kind: "toys",
    category: "Brinquedos"
  },
  {
    name: "Supercafé 220 g",
    client: "cli-new-nutri",
    sku: "CAF-220",
    kind: "coffee",
    category: "Alimentos"
  },
  {
    name: "Cabo Silicone 1,5 mm²",
    client: "cli-me-arames",
    sku: "CAB-150",
    kind: "cable",
    category: "Industrial"
  },
  {
    name: "Capacete Ciclismo Preto",
    client: "cli-thor-bikes",
    sku: "CAP-HEL",
    kind: "helmet",
    category: "Ciclismo"
  },
  {
    name: "Bolsa Organizadora Preta",
    client: "cli-rs-info",
    sku: "BAG-021",
    kind: "bag",
    category: "Acessórios"
  },
  {
    name: "Creme Hidratante Corporal",
    client: "cli-new-nutri",
    sku: "CRE-210",
    kind: "cream",
    category: "Cosméticos"
  },
  {
    name: "Selim Big Beach Elleven",
    client: "cli-thor-bikes",
    sku: "SEL-ELV",
    kind: "saddle",
    category: "Ciclismo"
  },
  {
    name: "Carregador USB-C 20W",
    client: "cli-rs-info",
    sku: "USB-020",
    kind: "charger",
    category: "Eletrônicos"
  },
  {
    name: "Aros de Inox Quadrados",
    client: "cli-papelaria",
    sku: "ARO-003",
    kind: "ring",
    category: "Cozinha"
  },
  {
    name: "Carrinho Fast Racer",
    client: "cli-papelaria",
    sku: "BR-2084",
    kind: "toycar",
    category: "Brinquedos"
  },
  {
    name: "Lava a Seco Automotivo 5 L",
    client: "cli-motorbrands",
    sku: "LAVA-05",
    kind: "bottle2",
    category: "Automotivo"
  },
  {
    name: "Pedal MTB Alumínio",
    client: "cli-thor-bikes",
    sku: "PED-MTB",
    kind: "pedal",
    category: "Ciclismo"
  }
]

const MATERIAL_KINDS: MaterialKind[] = [
  'cover',
  'in_use',
  'benefits',
  'technical',
  'measures',
  'faq',
]

/**
 * Posição na malha hexagonal — espiral a partir do centro (§6.2).
 * Estável: produto novo recebe a próxima célula livre, sem embaralhar
 * as bolinhas que já existem.
 */
export function spiralCells(count: number): Array<{ q: number; r: number }> {
  const out = [{ q: 0, r: 0 }]
  const moves = [
    [1, 0],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [0, -1],
    [1, -1],
  ]
  for (let radius = 1; out.length < count; radius++) {
    let q = 0
    let r = -radius
    for (const [dq, dr] of moves) {
      for (let k = 0; k < radius; k++) {
        if (out.length < count) out.push({ q, r })
        q += dq
        r += dr
      }
    }
  }
  return out.slice(0, count)
}

/** Converte célula hexagonal em pixels. */
export function cellToPoint(cell: { q: number; r: number }) {
  return { x: 118 * (cell.q + cell.r / 2), y: 102 * cell.r }
}

const STATES: ProductState[] = ['approved', 'review', 'producing', 'approved', 'adjust']

/**
 * Datas fixas, não Date.now().
 *
 * Com relógio, o HTML do servidor difere do primeiro render do cliente e
 * a hidratação quebra. Fixo também deixa a demonstração reproduzível.
 */
const EPOCH = Date.UTC(2026, 9, 8, 12, 0, 0)

function madeAt(offsetIndex: number): string {
  return new Date(EPOCH - offsetIndex * 1_800_000).toISOString()
}

function buildMaterials(index: number): Material[] {
  return MATERIAL_KINDS.map((kind, j) => {
    const creative = j < 2 ? 'approved' : j === 4 ? 'adjust' : 'review'
    const method = j === 0 ? 'reuse' : j === 2 ? 'template' : 'ai_economic'
    const id = `mat-${index}-${j}`
    const versionId = `${id}-v1`
    // Liberação por canal é decisão separada da aprovação criativa (§15.1):
    // material aprovado nem sempre está liberado em todo canal.
    const release: Material['release'] = {}
    if (creative === 'approved') {
      release.mercado_livre = j === 0 ? 'ready' : 'pending'
      release.shopee = j === 0 ? 'ready' : 'not_evaluated'
    }
    return {
      id,
      kind,
      label: MATERIAL_LABELS[kind],
      method,
      creative,
      release,
      activeVersionId: versionId,
      versions: [
        {
          id: versionId,
          parentId: null,
          version: 1,
          createdAt: madeAt(index),
          method,
        },
      ],
    }
  })
}

function marketsFor(index: number): Marketplace[] {
  if (index % 3 === 0) return [...MARKETPLACES]
  if (index % 3 === 1) return ['mercado_livre', 'shopee']
  return ['mercado_livre', 'amazon']
}

export function seedProducts(): Product[] {
  const cells = spiralCells(ROWS.length)
  return ROWS.map((row, i) => ({
    id: `prod-${i}`,
    clientId: row.client,
    name: row.name,
    sku: row.sku,
    category: row.category,
    artworkKind: row.kind,
    imageUrl: artwork(row.kind),
    state: STATES[i % STATES.length],
    marketplaces: marketsFor(i),
    materials: buildMaterials(i),
    content: {},
    attributes: {},
    video: i % 4 === 0 ? 'review' : 'none',
    createdAt: madeAt(i),
    cell: cells[i],
  }))
}

export function clientName(id: string): string {
  return CLIENTS.find((c) => c.id === id)?.name ?? id
}
