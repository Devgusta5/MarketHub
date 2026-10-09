'use client'

/**
 * A malha espacial — §6.2 e §6.3.
 *
 * Gestos: arraste move em qualquer direção, roda desloca vertical,
 * Shift+roda horizontal, Ctrl+roda controla zoom centrado no cursor.
 *
 * Acessibilidade (§39.1): cada bolinha é um <button> de verdade, com
 * rótulo. Tab percorre, Enter abre. Quando o desenho migrar para WebGL
 * na etapa 3, esta camada permanece — é ela que o leitor de tela lê.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { cellToPoint, clientName } from '@/lib/seed'
import type { Product } from '@/lib/domain'
import { Icon } from './icon'

type View = { x: number; y: number; z: number }

const MIN_Z = 0.45
const MAX_Z = 2.3
/** Acima disso o ponteiro arrastou, então não é clique (§6.2). */
const DRAG_SLOP = 6

export function Universe({
  products,
  visibleIds,
  focusId,
  onFocusHandled,
  onOpen,
}: {
  products: Product[]
  visibleIds: Set<string>
  focusId: string | null
  onFocusHandled: () => void
  onOpen: (id: string) => void
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<View>({ x: 0, y: 0, z: 1 })
  const [ready, setReady] = useState(false)
  const drag = useRef<{ id: number; px: number; py: number; moved: number } | null>(null)

  const center = useCallback(() => {
    const el = hostRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setView({ x: r.width * 0.5, y: r.height * 0.51, z: r.width < 700 ? 0.78 : 1.04 })
    setReady(true)
  }, [])

  useEffect(() => {
    center()
  }, [center])

  const zoomBy = useCallback((mult: number, px?: number, py?: number) => {
    const el = hostRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const mx = px ?? r.width * 0.55
    const my = py ?? r.height * 0.53
    setView((v) => {
      const nz = Math.max(MIN_Z, Math.min(MAX_Z, v.z * mult))
      return {
        z: nz,
        x: mx - (mx - v.x) * (nz / v.z),
        y: my - (my - v.y) * (nz / v.z),
      }
    })
  }, [])

  // §6.4: ao escolher um produto na busca, voar até ele.
  useEffect(() => {
    if (!focusId) return
    const el = hostRef.current
    const product = products.find((p) => p.id === focusId)
    if (!el || !product) return
    const r = el.getBoundingClientRect()
    const pt = cellToPoint(product.cell)
    const z = Math.max(1, view.z)
    setView({ x: r.width * 0.5 - pt.x * z, y: r.height * 0.51 - pt.y * z, z })
    const t = setTimeout(onFocusHandled, 560)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId])

  // Wheel precisa de listener não-passivo para poder usar preventDefault.
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (e.ctrlKey) {
        const r = el!.getBoundingClientRect()
        zoomBy(Math.exp(-e.deltaY * 0.0013), e.clientX - r.left, e.clientY - r.top)
      } else if (e.shiftKey) {
        setView((v) => ({ ...v, x: v.x - e.deltaY }))
      } else {
        setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }))
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomBy])

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
    setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }))
  }

  function endDrag() {
    const d = drag.current
    if (d) setTimeout(() => (drag.current = null), 0)
    else drag.current = null
  }

  function tryOpen(id: string) {
    // Arrastar e soltar sobre uma bolinha não deve abri-la (§6.2).
    if (drag.current && drag.current.moved > DRAG_SLOP) return
    onOpen(id)
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
        <div
          className="absolute top-0 left-0 size-px origin-top-left"
          style={{
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.z})`,
            visibility: ready ? 'visible' : 'hidden',
          }}
        >
          {products.map((product, i) => {
            const pt = cellToPoint(product.cell)
            const shown = visibleIds.has(product.id)
            return (
              <Bubble
                key={product.id}
                product={product}
                x={pt.x}
                y={pt.y}
                hidden={!shown}
                delay={Math.min(i, 24) * 23}
                focused={focusId === product.id}
                onOpen={() => tryOpen(product.id)}
              />
            )
          })}
        </div>
      </div>

      <div className="absolute right-8 bottom-[123px] z-[12] flex flex-col gap-[7px] max-[800px]:right-4 max-[800px]:bottom-[106px] max-[500px]:bottom-[152px]">
        <ViewControl icon="plus" label="Aproximar" onClick={() => zoomBy(1.18)} />
        <ViewControl icon="minus" label="Afastar" onClick={() => zoomBy(0.85)} />
        <ViewControl icon="target" label="Recentralizar" onClick={center} />
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

function Bubble({
  product,
  x,
  y,
  hidden,
  delay,
  focused,
  onOpen,
}: {
  product: Product
  x: number
  y: number
  hidden: boolean
  delay: number
  focused: boolean
  onOpen: () => void
}) {
  const needsWork = product.state === 'adjust' || product.state === 'producing'
  return (
    <button
      data-node
      onClick={onOpen}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      aria-label={`${product.name}, ${clientName(product.clientId)}, SKU ${product.sku}`}
      className={`absolute flex size-[98px] -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-opacity ${
        hidden ? 'pointer-events-none opacity-0' : 'group'
      }`}
      style={{ left: x, top: y, animationDelay: `${delay}ms` }}
    >
      <span
        className="bubble-skin relative block size-[88px] overflow-hidden rounded-full bg-[#f7f7f6] transition-[transform,box-shadow] duration-200 group-hover:scale-[1.2]"
        data-focused={focused}
      >
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt="" className="size-full object-contain" />
        ) : null}
        {needsWork ? (
          <span
            className="absolute top-[3px] right-[2px] flex size-4 items-center justify-center rounded-full text-[9px] text-white"
            style={{ background: 'var(--orange)', border: '2px solid var(--solid)' }}
          >
            {product.state === 'adjust' ? '!' : '·'}
          </span>
        ) : null}
      </span>

      <span className="pointer-events-none absolute -bottom-7 left-1/2 max-w-[185px] min-w-[120px] -translate-x-1/2 translate-y-1 overflow-hidden rounded-[9px] border border-line bg-solid px-2.5 py-[5px] text-[10px] font-semibold text-ellipsis whitespace-nowrap opacity-0 shadow-soft transition-[opacity,transform] duration-150 group-hover:translate-y-0 group-hover:opacity-100">
        {product.name}
      </span>
    </button>
  )
}
