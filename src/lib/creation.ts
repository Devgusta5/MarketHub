/**
 * Estado da Nova Criação — §7, §8, §9.
 *
 * Regras que o fluxo precisa respeitar:
 *
 * - A bolinha só nasce quando identidade E empresa forem confirmadas
 *   (passo 6). Antes disso é rascunho, sem presença na Home.
 * - São duas autorizações distintas: confirmar o que é o produto não
 *   autoriza gastar com IA (§7.1).
 * - Minimizar não cancela e não perde campo nenhum (§8).
 */
import {
  MATERIAL_LABELS,
  type Marketplace,
  type MaterialKind,
  type ProductionProfile,
} from './domain'

export type CreationStage =
  /** Entrada: foto, print, link ou nome. */
  | 'input'
  /** Análise simulada rodando. */
  | 'analyzing'
  /** Confirmação inteligente: identidade + empresa. */
  | 'confirm'
  /** Pacote: o que produzir e com que perfil. */
  | 'package'
  /** Produto cadastrado; bolinha já existe. */
  | 'done'

export type Creation = {
  open: boolean
  minimized: boolean
  stage: CreationStage
  /** Posição da miniatura arrastável, quando o usuário a moveu. */
  position: { x: number; y: number } | null

  // Entrada
  link: string
  fileName: string
  imageDataUrl: string | null

  // Identidade (passo 5)
  name: string
  sku: string
  clientId: string
  category: string
  marketplaces: Marketplace[]

  // Pacote (passo 7)
  profile: ProductionProfile
  selectedMaterials: MaterialKind[]
  withVideo: boolean

  /** Preenchido ao confirmar; é o que liga a janela ao produto criado. */
  productId: string | null
}

export const DEFAULT_MATERIALS: MaterialKind[] = ['cover', 'in_use', 'benefits']

export function emptyCreation(clientId: string): Creation {
  return {
    open: true,
    minimized: false,
    stage: 'input',
    position: null,
    link: '',
    fileName: '',
    imageDataUrl: null,
    name: '',
    sku: '',
    clientId,
    category: 'Produto cadastrado',
    marketplaces: ['mercado_livre', 'shopee'],
    profile: 'economic',
    selectedMaterials: DEFAULT_MATERIALS,
    withVideo: false,
    productId: null,
  }
}

/**
 * Nome provável a partir do que foi informado.
 *
 * O protótipo deixa claro (§7.2) que não identifica o objeto na foto:
 * de um link dá para extrair o slug, de um texto o próprio texto. O que
 * a IA real faria — reconhecer o produto — não acontece aqui, e a
 * interface precisa dizer isso.
 */
export function guessName(creation: Creation): string {
  const raw = creation.link.trim()
  if (!raw) return creation.fileName ? 'Produto a identificar' : 'Produto a identificar'
  if (!/^https?:\/\//i.test(raw)) return raw.slice(0, 90)
  try {
    const path = new URL(raw).pathname.split('/').filter(Boolean).pop() ?? ''
    const guess = decodeURIComponent(path).replace(/[-_]/g, ' ').trim()
    return guess.length >= 5 ? guess.slice(0, 90) : 'Produto a identificar'
  } catch {
    return 'Produto a identificar'
  }
}

/** Quais materiais o perfil sugere de saída (§9.1). */
export function suggestedMaterials(profile: ProductionProfile): MaterialKind[] {
  if (profile === 'register') return []
  if (profile === 'premium') {
    return ['cover', 'in_use', 'benefits', 'technical', 'measures', 'faq']
  }
  return DEFAULT_MATERIALS
}

/**
 * Como cada material seria produzido no perfil escolhido, e se isso
 * custa chamada paga (§9.2).
 *
 * O ponto do Modo Econômico: seis materiais finais não exigem seis
 * gerações. Capa se reaproveita, medidas e FAQ são template; só o que
 * precisa de cena nova vai para a IA.
 */
export function plannedMethod(
  kind: MaterialKind,
  profile: ProductionProfile,
): { method: string; paid: boolean; why: string } {
  if (profile === 'premium') {
    return { method: 'IA premium', paid: true, why: 'Perfil premium em todos os itens' }
  }
  switch (kind) {
    case 'cover':
      return {
        method: 'Reutilização',
        paid: false,
        why: 'Usa a foto original do produto',
      }
    case 'measures':
    case 'faq':
    case 'technical':
      return {
        method: 'Template',
        paid: false,
        why: 'Arte montada sobre dados verificados',
      }
    default:
      return {
        method: 'IA econômica',
        paid: true,
        why: 'Precisa de cena nova',
      }
  }
}

/** Resumo do que o pacote dispara de operação paga. */
export function packageSummary(creation: Creation) {
  const items = creation.selectedMaterials.map((kind) => ({
    kind,
    label: MATERIAL_LABELS[kind],
    ...plannedMethod(kind, creation.profile),
  }))
  const paid = items.filter((i) => i.paid).length
  return { items, paid, reused: items.length - paid }
}
