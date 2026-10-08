'use client'

/**
 * Shell da aplicação — briefing §9: sidebar compacta, previsível,
 * com a seção ativa destacada e o contexto preservado.
 */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, useState } from 'react'
import {
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  Sparkles,
  Store,
  Type,
  X,
  type LucideIcon,
} from 'lucide-react'

type NavItem = { href: string; label: string; icon: LucideIcon }

const NAV: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/produtos', label: 'Produtos', icon: Package },
  { href: '/conteudo', label: 'Conteúdo', icon: Type },
  { href: '/assistente', label: 'Assistente de IA', icon: Sparkles },
  { href: '/marketplaces', label: 'Marketplaces', icon: Store },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap">
      Market<span className="text-accent-text">Hub</span>
      {compact ? null : null}
    </span>
  )
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

const LINK_BASE =
  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors duration-150'
const LINK_IDLE =
  'text-text-secondary hover:bg-surface-sunken hover:text-text-primary'
const LINK_ACTIVE = 'bg-accent-surface text-accent-text'

/**
 * A lista é estática; só o destaque do item ativo depende da rota.
 * Por isso usePathname vive num componente separado, atrás de Suspense:
 * o shell inteiro continua pré-renderizável.
 */
function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Navegação principal">
      {NAV.map((item) => (
        <Suspense
          key={item.href}
          fallback={
            <Link href={item.href} onClick={onNavigate} className={`${LINK_BASE} ${LINK_IDLE}`}>
              <item.icon size={16} strokeWidth={2} aria-hidden />
              {item.label}
            </Link>
          }
        >
          <NavLink item={item} onNavigate={onNavigate} />
        </Suspense>
      ))}
    </nav>
  )
}

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname()
  const active = isActive(pathname, item.href)
  const { href, label, icon: Icon } = item
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`${LINK_BASE} ${active ? LINK_ACTIVE : LINK_IDLE}`}
    >
      <Icon size={16} strokeWidth={2} aria-hidden />
      {label}
    </Link>
  )
}

function SidebarFooter() {
  return (
    <p className="px-2.5 text-[11px] leading-relaxed text-text-tertiary">
      Dados de exemplo
      <br />
      Protótipo — sem integração ativa
    </p>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop */}
      <aside className="hidden w-[216px] shrink-0 flex-col justify-between border-r border-border bg-surface px-3 py-4 lg:flex">
        <div>
          <Link href="/" className="mb-5 flex items-center px-2.5">
            <Wordmark />
          </Link>
          <NavLinks />
        </div>
        <SidebarFooter />
      </aside>

      {/* Sidebar — móvel */}
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-black/50"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[240px] flex-col justify-between border-r border-border bg-surface px-3 py-4">
            <div>
              <div className="mb-5 flex items-center justify-between px-2.5">
                <Wordmark />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fechar menu"
                  className="rounded-md p-1 text-text-secondary hover:bg-surface-sunken"
                >
                  <X size={16} aria-hidden />
                </button>
              </div>
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <SidebarFooter />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center gap-3 border-b border-border bg-surface px-4 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken"
          >
            <Menu size={18} aria-hidden />
          </button>
          <Wordmark />
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}

/** Cabeçalho de página, dentro do shell. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 text-[13px] text-text-secondary">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}
