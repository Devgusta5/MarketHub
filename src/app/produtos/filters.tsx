'use client'

/**
 * Filtros do catálogo — briefing §11: busca clara, filtros combináveis,
 * contexto preservado ao abrir e voltar de um produto (vivem na URL).
 */
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { Search, X } from 'lucide-react'
import {
  CHANNEL_STATUSES,
  CHANNEL_STATUS_LABELS,
  MARKETPLACES,
  MARKETPLACE_LABELS,
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABELS,
} from '@/lib/types'
import { Button } from '@/components/ui'

export function CatalogFiltersBar() {
  const router = useRouter()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()
  const urlTerm = params.get('q') ?? ''
  // key={urlTerm} remonta o campo quando a URL muda por fora (voltar, limpar),
  // em vez de sincronizar estado dentro de um efeito.
  const [term, setTerm] = useState(urlTerm)

  function apply(mutate: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString())
    mutate(next)
    const qs = next.toString()
    startTransition(() => router.push(qs ? `/produtos?${qs}` : '/produtos'))
  }

  // Busca sem recarregar a cada tecla.
  useEffect(() => {
    if (term === urlTerm) return
    const id = setTimeout(() => {
      apply((next) => {
        if (term.trim()) next.set('q', term.trim())
        else next.delete('q')
      })
    }, 300)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, urlTerm])

  function toggle(key: string, value: string) {
    apply((next) => {
      const current = next.getAll(key)
      next.delete(key)
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      for (const v of updated) next.append(key, v)
    })
  }

  const activeStatus = params.getAll('status')
  const activeChannelStatus = params.getAll('channelStatus')
  const activeChannel = params.get('channel') ?? ''
  const hasAny = Boolean(
    params.get('q') || activeStatus.length || activeChannelStatus.length,
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <Search
          size={14}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-tertiary"
          aria-hidden
        />
        <input
          key={urlTerm}
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar por nome, SKU, marca ou tag"
          aria-label="Buscar produtos"
          className="h-9 w-full rounded-md border border-border bg-surface pr-3 pl-8 text-[13px] outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
        />
      </div>

      <FilterMenu
        label="Estado"
        count={activeStatus.length}
        options={PRODUCT_STATUSES.map((s) => ({
          value: s,
          label: PRODUCT_STATUS_LABELS[s],
          checked: activeStatus.includes(s),
        }))}
        onToggle={(v) => toggle('status', v)}
      />

      <FilterMenu
        label="Situação no canal"
        count={activeChannelStatus.length}
        options={CHANNEL_STATUSES.map((s) => ({
          value: s,
          label: CHANNEL_STATUS_LABELS[s],
          checked: activeChannelStatus.includes(s),
        }))}
        onToggle={(v) => toggle('channelStatus', v)}
        extra={
          <div className="border-t border-border px-3 py-2">
            <label
              htmlFor="channel-select"
              className="mb-1.5 block text-[11px] text-text-secondary"
            >
              Em qual canal
            </label>
            <select
              id="channel-select"
              value={activeChannel}
              onChange={(e) =>
                apply((next) => {
                  if (e.target.value) next.set('channel', e.target.value)
                  else next.delete('channel')
                })
              }
              className="h-8 w-full rounded-md border border-border bg-surface px-2 text-[13px] outline-none focus:border-accent"
            >
              <option value="">Qualquer canal</option>
              {MARKETPLACES.map((m) => (
                <option key={m} value={m}>
                  {MARKETPLACE_LABELS[m]}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {hasAny ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startTransition(() => router.push('/produtos'))}
        >
          <X size={13} aria-hidden />
          Limpar
        </Button>
      ) : null}

      {pending ? (
        <span className="text-[11px] text-text-tertiary" role="status">
          Atualizando…
        </span>
      ) : null}
    </div>
  )
}

function FilterMenu({
  label,
  count,
  options,
  onToggle,
  extra,
}: {
  label: string
  count: number
  options: Array<{ value: string; label: string; checked: boolean }>
  onToggle: (value: string) => void
  extra?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Button size="sm" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {label}
        {count > 0 ? (
          <span className="rounded bg-accent-surface px-1 text-[11px] font-semibold text-accent-text">
            {count}
          </span>
        ) : null}
      </Button>

      {open ? (
        <>
          <button
            className="fixed inset-0 z-10 cursor-default"
            aria-label="Fechar filtro"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 z-20 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-surface-raised shadow-pop">
            <div className="py-1">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 text-[13px] hover:bg-surface-sunken"
                >
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={() => onToggle(option.value)}
                    className="size-3.5 accent-[var(--accent)]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {extra}
          </div>
        </>
      ) : null}
    </div>
  )
}
