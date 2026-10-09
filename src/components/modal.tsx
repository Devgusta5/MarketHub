'use client'

/**
 * Modal sobre a Home desfocada.
 *
 * §6.7: Esc e clique fora fecham sem mudar a posição da Home.
 * O foco entra no painel e volta para quem o abriu — sem isso,
 * quem navega por teclado fica preso atrás do scrim.
 */
import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from './icon'

export function Modal({
  title,
  eyebrow,
  hint,
  wide = false,
  onClose,
  children,
  footer,
}: {
  title: string
  eyebrow?: string
  hint?: string
  wide?: boolean
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const opener = openerRef.current
    return () => opener?.focus?.()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      if (e.key !== 'Tab') return
      // Mantém o Tab dentro do painel enquanto ele está aberto.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[31]">
      <button
        className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-xl"
        aria-label="Fechar"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`absolute top-1/2 left-1/2 max-h-[calc(100vh-60px)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-[24px] border border-line bg-solid p-6 shadow-deep outline-none max-[500px]:p-4 ${
          wide ? 'w-[min(790px,calc(100vw-30px))]' : 'w-[min(520px,calc(100vw-30px))]'
        }`}
      >
        <header className="mb-[18px] flex items-start justify-between gap-3">
          <div>
            {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
            <h2 className="mt-1 text-[27px] leading-tight tracking-[-.048em]">{title}</h2>
            {hint ? <p className="mt-1.5 text-xs leading-relaxed text-sub">{hint}</p> : null}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-sub hover:bg-soft hover:text-text"
          >
            <Icon name="close" />
          </button>
        </header>
        {children}
        {footer ? <div className="mt-5 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  )
}

/** Aviso curto, canto inferior. Não rouba foco (§12.5). */
export function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-[108px] left-1/2 z-[100] flex max-w-[calc(100vw-30px)] -translate-x-1/2 items-center gap-2.5 rounded-[15px] bg-text px-4 py-3 text-xs text-bg shadow-deep"
    >
      <Icon name="info" size={17} />
      {message}
    </div>
  )
}
