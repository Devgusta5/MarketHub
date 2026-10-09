'use client'

/**
 * Workspace Adaptativo — §13.
 *
 * Ambiente de produção de um produto. Não é dashboard administrativo:
 * a área central privilegia o formato da tarefa, e o inspetor lateral
 * aparece com o contexto do produto.
 */
import { useState } from 'react'
import { Icon } from './icon'
import { Button, Chip, Hint, Panel, SectionHead, Segmented } from './ui'
import { WsImages } from './workspace-images'
import { WsContent } from './workspace-content'
import { WsExport } from './workspace-export'
import { clientName } from '@/lib/seed'
import { L } from '@/lib/labels'
import {
  CHANNEL_RELEASE_LABELS,
  MARKETPLACE_LABELS,
  MATERIAL_LABELS,
  PRODUCT_STATE_LABELS,
  releasedFor,
  type Marketplace,
  type Product,
} from '@/lib/domain'
import {
  WS_SECTIONS,
  WS_SECTION_ICONS,
  WS_SECTION_LABELS,
  type Tab,
  type WsSection,
} from '@/lib/workspace'
import { ProductStateChip, CreativeChip, ReleaseChip } from './ui'

export function Workspace({
  products,
  tabs,
  activeId,
  onPatchTab,
  onFocusTab,
  onCloseTab,
  onBack,
  onPatchProduct,
  onSay,
}: {
  products: Product[]
  tabs: Tab[]
  activeId: string
  onPatchTab: (patch: Partial<Tab>) => void
  onFocusTab: (productId: string) => void
  onCloseTab: (productId: string) => void
  onBack: () => void
  onPatchProduct: (productId: string, patch: Partial<Product>) => void
  onSay: (message: string) => void
}) {
  const tab = tabs.find((t) => t.productId === activeId)
  const product = products.find((p) => p.id === activeId)
  const [exporting, setExporting] = useState(false)

  if (!tab || !product) return null

  return (
    <section
      // z acima do universo e cor de base sólida: sem isso as bolinhas
      // da Home aparecem através do gradiente.
      className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-bg"
      style={{ backgroundImage: 'var(--ws-bg)' }}
      aria-label="Workspace do produto"
    >
      <WsHeader
        products={products}
        tabs={tabs}
        activeId={activeId}
        onFocusTab={onFocusTab}
        onCloseTab={onCloseTab}
        onBack={onBack}
        onExport={() => setExporting(true)}
      />

      <div className="flex min-h-0 flex-1 gap-5 px-7 pt-3.5 pb-28 max-[800px]:gap-2.5 max-[800px]:px-3 max-[800px]:pb-24">
        <WsSidebar
          section={tab.section}
          onSection={(section) => onPatchTab({ section, selected: [] })}
          onExport={() => setExporting(true)}
        />

        <div className="min-w-0 flex-1 overflow-auto px-1.5 pt-4 pb-20">
          <WsBody
            product={product}
            tab={tab}
            onPatchTab={onPatchTab}
            onPatchProduct={(patch) => onPatchProduct(product.id, patch)}
            onSay={onSay}
          />
        </div>

        <WsInspector product={product} />
      </div>

      {exporting ? (
        <WsExport
          product={product}
          onClose={() => setExporting(false)}
          onSay={onSay}
        />
      ) : null}
    </section>
  )
}

/* ── Cabeçalho e abas (§13.1) ────────────────────────────── */

function WsHeader({
  products,
  tabs,
  activeId,
  onFocusTab,
  onCloseTab,
  onBack,
  onExport,
}: {
  products: Product[]
  tabs: Tab[]
  activeId: string
  onFocusTab: (id: string) => void
  onCloseTab: (id: string) => void
  onBack: () => void
  onExport: () => void
}) {
  return (
    <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-line px-8 max-[800px]:h-16 max-[800px]:px-3.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          onClick={onBack}
          title="Voltar à Home"
          aria-label="Voltar à Home"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl text-sub hover:bg-soft hover:text-text"
        >
          <Icon name="back" size={18} />
        </button>
        <span className="shrink-0 text-xs font-extrabold tracking-[-.04em] whitespace-nowrap max-[500px]:hidden">
          market<span style={{ color: 'var(--orange)' }}>hub</span>
        </span>
        <span className="h-5 w-px shrink-0 bg-line max-[500px]:hidden" />

        <div
          className="flex min-w-0 items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Produtos abertos"
        >
          {tabs.map((t) => {
            const p = products.find((x) => x.id === t.productId)
            if (!p) return null
            const active = t.productId === activeId
            return (
              <span
                key={t.productId}
                className={`flex shrink-0 items-center gap-1 rounded-xl pr-1 pl-2.5 text-[11px] transition-colors ${
                  active ? 'font-bold' : 'text-sub hover:bg-soft'
                }`}
                style={
                  active
                    ? { background: 'var(--orange-light)', color: 'var(--orange)' }
                    : undefined
                }
              >
                <button
                  role="tab"
                  aria-selected={active}
                  onClick={() => onFocusTab(t.productId)}
                  className="flex items-center gap-1.5 py-2 whitespace-nowrap"
                >
                  <Icon name="folder" size={14} />
                  {p.name.length > 23 ? `${p.name.slice(0, 20)}…` : p.name}
                </button>
                <button
                  onClick={() => onCloseTab(t.productId)}
                  aria-label={`Fechar ${p.name}`}
                  title="Fechar aba"
                  className="flex size-5 items-center justify-center rounded-md opacity-60 hover:bg-soft hover:opacity-100"
                >
                  <Icon name="close" size={12} />
                </button>
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <Chip title="Nenhuma API é chamada neste protótipo">
          <Icon name="shield" size={13} />
          DEMO
        </Chip>
        <button
          onClick={onExport}
          title="Exportação inteligente"
          aria-label="Exportar"
          className="flex size-9 items-center justify-center rounded-xl text-sub hover:bg-soft hover:text-text"
        >
          <Icon name="download" size={20} />
        </button>
      </div>
    </header>
  )
}

/* ── Sidebar de seções ───────────────────────────────────── */

function WsSidebar({
  section,
  onSection,
  onExport,
}: {
  section: WsSection
  onSection: (s: WsSection) => void
  onExport: () => void
}) {
  return (
    <aside className="flex w-[198px] shrink-0 flex-col gap-1 py-3.5 max-[800px]:w-[53px]">
      <div className="eyebrow mx-3 mb-3 max-[800px]:hidden">Produto</div>
      {WS_SECTIONS.map((s) => {
        const active = s === section
        return (
          <button
            key={s}
            onClick={() => onSection(s)}
            aria-current={active ? 'page' : undefined}
            title={WS_SECTION_LABELS[s]}
            className={`flex w-full items-center gap-3 rounded-xl p-3 text-left text-xs font-semibold transition-colors max-[800px]:justify-center ${
              active ? '' : 'text-sub hover:bg-soft hover:text-text'
            }`}
            style={
              active
                ? { background: 'var(--orange-light)', color: 'var(--orange)' }
                : undefined
            }
          >
            <Icon name={WS_SECTION_ICONS[s]} size={17} />
            <span className="max-[800px]:hidden">{WS_SECTION_LABELS[s]}</span>
          </button>
        )
      })}
      <div className="my-2 h-px bg-line" />
      <button
        onClick={onExport}
        title="Exportar"
        className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-xs font-semibold text-sub transition-colors hover:bg-soft hover:text-text max-[800px]:justify-center"
      >
        <Icon name="download" size={17} />
        <span className="max-[800px]:hidden">Exportar</span>
      </button>
    </aside>
  )
}

/* ── Inspetor contextual ─────────────────────────────────── */

function WsInspector({ product }: { product: Product }) {
  return (
    <aside className="w-[262px] shrink-0 overflow-auto border-l border-line pt-5 pr-1.5 pl-5 max-[1180px]:hidden">
      <div className="eyebrow">Contexto do produto</div>
      <div className="my-3 h-px bg-line" />

      <div className="flex items-start gap-3">
        <span className="size-16 shrink-0 overflow-hidden rounded-xl bg-white">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt="" className="size-full object-contain" />
          ) : (
            <span className="grid size-full place-items-center text-[#9aa0a6]">
              <Icon name="image" size={20} />
            </span>
          )}
        </span>
        <div className="min-w-0">
          <strong className="block text-xs leading-snug">{product.name}</strong>
          <span className="mt-1 block text-[11px] text-sub">
            {clientName(product.clientId)}
          </span>
        </div>
      </div>

      <div className="my-3 h-px bg-line" />
      <div className="text-[11px] text-sub">SKU</div>
      <strong className="text-xs">{product.sku}</strong>

      <div className="mt-4 text-[11px] text-sub">Estado</div>
      <div className="mt-1.5">
        <ProductStateChip state={product.state} />
      </div>

      <div className="mt-4 text-[11px] text-sub">Marketplaces</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {product.marketplaces.map((m) => (
          <Chip key={m}>{MARKETPLACE_LABELS[m]}</Chip>
        ))}
      </div>

      <div className="my-3 h-px bg-line" />
      <p className="text-[11px] leading-relaxed text-sub">
        Este ambiente contém exemplos simulados. Nenhuma API foi chamada.
      </p>
    </aside>
  )
}

/* ── Corpo por seção ─────────────────────────────────────── */

function WsBody({
  product,
  tab,
  onPatchTab,
  onPatchProduct,
  onSay,
}: {
  product: Product
  tab: Tab
  onPatchTab: (patch: Partial<Tab>) => void
  onPatchProduct: (patch: Partial<Product>) => void
  onSay: (m: string) => void
}) {
  switch (tab.section) {
    case 'overview':
      return <WsOverview product={product} onSection={(s) => onPatchTab({ section: s })} />
    case 'images':
      return (
        <WsImages
          product={product}
          tab={tab}
          onPatchTab={onPatchTab}
          onPatchProduct={onPatchProduct}
          onSay={onSay}
        />
      )
    case 'content':
      return <WsContent product={product} tab={tab} onPatchTab={onPatchTab} onPatchProduct={onPatchProduct} />
    case 'video':
      return <WsVideo product={product} onSay={onSay} />
    case 'fiscal':
      return <WsFiscal product={product} />
    case 'review':
      return <WsReview product={product} onPatchProduct={onPatchProduct} onSay={onSay} />
    case 'history':
      return <WsHistory product={product} />
  }
}

/* ── Visão geral ─────────────────────────────────────────── */

function WsOverview({
  product,
  onSection,
}: {
  product: Product
  onSection: (s: WsSection) => void
}) {
  const approved = product.materials.filter((m) => m.creative === 'approved').length
  const shortcuts: Array<[WsSection, string, string]> = [
    ['images', 'image', 'Galeria de imagens'],
    ['content', 'document', 'Conteúdo comercial'],
    ['video', 'video', 'Estúdio de vídeo'],
    ['fiscal', 'receipt', 'Dados técnicos'],
  ]

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="eyebrow">Workspace do produto</div>
          <h2 className="mt-1.5 text-[27px] tracking-[-.048em]">Visão geral</h2>
        </div>
        <ProductStateChip state={product.state} />
      </div>

      <div className="flex items-center gap-5 rounded-[20px] border border-line bg-solid p-[18px] max-[500px]:flex-col max-[500px]:items-start">
        <span className="size-[132px] shrink-0 overflow-hidden rounded-[17px] bg-white max-[500px]:size-20">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt="" className="size-full object-contain" />
          ) : (
            <span className="grid size-full place-items-center text-[#9aa0a6]">
              <Icon name="image" size={28} />
            </span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="eyebrow">
            {clientName(product.clientId)} / {product.category}
          </div>
          <h2 className="my-1.5 text-[22px] tracking-[-.048em]">{product.name}</h2>
          <p className="text-xs text-sub">
            SKU {product.sku} ·{' '}
            {product.marketplaces.map((m) => MARKETPLACE_LABELS[m]).join(' · ')}
          </p>
        </div>
      </div>

      <div className="my-5 grid grid-cols-3 gap-3 max-[500px]:grid-cols-1">
        {(
          [
            [product.materials.length, 'Materiais'],
            [approved, 'Aprovados'],
            [product.marketplaces.length, 'Canais vinculados'],
          ] as const
        ).map(([v, l]) => (
          <div key={l} className="rounded-2xl bg-soft p-4">
            <strong className="block text-[22px] tracking-[-.04em]">{v}</strong>
            <span className="text-[11px] text-sub">{l}</span>
          </div>
        ))}
      </div>

      <Panel>
        <SectionHead
          title="Produção e revisão"
          hint="Acesse os materiais ou inicie outra tarefa."
        />
        <div className="grid grid-cols-2 gap-3 max-[500px]:grid-cols-1">
          {shortcuts.map(([section, icon, label]) => (
            <button
              key={section}
              onClick={() => onSection(section)}
              className="flex items-center gap-3 rounded-2xl bg-soft p-4 text-left text-xs font-semibold transition-[transform,background] duration-200 hover:-translate-y-1 hover:bg-[var(--orange-light)]"
            >
              <Icon name={icon} size={20} />
              {label}
            </button>
          ))}
        </div>
      </Panel>
    </>
  )
}

/* ── Vídeo (§11) ─────────────────────────────────────────── */

function WsVideo({ product, onSay }: { product: Product; onSay: (m: string) => void }) {
  const scenes = ['Apresentação', 'Produto em uso', 'Benefícios', 'Detalhes', 'Encerramento']
  return (
    <>
      <div className="eyebrow">Estúdio de vídeo</div>
      <h2 className="mt-2 mb-1.5 text-[27px] tracking-[-.048em]">Storyboard</h2>
      <p className="mb-5 text-xs text-sub">
        O vídeo é opcional. Cada cena pode ser revisada antes de autorizar a
        renderização paga (§11).
      </p>

      <Panel>
        <SectionHead
          title="Sequência de cenas"
          action={<Chip tone="orange">15 segundos · simulado</Chip>}
        />
        <div className="flex gap-2 overflow-x-auto py-3">
          {scenes.map((scene, i) => (
            <div
              key={scene}
              className="min-w-[118px] rounded-[13px] border border-line bg-soft p-3"
            >
              <div className="mb-2 grid h-[75px] place-items-center rounded-lg bg-solid text-sub">
                <Icon
                  name={
                    i === 0 ? 'image' : i === 1 ? 'video' : i === 2 ? 'sparkles' : i === 3 ? 'zoom' : 'check'
                  }
                  size={29}
                />
              </div>
              <strong className="mb-1 block text-[11px]">
                {i + 1}. {scene}
              </strong>
              <small className="text-[10px] text-sub">3 segundos</small>
            </div>
          ))}
        </div>
        <Hint>
          Na implementação, o vídeo econômico monta as fotos aprovadas com FFmpeg; o
          generativo exige reconfirmação por custar por segundo.
        </Hint>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onSay('Modo econômico: montagem local, sem geração paga.')}
          >
            Modo econômico
          </Button>
          <Button
            variant="primary"
            disabled={product.video === 'none'}
            onClick={() => onSay('Storyboard aprovado na simulação.')}
          >
            Aprovar storyboard
          </Button>
        </div>
        {product.video === 'none' ? (
          <p className="mt-2 text-right text-[11px] text-sub">
            Este produto não tem vídeo no pacote.
          </p>
        ) : null}
      </Panel>
    </>
  )
}

/* ── Fiscal (§16) ────────────────────────────────────────── */

function WsFiscal({ product }: { product: Product }) {
  const fields: Array<[string, string]> = [
    ['SKU', product.sku],
    ['EAN / GTIN', 'A confirmar'],
    ['NCM', 'A confirmar'],
    ['CEST', 'A confirmar'],
    ['Peso líquido', 'Não informado'],
    ['Peso bruto', 'Não informado'],
    ['Origem', 'Não informado'],
    ['Descrição NF-e', 'A confirmar'],
  ]
  return (
    <>
      <div className="eyebrow">Informações do produto</div>
      <h2 className="mt-2 mb-1.5 text-[27px] tracking-[-.048em]">
        Dados técnicos e fiscais
      </h2>
      <p className="mb-5 text-xs text-sub">
        Campos de referência — nenhuma classificação fiscal é gerada aqui.
      </p>
      <Panel>
        <div className="grid grid-cols-2 gap-3 max-[500px]:grid-cols-1">
          {fields.map(([label, value]) => (
            <div key={label}>
              <div className="mb-1.5 text-xs font-semibold text-sub">{label}</div>
              <div className="rounded-xl border border-line bg-soft px-3 py-3 text-xs">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Hint>
            <Icon name="shield" size={15} className="mr-1 inline align-text-bottom" />
            Dado fiscal exige fonte apropriada e confirmação humana. A IA não é fonte
            tributária definitiva (§16).
          </Hint>
        </div>
      </Panel>
    </>
  )
}

/* ── Revisão: os dois eixos (§15.1) ──────────────────────── */

function WsReview({
  product,
  onPatchProduct,
  onSay,
}: {
  product: Product
  onPatchProduct: (patch: Partial<Product>) => void
  onSay: (m: string) => void
}) {
  const [channel, setChannel] = useState<Marketplace>(
    product.marketplaces[0] ?? 'mercado_livre',
  )

  function release(materialId: string) {
    onPatchProduct({
      materials: product.materials.map((m) =>
        m.id === materialId
          ? { ...m, release: { ...m.release, [channel]: 'ready' as const } }
          : m,
      ),
    })
    onSay(`Liberado para ${MARKETPLACE_LABELS[channel]}.`)
  }

  return (
    <>
      <div className="eyebrow">Revisão</div>
      <h2 className="mt-2 mb-1.5 text-[27px] tracking-[-.048em]">
        Aprovação e liberação
      </h2>
      <p className="mb-4 text-xs leading-relaxed text-sub">
        São duas decisões diferentes: a qualidade do material e a aptidão dele para
        cada canal. Um material aprovado ainda pode não estar liberado na Shopee.
      </p>

      <div className="mb-4">
        <Segmented
          value={channel}
          onChange={setChannel}
          options={product.marketplaces.map((m) => ({
            value: m,
            label: MARKETPLACE_LABELS[m],
          }))}
        />
      </div>

      {product.materials.length === 0 ? (
        <Hint>Nenhum material ainda. Gere materiais pelo pacote ou pelas seções.</Hint>
      ) : (
        <Panel padded={false}>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-sub">
                <th className="p-3 font-semibold">Material</th>
                <th className="p-3 font-semibold">Qualidade</th>
                <th className="p-3 font-semibold">
                  Liberação · {MARKETPLACE_LABELS[channel]}
                </th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {product.materials.map((m) => {
                const rel = m.release[channel] ?? 'not_evaluated'
                const canRelease = m.creative === 'approved' && rel !== 'ready'
                return (
                  <tr key={m.id} className="border-b border-line last:border-b-0">
                    <td className="p-3">{MATERIAL_LABELS[m.kind]}</td>
                    <td className="p-3">
                      <CreativeChip state={m.creative} />
                    </td>
                    <td className="p-3">
                      <ReleaseChip state={rel} />
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        small
                        variant="outline"
                        disabled={!canRelease}
                        title={
                          m.creative !== 'approved'
                            ? 'Precisa de aprovação criativa antes'
                            : rel === 'ready'
                              ? 'Já liberado neste canal'
                              : undefined
                        }
                        onClick={() => release(m.id)}
                      >
                        Liberar
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>
      )}

      <div className="mt-4">
        <Hint>
          {releasedFor(product, channel).length} de {product.materials.length} materiais
          liberados em {MARKETPLACE_LABELS[channel]}. Só os liberados entram na
          exportação (§17).
        </Hint>
      </div>
    </>
  )
}

/* ── Histórico ───────────────────────────────────────────── */

function WsHistory({ product }: { product: Product }) {
  const events = [
    ['check', 'Produto cadastrado', `Identidade e ${L.clientLower} confirmadas`],
    ['sparkles', 'Pacote autorizado', `${product.materials.length} materiais no pacote`],
    ['clock', 'Versões preservadas', 'Cada edição cria uma versão nova (§14.3)'],
    ['shield', 'Aprovação registrada', 'Só versões liberadas são exportadas'],
  ] as const

  return (
    <>
      <div className="eyebrow">Rastreabilidade</div>
      <h2 className="mt-2 mb-1.5 text-[27px] tracking-[-.048em]">Histórico e versões</h2>
      <p className="mb-5 text-xs text-sub">
        Atividades associadas ao produto nesta sessão de demonstração.
      </p>
      <Panel>
        <ul className="flex flex-col gap-2">
          {events.map(([icon, title, detail]) => (
            <li
              key={title}
              className="flex items-center gap-3 rounded-[14px] border border-line p-3"
            >
              <Icon name={icon} size={18} className="shrink-0 text-sub" />
              <div className="min-w-0">
                <strong className="block text-xs">{title}</strong>
                <small className="text-[11px] text-sub">{detail}</small>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  )
}

export { PRODUCT_STATE_LABELS, CHANNEL_RELEASE_LABELS }
