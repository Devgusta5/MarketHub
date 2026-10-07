/**
 * Vocabulário do mundo DESPACHO.
 *
 * Painel de partidas (catálogo) e cartão de embarque segmentado (ficha)
 * compartilham os mesmos elementos em duas escalas.
 */
import type { Marketplace, Product, ProductStatus } from '@/lib/types'
import { MARKETPLACE_LABELS } from '@/lib/types'

/** Sigla de 3 letras, como código de aeroporto. */
export const CHANNEL_CODE: Record<Marketplace, string> = {
  mercado_livre: 'MEL',
  shopee: 'SHP',
  amazon: 'AMZ',
}

/** Tinta própria e constante por canal, em todo o sistema. */
export const CHANNEL_INK: Record<Marketplace, string> = {
  mercado_livre: 'var(--ml)',
  shopee: 'var(--shopee)',
  amazon: 'var(--amazon)',
}

export type ChannelState = 'adapted' | 'inherited' | 'empty'

export function channelState(product: Product, marketplace: Marketplace): ChannelState {
  const version = product.versions.find((v) => v.marketplace === marketplace)
  if (version?.title?.trim() || version?.description?.trim()) return 'adapted'
  // Herdando só faz sentido quando existe base para herdar.
  if (product.name.trim() && product.baseDescription?.trim()) return 'inherited'
  return 'empty'
}

const STATE_TITLE: Record<ChannelState, string> = {
  adapted: 'Adaptado',
  inherited: 'Herdando do produto base',
  empty: 'Sem conteúdo base',
}

/**
 * A fita de canais — a interação-assinatura.
 *
 * Preenchido = adaptado · contornado = herdando · vazado = sem base.
 * Forma + rótulo, nunca só cor.
 */
export function ChannelTape({
  product,
  size = 'sm',
}: {
  product: Product
  size?: 'sm' | 'lg'
}) {
  const large = size === 'lg'
  return (
    <div className="flex items-center" style={{ gap: large ? 6 : 4 }}>
      {(Object.keys(CHANNEL_CODE) as Marketplace[]).map((marketplace) => {
        const state = channelState(product, marketplace)
        const ink = CHANNEL_INK[marketplace]
        return (
          <span
            key={marketplace}
            title={`${MARKETPLACE_LABELS[marketplace]} — ${STATE_TITLE[state]}`}
            className="font-mono inline-flex items-center justify-center border transition-colors"
            style={{
              width: large ? 46 : 34,
              height: large ? 22 : 17,
              fontSize: large ? 11 : 9,
              letterSpacing: '0.08em',
              borderColor: state === 'empty' ? 'var(--rule-strong)' : ink,
              background: state === 'adapted' ? ink : 'transparent',
              color:
                state === 'adapted'
                  ? '#0b0d11'
                  : state === 'inherited'
                    ? ink
                    : 'var(--ink-faint)',
              borderStyle: state === 'inherited' ? 'dashed' : 'solid',
              fontWeight: state === 'adapted' ? 600 : 400,
            }}
          >
            {CHANNEL_CODE[marketplace]}
          </span>
        )
      })}
    </div>
  )
}

/** Legenda da fita — a tela explica o próprio vocabulário. */
export function ChannelLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {(
        [
          ['adapted', 'adaptado'],
          ['inherited', 'herdando'],
          ['empty', 'sem base'],
        ] as const
      ).map(([state, text]) => (
        <span key={state} className="flex items-center gap-2">
          <span
            className="inline-block"
            style={{
              width: 18,
              height: 10,
              border: `1px ${state === 'inherited' ? 'dashed' : 'solid'} ${
                state === 'empty' ? 'var(--rule-strong)' : 'var(--ink-dim)'
              }`,
              background: state === 'adapted' ? 'var(--ink-dim)' : 'transparent',
            }}
          />
          <span className="label">{text}</span>
        </span>
      ))}
    </div>
  )
}

/** Estado de preparo do produto, em caixa alta como no painel. */
export function StatusCell({
  status,
  pending,
}: {
  status: ProductStatus
  pending: string | null
}) {
  if (pending) {
    return (
      <span
        className="font-mono"
        style={{ fontSize: 11, color: 'var(--alert)', letterSpacing: '0.08em' }}
      >
        {pending.toUpperCase()}
      </span>
    )
  }
  const ready = status === 'ready'
  return (
    <span
      className="font-mono"
      style={{
        fontSize: 11,
        letterSpacing: '0.08em',
        color: ready ? 'var(--ready)' : 'var(--ink-dim)',
      }}
    >
      {ready ? 'PRONTO' : 'RASCUNHO'}
    </span>
  )
}

/**
 * O que falta para este produto estar pronto. Null = nada falta.
 * É o que acende a linha no painel.
 */
export function pendingReason(product: Product): string | null {
  if (product.images.length === 0) return 'sem foto'
  if (!product.baseDescription?.trim()) return 'sem descrição'
  const missing = product.versions.filter(
    (v) => !v.title?.trim() && !v.description?.trim(),
  ).length
  if (missing === 3) return 'sem canal'
  return null
}

/** Segmento rotulado do cartão de embarque. */
export function Segment({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`px-4 py-3 ${className}`}>
      <div className="label">{label}</div>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

/** Valor de dado dentro de um segmento. */
export function Value({
  children,
  mono = false,
  dim = false,
  size = 15,
}: {
  children: React.ReactNode
  mono?: boolean
  dim?: boolean
  size?: number
}) {
  return (
    <div
      className={mono ? 'font-mono' : ''}
      style={{
        fontSize: mono ? size - 2 : size,
        lineHeight: 1.35,
        color: dim ? 'var(--ink-faint)' : 'var(--ink)',
        letterSpacing: mono ? '0.02em' : undefined,
      }}
    >
      {children}
    </div>
  )
}
