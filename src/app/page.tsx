import { Suspense } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { listProducts, operationSnapshot } from '@/lib/store'
import {
  MARKETPLACE_LABELS,
  basePendings,
  channelPendings,
  completeness,
  pendings,
  type Product,
} from '@/lib/types'
import { PageHeader } from '@/components/shell'
import {
  Badge,
  ButtonLink,
  Card,
  ProductStatusBadge,
  ProgressBar,
  SectionHeading,
  Skeleton,
} from '@/components/ui'

export const metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="Dashboard"
        description="O estado da sua operação agora."
        actions={
          <ButtonLink href="/produtos/novo" variant="primary">
            Novo produto
          </ButtonLink>
        }
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[88px]" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  )
}

async function DashboardContent() {
  const [snapshot, products] = await Promise.all([operationSnapshot(), listProducts()])

  // §10: prioriza pendências acionáveis. Ordena por quanto falta.
  const needsWork = products
    .map((p) => ({ product: p, items: pendings(p) }))
    .filter((x) => x.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 5)

  const errorCount = snapshot.byChannel.reduce((n, c) => n + c.errors, 0)

  return (
    <div className="space-y-6">
      {/* Indicadores: cada um leva a uma lista filtrada. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          href="/produtos"
          label="Produtos"
          value={snapshot.total}
          icon={Package}
          hint="no catálogo"
        />
        <Metric
          href="/produtos?status=incomplete&status=draft"
          label="Incompletos"
          value={snapshot.byStatus.incomplete + snapshot.byStatus.draft}
          icon={AlertTriangle}
          tone="warning"
          hint="precisam de informação"
        />
        <Metric
          href="/produtos?status=in_review"
          label="Em revisão"
          value={snapshot.awaitingReview}
          icon={Clock}
          tone="info"
          hint="aguardando aprovação"
        />
        <Metric
          href="/produtos?status=complete"
          label="Completos"
          value={snapshot.byStatus.complete}
          icon={CheckCircle2}
          tone="success"
          hint="prontos para publicar"
        />
      </div>

      {errorCount > 0 ? (
        <Link
          href="/marketplaces"
          className="flex items-center gap-3 rounded-xl border border-danger-surface bg-danger-surface px-4 py-3 transition-opacity hover:opacity-90"
        >
          <XCircle size={16} className="shrink-0 text-danger" aria-hidden />
          <p className="flex-1 text-[13px] text-text-primary">
            <strong className="font-medium">
              {errorCount} {errorCount === 1 ? 'canal' : 'canais'} com erro de
              sincronização.
            </strong>{' '}
            <span className="text-text-secondary">Veja o que impede a publicação.</span>
          </p>
          <ArrowRight size={14} className="shrink-0 text-text-secondary" aria-hidden />
        </Link>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Pendências acionáveis */}
        <Card>
          <SectionHeading
            hint="O que está impedindo a publicação, em ordem de esforço."
            action={
              <Link
                href="/produtos"
                className="text-[13px] font-medium text-accent-text hover:underline"
              >
                Ver todos
              </Link>
            }
          >
            Precisa de atenção
          </SectionHeading>

          {needsWork.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-text-secondary">
              Nenhuma pendência. Todo o catálogo está completo.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {needsWork.map(({ product }) => (
                <PendingRow key={product.id} product={product} />
              ))}
            </ul>
          )}
        </Card>

        {/* Estado por marketplace */}
        <Card>
          <SectionHeading hint="Quantos produtos estão em cada estado.">
            Por marketplace
          </SectionHeading>
          <div className="space-y-4">
            {snapshot.byChannel.map((channel) => (
              <div key={channel.marketplace}>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-[13px] font-medium">
                    {MARKETPLACE_LABELS[channel.marketplace]}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {channel.published} de {snapshot.total} publicados
                  </span>
                </div>
                <ProgressBar
                  value={channel.published}
                  total={snapshot.total}
                  tone="success"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {channel.ready > 0 ? (
                    <Badge tone="info">{channel.ready} pronto{channel.ready > 1 ? 's' : ''}</Badge>
                  ) : null}
                  {channel.issues > 0 ? (
                    <Badge tone="warning" icon={AlertTriangle}>
                      {channel.issues} com pendência{channel.issues > 1 ? 's' : ''}
                    </Badge>
                  ) : null}
                  {channel.errors > 0 ? (
                    <Badge tone="danger" icon={XCircle}>
                      {channel.errors} com erro
                    </Badge>
                  ) : null}
                  {channel.notConfigured > 0 ? (
                    <Badge>{channel.notConfigured} não configurado{channel.notConfigured > 1 ? 's' : ''}</Badge>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Atividade recente */}
      <Card>
        <SectionHeading hint="Alterações, gerações de conteúdo e sincronizações.">
          Atividade recente
        </SectionHeading>
        <ul className="divide-y divide-border">
          {snapshot.recent.map(({ productId, productName, sku, event }) => (
            <li key={`${productId}-${event.id}`}>
              <Link
                href={`/produtos/${productId}`}
                className="-mx-2 flex items-baseline gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-surface-sunken"
              >
                {event.kind === 'ai_generated' ? (
                  <Sparkles size={13} className="shrink-0 translate-y-0.5 text-accent-text" aria-hidden />
                ) : event.kind === 'sync_failed' ? (
                  <XCircle size={13} className="shrink-0 translate-y-0.5 text-danger" aria-hidden />
                ) : event.kind === 'published' ? (
                  <CheckCircle2 size={13} className="shrink-0 translate-y-0.5 text-success" aria-hidden />
                ) : (
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-border-strong"
                    aria-hidden
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px]">{event.summary}</span>
                  <span className="mt-0.5 block truncate text-xs text-text-secondary">
                    {productName} · <span className="font-mono">{sku}</span>
                  </span>
                </span>
                <time
                  dateTime={event.createdAt}
                  className="shrink-0 text-xs text-text-tertiary"
                >
                  {new Date(event.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Metric({
  href,
  label,
  value,
  icon: Icon,
  hint,
  tone = 'neutral',
}: {
  href: string
  label: string
  value: number
  icon: typeof Package
  hint: string
  tone?: 'neutral' | 'warning' | 'info' | 'success'
}) {
  const color =
    tone === 'warning'
      ? 'text-warning'
      : tone === 'info'
        ? 'text-info'
        : tone === 'success'
          ? 'text-success'
          : 'text-text-tertiary'

  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-surface p-4 shadow-card transition-colors duration-150 hover:border-border-strong"
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-text-secondary">{label}</span>
        <Icon size={15} className={color} aria-hidden />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-text-tertiary">{hint}</p>
    </Link>
  )
}

function PendingRow({ product }: { product: Product }) {
  const { filled, total } = completeness(product)
  const base = basePendings(product).length
  const channel = channelPendings(product).length

  // Diz de que tipo é a pendência: faltar informação do produto e faltar
  // ajuste de canal são trabalhos diferentes.
  const summary = [
    base > 0 ? `${base} no produto` : null,
    channel > 0 ? `${channel} em canais` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <li>
      <Link
        href={`/produtos/${product.id}`}
        className="-mx-2 flex items-center gap-4 rounded-md px-2 py-3 transition-colors hover:bg-surface-sunken"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-[13px] font-medium">{product.name}</span>
            <ProductStatusBadge status={product.status} />
          </span>
          <span className="mt-1.5 flex items-center gap-2">
            <span className="w-24">
              <ProgressBar value={filled} total={total} tone={filled === total ? 'success' : 'accent'} />
            </span>
            <span className="text-xs text-text-secondary">
              {filled} de {total} informações
            </span>
          </span>
        </span>
        <span className="shrink-0 text-xs text-text-secondary">{summary}</span>
        <ArrowRight size={14} className="shrink-0 text-text-tertiary" aria-hidden />
      </Link>
    </li>
  )
}
