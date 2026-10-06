import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/store'
import {
  MARKETPLACE_LABELS,
  effectiveTitle,
  primaryImage,
  type ProductEventKind,
} from '@/lib/types'
import { Card, Field, ImagePlaceholder, SectionTitle, StatusBadge } from '@/components/ui'

const EVENT_LABELS: Record<ProductEventKind, string> = {
  created: 'Criado',
  updated: 'Atualizado',
  image_added: 'Imagem',
  image_removed: 'Imagem',
  ai_generated: 'IA',
  marketplace_updated: 'Canal',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ProductPage(props: PageProps<'/produtos/[id]'>) {
  return (
    <div>
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← Produtos
      </Link>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetail params={props.params} />
      </Suspense>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
      <div className="h-64 animate-pulse rounded-xl border border-border bg-surface" />
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

  const cover = primaryImage(product)
  const attributes = Object.entries(product.attributes)

  return (
    <>
      <div className="mt-4 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">{product.name}</h1>
            <StatusBadge status={product.status} />
          </div>
          <p className="mt-1 font-mono text-xs text-muted">{product.sku}</p>
        </div>
        <p className="text-xs text-muted">Atualizado em {formatDate(product.updatedAt)}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Card>
            <SectionTitle hint="A primeira imagem é a principal nos canais.">
              Imagens
            </SectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="aspect-square overflow-hidden rounded-lg border border-border">
                <ImagePlaceholder label={cover?.altText ?? 'Principal'} />
              </div>
              {product.images
                .filter((image) => image.id !== cover?.id)
                .map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square overflow-hidden rounded-lg border border-border"
                  >
                    <ImagePlaceholder label={image.altText} />
                  </div>
                ))}
              <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted">
                + Adicionar
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle hint="Fonte única de verdade. Os canais herdam daqui.">
              Produto base
            </SectionTitle>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Nome" value={product.name} />
              <Field label="SKU" value={product.sku} />
              <Field label="Marca" value={product.brand} />
              <Field label="Categoria" value={product.category} />
              <Field label="Nome interno" value={product.internalName} />
            </dl>

            <div className="mt-5">
              <dt className="text-xs text-muted">Descrição base</dt>
              <p
                className={`mt-1 text-sm leading-relaxed ${
                  product.baseDescription ? '' : 'text-muted'
                }`}
              >
                {product.baseDescription ?? 'Nenhuma descrição ainda.'}
              </p>
              <button
                type="button"
                className="mt-3 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted"
                disabled
              >
                Gerar com IA (etapa 7)
              </button>
            </div>

            <div className="mt-5">
              <dt className="text-xs text-muted">Tags</dt>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.tags.length === 0 ? (
                  <span className="text-sm text-muted">Nenhuma tag.</span>
                ) : (
                  product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-background px-2 py-1 text-xs text-muted"
                    >
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>

            {attributes.length > 0 ? (
              <div className="mt-5">
                <dt className="text-xs text-muted">Atributos</dt>
                <dl className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {attributes.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-3 rounded-md bg-background px-3 py-2 text-sm"
                    >
                      <span className="text-muted">{key}</span>
                      <span className="text-right">{value}</span>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </Card>

          <Card>
            <SectionTitle hint="Campo vazio herda do produto base — nada é duplicado.">
              Versões por marketplace
            </SectionTitle>
            <ul className="grid gap-3 sm:grid-cols-3">
              {product.versions.map((version) => {
                const adapted = Boolean(version.updatedAt)
                return (
                  <li
                    key={version.marketplace}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-medium">
                        {MARKETPLACE_LABELS[version.marketplace]}
                      </h3>
                      <span
                        className={`text-xs ${adapted ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted'}`}
                      >
                        {adapted ? 'Adaptado' : 'Herdando'}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
                      {effectiveTitle(product, version.marketplace)}
                    </p>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>

        <Card className="h-fit">
          <SectionTitle>Histórico</SectionTitle>
          <ol className="space-y-4">
            {product.events.map((event) => (
              <li key={event.id} className="text-sm">
                <div className="flex items-baseline gap-2">
                  <span className="rounded bg-background px-1.5 py-0.5 text-[11px] text-muted">
                    {EVENT_LABELS[event.kind]}
                  </span>
                </div>
                <p className="mt-1 leading-snug">{event.summary}</p>
                <p className="mt-0.5 text-xs text-muted">{formatDate(event.createdAt)}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  )
}
