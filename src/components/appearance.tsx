'use client'

/**
 * Aparência — briefing §7: tema claro/escuro/sistema, cor de destaque
 * e densidade. A escolha afeta marca, ação e foco; nunca o significado
 * dos estados semânticos.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

export const THEMES = ['light', 'dark', 'system'] as const
export type Theme = (typeof THEMES)[number]

export const ACCENTS = ['orange', 'blue', 'violet', 'green', 'teal'] as const
export type Accent = (typeof ACCENTS)[number]

export const ACCENT_LABELS: Record<Accent, string> = {
  orange: 'Laranja',
  blue: 'Azul',
  violet: 'Violeta',
  green: 'Verde',
  teal: 'Turquesa',
}

/** Amostra do seletor. Igual ao --accent de cada tema em globals.css. */
export const ACCENT_SWATCH: Record<Accent, string> = {
  orange: '#f97316',
  blue: '#2563eb',
  violet: '#7c3aed',
  green: '#059669',
  teal: '#0d9488',
}

export const DENSITIES = ['comfortable', 'compact'] as const
export type Density = (typeof DENSITIES)[number]

export const DENSITY_LABELS: Record<Density, string> = {
  comfortable: 'Confortável',
  compact: 'Compacta',
}

type Appearance = {
  theme: Theme
  accent: Accent
  density: Density
  /** false durante o primeiro render do cliente. */
  hydrated: boolean
  setTheme: (t: Theme) => void
  setAccent: (a: Accent) => void
  setDensity: (d: Density) => void
}

const AppearanceContext = createContext<Appearance | null>(null)

export const STORAGE_KEY = 'markethub.appearance'

/**
 * Roda antes da primeira pintura para o tema salvo não piscar.
 * Injetado como script inline no <head>.
 */
export const APPEARANCE_INIT = `(function(){try{
var s=localStorage.getItem('${STORAGE_KEY}');var p=s?JSON.parse(s):{};
var t=p.theme||'system';
var r=document.documentElement;
r.dataset.theme=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;
r.dataset.accent=p.accent||'orange';
r.dataset.density=p.density||'comfortable';
}catch(e){
var r=document.documentElement;r.dataset.theme='light';r.dataset.accent='orange';r.dataset.density='comfortable';
}})()`

function resolve(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

type Saved = Partial<{ theme: Theme; accent: Accent; density: Density }>

/**
 * Lê o que o script inline já aplicou ao DOM. Roda no inicializador do
 * useState — nunca num efeito — para o React não divergir do DOM nem
 * disparar um render em cascata logo após montar.
 *
 * No servidor retorna {}, e o primeiro render do cliente casa com o HTML
 * porque <html> carrega os mesmos padrões.
 */
/** O valor nunca muda depois de hidratar, então não há o que assinar. */
function subscribeNever(): () => void {
  return () => {}
}

function readSaved(): Saved {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Saved) : {}
  } catch {
    return {}
  }
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readSaved().theme ?? 'system')
  const [accent, setAccentState] = useState<Accent>(() => readSaved().accent ?? 'orange')
  const [density, setDensityState] = useState<Density>(
    () => readSaved().density ?? 'comfortable',
  )
  // O HTML do servidor não conhece a preferência salva. Até hidratar, a UI
  // não marca nenhuma opção como ativa — assim nada diverge na hidratação.
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true, // cliente
    () => false, // servidor e primeiro render
  )

  const persist = useCallback(
    (next: Partial<{ theme: Theme; accent: Accent; density: Density }>) => {
      try {
        const current = { theme, accent, density }
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...next }))
      } catch {
        // Sem persistência: a sessão atual continua funcionando.
      }
    },
    [theme, accent, density],
  )

  const setTheme = useCallback(
    (t: Theme) => {
      setThemeState(t)
      document.documentElement.dataset.theme = resolve(t)
      persist({ theme: t })
    },
    [persist],
  )

  const setAccent = useCallback(
    (a: Accent) => {
      setAccentState(a)
      document.documentElement.dataset.accent = a
      persist({ accent: a })
    },
    [persist],
  )

  const setDensity = useCallback(
    (d: Density) => {
      setDensityState(d)
      document.documentElement.dataset.density = d
      persist({ density: d })
    },
    [persist],
  )

  // Tema "sistema" acompanha a troca no SO enquanto a aba está aberta.
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      document.documentElement.dataset.theme = mq.matches ? 'dark' : 'light'
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  const value = useMemo(
    () => ({ theme, accent, density, hydrated, setTheme, setAccent, setDensity }),
    [theme, accent, density, hydrated, setTheme, setAccent, setDensity],
  )

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
}

export function useAppearance(): Appearance {
  const ctx = useContext(AppearanceContext)
  if (!ctx) throw new Error('useAppearance precisa estar dentro de AppearanceProvider')
  return ctx
}
