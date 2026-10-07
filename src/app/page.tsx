import { Suspense } from 'react'
import Link from 'next/link'
import { listProducts } from '@/lib/store'
import {
  ChannelLegend,
  ChannelTape,
  StatusCell,
  pendingReason,
} from '@/components/despacho'

export default function CatalogPage(props: PageProps<'/'>) {
  return (
    <div className="flex min-h-screen flex-col">
      <DispatchBar
        countsSlot={
          <Suspense fallback={null}>
            <LiveCount />
          </Suspense>
        }
      />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 sm:px-6">
        <Toolbar
          searchSlot={
            <Suspense fallback={null}>
              <SearchField searchParams={props.searchParams} />
            </Suspense>
          }
        />
        <Suspense fallback={<BoardSkeleton />}>
          <Board searchParams={props.searchParams} />
        </Suspense>
      </div>
      <Footnote />
    </div>
  )
}

function DispatchBar({ countsSlot }: { countsSlot: React.ReactNode }) {
  return (
    <header className="border-b border-rule-strong bg-panel">
      <div className="mx-auto flex h-12 w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-baseline gap-3">
          <span
            className="font-mono font-semibold whitespace-nowrap"
            style={{ fontSize: 13, letterSpacing: '0.18em' }}
          >
            MARKETHUB
          </span>
          <span className="label hidden sm:inline" style={{ color: 'var(--ink-faint)' }}>
            despacho
          </span>
        </div>
        {countsSlot}
      </div>
    </header>
  )
}

async function LiveCount() {
  const products = await listProducts()
  const pending = products.filter((p) => pendingReason(p)).length
  return (
    <div
      className="flex shrink-0 items-center gap-4 font-mono whitespace-nowrap"
      style={{ fontSize: 11 }}
    >
      <span style={{ letterSpacing: '0.1em', color: 'var(--ink-dim)' }}>
        {String(products.length).padStart(2, '0')} SKU
      </span>
      <span
        className="flex items-center gap-1.5"
        style={{
          letterSpacing: '0.1em',
          color: pending ? 'var(--ink)' : 'var(--ink-dim)',
        }}
      >
        {/* O ponto carrega o alerta; o número fica em tinta normal para que
            o âmbar das linhas continue sendo o sinal mais forte da tela. */}
        <span
          aria-hidden
          className="inline-block"
          style={{
            width: 5,
            height: 5,
            background: pending ? 'var(--alert)' : 'var(--ready)',
          }}
        />
        {String(pending).padStart(2, '0')} {pending === 1 ? 'PENDENTE' : 'PENDENTES'}
      </span>
    </div>
  )
}

function Toolbar({ searchSlot }: { searchSlot: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-5">
      <form className="flex min-w-0 flex-1 items-center">{searchSlot}</form>
      <Link
        href="/produtos/novo"
        className="font-mono shrink-0 font-semibold whitespace-nowrap transition-opacity hover:opacity-85"
        style={{
          fontSize: 11,
          letterSpacing: '0.12em',
          background: 'var(--alert)',
          color: 'var(--alert-ink)',
          padding: '10px 16px',
        }}
      >
        <span className="sm:hidden" aria-hidden>
          +
        </span>
        <span className="sr-only sm:hidden">Novo produto</span>
        <span className="hidden sm:inline">+ PRODUTO</span>
      </Link>
    </div>
  )
}

type SearchParams = PageProps<'/'>['searchParams']

async function readSearch(searchParams: SearchParams): Promise<string | undefined> {
  const { q } = await searchParams
  return typeof q === 'string' && q.trim() ? q : undefined
}

async function SearchField({ searchParams }: { searchParams: SearchParams }) {
  const search = await readSearch(searchParams)
  return (
    <div className="flex min-w-0 items-center border border-rule-strong bg-panel">
      <span className="label hidden px-3 sm:block">buscar</span>
      <span className="perforation-v hidden self-stretch sm:block" />
      <input
        type="search"
        name="q"
        defaultValue={search ?? ''}
        placeholder="SKU, produto ou marca"
        className="font-mono min-w-0 bg-transparent px-3 outline-none"
        style={{
          fontSize: 12,
          height: 36,
          width: 'min(260px, 60vw)',
          letterSpacing: '0.04em',
        }}
      />
    </div>
  )
}

function BoardSkeleton() {
  return (
    <div className="border border-rule-strong">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="border-b border-rule bg-panel last:border-b-0"
          style={{ height: 56, opacity: 1 - i * 0.16 }}
        />
      ))}
    </div>
  )
}

/* Largura fixa só a partir de lg; abaixo disso a linha vira bloco empilhado. */
const ROW =
  'grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 pr-4 lg:grid-cols-[34px_108px_minmax(0,1fr)_136px_116px_72px] lg:items-center lg:gap-4'

async function Board({ searchParams }: { searchParams: SearchParams }) {
  const search = await readSearch(searchParams)
  const products = await listProducts(search)

  if (products.length === 0) {
    return (
      <div className="border border-rule-strong bg-panel px-6 py-16 text-center">
        <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.1em' }}>
          PAINEL VAZIO
        </p>
        <p
          className="mx-auto mt-3 max-w-[46ch]"
          style={{ fontSize: 14, color: 'var(--ink-dim)', lineHeight: 1.6 }}
        >
          {search
            ? 'Nenhum SKU corresponde a essa busca.'
            : 'Cadastre o primeiro produto para começar o despacho.'}
        </p>
      </div>
    )
  }

  const pendingCount = products.filter((p) => pendingReason(p)).length

  return (
    <div className="border border-rule-strong">
      {/* Cabeçalho de colunas: só onde as colunas existem. */}
      <div
        className={`${ROW} hidden border-b border-rule-strong bg-panel lg:grid`}
        style={{ height: 32, paddingLeft: 18 }}
      >
        <span className="label">#</span>
        <span className="label">sku</span>
        <span className="label">produto</span>
        <span className="label">canais</span>
        <span className="label">estado</span>
        <span className="label text-right">atual.</span>
      </div>

      {products.map((product, i) => {
        const pending = pendingReason(product)
        return (
          <Link
            key={product.id}
            href={`/produtos/${product.id}`}
            className={`${ROW} border-b border-rule bg-panel py-3 transition-colors last:border-b-0 hover:bg-panel-raised lg:py-0`}
            style={{
              minHeight: 56,
              // A faixa marca a linha que precisa de ação. Largura constante
              // (transparente quando não há pendência) para a grade não deslocar.
              borderLeft: `2px solid ${pending ? 'var(--alert)' : 'transparent'}`,
              paddingLeft: 16,
            }}
          >
            {/* Ranque: a linha é posicionada, não só ordenada. */}
            <span
              className="font-mono order-0 hidden lg:block"
              style={{ fontSize: 11, color: 'var(--ink-faint)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Linha 1 no mobile: SKU + estado. */}
            <span
              className="font-mono order-1"
              style={{
                fontSize: 12,
                letterSpacing: '0.04em',
                color: pending ? 'var(--alert)' : 'var(--ink)',
              }}
            >
              {product.sku}
            </span>

            <span className="order-2 justify-self-end lg:order-4 lg:justify-self-start">
              <StatusCell status={product.status} pending={pending} />
            </span>

            {/* Linha 2 no mobile: nome do produto, largura toda. */}
            <span className="order-3 col-span-2 min-w-0 lg:order-2 lg:col-span-1">
              <span
                className="block truncate"
                style={{ fontSize: 15, lineHeight: 1.3 }}
              >
                {product.name}
              </span>
              {product.brand ? (
                <span
                  className="label mt-0.5 block"
                  style={{ color: 'var(--ink-faint)' }}
                >
                  {product.brand}
                </span>
              ) : null}
            </span>

            {/* Linha 3 no mobile: fita de canais + data. */}
            <span className="order-4 lg:order-3">
              <ChannelTape product={product} />
            </span>

            <span
              className="font-mono order-5 justify-self-end text-right"
              style={{ fontSize: 11, color: 'var(--ink-faint)' }}
            >
              {new Date(product.updatedAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
              })}
            </span>
          </Link>
        )
      })}

      {/* Selo de lote: fecha o painel e carrega a legenda do vocabulário. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule-strong bg-panel py-2.5 pr-4 pl-[18px]">
        <ChannelLegend />
        <span
          className="font-mono"
          style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-faint)' }}
        >
          {String(products.length).padStart(2, '0')} LINHAS ·{' '}
          {String(pendingCount).padStart(2, '0')} A FAZER
        </span>
      </div>
    </div>
  )
}

function Footnote() {
  return (
    <footer className="mx-auto mt-10 w-full max-w-[1400px] px-4 pb-6 sm:px-6">
      <p className="label" style={{ color: 'var(--ink-faint)' }}>
        dados de exemplo · protótipo
      </p>
    </footer>
  )
}
