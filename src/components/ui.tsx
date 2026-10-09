/**
 * Design system do markethub.
 * Portado do protótipo v2; §5.2 e §15 do documento mestre.
 */
'use client'

import type { ComponentProps, ReactNode } from 'react'
import {
  CREATIVE_STATE_LABELS,
  CHANNEL_RELEASE_LABELS,
  CONFIDENCE_LABELS,
  PRODUCT_STATE_LABELS,
  type ChannelReleaseState,
  type Confidence,
  type CreativeState,
  type ProductState,
} from '@/lib/domain'

/* ── Botão ───────────────────────────────────────────────── */

type Variant = 'primary' | 'soft' | 'outline' | 'ghost'

const BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 font-semibold whitespace-nowrap transition-[transform,background,opacity] duration-150 active:scale-[.96] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100'

const VARIANTS: Record<Variant, string> = {
  primary: 'text-white hover:-translate-y-px disabled:hover:translate-y-0',
  soft: 'bg-soft text-text hover:-translate-y-px disabled:hover:translate-y-0',
  outline: 'border border-line text-text hover:bg-soft',
  ghost: 'text-sub hover:bg-soft hover:text-text',
}

export function Button({
  variant = 'soft',
  small = false,
  full = false,
  className = '',
  style,
  ...props
}: ComponentProps<'button'> & { variant?: Variant; small?: boolean; full?: boolean }) {
  return (
    <button
      className={`${BTN} ${VARIANTS[variant]} ${
        small ? 'min-h-8 px-3 text-xs' : 'min-h-[39px] text-sm'
      } ${full ? 'w-full' : ''} ${className}`}
      style={
        variant === 'primary'
          ? {
              background: 'var(--accent-gradient)',
              boxShadow: '0 5px 16px rgba(255,106,0,.18)',
              ...style,
            }
          : style
      }
      {...props}
    />
  )
}

export function IconButton({
  label,
  className = '',
  ...props
}: ComponentProps<'button'> & { label: string }) {
  return (
    <button
      title={label}
      aria-label={label}
      className={`inline-flex size-9 items-center justify-center rounded-xl text-sub transition-colors hover:bg-soft hover:text-text ${className}`}
      {...props}
    />
  )
}

/* ── Chip ────────────────────────────────────────────────── */

type Tone = 'neutral' | 'orange' | 'green' | 'amber' | 'red'

const TONES: Record<Tone, string> = {
  neutral: 'bg-soft text-sub',
  orange: 'text-[var(--orange)]',
  green: 'text-[var(--ok)]',
  amber: 'text-[var(--warn)]',
  red: 'text-[var(--bad)]',
}

const TONE_BG: Record<Tone, string | undefined> = {
  neutral: undefined,
  orange: 'var(--orange-light)',
  green: 'var(--ok-soft)',
  amber: 'var(--warn-soft)',
  red: 'var(--bad-soft)',
}

export function Chip({
  tone = 'neutral',
  children,
  title,
}: {
  tone?: Tone
  children: ReactNode
  title?: string
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${TONES[tone]}`}
      style={{ background: TONE_BG[tone] }}
    >
      {children}
    </span>
  )
}

/* ── Estados (§15.2) ─────────────────────────────────────── */

const PRODUCT_TONE: Record<ProductState, Tone> = {
  draft: 'neutral',
  analyzing: 'orange',
  awaiting_identity: 'amber',
  registered: 'neutral',
  producing: 'orange',
  review: 'amber',
  adjust: 'red',
  approved: 'green',
}

export function ProductStateChip({ state }: { state: ProductState }) {
  return <Chip tone={PRODUCT_TONE[state]}>{PRODUCT_STATE_LABELS[state]}</Chip>
}

const CREATIVE_TONE: Record<CreativeState, Tone> = {
  generating: 'orange',
  review: 'amber',
  approved: 'green',
  adjust: 'red',
  error: 'red',
}

/** Eixo 1: qualidade do material. */
export function CreativeChip({ state }: { state: CreativeState }) {
  return <Chip tone={CREATIVE_TONE[state]}>{CREATIVE_STATE_LABELS[state]}</Chip>
}

const RELEASE_TONE: Record<ChannelReleaseState, Tone> = {
  not_evaluated: 'neutral',
  pending: 'amber',
  ready: 'green',
  needs_adaptation: 'amber',
  blocked: 'red',
}

/** Eixo 2: liberação para um canal. Diferente da aprovação criativa. */
export function ReleaseChip({ state }: { state: ChannelReleaseState }) {
  return <Chip tone={RELEASE_TONE[state]}>{CHANNEL_RELEASE_LABELS[state]}</Chip>
}

const CONFIDENCE_TONE: Record<Confidence, Tone> = {
  confirmed: 'green',
  sourced: 'green',
  probable: 'amber',
  needs_check: 'red',
}

/** §7.2: nunca apresentar inferência da IA como fato. */
export function ConfidenceChip({ level }: { level: Confidence }) {
  return <Chip tone={CONFIDENCE_TONE[level]}>{CONFIDENCE_LABELS[level]}</Chip>
}

/* ── Superfícies ─────────────────────────────────────────── */

export function Panel({
  children,
  className = '',
  padded = true,
  ...props
}: ComponentProps<'section'> & { padded?: boolean }) {
  return (
    <section
      className={`overflow-hidden rounded-[19px] border border-line bg-solid ${
        padded ? 'p-5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

export function Kpi({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="rounded-2xl bg-soft p-4">
      <strong className="block text-[22px] tracking-[-.04em]">{value}</strong>
      <span className="text-[11px] text-sub">{label}</span>
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>
}

export function SectionHead({
  title,
  hint,
  action,
}: {
  title: string
  hint?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-[17px] tracking-[-.025em]">{title}</h3>
        {hint ? <p className="mt-1 text-xs leading-relaxed text-sub">{hint}</p> : null}
      </div>
      {action}
    </div>
  )
}

/** Caixa de aviso em laranja — usada para alertas de demonstração. */
export function Hint({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-xl p-3 text-xs leading-relaxed text-text"
      style={{ background: 'var(--orange-light)' }}
    >
      {children}
    </div>
  )
}

/** "3 de 6 prontas" — §12.3 prefere contagem real a porcentagem inventada. */
export function Progress({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div
      className="h-1.5 overflow-hidden rounded-full bg-soft"
      role="progressbar"
      aria-valuenow={done}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`${done} de ${total}`}
    >
      <div
        className="h-full rounded-full transition-[width] duration-300"
        style={{ width: `${pct}%`, background: 'var(--orange)' }}
      />
    </div>
  )
}

/* ── Formulário ──────────────────────────────────────────── */

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="mb-3 flex flex-col gap-[7px]">
      <span className="text-xs font-semibold text-sub">{label}</span>
      {children}
      {hint ? <span className="text-[11px] text-sub">{hint}</span> : null}
    </label>
  )
}

const CONTROL =
  'w-full rounded-xl border border-line bg-soft px-3 py-3 text-text outline-none transition-colors focus:border-[rgba(255,106,0,.5)]'

export function Input(props: ComponentProps<'input'>) {
  return <input className={`${CONTROL} min-h-[41px]`} {...props} />
}

export function Textarea(props: ComponentProps<'textarea'>) {
  return <textarea className={`${CONTROL} min-h-24 resize-y leading-relaxed`} {...props} />
}

export function Select(props: ComponentProps<'select'>) {
  return <select className={`${CONTROL} min-h-[41px]`} {...props} />
}

/** Alternância de visão: Galeria/Lista, Por material/Por marketplace. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex gap-[3px] rounded-xl border border-line bg-soft p-[3px]">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={`rounded-lg px-3 py-[7px] text-[11px] transition-colors ${
              active ? 'bg-solid font-bold text-text shadow-soft' : 'text-sub hover:text-text'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
