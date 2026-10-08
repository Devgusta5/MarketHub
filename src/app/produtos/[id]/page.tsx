import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Plus,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { getProduct } from '@/lib/store'
import {
  MARKETPLACES,
  MARKETPLACE_LABELS,
  basePendings,
  channelPendings,
  completeness,
  effectiveDescription,
  effectiveTitle,
  isInherited,
  pendings,
  primaryImage,
  version,
  type Marketplace,
  type Product,
  type ProductEventKind,
} from '@/lib/types'
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  ChannelStatusBadge,
  ContentStatusBadge,
  Field,
  ProductStatusBadge,
  ProgressBar,
  SectionHeading,
  Skeleton,
} from '@/components/ui'

export default function ProductPage(props: PageProps<'/produtos/[id]'>) {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/produtos"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft size={14} aria-hidden />
        Produtos
      </Link>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetail params={props.params} />
      </Suspense>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="mt-4 space-y-6">
      <Skeleton className="h-24" />
      <Skeleton className="h-64" />
    </div>
  )
}

async function ProductDetail({
  params,
}: {
  params: PageProps<'/produtos/[id]'>['params']
}) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const { filled, total } = completeness(product)
  const issues = pendings(product)
  const baseIssues = basePendings(product)
  const channelIssues = channelPendings(product)
  const required = issues.filter((i) => i.severity === 'required')

  return (
    <>
      {/* 1. Cabeçalho compacto (§12) */}
      <header className="mt-4 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight">{product.name}</h1>
            <ProductStatusBadge status={product.status} />
          </div>
          <p className="mt-1 font-mono text-[13px] text-text-secondary">
            {product.sku}
            {product.brand ? (
              <span className="font-sans"> · {product.brand}</span>
            ) : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>Editar</Button>
          {required.length > 0 ? (
            // Botão morto é beco sem saída: leva à primeira pendência.
            <ButtonLink href={`#${required[0].field}`} variant="secondary">
              <AlertTriangle size={13} aria-hidden />
              {required.length} {required.length === 1 ? 'pendência' : 'pendências'} para
              publicar
            </ButtonLink>
          ) : (
            <Button variant="primary">Preparar publicação</Button>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {/* 4. Informações base */}
          <Card>
            <SectionHeading hint="A fonte central. Os canais herdam daqui quando não têm conteúdo próprio.">
              Informações base
            </SectionHeading>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
              <Field label="Nome" value={product.name} />
              <Field label="SKU" value={product.sku} mono />
              <Field label="Marca" value={product.brand} />
              <Field label="Categoria" value={product.category} />
              <Field label="Nome interno" value={product.internalName} />
            </dl>

            <div id="description" className="mt-6 border-t border-border pt-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text-secondary">
                    Descrição
                  </span>
                  {product.description ? (
                    <ContentStatusBadge status={product.description.status} />
                  ) : null}
                </div>
                <Button size="sm" disabled>
                  <Sparkles size={13} aria-hidden />
                  Gerar com IA
                </Button>
              </div>

              {product.description ? (
                <>
                  <p className="max-w-[70ch] text-[13px] leading-relaxed">
                    {product.description.value}
                  </p>
                  {product.description.status === 'awaiting_approval' ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-warning-surface bg-warning-surface px-3 py-2">
                      <AlertTriangle size={13} className="text-warning" aria-hidden />
                      <span className="flex-1 text-[13px]">
                        Esta descrição foi gerada com IA e ainda não foi revisada.
                      </span>
                      <Button size="sm" variant="primary" disabled>
                        Aprovar
                      </Button>
                      <Button size="sm" disabled>
                        Editar
                      </Button>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-[13px] text-text-tertiary">
                  Sem descrição. Os canais não têm conteúdo para herdar.
                </p>
              )}
            </div>

            <div id="attributes" className="mt-6 border-t border-border pt-5">
              <span className="text-xs font-medium text-text-secondary">Atributos</span>
              {Object.keys(product.attributes).length === 0 ? (
                <p className="mt-2 text-[13px] text-text-tertiary">
                  Nenhum atributo informado.
                </p>
              ) : (
                <dl className="mt-2 grid gap-x-8 sm:grid-cols-2">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-baseline justify-between gap-4 border-b border-border py-1.5 last:border-b-0"
                    >
                      <dt className="text-[13px] text-text-secondary">{key}</dt>
                      <dd className="text-right text-[13px]">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            <div id="tags" className="mt-6 border-t border-border pt-5">
              <span className="text-xs font-medium text-text-secondary">Tags</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.tags.length === 0 ? (
                  <p className="text-[13px] text-text-tertiary">Nenhuma tag.</p>
                ) : (
                  product.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)
                )}
              </div>
            </div>
          </Card>

          {/* 5. Mídia */}
          <Card id="images">
            <SectionHeading hint="A primeira imagem é a principal em todos os canais.">
              Imagens
            </SectionHeading>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {product.images.map((image) => {
                const isPrimary = image.id === primaryImage(product)?.id
                return (
                  <div
                    key={image.id}
                    className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border bg-surface-sunken ${
                      isPrimary ? 'border-accent' : 'border-border'
                    }`}
                    title={image.altText ?? undefined}
                  >
                    <span className="text-[11px] text-text-tertiary">
                      {image.altText ?? 'Imagem'}
                    </span>
                    {isPrimary ? (
                      <span className="absolute top-1 left-1 rounded bg-accent px-1 py-0.5 text-[9px] font-medium text-accent-contrast">
                        Principal
                      </span>
                    ) : null}
                  </div>
                )
              })}
              <button
                type="button"
                disabled
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-text-tertiary transition-colors hover:border-border-strong disabled:cursor-not-allowed"
              >
                <ImagePlus size={16} aria-hidden />
                <span className="text-[11px]">Adicionar</span>
              </button>
            </div>
          </Card>

          {/* 6. Marketplaces */}
          <Card>
            <SectionHeading hint="Cada canal tem estado próprio. Campo vazio usa o conteúdo base.">
              Marketplaces
            </SectionHeading>
            <div className="space-y-3">
              {MARKETPLACES.map((marketplace) => (
                <ChannelPanel
                  key={marketplace}
                  product={product}
                  marketplace={marketplace}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Coluna lateral: completude, pendências, histórico */}
        <div className="space-y-6">
          {/* 2. Resumo de completude */}
          <Card>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold tracking-tight">Completude</span>
              <span className="text-[13px] tabular-nums text-text-secondary">
                {filled} de {total}
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar
                value={filled}
                total={total}
                tone={filled === total ? 'success' : 'accent'}
              />
            </div>
            <p className="mt-2 text-xs text-text-secondary">
              {filled === total
                ? 'Todas as informações essenciais estão preenchidas.'
                : `Faltam ${total - filled} informações essenciais.`}
            </p>
          </Card>

          {/* 3. Pendências acionáveis */}
          {issues.length > 0 ? (
            <Card>
              <SectionHeading hint="Cada item leva ao campo correspondente.">
                Pendências
              </SectionHeading>
              {baseIssues.length > 0 ? (
                <p className="mb-1.5 text-[11px] font-medium text-text-secondary">
                  No produto
                </p>
              ) : null}
              <ul className="space-y-1">
                {baseIssues.map((issue, i) => (
                  <li key={`${issue.field}-${i}`}>
                    <Link
                      href={`#${issue.field.startsWith('channel-') ? issue.field : issue.field}`}
                      className="-mx-2 flex items-start gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-surface-sunken"
                    >
                      {issue.severity === 'required' ? (
                        <AlertTriangle
                          size={13}
                          className="mt-0.5 shrink-0 text-warning"
                          aria-hidden
                        />
                      ) : (
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-border-strong"
                          aria-hidden
                        />
                      )}
                      <span className="min-w-0">
                        <span className="block text-[13px] leading-snug">
                          {issue.action}
                        </span>
                        <span className="text-[11px] text-text-tertiary">
                          {issue.label}
                          {issue.severity === 'required' ? ' · obrigatório' : ''}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {channelIssues.length > 0 ? (
                <>
                  <p className="mt-4 mb-1.5 text-[11px] font-medium text-text-secondary">
                    Nos canais
                  </p>
                  <ul className="space-y-1">
                    {channelIssues.map((issue, i) => (
                      <li key={`${issue.field}-${i}`}>
                        <Link
                          href={`#${issue.field}`}
                          className="-mx-2 flex items-start gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-surface-sunken"
                        >
                          <AlertTriangle
                            size={13}
                            className="mt-0.5 shrink-0 text-warning"
                            aria-hidden
                          />
                          <span className="min-w-0">
                            <span className="block text-[13px] leading-snug">
                              {issue.action}
                            </span>
                            <span className="text-[11px] text-text-tertiary">
                              {issue.label}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </Card>
          ) : (
            <Card>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-success" aria-hidden />
                <p className="text-[13px]">Nenhuma pendência neste produto.</p>
              </div>
            </Card>
          )}

          {/* 7. Histórico */}
          <Card>
            <SectionHeading>Atividade</SectionHeading>
            <ol className="space-y-3">
              {product.events.map((event) => (
                <li key={event.id} className="flex gap-2.5">
                  <EventDot kind={event.kind} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug">{event.summary}</p>
                    {event.detail ? (
                      <p className="mt-0.5 text-[11px] text-text-secondary">
                        {event.detail}
                      </p>
                    ) : null}
                    <p className="mt-0.5 text-[11px] text-text-tertiary">
                      {event.actor} ·{' '}
                      {new Date(event.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  )
}

function EventDot({ kind }: { kind: ProductEventKind }) {
  if (kind === 'ai_generated') {
    return <Sparkles size={13} className="mt-0.5 shrink-0 text-accent-text" aria-hidden />
  }
  if (kind === 'sync_failed') {
    return <XCircle size={13} className="mt-0.5 shrink-0 text-danger" aria-hidden />
  }
  if (kind === 'published' || kind === 'content_approved') {
    return <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-success" aria-hidden />
  }
  return (
    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-border-strong" aria-hidden />
  )
}

function ChannelPanel({
  product,
  marketplace,
}: {
  product: Product
  marketplace: Marketplace
}) {
  const v = version(product, marketplace)
  if (!v) return null

  const titleInherited = isInherited(product, marketplace, 'title')
  const descInherited = isInherited(product, marketplace, 'description')

  return (
    <div
      id={`channel-${marketplace}`}
      className="rounded-lg border border-border p-4 scroll-mt-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-medium">
            {MARKETPLACE_LABELS[marketplace]}
          </span>
          <ChannelStatusBadge status={v.status} />
        </div>
        {v.listingId ? (
          <span className="font-mono text-[11px] text-text-tertiary">{v.listingId}</span>
        ) : null}
      </div>

      {v.status === 'error' && v.errorMessage ? (
        <p className="mt-3 flex items-start gap-2 rounded-md bg-danger-surface px-3 py-2 text-[13px] leading-snug">
          <XCircle size={13} className="mt-0.5 shrink-0 text-danger" aria-hidden />
          {v.errorMessage}
        </p>
      ) : null}

      {v.missingFields.length > 0 ? (
        <p className="mt-3 flex items-start gap-2 rounded-md bg-warning-surface px-3 py-2 text-[13px] leading-snug">
          <AlertTriangle size={13} className="mt-0.5 shrink-0 text-warning" aria-hidden />
          Falta {v.missingFields.join(' e ')}.
        </p>
      ) : null}

      <dl className="mt-3 space-y-2.5">
        <ChannelField
          label="Título"
          value={effectiveTitle(product, marketplace)}
          inherited={titleInherited}
          status={v.title?.status}
        />
        <ChannelField
          label="Descrição"
          value={effectiveDescription(product, marketplace) || '—'}
          inherited={descInherited}
          status={v.description?.status}
          clamp
        />
        {marketplace === 'amazon' ? (
          <div>
            <dt className="text-[11px] text-text-secondary">
              Bullet points{' '}
              <span className="text-text-tertiary">
                ({v.bulletPoints.length} de 5)
              </span>
            </dt>
            <dd className="mt-1">
              {v.bulletPoints.length === 0 ? (
                <span className="text-[13px] text-text-tertiary">Nenhum informado.</span>
              ) : (
                <ul className="space-y-0.5">
                  {v.bulletPoints.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-1.5 text-[13px] leading-snug text-text-secondary"
                    >
                      <span aria-hidden>·</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-3 flex gap-2">
        <Button size="sm" disabled>
          <Sparkles size={12} aria-hidden />
          Adaptar com IA
        </Button>
        <Button size="sm" disabled>
          <Plus size={12} aria-hidden />
          Editar conteúdo
        </Button>
      </div>
    </div>
  )
}

function ChannelField({
  label,
  value,
  inherited,
  status,
  clamp = false,
}: {
  label: string
  value: string
  inherited: boolean
  status?: string
  clamp?: boolean
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-[11px] text-text-secondary">
        {label}
        {inherited ? (
          <span
            className="rounded bg-surface-sunken px-1 py-0.5 text-[10px] text-text-tertiary"
            title="Usando o conteúdo do produto base"
          >
            herdado da base
          </span>
        ) : status === 'ai_generated' ? (
          <span className="rounded bg-accent-surface px-1 py-0.5 text-[10px] text-accent-text">
            gerado com IA
          </span>
        ) : null}
      </dt>
      <dd
        className={`mt-0.5 text-[13px] leading-snug ${
          inherited ? 'text-text-tertiary' : ''
        } ${clamp ? 'line-clamp-2' : ''}`}
      >
        {value}
      </dd>
    </div>
  )
}
