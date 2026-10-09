'use client'

/**
 * Preferências locais da estação (§6.8, §39.1).
 *
 * Tema, posição e zoom da Home são "locais à estação"; produtos e tarefas
 * persistem no backend futuro. Por isso ficam separados do estado de domínio.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

export type Theme = 'dark' | 'light'

const KEY = 'markethub.prefs.v3'

type Prefs = { theme: Theme }

/** Aplica o tema salvo antes da primeira pintura, para não piscar. */
export const PREFS_INIT = `(function(){try{
var p=JSON.parse(localStorage.getItem('${KEY}')||'{}');
document.documentElement.dataset.theme=p.theme==='light'?'light':'dark';
}catch(e){document.documentElement.dataset.theme='dark'}})()`

function read(): Prefs {
  if (typeof window === 'undefined') return { theme: 'dark' }
  try {
    const raw = localStorage.getItem(KEY)
    const saved = raw ? (JSON.parse(raw) as Partial<Prefs>) : {}
    return { theme: saved.theme === 'light' ? 'light' : 'dark' }
  } catch {
    return { theme: 'dark' }
  }
}

type Ctx = Prefs & { hydrated: boolean; setTheme: (t: Theme) => void; toggleTheme: () => void }

const PrefsContext = createContext<Ctx | null>(null)

const subscribeNever = () => () => {}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => read().theme)

  // O HTML do servidor é sempre escuro; só depois de hidratar sabemos a
  // preferência salva. Evita divergência de hidratação sem usar efeito.
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  )

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    document.documentElement.dataset.theme = t
    try {
      localStorage.setItem(KEY, JSON.stringify({ theme: t }))
    } catch {
      // Sem persistência: a sessão atual continua funcionando.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const value = useMemo(
    () => ({ theme, hydrated, setTheme, toggleTheme }),
    [theme, hydrated, setTheme, toggleTheme],
  )

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

export function usePrefs(): Ctx {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs precisa estar dentro de PrefsProvider')
  return ctx
}
