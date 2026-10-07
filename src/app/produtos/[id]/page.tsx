import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/store'
import {
  MARKETPLACE_LABELS,
  effectiveTitle,
  type Marketplace,
  type Product,
  type ProductEventKind,
} from '@/lib/types'
import {
  CHANNEL_CODE,
  CHANNEL_INK,
  ChannelTape,
  Segment,
  StatusCell,
  Value,
  channelState,
  pendingReason,
} from '@/components/despacho'

const EVENT_LABEL: Record<ProductEventKind, string> = {
  created: 'CRIADO',
  updated: 'ALTERADO',
  image_added: 'FOTO +',
  image_removed: 'FOTO −',
  ai_generated: 'IA',
  marketplace_updated: 'CANAL',
}

function dateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ProductPage(props: PageProps<'/produtos/[id]'>) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-rule-strong bg-panel">
        <div className="mx-auto flex h-12 w-full max-w-[1100px] items-center px-6">
          <Link
            href="/"
            className="font-mono transition-colors hover:text-ink"
            style={{
              fontSize: 11,
              letterSpacing: '0.14em',
              color: 'var(--ink-dim)',
            }}
          >
            ← PAINEL
          </Link>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[1100px] px-6 py-8">
        <Suspense fallback={<CardSkeleton />}>
          <ProductCard params={props.params} />
        </Suspense>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="border border-rule-strong bg-panel" style={{ height: 480 }} />
  )
}

async function ProductCard({
  params,
}: {
  params: PageProps<'/produtos/[id]'>['params']
}) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const pending = pendingReason(product)

  return (
    <>
      {/* ── O cartão ── */}
      <article className="border border-rule-strong bg-panel">
        {/* Talão superior: identificação */}
        <div className="grid grid-cols-2 sm:grid-cols-[minmax(0,1fr)_200px_140px]">
          <Segment label="produto" className="col-span-2 sm:col-span-1">
            <Value size={22}>{product.name}</Value>
          </Segment>
          <div className="border-t border-rule sm:border-t-0 sm:border-l">
            <Segment label="sku">
              <Value mono size={20}>
                {product.sku}
              </Value>
            </Segment>
          </div>
          <div className="border-t border-l border-rule sm:border-t-0">
            <Segment label="estado">
              <div className="pt-1">
                <StatusCell status={product.status} pending={pending} />
              </div>
            </Segment>
          </div>
        </div>

        <div className="perforation" />

        {/* Talão do meio: dados de base */}
        <div className="grid grid-cols-2 sm:grid-cols-4">
          <Segment label="marca">
            <Value mono size={14} dim={!product.brand}>
              {product.brand ?? '——'}
            </Value>
          </Segment>
          <div className="border-l border-rule">
            <Segment label="categoria">
              <Value mono size={14} dim={!product.category}>
                {product.category ?? '——'}
              </Value>
            </Segment>
          </div>
          <div className="border-l border-rule">
            <Segment label="imagens">
              <ImageStrip product={product} />
            </Segment>
          </div>
          <div className="border-l border-rule">
            <Segment label="canais">
              <div className="pt-0.5">
                <ChannelTape product={product} />
              </div>
            </Segment>
          </div>
        </div>

        <div className="perforation" />

        {/* Talão inferior: conteúdo base */}
        <Segment label="descrição base">
          <div className="flex items-start justify-between gap-6">
            <p
              className="max-w-[68ch]"
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: product.baseDescription ? 'var(--ink)' : 'var(--ink-faint)',
              }}
            >
              {product.baseDescription ?? 'Sem descrição base. Os canais não têm o que herdar.'}
            </p>
            <button
              type="button"
              disabled
              className="font-mono shrink-0 border border-rule-strong px-3 py-2"
              style={{
                fontSize: 10,
                letterSpacing: '0.12em',
                color: 'var(--ink-faint)',
              }}
            >
              GERAR · IA
            </button>
          </div>
        </Segment>

        {product.tags.length > 0 || Object.keys(product.attributes).length > 0 ? (
          <>
            <div className="perforation" />
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
              <Segment label="tags">
                {product.tags.length === 0 ? (
                  <Value mono size={13} dim>
                    ——
                  </Value>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono border border-rule-strong px-2 py-1"
                        style={{ fontSize: 10, letterSpacing: '0.06em' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Segment>
              <div className="border-t border-rule sm:border-t-0 sm:border-l">
                <Segment label="atributos">
                  <dl className="min-w-[280px]">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-baseline gap-3 border-b border-rule py-1 last:border-b-0"
                      >
                        <dt className="label shrink-0">{key}</dt>
                        {/* Pontilhado liga rótulo a valor, como ficha impressa. */}
                        <dd
                          aria-hidden
                          className="min-w-3 flex-1 shrink self-center"
                          style={{
                            height: 1,
                            backgroundImage:
                              'repeating-linear-gradient(to right, var(--rule-strong) 0 1px, transparent 1px 4px)',
                          }}
                        />
                        <dd
                          className="font-mono min-w-0 text-right"
                          style={{ fontSize: 11, color: 'var(--ink)' }}
                        >
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Segment>
              </div>
            </div>
          </>
        ) : null}
      </article>

      {/* ── Embarques: um por canal ── */}
      <h2 className="label mt-10 mb-3">embarques</h2>
      <div className="grid gap-px border border-rule-strong bg-rule-strong sm:grid-cols-3">
        {product.versions.map((version) => (
          <ChannelStub
            key={version.marketplace}
            product={product}
            marketplace={version.marketplace}
          />
        ))}
      </div>

      {/* ── Histórico ── */}
      <h2 className="label mt-10 mb-3">histórico</h2>
      <div className="border border-rule-strong bg-panel">
        {product.events.map((event) => (
          <div
            key={event.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 border-b border-rule px-4 py-2.5 last:border-b-0 sm:grid-cols-[86px_minmax(0,1fr)_auto]"
          >
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.1em',
                color:
                  event.kind === 'ai_generated' ? 'var(--alert)' : 'var(--ink-faint)',
              }}
            >
              {EVENT_LABEL[event.kind]}
            </span>
            <span
              className="font-mono text-right sm:order-3"
              style={{ fontSize: 10, color: 'var(--ink-faint)' }}
            >
              {dateTime(event.createdAt)}
            </span>
            <span className="col-span-2 sm:order-2 sm:col-span-1" style={{ fontSize: 14 }}>
              {event.summary}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function ChannelStub({
  product,
  marketplace,
}: {
  product: Product
  marketplace: Marketplace
}) {
  const state = channelState(product, marketplace)
  const ink = CHANNEL_INK[marketplace]
  const title = effectiveTitle(product, marketplace)

  return (
    <div className="bg-panel p-4">
      <div className="flex items-center justify-between">
        <span
          className="font-mono font-semibold"
          style={{ fontSize: 12, letterSpacing: '0.1em', color: ink }}
        >
          {CHANNEL_CODE[marketplace]}
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 9,
            letterSpacing: '0.12em',
            // A cor do canal identifica o canal; o estado fala em tinta
            // neutra para os dois vocabularios nao se confundirem.
            color: state === 'adapted' ? 'var(--ink-dim)' : 'var(--ink-faint)',
          }}
        >
          {state === 'adapted'
            ? 'ADAPTADO'
            : state === 'inherited'
              ? 'HERDANDO'
              : 'SEM BASE'}
        </span>
      </div>

      <div className="label mt-3">{MARKETPLACE_LABELS[marketplace]}</div>

      <p
        className="mt-2"
        style={{
          fontSize: 13,
          lineHeight: 1.45,
          color: state === 'adapted' ? 'var(--ink)' : 'var(--ink-dim)',
          // Herdando: o texto vem da camada de baixo, então é mostrado
          // mais apagado — a ausência de camada própria é visível.
          fontStyle: state === 'inherited' ? 'italic' : 'normal',
        }}
      >
        {title}
      </p>
    </div>
  )
}

/**
 * Faixa de imagens: vagas reais, não um contador.
 * O storage entra na etapa 6; até lá a vaga mostra o alt text.
 */
function ImageStrip({ product }: { product: Product }) {
  if (product.images.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="flex items-center justify-center border border-dashed border-rule-strong"
          style={{ width: 34, height: 34 }}
        >
          <span className="label" style={{ fontSize: 9 }}>
            +
          </span>
        </span>
        <span className="label" style={{ color: 'var(--ink-faint)' }}>
          sem foto
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5">
      {product.images.slice(0, 4).map((image, i) => (
        <span
          key={image.id}
          title={image.altText ?? undefined}
          className="flex items-center justify-center border bg-panel-raised"
          style={{
            width: 34,
            height: 34,
            borderColor: i === 0 ? 'var(--ink-dim)' : 'var(--rule-strong)',
          }}
        >
          <span
            className="font-mono"
            style={{ fontSize: 9, color: 'var(--ink-faint)' }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
        </span>
      ))}
      <span
        className="flex items-center justify-center border border-dashed border-rule-strong"
        style={{ width: 34, height: 34 }}
      >
        <span className="label" style={{ fontSize: 9 }}>
          +
        </span>
      </span>
    </div>
  )
}
