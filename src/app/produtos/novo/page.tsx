import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NewProductForm } from './form'

export const metadata = { title: 'Novo produto' }

export default function NewProductPage() {
  return (
    <div className="mx-auto w-full max-w-[520px] px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/produtos"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft size={14} aria-hidden />
        Produtos
      </Link>
      <h1 className="mt-4 text-xl font-semibold tracking-tight">Novo produto</h1>
      <p className="mt-1 mb-6 text-[13px] text-text-secondary">
        Nome e SKU criam o produto. As demais informações entram na ficha.
      </p>
      <NewProductForm />
    </div>
  )
}
