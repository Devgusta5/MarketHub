import { Suspense } from 'react'
import Link from 'next/link'
import { listProducts } from '@/lib/store'
import { MARKETPLACES, primaryImage } from '@/lib/types'
import { ImagePlaceholder, StatusBadge } from '@/components/ui'

export default function CatalogPage(props: PageProps<'/'>) {
  // O shell (título, busca, botão) é estático e aparece na hora; só a lista,
  // que depende de searchParams, fica atrás do Suspense.
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight">Catálogo</h1>
        <Link
          href="/produtos/novo"
          className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
        >
          + Produto
        </Link>
      </div>

      <form className="mb-6">
        <Suspense>
          <SearchInput searchParams={props.searchParams} />
        </Suspense>
      </form>

      <Suspense fallback={<CatalogSkeleton />}>
        <ProductGrid searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}

type SearchParams = PageProps<'/'>['searchParams']

async function readSearch(searchParams: SearchParams): Promise<string | undefined> {
  const { q } = await searchParams
  return typeof q === 'string' && q.trim() ? q : undefined
}

async function SearchInput({ searchParams }: { searchParams: SearchParams }) {
  const search = await readSearch(searchParams)
  return (
    <input
      type="search"
      name="q"
      defaultValue={search ?? ''}
      placeholder="Buscar por nome, SKU ou marca"
      className="w-full max-w-sm rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
    />
  )
}

function CatalogSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="h-64 animate-pulse rounded-xl border border-border bg-surface"
        />
      ))}
    </ul>
  )
}

async function ProductGrid({ searchParams }: { searchParams: SearchParams }) {
  const search = await readSearch(searchParams)
  const products = await listProducts(search)

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm font-medium">Nenhum produto encontrado</p>
        <p className="mt-1 text-sm text-muted">
          {search
            ? 'Tente outro termo de busca.'
            : 'Cadastre o primeiro produto para começar.'}
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted">
        {products.length} {products.length === 1 ? 'produto' : 'produtos'}
      </p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const image = primaryImage(product)
          const adapted = product.versions.filter((v) => v.updatedAt).length
          return (
            <li key={product.id}>
              <Link
                href={`/produtos/${product.id}`}
                className="block overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent"
              >
                <div className="aspect-4/3">
                  <ImagePlaceholder label={image?.altText} />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-sm font-medium leading-snug">{product.name}</h2>
                    <StatusBadge status={product.status} />
                  </div>
                  <p className="mt-2 font-mono text-xs text-muted">{product.sku}</p>
                  <p className="mt-3 text-xs text-muted">
                    {adapted} de {MARKETPLACES.length} canais adaptados
                    {product.images.length > 0
                      ? ` · ${product.images.length} ${
                          product.images.length === 1 ? 'imagem' : 'imagens'
                        }`
                      : ' · sem imagens'}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
