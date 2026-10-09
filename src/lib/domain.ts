/**
 * Domínio do markethub.
 *
 * Hierarquia (documento mestre §1.1, §19):
 *   Ecommerce+ (a organização, implícita) → cliente → produto → materiais/canais
 *
 * No código a entidade atendida é `client`, como o mestre usa em todo lugar.
 * Na interface ela aparece como "empresa", que é o termo da operação —
 * os rótulos ficam em `labels.ts` para trocar num lugar só.
 */

export const MARKETPLACES = ['mercado_livre', 'shopee', 'amazon'] as const
export type Marketplace = (typeof MARKETPLACES)[number]

export const MARKETPLACE_LABELS: Record<Marketplace, string> = {
  mercado_livre: 'Mercado Livre',
  shopee: 'Shopee',
  amazon: 'Amazon',
}

/* ── Estado do produto (§38.1) ───────────────────────────── */

export const PRODUCT_STATES = [
  'draft',
  'analyzing',
  'awaiting_identity',
  'registered',
  'producing',
  'review',
  'adjust',
  'approved',
] as const
export type ProductState = (typeof PRODUCT_STATES)[number]

export const PRODUCT_STATE_LABELS: Record<ProductState, string> = {
  draft: 'Rascunho',
  analyzing: 'Analisando',
  awaiting_identity: 'Aguardando confirmação',
  registered: 'Cadastrado',
  producing: 'Em produção',
  review: 'Em revisão',
  adjust: 'Precisa de ajuste',
  approved: 'Aprovado',
}

/* ── Aprovação em dois eixos (§15.1) ──────────────────────
   Criativa (qualidade do material) e liberação por canal são
   decisões diferentes. Uma imagem pode estar aprovada e ainda
   não liberada para a Shopee. */

export const CREATIVE_STATES = ['generating', 'review', 'approved', 'adjust', 'error'] as const
export type CreativeState = (typeof CREATIVE_STATES)[number]

export const CREATIVE_STATE_LABELS: Record<CreativeState, string> = {
  generating: 'Gerando',
  review: 'Em revisão',
  approved: 'Aprovado',
  adjust: 'Precisa de ajuste',
  error: 'Erro',
}

export const CHANNEL_RELEASE_STATES = [
  'not_evaluated',
  'pending',
  'ready',
  'needs_adaptation',
  'blocked',
] as const
export type ChannelReleaseState = (typeof CHANNEL_RELEASE_STATES)[number]

export const CHANNEL_RELEASE_LABELS: Record<ChannelReleaseState, string> = {
  not_evaluated: 'Não avaliado',
  pending: 'Pendente',
  ready: 'Pronto',
  needs_adaptation: 'Necessita adaptação',
  blocked: 'Bloqueado',
}

/* ── Confiabilidade de dado (§7.2) ────────────────────────
   O mestre exige distinguir o que foi confirmado do que a IA
   apenas inferiu. Nunca alimentar alegação técnica ou fiscal
   com dado de baixa confiança sem revisão. */

export const CONFIDENCE_LEVELS = ['confirmed', 'sourced', 'probable', 'needs_check'] as const
export type Confidence = (typeof CONFIDENCE_LEVELS)[number]

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  confirmed: 'Confirmado',
  sourced: 'Fonte identificada',
  probable: 'Provável',
  needs_check: 'Precisa conferir',
}

export type DataOrigin =
  | 'user'
  | 'extracted'
  | 'official_source'
  | 'ai_inference'
  | 'empty'

export const ORIGIN_LABELS: Record<DataOrigin, string> = {
  user: 'Informado pelo usuário',
  extracted: 'Extraído de print ou anúncio',
  official_source: 'Fonte oficial verificada',
  ai_inference: 'Inferência da IA',
  empty: 'Não informado',
}

/** Valor com proveniência — §7.2 e §40.1. */
export type TrackedValue<T = string> = {
  value: T
  confidence: Confidence
  origin: DataOrigin
  /** URL da fonte, quando houver. */
  sourceUrl?: string
  checkedAt?: string
}

/* ── Perfis de produção (§9.1, §26.1) ─────────────────────── */

export const PRODUCTION_PROFILES = ['register', 'economic', 'premium'] as const
export type ProductionProfile = (typeof PRODUCTION_PROFILES)[number]

export const PROFILE_LABELS: Record<ProductionProfile, string> = {
  register: 'Apenas cadastrar',
  economic: 'Econômico',
  premium: 'Premium',
}

export const PROFILE_HINTS: Record<ProductionProfile, string> = {
  register: 'Organiza o catálogo sem gerar arquivos pagos.',
  economic: 'Reutiliza fotos e templates; gera só o necessário.',
  premium: 'Modelos avançados, com estimativa e confirmação.',
}

/** Como um material foi produzido (§9.2). */
export const PRODUCTION_METHODS = ['reuse', 'template', 'ai_economic', 'ai_premium'] as const
export type ProductionMethod = (typeof PRODUCTION_METHODS)[number]

export const METHOD_LABELS: Record<ProductionMethod, string> = {
  reuse: 'Reutilizada',
  template: 'Template',
  ai_economic: 'IA econômica',
  ai_premium: 'IA premium',
}

/** Só estes custam chamada paga — o resto é infraestrutura (§9.2). */
export function isPaidMethod(method: ProductionMethod): boolean {
  return method === 'ai_economic' || method === 'ai_premium'
}

/* ── Tarefas (§12.1, §38.2) ───────────────────────────────── */

export const JOB_STATES = [
  'draft',
  'awaiting_authorization',
  'queued',
  'reserved',
  'processing',
  'partial',
  'done',
  'error',
  'cancelled',
  'awaiting_budget',
  'awaiting_premium_reconfirm',
] as const
export type JobState = (typeof JOB_STATES)[number]

export const JOB_STATE_LABELS: Record<JobState, string> = {
  draft: 'Rascunho',
  awaiting_authorization: 'Aguardando autorização',
  queued: 'Na fila',
  reserved: 'Reservada',
  processing: 'Processando',
  partial: 'Parcialmente concluída',
  done: 'Concluída',
  error: 'Erro',
  cancelled: 'Cancelada',
  awaiting_budget: 'Aguardando orçamento',
  awaiting_premium_reconfirm: 'Aguardando reconfirmação',
}

export type JobPriority = 'urgent' | 'normal' | 'low'

/* ── Entidades ───────────────────────────────────────────── */

export type Client = {
  id: string
  name: string
}

export type MaterialKind =
  | 'cover'
  | 'in_use'
  | 'benefits'
  | 'technical'
  | 'measures'
  | 'faq'

export const MATERIAL_LABELS: Record<MaterialKind, string> = {
  cover: 'Capa profissional',
  in_use: 'Produto em uso',
  benefits: 'Benefícios',
  technical: 'Detalhes técnicos',
  measures: 'Medidas',
  faq: 'Perguntas frequentes',
}

/** Versão de material. Imutável depois de concluída (§14.3, §40). */
export type MaterialVersion = {
  id: string
  /** null = é a original. */
  parentId: string | null
  version: number
  createdAt: string
  method: ProductionMethod
  /** Comando ou instrução que a gerou, quando houver. */
  prompt?: string
  model?: string
}

export type Material = {
  id: string
  kind: MaterialKind
  label: string
  method: ProductionMethod
  /** Aprovação criativa — eixo 1 (§15.1). */
  creative: CreativeState
  /** Liberação por canal — eixo 2. Ausente = não avaliado. */
  release: Partial<Record<Marketplace, ChannelReleaseState>>
  versions: MaterialVersion[]
  activeVersionId: string
}

export type ChannelContent = {
  marketplace: Marketplace
  title: string
  description: string
  keywords: string[]
  updatedAt: string | null
}

export type Product = {
  id: string
  clientId: string
  name: string
  sku: string
  category: string
  /** Chave do desenho de demonstração; vira URL de foto real depois. */
  artworkKind: string
  imageUrl: string | null
  state: ProductState
  marketplaces: Marketplace[]
  materials: Material[]
  content: Partial<Record<Marketplace, ChannelContent>>
  /** Atributos com proveniência (§7.2). */
  attributes: Record<string, TrackedValue>
  video: 'none' | 'storyboard' | 'review' | 'done'
  createdAt: string
  /** Posição na malha espacial; estável para não embaralhar (§6.2). */
  cell: { q: number; r: number }
}

export type Job = {
  id: string
  name: string
  productId: string | null
  kind: 'analysis' | 'generation' | 'video' | 'export'
  state: JobState
  priority: JobPriority
  /** "3 de 6 prontas" é melhor que porcentagem inventada (§12.3). */
  done: number
  total: number
  createdAt: string
  /** Em centavos de real. Estimativa, não cobrança (§27.2). */
  estimatedCost: number
  error?: string
}

/* ── Leitura ─────────────────────────────────────────────── */

export function approvedMaterials(product: Product): Material[] {
  return product.materials.filter((m) => m.creative === 'approved')
}

/** Só o que está aprovado E liberado pode ser exportado (§17). */
export function releasedFor(product: Product, marketplace: Marketplace): Material[] {
  return product.materials.filter(
    (m) => m.creative === 'approved' && m.release[marketplace] === 'ready',
  )
}

export function pendingFor(product: Product, marketplace: Marketplace): Material[] {
  return product.materials.filter(
    (m) => m.creative !== 'approved' || m.release[marketplace] !== 'ready',
  )
}

export function activeVersion(material: Material): MaterialVersion | undefined {
  return material.versions.find((v) => v.id === material.activeVersionId)
}
