'use client'

/**
 * Conteúdo comercial por marketplace — §10.
 *
 * Cada canal tem a sua versão, editável e independente. O mestre separa
 * `texto_base` das `variantes_comerciais_por_canal`: aqui a variante é
 * sempre do canal escolhido.
 */
import { Icon } from './icon'
import { Button, Hint, Panel, Segmented } from './ui'
import { MARKETPLACE_LABELS, type ChannelContent, type Marketplace, type Product } from '@/lib/domain'
import type { Tab } from '@/lib/workspace'
import { clientName } from '@/lib/seed'

/** Limite de título por canal. Configurável e verificável (§10). */
const TITLE_LIMIT: Record<Marketplace, number> = {
  mercado_livre: 60,
  shopee: 100,
  amazon: 200,
}

function defaults(product: Product, marketplace: Marketplace): ChannelContent {
  return {
    marketplace,
    title: `${product.name} | ${clientName(product.clientId)}`,
    description: `${product.name}. Confirme as características técnicas e compatibilidades antes de publicar em ${MARKETPLACE_LABELS[marketplace]}.`,
    keywords: [],
    updatedAt: null,
  }
}

export function WsContent({
  product,
  tab,
  onPatchTab,
  onPatchProduct,
}: {
  product: Product
  tab: Tab
  onPatchTab: (patch: Partial<Tab>) => void
  onPatchProduct: (patch: Partial<Product>) => void
}) {
  const channel = product.marketplaces.includes(tab.channel)
    ? tab.channel
    : (product.marketplaces[0] ?? 'mercado_livre')
  const content = product.content[channel] ?? defaults(product, channel)
  const limit = TITLE_LIMIT[channel]
  const over = content.title.length > limit

  function patch(next: Partial<ChannelContent>) {
    onPatchProduct({
      content: {
        ...product.content,
        [channel]: { ...content, ...next, updatedAt: new Date().toISOString() },
      },
    })
  }

  return (
    <>
      <div className="eyebrow">Conteúdo comercial</div>
      <h2 className="mt-2 mb-1.5 text-[27px] tracking-[-.048em]">Títulos e descrições</h2>
      <p className="mb-5 text-xs text-sub">
        Conteúdo editável e independente por marketplace.
      </p>

      {product.marketplaces.length > 1 ? (
        <div className="mb-5">
          <Segmented
            value={channel}
            onChange={(c: Marketplace) => onPatchTab({ channel: c })}
            options={product.marketplaces.map((m) => ({
              value: m,
              label: MARKETPLACE_LABELS[m],
            }))}
          />
        </div>
      ) : null}

      <Panel className="mb-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <strong className="text-xs">Título do anúncio</strong>
          <Button
            small
            variant="outline"
            onClick={() => navigator.clipboard?.writeText(content.title)}
          >
            <Icon name="copy" size={14} />
            Copiar
          </Button>
        </div>
        <textarea
          value={content.title}
          onChange={(e) => patch({ title: e.target.value })}
          className="w-full resize-y border-0 bg-transparent leading-relaxed text-text outline-none"
          rows={2}
          aria-label="Título do anúncio"
        />
        <small className={over ? 'text-[var(--bad)]' : 'text-sub'}>
          {content.title.length} de {limit} caracteres
          {over ? ' — acima do limite deste canal' : ''}
        </small>
      </Panel>

      <Panel className="mb-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <strong className="text-xs">Descrição</strong>
          <Button
            small
            variant="outline"
            onClick={() => navigator.clipboard?.writeText(content.description)}
          >
            <Icon name="copy" size={14} />
            Copiar
          </Button>
        </div>
        <textarea
          value={content.description}
          onChange={(e) => patch({ description: e.target.value })}
          className="min-h-[170px] w-full resize-y border-0 bg-transparent leading-relaxed text-text outline-none"
          aria-label="Descrição do anúncio"
        />
        <small className="text-sub">Alterações valem só para este canal.</small>
      </Panel>

      <Hint>
        Os limites por canal são configuráveis e precisam ser conferidos na fonte: o
        mestre (§10) pede não prometer conformidade com regra não verificada.
      </Hint>
    </>
  )
}
