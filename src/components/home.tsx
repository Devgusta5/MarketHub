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
import { ActivityTrigger, Dock, type DockKey } from './dock'
import { HomeTop } from './home-top'
import { Icon } from './icon'
import { Toast } from './modal'
import {
  ActivitiesPanel,
  ClientsPanel,
  Launchpad,
  ProfilePanel,
  SettingsPanel,
  type ToolKey,
} from './panels'
import { SearchBar } from './search'
import { Universe } from './universe'
import { clientName, seedProducts } from '@/lib/seed'
import { L } from '@/lib/labels'
import type { Job, Product } from '@/lib/domain'

export type Filters = { client: string; marketplace: string; state: string }

const NO_FILTERS: Filters = { client: 'all', marketplace: 'all', state: 'all' }

/** Painel aberto sobre a Home. Só um por vez. */
type Overlay =
  | { kind: 'none' }
  | { kind: 'tools' }
  | { kind: 'clients' }
  | { kind: 'settings' }
  | { kind: 'activities' }
  | { kind: 'profile' }
  | { kind: 'preview'; productId: string }

export function HomeScreen() {
  const [products] = useState<Product[]>(() => seedProducts())
  const [jobs] = useState<Job[]>([])
  const [filters, setFilters] = useState<Filters>(NO_FILTERS)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [overlay, setOverlay] = useState<Overlay>({ kind: 'none' })
  const [toast, setToast] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const recenterRef = useRef<(() => void) | null>(null)

  const say = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3400)
  }, [])

  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (filters.client === 'all' || p.clientId === filters.client) &&
          (filters.marketplace === 'all' ||
            p.marketplaces.includes(
              filters.marketplace as Product['marketplaces'][number],
            )) &&
          (filters.state === 'all' || p.state === filters.state),
      ),
    [products, filters],
  )

  const visibleIds = useMemo(() => new Set(visible.map((p) => p.id)), [visible])

  /** §6.4: produto oculto por filtro é revelado com aviso, nunca em silêncio. */
  const reveal = useCallback(
    (id: string) => {
      if (!visibleIds.has(id)) {
        setFilters(NO_FILTERS)
        say('Filtros redefinidos para revelar o produto.')
      }
      setFocusId(id)
    },
    [visibleIds, say],
  )

  function onDock(key: DockKey) {
    if (key === 'home') {
      setOverlay({ kind: 'none' })
      recenterRef.current?.()
      return
    }
    if (key === 'create') {
      setOverlay({ kind: 'none' })
      say('Nova criação entra na próxima etapa do porte.')
      return
    }
    setOverlay({ kind: key === 'clients' ? 'clients' : key === 'tools' ? 'tools' : 'settings' })
  }

  function onTool(tool: ToolKey) {
    if (tool === 'library') {
      setOverlay({ kind: 'clients' })
      return
    }
    if (tool === 'metrics') {
      setOverlay({ kind: 'settings' })
      return
    }
    setOverlay({ kind: 'none' })
    say('O Workspace do produto entra na próxima etapa do porte.')
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOverlay({ kind: 'none' })
        searchRef.current?.focus()
        searchRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const close = useCallback(() => setOverlay({ kind: 'none' }), [])

  // O item aceso no Dock reflete o painel aberto.
  const dockActive: DockKey | null =
    overlay.kind === 'clients'
      ? 'clients'
      : overlay.kind === 'tools'
        ? 'tools'
        : overlay.kind === 'settings'
          ? 'settings'
          : overlay.kind === 'none'
            ? 'home'
            : null

  const running = jobs.filter((j) =>
    ['processing', 'queued', 'awaiting_budget'].includes(j.state),
  ).length

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
        onOpen={(id) => setOverlay({ kind: 'preview', productId: id })}
        onReady={(fn) => (recenterRef.current = fn)}
      />

      <HomeTop onProfile={() => setOverlay({ kind: 'profile' })} />

      <SearchBar
        inputRef={searchRef}
        products={products}
        filters={filters}
        onFilters={setFilters}
        onPick={reveal}
      />

      <Dock active={dockActive} onSelect={onDock} />
      <ActivityTrigger
        count={running}
        onClick={() => setOverlay({ kind: 'activities' })}
      />

      {overlay.kind === 'tools' ? <Launchpad onClose={close} onTool={onTool} /> : null}

      {overlay.kind === 'clients' ? (
        <ClientsPanel
          products={products}
          onClose={close}
          onPick={(clientId) => {
            setFilters({ ...NO_FILTERS, client: clientId })
            close()
            say(`Filtrado por ${clientName(clientId)}`)
          }}
        />
      ) : null}

      {overlay.kind === 'settings' ? (
        <SettingsPanel onClose={close} onRecenter={() => recenterRef.current?.()} />
      ) : null}

      {overlay.kind === 'activities' ? (
        <ActivitiesPanel
          jobs={jobs}
          onClose={close}
          onOpenJob={() => say('O Workspace entra na próxima etapa.')}
        />
      ) : null}

      {overlay.kind === 'profile' ? <ProfilePanel onClose={close} /> : null}

      {overlay.kind === 'preview' ? (
        <ProductPreview
          product={products.find((p) => p.id === overlay.productId)!}
          onClose={close}
          onSay={say}
        />
      ) : null}

      <Toast message={toast} />
    </main>
  )
}

/** Cartão de prévia — §6.2: expansão da bolinha em prévia funcional. */
function ProductPreview({
  product,
  onClose,
  onSay,
}: {
  product: Product
  onClose: () => void
  onSay: (m: string) => void
}) {
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
        className="absolute top-1/2 left-1/2 max-h-[calc(100vh-60px)] w-[min(520px,calc(100vw-30px))] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-[24px] border border-line bg-solid p-6 shadow-deep max-[500px]:p-4"
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

        <div className="flex items-start gap-[18px] max-[500px]:flex-col">
          <div className="aspect-square w-[190px] max-w-[45%] shrink-0 overflow-hidden rounded-[20px] bg-white shadow-soft max-[500px]:max-w-none">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt="" className="size-full object-contain" />
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
          {(
            [
              [product.materials.length, 'Materiais'],
              [approved, 'Aprovados'],
              [product.marketplaces.length, 'Marketplaces'],
            ] as const
          ).map(([v, l]) => (
            <div key={l} className="rounded-2xl bg-soft p-4">
              <strong className="block text-[22px] tracking-[-.04em]">{v}</strong>
              <span className="text-[11px] text-sub">{l}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => {
              onClose()
              onSay('O Workspace do produto entra na próxima etapa do porte.')
            }}
            className="inline-flex min-h-[39px] items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white"
            style={{ background: 'var(--accent-gradient)' }}
          >
            Abrir workspace
            <Icon name="arrow" size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export { L }
