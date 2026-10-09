'use client'

/**
 * Dock flutuante — §6.6.
 *
 * Centralizado embaixo, persistente, acima da área espacial: não se move
 * com o pan/zoom da Home. Continua visível dentro do Workspace.
 */
import { Icon, type IconName } from './icon'
import { L } from '@/lib/labels'

export type DockKey = 'home' | 'clients' | 'create' | 'tools' | 'settings'

const ITEMS: Array<{ key: DockKey; icon: IconName; label: string }> = [
  { key: 'home', icon: 'home', label: 'Início' },
  { key: 'clients', icon: 'building', label: L.clientPlural },
  { key: 'create', icon: 'plus', label: 'Nova criação' },
  { key: 'tools', icon: 'apps', label: 'Ferramentas' },
  { key: 'settings', icon: 'settings', label: 'Ajustes' },
]

export function Dock({
  active,
  onSelect,
}: {
  active: DockKey | null
  onSelect: (key: DockKey) => void
}) {
  return (
    <nav
      aria-label="Navegação principal"
      className="glass fixed bottom-6 left-1/2 z-[24] flex h-[66px] -translate-x-1/2 items-center gap-1.5 rounded-[24px] px-3 py-2 max-[800px]:bottom-4 max-[800px]:h-[62px] max-[800px]:gap-0.5 max-[800px]:p-[7px] max-[500px]:w-[calc(100%-26px)] max-[500px]:justify-evenly"
      style={{ background: 'color-mix(in srgb, var(--surface) 91%, transparent)' }}
    >
      {ITEMS.map(({ key, icon, label }) => {
        const isCreate = key === 'create'
        const isActive = key === active
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            title={label}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={`group relative flex h-[49px] w-[50px] items-center justify-center rounded-2xl transition-[transform,background,color] duration-200 hover:-translate-y-1 max-[800px]:size-11 max-[500px]:w-[42px] ${
              isCreate
                ? 'mx-[7px] text-white hover:brightness-110'
                : isActive
                  ? 'text-[var(--orange)]'
                  : 'text-sub hover:bg-soft hover:text-text'
            }`}
            style={
              isCreate
                ? {
                    background: 'var(--accent-gradient)',
                    boxShadow: '0 7px 24px rgba(255,106,0,.25)',
                  }
                : isActive
                  ? { background: 'var(--orange-light)' }
                  : undefined
            }
          >
            <Icon name={icon} size={23} />
            <span className="pointer-events-none absolute bottom-[63px] rounded-lg bg-text px-2 py-1 text-[10px] whitespace-nowrap text-bg opacity-0 transition-[opacity,transform] group-hover:translate-y-0 group-hover:opacity-100">
              {label}
            </span>
            {isActive && !isCreate ? (
              <span
                className="absolute bottom-0.5 size-1 rounded-full"
                style={{ background: 'var(--orange)' }}
              />
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}

/** Gatilho da Central de Atividades — §6.6: perto do Dock, sem sobrecarregá-lo. */
export function ActivityTrigger({
  count,
  onClick,
}: {
  count: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="glass fixed right-8 bottom-9 z-[24] flex h-[45px] items-center gap-2 rounded-[15px] px-3.5 text-xs font-semibold text-text transition-transform hover:-translate-y-0.5 max-[800px]:right-3 max-[800px]:bottom-[88px] max-[800px]:h-[38px] max-[800px]:text-[11px]"
    >
      <Icon name="activity" size={18} />
      <span>Atividades</span>
      {count > 0 ? (
        <span
          className="grid h-[19px] min-w-[19px] place-items-center rounded-full text-[10px] text-white"
          style={{ background: 'var(--orange)' }}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}
