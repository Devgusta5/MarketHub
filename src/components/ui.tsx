import type { ProductStatus } from '@/lib/types'

export function StatusBadge({ status }: { status: ProductStatus }) {
  const ready = status === 'ready'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        ready
          ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400'
          : 'bg-amber-500/12 text-amber-700 dark:text-amber-400'
      }`}
    >
      {ready ? 'Pronto' : 'Rascunho'}
    </span>
  )
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-xl border border-border bg-surface p-5 ${className}`}
    >
      {children}
    </section>
  )
}

export function SectionTitle({
  children,
  hint,
}: {
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold tracking-tight">{children}</h2>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  )
}

export function Field({
  label,
  value,
  placeholder = '—',
}: {
  label: string
  value: string | null | undefined
  placeholder?: string
}) {
  const filled = Boolean(value && value.trim())
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`mt-0.5 text-sm ${filled ? '' : 'text-muted'}`}>
        {filled ? value : placeholder}
      </dd>
    </div>
  )
}

export function ImagePlaceholder({ label }: { label?: string | null }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background text-center text-[11px] text-muted">
      {label || 'Sem imagem'}
    </div>
  )
}
