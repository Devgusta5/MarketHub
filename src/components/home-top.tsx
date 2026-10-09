'use client'

/**
 * Topo da Home — §6.1.
 * Identidade compacta à esquerda, busca flutuante ao centro, utilitários
 * à direita. Sem texto de boas-vindas, frase introdutória ou números de
 * marketing: o §6.1 proíbe explicitamente.
 */
import { Icon } from './icon'
import { usePrefs } from '@/lib/prefs'

export function Wordmark({ size = 17 }: { size?: number }) {
  return (
    <span
      className="font-extrabold tracking-[-.055em] whitespace-nowrap"
      style={{ fontSize: size }}
    >
      market<span style={{ color: 'var(--orange)' }}>hub</span>
    </span>
  )
}

export function BrandIcon({ size = 39 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-[13px] text-white"
      style={{
        width: size,
        height: size,
        background: 'var(--accent-gradient)',
        boxShadow:
          '0 9px 25px rgba(255,93,0,.19), inset 0 1px 0 rgba(255,255,255,.26)',
      }}
    >
      <Icon name="sparkles" size={Math.round(size * 0.59)} />
    </span>
  )
}

export function HomeTop({ onProfile }: { onProfile: () => void }) {
  const { theme, hydrated, toggleTheme } = usePrefs()
  return (
    <div className="pointer-events-none absolute top-7 right-9 left-[38px] z-[15] flex items-center justify-between max-[800px]:top-[18px] max-[800px]:right-5 max-[800px]:left-5">
      <div className="pointer-events-auto flex items-center gap-[11px]">
        <BrandIcon />
        <Wordmark />
      </div>
      <div className="pointer-events-auto flex items-center gap-3 max-[500px]:gap-1.5">
        <button
          onClick={toggleTheme}
          title="Alternar tema"
          aria-label="Alternar tema"
          className="glass flex size-[38px] items-center justify-center rounded-full text-sub transition-transform duration-200 hover:-translate-y-[3px]"
        >
          {/* Antes de hidratar não sabemos o tema salvo: ícone neutro. */}
          <Icon name={hydrated && theme === 'light' ? 'moon' : 'sun'} size={18} />
        </button>
        <button
          onClick={onProfile}
          title="Conta compartilhada"
          aria-label="Conta compartilhada"
          className="glass flex size-[38px] items-center justify-center rounded-full text-sub transition-transform duration-200 hover:-translate-y-[3px]"
        >
          <Icon name="user" size={18} />
        </button>
      </div>
    </div>
  )
}
