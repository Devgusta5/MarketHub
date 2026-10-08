'use client'

/**
 * Configurações → Aparência (§7).
 * A cor de destaque muda marca, ação e foco — nunca o significado
 * de erro, sucesso ou pendência. O exemplo abaixo mostra isso.
 */
import { Check, Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import {
  ACCENTS,
  ACCENT_LABELS,
  ACCENT_SWATCH,
  DENSITIES,
  DENSITY_LABELS,
  THEMES,
  useAppearance,
  type Theme,
} from '@/components/appearance'
import { Badge, Button, Card, SectionHeading } from '@/components/ui'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

const THEME_META: Record<Theme, { label: string; icon: LucideIcon }> = {
  light: { label: 'Claro', icon: Sun },
  dark: { label: 'Escuro', icon: Moon },
  system: { label: 'Sistema', icon: Monitor },
}

export function AppearanceSettings() {
  const { theme, accent, density, hydrated, setTheme, setAccent, setDensity } =
    useAppearance()

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading hint="“Sistema” acompanha a preferência do seu computador.">
          Tema
        </SectionHeading>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((value) => {
            const { label, icon: Icon } = THEME_META[value]
            const active = hydrated && theme === value
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                aria-pressed={active}
                className={`flex flex-col items-center gap-2 rounded-lg border px-3 py-4 text-[13px] font-medium transition-colors duration-150 ${
                  active
                    ? 'border-accent bg-accent-surface text-accent-text'
                    : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
                }`}
              >
                <Icon size={18} strokeWidth={1.75} aria-hidden />
                {label}
              </button>
            )
          })}
        </div>
      </Card>

      <Card>
        <SectionHeading hint="Afeta botões, seleção e foco. Não muda as cores de estado.">
          Cor de destaque
        </SectionHeading>
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map((value) => {
            const active = hydrated && accent === value
            return (
              <button
                key={value}
                onClick={() => setAccent(value)}
                aria-pressed={active}
                title={ACCENT_LABELS[value]}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] transition-colors duration-150 ${
                  active
                    ? 'border-accent bg-accent-surface'
                    : 'border-border hover:border-border-strong'
                }`}
              >
                <span
                  className="flex size-4 items-center justify-center rounded-full"
                  style={{ background: ACCENT_SWATCH[value] }}
                  aria-hidden
                >
                  {active ? <Check size={10} strokeWidth={3} color="#fff" /> : null}
                </span>
                {ACCENT_LABELS[value]}
              </button>
            )
          })}
        </div>

        {/* Prova de que o significado dos estados não muda com a marca. */}
        <div className="mt-5 rounded-lg border border-border bg-surface-sunken p-4">
          <p className="mb-3 text-xs text-text-secondary">
            Os estados mantêm o significado qualquer que seja a cor escolhida:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm">
              Ação principal
            </Button>
            <Badge tone="success" icon={CheckCircle2}>
              Publicado
            </Badge>
            <Badge tone="warning" icon={AlertTriangle}>
              Com pendências
            </Badge>
            <Badge tone="danger" icon={XCircle}>
              Erro
            </Badge>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeading hint="Compacta mostra mais produtos por tela no catálogo.">
          Densidade
        </SectionHeading>
        <div className="grid grid-cols-2 gap-2">
          {DENSITIES.map((value) => {
            const active = hydrated && density === value
            return (
              <button
                key={value}
                onClick={() => setDensity(value)}
                aria-pressed={active}
                className={`rounded-lg border px-3 py-3 text-[13px] font-medium transition-colors duration-150 ${
                  active
                    ? 'border-accent bg-accent-surface text-accent-text'
                    : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
                }`}
              >
                {DENSITY_LABELS[value]}
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
