/**
 * Componentes compartilhados — briefing §15.
 * Cada um define seus estados; nada de valores avulsos.
 */
import type { ComponentProps, ReactNode } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  Clock,
  Sparkles,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import {
  CHANNEL_STATUS_LABELS,
  CONTENT_STATUS_LABELS,
  PRODUCT_STATUS_LABELS,
  type ChannelStatus,
  type ContentStatus,
  type ProductStatus,
} from '@/lib/types'

/* ── Botão ───────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-contrast hover:bg-accent-hover disabled:hover:bg-accent',
  secondary:
    'border border-border bg-surface text-text-primary hover:bg-surface-sunken hover:border-border-strong',
  ghost: 'text-text-secondary hover:bg-surface-sunken hover:text-text-primary',
  danger: 'bg-danger text-white hover:opacity-90',
}

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-9 px-4 text-sm',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}: ComponentProps<'button'> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
      {...props}
    />
  )
}

export function ButtonLink({
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <Link
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
      {...props}
    />
  )
}

/* ── Superfícies ─────────────────────────────────────────── */

export function Card({
  children,
  className = '',
  padded = true,
  ...props
}: ComponentProps<'section'> & { padded?: boolean }) {
  return (
    <section
      className={`rounded-xl border border-border bg-surface shadow-card ${
        padded ? 'p-5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

export function SectionHeading({
  children,
  hint,
  action,
}: {
  children: ReactNode
  hint?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">{children}</h2>
        {hint ? <p className="mt-1 text-[13px] text-text-secondary">{hint}</p> : null}
      </div>
      {action}
    </div>
  )
}

/* ── Badges de estado (§13) ──────────────────────────────────
   Nunca apenas cor: cada badge tem ícone e texto. */

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent'

const TONES: Record<Tone, string> = {
  neutral: 'bg-surface-sunken text-text-secondary border-border',
  info: 'bg-info-surface text-info border-transparent',
  success: 'bg-success-surface text-success border-transparent',
  warning: 'bg-warning-surface text-warning border-transparent',
  danger: 'bg-danger-surface text-danger border-transparent',
  accent: 'bg-accent-surface text-accent-text border-transparent',
}

export function Badge({
  tone = 'neutral',
  icon: Icon,
  children,
  title,
}: {
  tone?: Tone
  icon?: LucideIcon
  children: ReactNode
  title?: string
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {Icon ? <Icon size={12} strokeWidth={2.25} aria-hidden /> : null}
      {children}
    </span>
  )
}

const PRODUCT_TONE: Record<ProductStatus, { tone: Tone; icon: LucideIcon }> = {
  draft: { tone: 'neutral', icon: CircleDashed },
  incomplete: { tone: 'warning', icon: AlertTriangle },
  in_review: { tone: 'info', icon: Clock },
  complete: { tone: 'success', icon: CheckCircle2 },
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const { tone, icon } = PRODUCT_TONE[status]
  return (
    <Badge tone={tone} icon={icon}>
      {PRODUCT_STATUS_LABELS[status]}
    </Badge>
  )
}

const CHANNEL_TONE: Record<ChannelStatus, { tone: Tone; icon: LucideIcon }> = {
  not_configured: { tone: 'neutral', icon: CircleDashed },
  has_issues: { tone: 'warning', icon: AlertTriangle },
  ready: { tone: 'info', icon: CircleDot },
  published: { tone: 'success', icon: CheckCircle2 },
  error: { tone: 'danger', icon: XCircle },
}

export function ChannelStatusBadge({ status }: { status: ChannelStatus }) {
  const { tone, icon } = CHANNEL_TONE[status]
  return (
    <Badge tone={tone} icon={icon}>
      {CHANNEL_STATUS_LABELS[status]}
    </Badge>
  )
}

const CONTENT_TONE: Record<ContentStatus, { tone: Tone; icon?: LucideIcon }> = {
  original: { tone: 'neutral' },
  ai_generated: { tone: 'accent', icon: Sparkles },
  edited: { tone: 'neutral' },
  awaiting_approval: { tone: 'warning', icon: Clock },
  approved: { tone: 'success', icon: CheckCircle2 },
}

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  const { tone, icon } = CONTENT_TONE[status]
  return (
    <Badge tone={tone} icon={icon}>
      {CONTENT_STATUS_LABELS[status]}
    </Badge>
  )
}

/* ── Campo rotulado ──────────────────────────────────────── */

export function Field({
  label,
  value,
  mono = false,
  empty = '—',
}: {
  label: string
  value: string | null | undefined
  mono?: boolean
  empty?: string
}) {
  const filled = Boolean(value && value.trim())
  return (
    <div>
      <dt className="text-xs text-text-secondary">{label}</dt>
      <dd
        className={`mt-1 text-sm ${mono ? 'font-mono text-[13px]' : ''} ${
          filled ? 'text-text-primary' : 'text-text-tertiary'
        }`}
      >
        {filled ? value : empty}
      </dd>
    </div>
  )
}

/* ── Estados de tela (§18) ───────────────────────────────── */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <Icon size={22} className="text-text-tertiary" aria-hidden />
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1.5 max-w-[46ch] text-[13px] leading-relaxed text-text-secondary">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-md ${className}`} aria-hidden />
}

/** Barra de completude — "8 de 10 informações essenciais" (§12). */
export function ProgressBar({
  value,
  total,
  tone = 'accent',
}: {
  value: number
  total: number
  tone?: 'accent' | 'success'
}) {
  const percent = total === 0 ? 0 : Math.round((value / total) * 100)
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${value} de ${total} informações essenciais`}
    >
      <div
        className="h-full rounded-full transition-[width] duration-200"
        style={{
          width: `${percent}%`,
          background: tone === 'success' ? 'var(--success)' : 'var(--accent)',
        }}
      />
    </div>
  )
}
