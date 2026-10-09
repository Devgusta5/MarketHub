'use client'

/**
 * Home espacial — §6.
 *
 * Universo de bolinhas, uma por produto. Sem texto de boas-vindas,
 * título genérico ou mostruário promocional: o §6.1 proíbe.
 *
 * Esta é a versão DOM. A etapa 3 do PLANO troca o desenho por PixiJS,
 * mantendo a mesma camada de acessibilidade e os mesmos gestos.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dock, ActivityTrigger, type DockKey } from './dock'
import { HomeTop } from './home-top'
import { Icon } from './icon'
import { Universe } from './universe'
import { SearchBar } from './search'
import { CLIENTS, clientName, seedProducts } from '@/lib/seed'
import type { Product } from '@/lib/domain'

export type Filters = { client: string; marketplace: string; state: string }

const NO_FILTERS: Filters = { client: 'all', marketplace: 'all', state: 'all' }

export function HomeScreen() {
  const [products] = useState<Product[]>(() => seedProducts())
  const [filters, setFilters] = useState<Filters>(NO_FILTERS)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [dock, setDock] = useState<DockKey | null>('home')
  const searchRef = useRef<HTMLInputElement>(null)

  const visible = useMemo(() => {
    return products.filter(
      (p) =>
        (filters.client === 'all' || p.clientId === filters.client) &&
        (filters.marketplace === 'all' ||
          p.marketplaces.includes(filters.marketplace as Product['marketplaces'][number])) &&
        (filters.state === 'all' || p.state === filters.state),
    )
  }, [products, filters])

  const visibleIds = useMemo(() => new Set(visible.map((p) => p.id)), [visible])

  /** §6.4: se o produto está oculto por filtro, avisar e revelar — nunca
      apagar os filtros em silêncio. */
  const reveal = useCallback(
    (id: string) => {
      if (!visibleIds.has(id)) setFilters(NO_FILTERS)
      setFocusId(id)
    },
    [visibleIds],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <main
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'var(--home-bg)' }}
      aria-label="Universo de produtos"
    >
      <Universe
        products={products}
        visibleIds={visibleIds}
        focusId={focusId}
        onFocusHandled={() => setFocusId(null)}
        onOpen={setOpenId}
      />

      <HomeTop onProfile={() => setDock('settings')} />

      <SearchBar
        inputRef={searchRef}
        products={products}
        filters={filters}
        onFilters={setFilters}
        onPick={reveal}
      />

      <Dock active={dock} onSelect={setDock} />
      <ActivityTrigger count={0} onClick={() => setDock(null)} />

      {openId ? (
        <ProductPreview
          product={products.find((p) => p.id === openId)!}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </main>
  )
}

/** Cartão de prévia — §6.2: expansão da bolinha em prévia funcional. */
function ProductPreview({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const approved = product.materials.filter((m) => m.creative === 'approved').length

  return (
    <div className="fixed inset-0 z-[31]">
      <button
        className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-md"
        aria-label="Fechar prévia"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="absolute top-1/2 left-1/2 max-h-[calc(100vh-60px)] w-[min(520px,calc(100vw-30px))] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-[24px] border border-line bg-solid p-6 shadow-deep"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="eyebrow">Prévia do produto</span>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex size-9 items-center justify-center rounded-xl text-sub hover:bg-soft hover:text-text"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex items-start gap-[18px]">
          <div className="aspect-square w-[190px] max-w-[45%] shrink-0 overflow-hidden rounded-[20px] bg-white shadow-soft">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt=""
                className="size-full object-contain"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[23px] leading-tight tracking-[-.04em]">{product.name}</h2>
            <p className="mt-2 text-xs text-sub">
              {clientName(product.clientId)} · {product.category}
            </p>
            <p className="mt-4 text-xs text-sub">SKU {product.sku}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            [product.materials.length, 'Materiais'],
            [approved, 'Aprovados'],
            [product.marketplaces.length, 'Marketplaces'],
          ].map(([v, l]) => (
            <div key={l} className="rounded-2xl bg-soft p-4">
              <strong className="block text-[22px] tracking-[-.04em]">{v}</strong>
              <span className="text-[11px] text-sub">{l}</span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[11px] text-sub">
          Workspace, criação e geração entram nas próximas etapas do porte.
        </p>
      </div>
    </div>
  )
}

export { CLIENTS }
