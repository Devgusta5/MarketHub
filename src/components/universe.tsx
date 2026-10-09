'use client'

/**
 * A malha espacial — §6.2, §6.3, §6.9.
 *
 * O desenho é WebGL (PixiJS), que aguenta milhares de bolinhas onde o
 * DOM trava. Mas canvas não tem semântica: não recebe Tab, não é lido
 * por leitor de tela.
 *
 * Por isso existem DUAS camadas:
 *
 *   1. O canvas, que só pinta. aria-hidden, sem eventos de ponteiro.
 *   2. Uma camada DOM espelhada com um <button> real por bolinha. É ela
 *      que recebe clique, foco e teclado.
 *
 * Mais a visão em lista, que o §39.1 exige como rota alternativa para
 * quem não navega no espaço.
 *
 * Gestos (§6.3): arraste move, roda desloca vertical, Shift+roda
 * horizontal, Ctrl+roda controla zoom centrado no cursor.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from './icon'
import { cellToPoint, clientName } from '@/lib/seed'
import { PRODUCT_STATE_LABELS, type Product } from '@/lib/domain'
import { UniverseScene, type SceneNode, type View } from '@/lib/universe-scene'
import { usePrefs } from '@/lib/prefs'

const MIN_Z = 0.45
const MAX_Z = 2.3
/** Acima disso o ponteiro arrastou, então não é clique (§6.2). */
const DRAG_SLOP = 6
const BUBBLE = 88

export function Universe({
  products,
  visibleIds,
  focusId,
  onFocusHandled,
  onOpen,
  onReady,
}: {
  products: Product[]
  visibleIds: Set<string>
  focusId: string | null
  onFocusHandled: () => void
  onOpen: (id: string) => void
  onReady?: (recenter: () => void) => void
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<UniverseScene | null>(null)
  const viewRef = useRef<View>({ x: 0, y: 0, z: 1 })
  const drag = useRef<{ id: number; px: number; py: number; moved: number } | null>(null)

  // A view vive em estado porque a camada DOM espelhada precisa dela a
  // cada quadro; o ref é só o espelho para ler dentro de handlers sem
  // depender da closure.
  const [view, setView] = useState<View>({ x: 0, y: 0, z: 1 })
  // O init do Pixi é assíncrono. Sem este sinal, o efeito de sync roda
  // antes da cena existir e nada é desenhado.
  const [sceneReady, setSceneReady] = useState(false)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [listMode, setListMode] = useState(false)
  const [hover, setHover] = useState<string | null>(null)
  const { theme, hydrated } = usePrefs()

  const nodes: SceneNode[] = useMemo(
    () =>
      products.map((p) => {
        const pt = cellToPoint(p.cell)
        return {
          id: p.id,
          x: pt.x,
          y: pt.y,
          imageUrl: p.imageUrl,
          flagged: p.state === 'adjust' || p.state === 'producing',
        }
      }),
    [products],
  )

  const domLayerRef = useRef<HTMLDivElement>(null)
  const syncFrame = useRef<number | null>(null)

  /**
   * Move a câmera.
   *
   * O canvas e a camada DOM são atualizados direto no DOM, sem passar
   * pelo React: com 3.000 produtos, re-renderizar a cada pointermove
   * custava 164 ms por quadro. O estado só é atualizado no fim do
   * gesto, quando a virtualização precisa recalcular quem está visível.
   */
  const applyView = useCallback((next: View) => {
    viewRef.current = next
    sceneRef.current?.setView(next)
    if (domLayerRef.current) {
      domLayerRef.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0) scale(${next.z})`
    }
    if (syncFrame.current !== null) cancelAnimationFrame(syncFrame.current)
    syncFrame.current = requestAnimationFrame(() => {
      syncFrame.current = null
      setView(viewRef.current)
    })
  }, [])

  useEffect(
    () => () => {
      if (syncFrame.current !== null) cancelAnimationFrame(syncFrame.current)
    },
    [],
  )

  const center = useCallback(() => {
    const el = hostRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    applyView({ x: r.width * 0.5, y: r.height * 0.51, z: r.width < 700 ? 0.78 : 1.04 })
  }, [applyView])

  // Monta a cena uma vez.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const scene = new UniverseScene()
    sceneRef.current = scene
    const measure = () => {
      const r = host.getBoundingClientRect()
      setSize({ w: r.width, h: r.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(host)

    void scene.mount(host, () => {
      setSceneReady(true)
      center()
      onReady?.(center)
    })
    return () => {
      ro.disconnect()
      setSceneReady(false)
      scene.destroy()
      sceneRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sincroniza nós quando a cena fica pronta e quando produtos ou
  // filtros mudam.
  useEffect(() => {
    if (!sceneReady) return
    void sceneRef.current?.sync(nodes, visibleIds)
  }, [sceneReady, nodes, visibleIds])

  useEffect(() => {
    sceneRef.current?.setHover(hover)
  }, [hover])

  useEffect(() => {
    if (sceneReady) sceneRef.current?.setTheme(hydrated ? theme : 'dark')
  }, [sceneReady, theme, hydrated])

  // §6.4: voar até o produto escolhido na busca.
  useEffect(() => {
    if (!focusId) return
    const el = hostRef.current
    const node = nodes.find((n) => n.id === focusId)
    if (!el || !node) return
    const r = el.getBoundingClientRect()
    const z = Math.max(1, viewRef.current.z)
    applyView({ x: r.width * 0.5 - node.x * z, y: r.height * 0.51 - node.y * z, z })
    sceneRef.current?.setFocus(focusId)
    const t = setTimeout(() => {
      sceneRef.current?.setFocus(null)
      onFocusHandled()
    }, 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId])

  const zoomBy = useCallback(
    (mult: number, px?: number, py?: number) => {
      const el = hostRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const mx = px ?? r.width * 0.55
      const my = py ?? r.height * 0.53
      const v = viewRef.current
      const nz = Math.max(MIN_Z, Math.min(MAX_Z, v.z * mult))
      applyView({
        z: nz,
        x: mx - (mx - v.x) * (nz / v.z),
        y: my - (my - v.y) * (nz / v.z),
      })
    },
    [applyView],
  )

  // Wheel precisa de listener não-passivo para usar preventDefault.
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const v = viewRef.current
      if (e.ctrlKey) {
        const r = el!.getBoundingClientRect()
        zoomBy(Math.exp(-e.deltaY * 0.0013), e.clientX - r.left, e.clientY - r.top)
      } else if (e.shiftKey) {
        applyView({ ...v, x: v.x - e.deltaY })
      } else {
        applyView({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY })
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomBy, applyView])

  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0 && e.pointerType !== 'touch') return
    drag.current = { id: e.pointerId, px: e.clientX, py: e.clientY, moved: 0 }
    if (!(e.target as HTMLElement).closest('[data-node]')) {
      hostRef.current?.setPointerCapture(e.pointerId)
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.px
    const dy = e.clientY - d.py
    d.moved += Math.hypot(dx, dy)
    d.px = e.clientX
    d.py = e.clientY
    const v = viewRef.current
    applyView({ ...v, x: v.x + dx, y: v.y + dy })
  }

  function endDrag() {
    if (drag.current) setTimeout(() => (drag.current = null), 0)
  }

  function tryOpen(id: string) {
    if (drag.current && drag.current.moved > DRAG_SLOP) return
    onOpen(id)
  }

  const visibleProducts = products.filter((p) => visibleIds.has(p.id))

  /**
   * Virtualização da camada DOM — §6.9.
   *
   * O canvas aguenta milhares de bolinhas, mas um <button> por produto
   * derruba o FPS no pan (medido: 2 FPS com 3.000). Só entram no DOM os
   * nós dentro do viewport, com uma margem para o foco por teclado não
   * cair num elemento que acabou de sair.
   */
  const domNodes = useMemo(() => {
    if (size.w === 0) return []
    const margin = BUBBLE * 2
    return nodes.filter((n) => {
      const sx = n.x * view.z + view.x
      const sy = n.y * view.z + view.y
      return sx > -margin && sx < size.w + margin && sy > -margin && sy < size.h + margin
    })
  }, [nodes, view, size])

  /** Índice por id: `find` linear por nó custa caro com milhares. */
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])

  if (listMode) {
    return (
      <ListView
        products={visibleProducts}
        onOpen={onOpen}
        onBack={() => setListMode(false)}
      />
    )
  }

  return (
    <>
      <div
        ref={hostRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="absolute inset-0 cursor-grab touch-none overflow-hidden active:cursor-grabbing"
        style={{
          backgroundImage: 'radial-gradient(var(--mesh) .8px, transparent .8px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* Camada DOM espelhada: transparente, mas é ela que interage.
            Sem isso o canvas seria inacessível por teclado (§39.1). */}
        <div
          ref={domLayerRef}
          className="pointer-events-none absolute top-0 left-0 size-px origin-top-left"
          style={{
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.z})`,
          }}
        >
          {domNodes.map((node) => {
            const product = byId.get(node.id)
            if (!product) return null
            const shown = visibleIds.has(node.id)
            return (
              <button
                key={node.id}
                data-node
                onClick={() => tryOpen(node.id)}
                onPointerEnter={() => setHover(node.id)}
                onPointerLeave={() => setHover((h) => (h === node.id ? null : h))}
                onFocus={() => setHover(node.id)}
                onBlur={() => setHover((h) => (h === node.id ? null : h))}
                aria-hidden={!shown}
                tabIndex={shown ? 0 : -1}
                aria-label={`${product.name}, ${clientName(product.clientId)}, SKU ${product.sku}, ${PRODUCT_STATE_LABELS[product.state]}`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-0 bg-transparent ${
                  shown ? 'group pointer-events-auto' : 'pointer-events-none'
                }`}
                style={{ left: node.x, top: node.y, width: BUBBLE, height: BUBBLE }}
              >
                <span className="pointer-events-none absolute -bottom-8 left-1/2 max-w-[185px] min-w-[120px] -translate-x-1/2 translate-y-1 overflow-hidden rounded-[9px] border border-line bg-solid px-2.5 py-[5px] text-[10px] font-semibold text-ellipsis whitespace-nowrap text-text opacity-0 shadow-soft transition-[opacity,transform] duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  {product.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="absolute right-8 bottom-[123px] z-[12] flex flex-col gap-[7px] max-[800px]:right-4 max-[800px]:bottom-[106px] max-[500px]:bottom-[152px]">
        <ViewControl icon="plus" label="Aproximar" onClick={() => zoomBy(1.18)} />
        <ViewControl icon="minus" label="Afastar" onClick={() => zoomBy(0.85)} />
        <ViewControl icon="target" label="Recentralizar" onClick={center} />
        {/* §39.1: rota alternativa, sem depender do movimento espacial. */}
        <ViewControl icon="list" label="Ver em lista" onClick={() => setListMode(true)} />
      </div>
    </>
  )
}

function ViewControl({
  icon,
  label,
  onClick,
}: {
  icon: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="glass flex size-[38px] items-center justify-center rounded-full text-sub transition-transform duration-200 hover:-translate-y-[3px] hover:text-[var(--orange)]"
    >
      <Icon name={icon} size={18} />
    </button>
  )
}

/**
 * Visão em lista — §6.9 e §39.1.
 *
 * Alternativa à malha para quem usa teclado, leitor de tela ou
 * simplesmente prefere. Mesmos produtos, mesma ação ao abrir.
 */
function ListView({
  products,
  onOpen,
  onBack,
}: {
  products: Product[]
  onOpen: (id: string) => void
  onBack: () => void
}) {
  return (
    <div className="absolute inset-0 overflow-auto px-6 pt-24 pb-28 max-[800px]:px-4 max-[800px]:pt-32">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs text-sub">
            {products.length} {products.length === 1 ? 'produto' : 'produtos'}
          </p>
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-xs text-sub hover:bg-soft hover:text-text"
          >
            <Icon name="grid" size={14} />
            Ver no universo
          </button>
        </div>

        <ul className="overflow-hidden rounded-[19px] border border-line bg-solid">
          {products.map((p) => (
            <li key={p.id} className="border-b border-line last:border-b-0">
              <button
                onClick={() => onOpen(p.id)}
                className="flex w-full items-center gap-3 p-3 text-left hover:bg-soft"
              >
                <span className="size-11 shrink-0 overflow-hidden rounded-full bg-white">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" className="size-full object-contain" />
                  ) : (
                    <span className="grid size-full place-items-center text-[#9aa0a6]">
                      <Icon name="image" size={18} />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-xs">{p.name}</strong>
                  <span className="block truncate text-[11px] text-sub">
                    {clientName(p.clientId)} · {p.sku}
                  </span>
                </span>
                <span className="shrink-0 text-[11px] text-sub">
                  {PRODUCT_STATE_LABELS[p.state]}
                </span>
                <Icon name="arrow" size={15} className="shrink-0 text-sub" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
