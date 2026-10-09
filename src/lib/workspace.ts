/**
 * Estado do Workspace — §13.
 *
 * Abas inteligentes: abrir um produto que já está aberto foca a aba
 * existente em vez de duplicar. Fechar aba não apaga o produto nem
 * cancela tarefas.
 */
import type { Marketplace } from './domain'

export const WS_SECTIONS = [
  'overview',
  'images',
  'video',
  'content',
  'fiscal',
  'review',
  'history',
] as const
export type WsSection = (typeof WS_SECTIONS)[number]

export const WS_SECTION_LABELS: Record<WsSection, string> = {
  overview: 'Visão geral',
  images: 'Imagens',
  video: 'Vídeos',
  content: 'Conteúdo',
  fiscal: 'Dados fiscais',
  review: 'Revisão',
  history: 'Histórico',
}

export const WS_SECTION_ICONS: Record<WsSection, string> = {
  overview: 'home',
  images: 'image',
  video: 'video',
  content: 'document',
  fiscal: 'receipt',
  review: 'check',
  history: 'clock',
}

/** §13.2: duas perspectivas sobre os mesmos arquivos, sem duplicar nada. */
export type Perspective = 'material' | 'marketplace'

/**
 * Estado de uma aba. O §13.1 pede preservar seção, filtros e seleção
 * por aba — então isso vive aqui, não num estado global.
 */
export type Tab = {
  productId: string
  section: WsSection
  perspective: Perspective
  /** Canal em foco quando a perspectiva é por marketplace. */
  channel: Marketplace
  /** Materiais marcados para ação em lote (§15.3). */
  selected: string[]
}

export function newTab(productId: string, section: WsSection = 'overview'): Tab {
  return {
    productId,
    section,
    perspective: 'material',
    channel: 'mercado_livre',
    selected: [],
  }
}

/** Abre ou foca — nunca duplica (§13.1). */
export function openTab(
  tabs: Tab[],
  productId: string,
  section?: WsSection,
): { tabs: Tab[]; activeId: string } {
  const existing = tabs.find((t) => t.productId === productId)
  if (existing) {
    return {
      tabs: section
        ? tabs.map((t) => (t.productId === productId ? { ...t, section } : t))
        : tabs,
      activeId: productId,
    }
  }
  return { tabs: [...tabs, newTab(productId, section)], activeId: productId }
}

/** Fechar aba não apaga produto nem cancela tarefa (§13.1). */
export function closeTab(
  tabs: Tab[],
  productId: string,
  activeId: string | null,
): { tabs: Tab[]; activeId: string | null } {
  const index = tabs.findIndex((t) => t.productId === productId)
  const next = tabs.filter((t) => t.productId !== productId)
  if (activeId !== productId) return { tabs: next, activeId }
  if (next.length === 0) return { tabs: next, activeId: null }
  // Foca a aba vizinha, preferindo a anterior.
  const neighbour = next[Math.max(0, index - 1)]
  return { tabs: next, activeId: neighbour.productId }
}
