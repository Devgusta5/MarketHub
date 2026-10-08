import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Sparkles, Type } from 'lucide-react'
import { listProducts } from '@/lib/store'
import { PageHeader } from '@/components/shell'
import {
  Card,
  ContentStatusBadge,
  EmptyState,
  SectionHeading,
  Skeleton,
} from '@/components/ui'

export const metadata = { title: 'Conteúdo' }

export default function ContentPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="Conteúdo"
        description="Textos do catálogo por situação: o que foi gerado, editado e aprovado."
      />
      <Suspense fallback={<Skeleton className="h-80" />}>
        <ContentBoard />
      </Suspense>
    </div>
  )
}

async function ContentBoard() {
  const products = await listProducts()

  const rows = products
    .filter((p) => p.description)
    .map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      status: p.description!.status,
      text: p.description!.value,
      updatedAt: p.description!.updatedAt,
    }))

  const missing = products.filter((p) => !p.description)
  const awaiting = rows.filter(
    (r) => r.status === 'awaiting_approval' || r.status === 'ai_generated',
  )

  return (
    <div className="space-y-6">
      {awaiting.length > 0 ? (
        <Card>
          <SectionHeading hint="Conteúdo gerado com IA que ainda não foi revisado por uma pessoa.">
            Aguardando revisão
          </SectionHeading>
          <ul className="divide-y divide-border">
            {awaiting.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/produtos/${row.id}#description`}
                  className="-mx-2 flex items-start gap-3 rounded-md px-2 py-3 transition-colors hover:bg-surface-sunken"
                >
                  <Sparkles size={14} className="mt-0.5 shrink-0 text-accent-text" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-[13px] font-medium">{row.name}</span>
                      <ContentStatusBadge status={row.status} />
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-text-secondary">
                      {row.text}
                    </p>
                  </div>
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-text-tertiary" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card>
        <SectionHeading hint="Descrição base de cada produto do catálogo.">
          Todo o conteúdo
        </SectionHeading>
        {rows.length === 0 ? (
          <EmptyState
            icon={Type}
            title="Nenhum conteúdo ainda"
            description="Quando um produto tiver descrição, ela aparece aqui com sua situação."
          />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/produtos/${row.id}#description`}
                  className="-mx-2 flex items-start gap-3 rounded-md px-2 py-3 transition-colors hover:bg-surface-sunken"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-[13px] font-medium">{row.name}</span>
                      <span className="font-mono text-[11px] text-text-tertiary">{row.sku}</span>
                      <ContentStatusBadge status={row.status} />
                    </div>
                    <p className="mt-1 line-clamp-1 text-[13px] text-text-secondary">{row.text}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {missing.length > 0 ? (
        <Card>
          <SectionHeading hint="Sem descrição base, os canais não têm o que herdar.">
            Sem conteúdo
          </SectionHeading>
          <ul className="divide-y divide-border">
            {missing.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/produtos/${p.id}#description`}
                  className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-surface-sunken"
                >
                  <Clock size={13} className="shrink-0 text-text-tertiary" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-[13px]">{p.name}</span>
                  <span className="font-mono text-[11px] text-text-tertiary">{p.sku}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  )
}
