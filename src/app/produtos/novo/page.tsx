import Link from 'next/link'
import { NewProductForm } from './form'

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← Produtos
      </Link>
      <h1 className="mt-4 text-xl font-semibold tracking-tight">Novo produto</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Só nome e SKU agora. O resto do conteúdo entra na ficha do produto.
      </p>
      <NewProductForm />
    </div>
  )
}
