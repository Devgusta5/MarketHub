import { Suspense } from 'react'
import Link from 'next/link'
import { Package, Search } from 'lucide-react'
import { listProducts, type CatalogFilters } from '@/lib/store'
import {
  MARKETPLACES,
  MARKETPLACE_SHORT,
  PRODUCT_STATUSES,
  completeness,
  primaryImage,
  version,
  type ChannelStatus,
  type ProductStatus,
} from '@/lib/types'
import { PageHeader } from '@/components/shell'
import {
  ButtonLink,
  EmptyState,
  ProductStatusBadge,
  ProgressBar,
  Skeleton,
} from '@/components/ui'
import { CatalogFiltersBar } from './filters'

export const metadata = { title: 'Produtos' }

type SearchParams = PageProps<'/produtos'>['searchParams']

export default function CatalogPage(props: PageProps<'/produtos'>) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="Produtos"
        description="Busque, filtre e acompanhe o estado de cada item do catálogo."
        actions={
          <ButtonLink href="/produtos/novo" variant="primary">
            Novo produto
          </ButtonLink>
        }
      />

      <Suspense fallback={<Skeleton className="h-9 w-full" />}>
        <CatalogFiltersBar />
      </Suspense>

      <div className="mt-4">
        <Suspense fallback={<TableSkeleton />}>
          <ProductTable searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

function asArray(value: string | string[] | undefined): string[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

async function readFilters(searchParams: SearchParams): Promise<CatalogFilters> {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : undefined
  const status = asArray(sp.status).filter((s): s is ProductStatus =>
    (PRODUCT_STATUSES as readonly string[]).includes(s),
  )
  const channel = MARKETPLACES.find((m) => m === sp.channel)
  const channelStatus = asArray(sp.channelStatus)
  return { q, status, channel, channelStatus }
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Skeleton className="h-10 rounded-none" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="border-t border-border p-3">
          <Skeleton className="h-8" />
        </div>
      ))}
    </div>
  )
}

async function ProductTable({ searchParams }: { searchParams: SearchParams }) {
  const filters = await readFilters(searchParams)
  const products = await listProducts(filters)
  const hasFilters = Boolean(
    filters.q || filters.status?.length || filters.channelStatus?.length,
  )

  if (products.length === 0) {
    return (
      <EmptyState
        icon={hasFilters ? Search : Package}
        title={hasFilters ? 'Nenhum produto encontrado' : 'Catálogo vazio'}
        description={
          hasFilters
            ? 'Nenhum produto corresponde aos filtros aplicados. Ajuste a busca ou limpe os filtros.'
            : 'Cadastre o primeiro produto para começar a preparar seus anúncios.'
        }
        action={
          hasFilters ? (
            <ButtonLink href="/produtos">Limpar filtros</ButtonLink>
          ) : (
            <ButtonLink href="/produtos/novo" variant="primary">
              Novo produto
            </ButtonLink>
          )
        }
      />
    )
  }

  return (
    <>
      <p className="mb-2 text-xs text-text-secondary">
        {products.length} {products.length === 1 ? 'produto' : 'produtos'}
      </p>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        {/* Cabeçalho: só onde há colunas de verdade. */}
        <div className="hidden grid-cols-[minmax(0,1fr)_120px_210px_132px_80px] items-center gap-4 border-b border-border bg-surface-sunken px-4 py-2.5 lg:grid">
          {['Produto', 'Completude', 'Canais', 'Estado', 'Atualizado'].map((h) => (
            <span key={h} className="text-xs font-medium text-text-secondary">
              {h}
            </span>
          ))}
        </div>

        <ul className="divide-y divide-border">
          {products.map((product) => {
            const { filled, total } = completeness(product)
            const cover = primaryImage(product)
            return (
              <li key={product.id}>
                <Link
                  href={`/produtos/${product.id}`}
                  className="grid grid-cols-1 gap-3 px-4 py-3 transition-colors duration-150 hover:bg-surface-sunken lg:grid-cols-[minmax(0,1fr)_120px_210px_132px_80px] lg:items-center lg:gap-4"
                  style={{ minHeight: 'var(--row-h)' }}
                >
                  {/* Produto */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-surface-sunken">
                      {cover ? (
                        <span className="text-[10px] text-text-tertiary">IMG</span>
                      ) : (
                        <Package size={14} className="text-text-tertiary" aria-hidden />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{product.name}</p>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-text-secondary">
                        {product.sku}
                        {product.brand ? (
                          <span className="font-sans"> · {product.brand}</span>
                        ) : null}
                      </p>
                    </div>
                  </div>

                  {/* Completude */}
                  <div className="flex items-center gap-2 lg:block">
                    <div className="w-20 lg:w-full">
                      <ProgressBar
                        value={filled}
                        total={total}
                        tone={filled === total ? 'success' : 'accent'}
                      />
                    </div>
                    <span className="text-[11px] text-text-secondary lg:mt-1 lg:block">
                      {filled}/{total}
                    </span>
                  </div>

                  {/* Canais */}
                  <div className="flex items-center gap-1">
                    {MARKETPLACES.map((marketplace) => {
                      const v = version(product, marketplace)
                      if (!v) return null
                      return (
                        <ChannelChip
                          key={marketplace}
                          short={MARKETPLACE_SHORT[marketplace]}
                          status={v.status}
                        />
                      )
                    })}
                  </div>

                  {/* Estado */}
                  <div>
                    <ProductStatusBadge status={product.status} />
                  </div>

                  {/* Atualizado */}
                  <time
                    dateTime={product.updatedAt}
                    className="text-[11px] text-text-tertiary"
                  >
                    {new Date(product.updatedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </time>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

/**
 * Sigla do canal com o estado em cor + forma.
 * O título diz o estado por extenso — a cor nunca é o único sinal.
 */
function ChannelChip({ short, status }: { short: string; status: ChannelStatus }) {
  const style: Record<ChannelStatus, string> = {
    published: 'border-success text-success bg-success-surface',
    ready: 'border-info text-info bg-info-surface',
    has_issues: 'border-warning text-warning bg-warning-surface',
    error: 'border-danger text-danger bg-danger-surface',
    not_configured: 'border-border text-text-tertiary',
  }
  const label: Record<ChannelStatus, string> = {
    published: 'Publicado',
    ready: 'Pronto',
    has_issues: 'Com pendências',
    error: 'Erro',
    not_configured: 'Não configurado',
  }
  const mark: Record<ChannelStatus, string> = {
    published: '●',
    ready: '◐',
    has_issues: '▲',
    error: '✕',
    not_configured: '○',
  }
  return (
    <span
      title={`${short}: ${label[status]}`}
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${style[status]}`}
    >
      <span aria-hidden>{mark[status]}</span>
      <span className="truncate">{short}</span>
      <span className="sr-only">: {label[status]}</span>
    </span>
  )
}
