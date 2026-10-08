import { Suspense } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, XCircle } from 'lucide-react'
import { listProducts, operationSnapshot } from '@/lib/store'
import {
  MARKETPLACES,
  MARKETPLACE_LABELS,
  version,
  type Marketplace,
} from '@/lib/types'
import { PageHeader } from '@/components/shell'
import {
  Card,
  ChannelStatusBadge,
  ProgressBar,
  SectionHeading,
  Skeleton,
} from '@/components/ui'

export const metadata = { title: 'Marketplaces' }

export default function MarketplacesPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="Marketplaces"
        description="O estado de cada canal e o que impede a publicação."
      />
      <Suspense fallback={<Skeleton className="h-96" />}>
        <Channels />
      </Suspense>
    </div>
  )
}

async function Channels() {
  const [snapshot, products] = await Promise.all([operationSnapshot(), listProducts()])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {snapshot.byChannel.map((channel) => (
          <Card key={channel.marketplace}>
            <h2 className="text-sm font-semibold tracking-tight">
              {MARKETPLACE_LABELS[channel.marketplace]}
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              {channel.published} de {snapshot.total} publicados
            </p>
            <div className="mt-3">
              <ProgressBar
                value={channel.published}
                total={snapshot.total}
                tone="success"
              />
            </div>
            <dl className="mt-4 space-y-1.5">
              <Line label="Publicados" value={channel.published} />
              <Line label="Prontos" value={channel.ready} />
              <Line label="Com pendências" value={channel.issues} tone="warning" />
              <Line label="Com erro" value={channel.errors} tone="danger" />
              <Line label="Não configurados" value={channel.notConfigured} />
            </dl>
          </Card>
        ))}
      </div>

      {MARKETPLACES.map((marketplace) => (
        <ChannelDetail key={marketplace} marketplace={marketplace} products={products} />
      ))}
    </div>
  )
}

function Line({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: 'warning' | 'danger'
}) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-[13px] text-text-secondary">{label}</dt>
      <dd
        className={`text-[13px] tabular-nums ${
          value === 0
            ? 'text-text-tertiary'
            : tone === 'danger'
              ? 'text-danger'
              : tone === 'warning'
                ? 'text-warning'
                : ''
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

function ChannelDetail({
  marketplace,
  products,
}: {
  marketplace: Marketplace
  products: Awaited<ReturnType<typeof listProducts>>
}) {
  // Só o que exige ação aparece aqui: erro ou pendência.
  const blocked = products
    .map((product) => ({ product, v: version(product, marketplace) }))
    .filter(
      (x): x is { product: (typeof products)[number]; v: NonNullable<typeof x.v> } =>
        !!x.v && (x.v.status === 'error' || x.v.status === 'has_issues'),
    )

  if (blocked.length === 0) return null

  return (
    <Card>
      <SectionHeading hint="Produtos que não podem ser publicados neste canal.">
        {MARKETPLACE_LABELS[marketplace]} — precisa de atenção
      </SectionHeading>
      <ul className="divide-y divide-border">
        {blocked.map(({ product, v }) => (
          <li key={product.id}>
            <Link
              href={`/produtos/${product.id}#channel-${marketplace}`}
              className="-mx-2 flex items-start gap-3 rounded-md px-2 py-3 transition-colors hover:bg-surface-sunken"
            >
              {v.status === 'error' ? (
                <XCircle size={14} className="mt-0.5 shrink-0 text-danger" aria-hidden />
              ) : (
                <AlertTriangle
                  size={14}
                  className="mt-0.5 shrink-0 text-warning"
                  aria-hidden
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-[13px] font-medium">{product.name}</span>
                  <ChannelStatusBadge status={v.status} />
                </div>
                <p className="mt-1 text-[13px] leading-snug text-text-secondary">
                  {v.errorMessage ?? `Falta ${v.missingFields.join(' e ')}.`}
                </p>
              </div>
              <ArrowRight
                size={14}
                className="mt-0.5 shrink-0 text-text-tertiary"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
