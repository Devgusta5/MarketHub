import Link from 'next/link'
import { NewProductForm } from './form'

export default function NewProductPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-rule-strong bg-panel">
        <div className="mx-auto flex h-12 w-full max-w-[560px] items-center px-6">
          <Link
            href="/"
            className="font-mono transition-colors hover:text-ink"
            style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink-dim)' }}
          >
            ← PAINEL
          </Link>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[560px] px-6 py-10">
        <h1 className="font-mono" style={{ fontSize: 13, letterSpacing: '0.16em' }}>
          NOVO DESPACHO
        </h1>
        <p className="mt-2" style={{ fontSize: 14, color: 'var(--ink-dim)' }}>
          Produto e SKU abrem o talão. O resto do conteúdo entra na ficha.
        </p>
        <div className="mt-6">
          <NewProductForm />
        </div>
      </div>
    </div>
  )
}
