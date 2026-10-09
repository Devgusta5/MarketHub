'use client'

/**
 * Busca híbrida espacial — §6.4 — e filtros — §6.5.
 *
 * Encontra por nome, SKU, empresa e categoria. Escolher um resultado
 * esconde a lista e navega até a bolinha. Se o produto estiver oculto
 * por filtro, os filtros são limpos e o usuário é avisado — nunca em
 * silêncio.
 */
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Icon } from './icon'
import { CLIENTS, clientName } from '@/lib/seed'
import { MARKETPLACES, MARKETPLACE_LABELS, PRODUCT_STATE_LABELS } from '@/lib/domain'
import type { Product } from '@/lib/domain'
import { L } from '@/lib/labels'
import type { Filters } from './home'

const FILTERABLE_STATES = ['approved', 'review', 'producing', 'adjust'] as const

export function SearchBar({
  inputRef,
  products,
  filters,
  onFilters,
  onPick,
}: {
  inputRef: RefObject<HTMLInputElement | null>
  products: Product[]
  filters: Filters
  onFilters: (f: Filters) => void
  onPick: (id: string) => void
}) {
  const [term, setTerm] = useState('')
  const [openList, setOpenList] = useState(false)
  const [openFilters, setOpenFilters] = useState(false)
  const shellRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = term.trim().toLowerCase()
    if (!q) return products.slice(0, 4)
    return products
      .filter((p) =>
        `${p.name} ${p.sku} ${clientName(p.clientId)} ${p.category}`
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 8)
  }, [term, products])

  useEffect(() => {
    function onDown(e: PointerEvent) {
      if (!shellRef.current?.contains(e.target as Node)) {
        setOpenList(false)
        setOpenFilters(false)
      }
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])

  function pick(id: string) {
    setOpenList(false)
    setTerm('')
    inputRef.current?.blur()
    onPick(id)
  }

  const activeFilters =
    (filters.client !== 'all' ? 1 : 0) +
    (filters.marketplace !== 'all' ? 1 : 0) +
    (filters.state !== 'all' ? 1 : 0)

  return (
    <div
      ref={shellRef}
      className="absolute top-6 left-1/2 z-[21] w-[min(490px,calc(100vw-560px))] min-w-[280px] -translate-x-1/2 max-[1180px]:top-[89px] max-[1180px]:w-[min(540px,calc(100vw-50px))] max-[500px]:top-[79px]"
    >
      <div className="glass flex h-12 items-center gap-2.5 rounded-2xl pr-[11px] pl-[15px]">
        <Icon name="search" size={18} className="text-sub" />
        <input
          ref={inputRef}
          type="search"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value)
            setOpenList(true)
          }}
          onFocus={() => setOpenList(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) pick(results[0].id)
            if (e.key === 'Escape') {
              setOpenList(false)
              inputRef.current?.blur()
            }
          }}
          placeholder={`Pesquisar produtos, SKU ou ${L.clientLower}...`}
          aria-label="Pesquisar produtos"
          autoComplete="off"
          className="w-full min-w-0 border-0 bg-transparent tracking-[-.01em] text-text outline-none"
        />
        <span className="rounded bg-soft px-1.5 py-[3px] text-[10px] whitespace-nowrap text-sub max-[500px]:hidden">
          Ctrl K
        </span>
        <button
          onClick={() => {
            setOpenFilters((v) => !v)
            setOpenList(false)
          }}
          title="Filtros"
          aria-label="Filtros"
          aria-expanded={openFilters}
          className="relative flex size-9 items-center justify-center rounded-xl text-sub hover:bg-soft hover:text-text"
        >
          <Icon name="filter" size={18} />
          {activeFilters > 0 ? (
            <span
              className="absolute top-1 right-1 size-1.5 rounded-full"
              style={{ background: 'var(--orange)' }}
            />
          ) : null}
        </button>
      </div>

      {openList ? (
        <div
          className="glass absolute top-[55px] max-h-[370px] w-full overflow-auto rounded-[18px] p-2.5"
          // O vidro do Dock é translúcido de propósito; aqui atrás passam
          // bolinhas, então a lista precisa de fundo quase opaco para o
          // texto continuar legível.
          style={{ background: 'color-mix(in srgb, var(--solid) 96%, transparent)' }}
        >
          <div className="px-2 pt-2 pb-1.5 text-[10px] tracking-[.12em] text-sub uppercase">
            {term.trim() ? 'Produtos encontrados' : 'Acesso recente'}
          </div>
          {results.length === 0 ? (
            <p className="p-4 text-xs leading-relaxed text-sub">
              Nenhum resultado. Revise a busca ou os filtros.
            </p>
          ) : (
            results.map((p) => (
              <button
                key={p.id}
                onClick={() => pick(p.id)}
                className="flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left hover:bg-soft"
              >
                <span className="size-10 shrink-0 overflow-hidden rounded-full bg-white">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" className="size-full object-contain" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-xs font-semibold">{p.name}</strong>
                  <span className="block truncate text-[10px] text-sub">
                    {clientName(p.clientId)} · {p.sku}
                  </span>
                </span>
                <Icon name="arrow" size={15} className="text-sub" />
              </button>
            ))
          )}
          <p className="px-2 pt-2 pb-1 text-[10px] text-sub">
            Enter seleciona · Esc fecha · Ctrl K busca
          </p>
        </div>
      ) : null}

      {openFilters ? (
        <FilterBox
          filters={filters}
          onApply={(f) => {
            onFilters(f)
            setOpenFilters(false)
          }}
          onClose={() => setOpenFilters(false)}
        />
      ) : null}
    </div>
  )
}

function FilterBox({
  filters,
  onApply,
  onClose,
}: {
  filters: Filters
  onApply: (f: Filters) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState(filters)
  const control =
    'w-full rounded-lg border border-line bg-soft px-2.5 py-2 text-xs text-text outline-none focus:border-[rgba(255,106,0,.5)]'

  return (
    <div
      className="glass absolute top-[55px] right-0 w-[260px] rounded-[18px] p-4"
      style={{ background: 'color-mix(in srgb, var(--solid) 96%, transparent)' }}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Filtrar universo</h4>
        <button
          onClick={onClose}
          aria-label="Fechar filtros"
          className="flex size-7 items-center justify-center rounded-lg text-sub hover:bg-soft"
        >
          <Icon name="close" size={15} />
        </button>
      </div>

      <label className="mb-2.5 block">
        <span className="mb-1.5 block text-[11px] text-sub">{L.client}</span>
        <select
          value={draft.client}
          onChange={(e) => setDraft({ ...draft, client: e.target.value })}
          className={control}
        >
          <option value="all">Todas as {L.clientPluralLower}</option>
          {CLIENTS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="mb-2.5 block">
        <span className="mb-1.5 block text-[11px] text-sub">Marketplace</span>
        <select
          value={draft.marketplace}
          onChange={(e) => setDraft({ ...draft, marketplace: e.target.value })}
          className={control}
        >
          <option value="all">Todos os marketplaces</option>
          {MARKETPLACES.map((m) => (
            <option key={m} value={m}>
              {MARKETPLACE_LABELS[m]}
            </option>
          ))}
        </select>
      </label>

      <label className="mb-3 block">
        <span className="mb-1.5 block text-[11px] text-sub">Estado</span>
        <select
          value={draft.state}
          onChange={(e) => setDraft({ ...draft, state: e.target.value })}
          className={control}
        >
          <option value="all">Todos os estados</option>
          {FILTERABLE_STATES.map((s) => (
            <option key={s} value={s}>
              {PRODUCT_STATE_LABELS[s]}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={() => onApply(draft)}
        className="mb-1.5 w-full rounded-xl py-2.5 text-xs font-semibold text-white"
        style={{ background: 'var(--accent-gradient)' }}
      >
        Aplicar filtros
      </button>
      <button
        onClick={() => onApply({ client: 'all', marketplace: 'all', state: 'all' })}
        className="w-full rounded-xl py-2 text-xs text-sub hover:bg-soft hover:text-text"
      >
        Limpar filtros
      </button>
    </div>
  )
}
