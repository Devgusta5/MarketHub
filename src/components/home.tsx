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
import { CreationWindow } from './creation'
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
import { Workspace } from './workspace'
import { CLIENTS, clientName, seedProducts, spiralCells } from '@/lib/seed'
import { L } from '@/lib/labels'
import { emptyCreation, packageSummary, plannedMethod, type Creation } from '@/lib/creation'
import { closeTab, openTab, type Tab, type WsSection } from '@/lib/workspace'
import {
  MATERIAL_LABELS,
  type Job,
  type Material,
  type Product,
} from '@/lib/domain'

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
  const [products, setProducts] = useState<Product[]>(() => seedProducts())
  const [jobs, setJobs] = useState<Job[]>([])
  const [creation, setCreation] = useState<Creation | null>(null)
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
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

  /** §13.1: abrir produto cria ou foca a aba — nunca duplica. */
  const openProduct = useCallback((productId: string, section?: WsSection) => {
    setTabs((list) => {
      const next = openTab(list, productId, section)
      setActiveTab(next.activeId)
      return next.tabs
    })
    setOverlay({ kind: 'none' })
    setCreation((c) => (c ? { ...c, minimized: true } : c))
  }, [])

  const patchTab = useCallback(
    (patch: Partial<Tab>) => {
      setTabs((list) =>
        list.map((t) => (t.productId === activeTab ? { ...t, ...patch } : t)),
      )
    },
    [activeTab],
  )

  const patchProduct = useCallback((productId: string, patch: Partial<Product>) => {
    setProducts((list) =>
      list.map((p) => (p.id === productId ? { ...p, ...patch } : p)),
    )
  }, [])

  const patchCreation = useCallback((patch: Partial<Creation>) => {
    setCreation((c) => (c ? { ...c, ...patch } : c))
  }, [])

  /**
   * Passo 6 do §7.1: identidade e empresa confirmadas criam a ficha
   * definitiva, e é NESTE momento que a bolinha aparece na Home.
   *
   * A célula vem da primeira posição livre da espiral, então o produto
   * novo não embaralha as bolinhas existentes (§6.2).
   */
  const confirmIdentity = useCallback(() => {
    if (!creation) return
    const id = `prod-new-${Date.now().toString(36)}`

    // O updater não pode criar o produto: o React o executa duas vezes
    // em modo estrito e nasceriam duas bolinhas. A escrita acontece aqui,
    // uma vez, e a célula sai da espiral a partir do tamanho atual.
    setProducts((list) => {
      if (list.some((p) => p.id === id)) return list
      const cells = spiralCells(list.length + 1)
      const product: Product = {
        id,
        clientId: creation.clientId,
        name: creation.name.trim(),
        sku: creation.sku.trim() || `NOVO-${list.length + 1}`,
        category: creation.category,
        artworkKind: '',
        imageUrl: creation.imageDataUrl,
        state: 'registered',
        marketplaces: creation.marketplaces,
        materials: [],
        content: {},
        attributes: {},
        video: 'none',
        createdAt: new Date().toISOString(),
        cell: cells[list.length],
      }
      return [...list, product]
    })

    setCreation((c) => (c ? { ...c, stage: 'package', productId: id } : c))
    say('Identidade confirmada: a bolinha apareceu na Home.')
  }, [creation, say])

  /**
   * Passo 8: autorização de produção. Separada da identidade de
   * propósito — confirmar o que é o produto não autoriza gastar.
   */
  const authorize = useCallback(() => {
    const c = creation
    if (!c || !c.productId) return
    const productId = c.productId

    if (c.profile === 'register') {
      setCreation((cur) => (cur ? { ...cur, stage: 'done' } : cur))
      say('Produto cadastrado. Nenhuma geração foi disparada.')
      return
    }

    {
      const materials: Material[] = c.selectedMaterials.map((kind, i) => {
        const plan = plannedMethod(kind, c.profile)
        const mid = `mat-${productId}-${i}`
        return {
          id: mid,
          kind,
          label: MATERIAL_LABELS[kind],
          method: plan.paid
            ? c.profile === 'premium'
              ? 'ai_premium'
              : 'ai_economic'
            : kind === 'cover'
              ? 'reuse'
              : 'template',
          creative: 'generating',
          release: {},
          activeVersionId: `${mid}-v1`,
          versions: [
            {
              id: `${mid}-v1`,
              parentId: null,
              version: 1,
              createdAt: new Date().toISOString(),
              method: plan.paid ? 'ai_economic' : 'template',
            },
          ],
        }
      })

      setProducts((list) =>
        list.map((p) =>
          p.id === productId ? { ...p, materials, state: 'producing' } : p,
        ),
      )

      const summary = packageSummary(c)
      const jobId = `job-${Date.now().toString(36)}`
      setJobs((list) =>
        list.some((j) => j.id === jobId)
          ? list
          : [
              ...list,
              {
                id: jobId,
                name: c.name.trim(),
                productId,
                kind: 'generation',
                state: 'processing',
                priority: 'normal',
                done: 0,
                total: materials.length,
                createdAt: new Date().toISOString(),
                estimatedCost: summary.paid * 18,
              },
            ],
      )

      setCreation((cur) => (cur ? { ...cur, stage: 'done' } : cur))
      say('Produção autorizada. Acompanhe em Atividades.')
    }
  }, [creation, say])

  function onDock(key: DockKey) {
    if (key === 'home') {
      setOverlay({ kind: 'none' })
      recenterRef.current?.()
      return
    }
    if (key === 'create') {
      setOverlay({ kind: 'none' })
      // §8: se já existe uma criação em andamento, restaura em vez de
      // começar outra e perder o rascunho.
      setCreation((c) => (c ? { ...c, minimized: false } : emptyCreation(CLIENTS[0].id)))
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
    openProduct(products[0].id, tool === 'content' ? 'content' : tool === 'fiscal' ? 'fiscal' : tool === 'video' ? 'video' : 'images')
    say('Ferramenta aberta num produto de demonstração.')
  }

  // Análise simulada: 1,9s e o produto fica aguardando confirmação.
  // §8: termina em "aguardando confirmação", nunca começa a gerar sozinho.
  useEffect(() => {
    if (creation?.stage !== 'analyzing') return
    const t = setTimeout(() => {
      patchCreation({ stage: 'confirm' })
      say('Análise concluída. Confirme a identidade do produto.')
    }, 1900)
    return () => clearTimeout(t)
  }, [creation?.stage, patchCreation, say])

  // Progresso das gerações. §12.3: conta materiais prontos, não
  // porcentagem inventada, e cada um fica disponível assim que termina.
  useEffect(() => {
    if (!jobs.some((j) => j.state === 'processing')) return
    const timer = setInterval(() => {
      setJobs((list) =>
        list.map((job) => {
          if (job.state !== 'processing') return job
          const done = job.done + 1
          if (done >= job.total) {
            setProducts((ps) =>
              ps.map((p) =>
                p.id === job.productId
                  ? {
                      ...p,
                      state: 'review',
                      materials: p.materials.map((m) => ({
                        ...m,
                        creative: 'review' as const,
                      })),
                    }
                  : p,
              ),
            )
            return { ...job, done: job.total, state: 'done' as const }
          }
          // Material pronto já aparece revisável, sem esperar o pacote.
          setProducts((ps) =>
            ps.map((p) =>
              p.id === job.productId
                ? {
                    ...p,
                    materials: p.materials.map((m, i) =>
                      i < done ? { ...m, creative: 'review' as const } : m,
                    ),
                  }
                : p,
            ),
          )
          return { ...job, done }
        }),
      )
    }, 1400)
    return () => clearInterval(timer)
  }, [jobs])

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

      {activeTab ? null : <HomeTop onProfile={() => setOverlay({ kind: 'profile' })} />}

      {activeTab ? null : <SearchBar
        inputRef={searchRef}
        products={products}
        filters={filters}
        onFilters={setFilters}
        onPick={reveal}
      />}

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
          onOpenJob={(job) => {
            if (job.productId) openProduct(job.productId)
          }}
        />
      ) : null}

      {overlay.kind === 'profile' ? <ProfilePanel onClose={close} /> : null}

      {overlay.kind === 'preview' ? (
        <ProductPreview
          product={products.find((p) => p.id === overlay.productId)!}
          onClose={close}
          onOpen={() => openProduct(overlay.productId)}
        />
      ) : null}

      {creation ? (
        <CreationWindow
          creation={creation}
          onChange={patchCreation}
          onMinimize={() => {
            patchCreation({ minimized: true })
            say('Janela minimizada. O trabalho continua disponível.')
          }}
          onRestore={() => patchCreation({ minimized: false })}
          onConfirmIdentity={confirmIdentity}
          onAuthorize={authorize}
          onFinish={(openWorkspace) => {
            const id = creation.productId
            setCreation(null)
            if (openWorkspace && id) {
              openProduct(id)
            } else if (id) {
              setFocusId(id)
            }
          }}
        />
      ) : null}

      {/* O Workspace cobre a Home, mas o Dock continua visível (§6.6). */}
      {activeTab ? (
        <Workspace
          products={products}
          tabs={tabs}
          activeId={activeTab}
          onPatchTab={patchTab}
          onFocusTab={setActiveTab}
          onCloseTab={(id) => {
            // §13.1: fechar aba não apaga produto nem cancela tarefa.
            setTabs((list) => {
              const next = closeTab(list, id, activeTab)
              setActiveTab(next.activeId)
              return next.tabs
            })
          }}
          onBack={() => setActiveTab(null)}
          onPatchProduct={patchProduct}
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
  onOpen,
}: {
  product: Product
  onClose: () => void
  onOpen: () => void
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
            onClick={onOpen}
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
