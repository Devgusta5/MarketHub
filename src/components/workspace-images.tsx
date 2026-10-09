'use client'

/**
 * Seção Imagens — §13.2, §14, §15.3.
 *
 * Duas perspectivas sobre os mesmos arquivos (por material ou por
 * marketplace) e duas visões de apresentação (galeria ou lista), que o
 * §9.3 aprova como alternáveis.
 */
import { useState } from 'react'
import { Icon } from './icon'
import {
  Button,
  Chip,
  CreativeChip,
  Field,
  Hint,
  Panel,
  ReleaseChip,
  Segmented,
  Select,
  Textarea,
} from './ui'
import { Modal } from './modal'
import {
  MARKETPLACE_LABELS,
  MATERIAL_LABELS,
  METHOD_LABELS,
  activeVersion,
  type Marketplace,
  type Material,
  type Product,
} from '@/lib/domain'
import type { Tab } from '@/lib/workspace'

const COMMANDS = [
  'Alterar fundo',
  'Produto em uso',
  'Benefícios',
  'Medidas',
  'Ajustar enquadramento',
  'Criar variação',
]

export function WsImages({
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
  const [editing, setEditing] = useState<Material | null>(null)
  const [view, setView] = useState<'gallery' | 'list'>('gallery')

  // §13.2: por marketplace mostra os mesmos arquivos filtrados pelo
  // canal — não duplica nada, só muda o recorte.
  const shown =
    tab.perspective === 'marketplace'
      ? product.materials.filter((m) => m.release[tab.channel] !== undefined)
      : product.materials

  function toggle(id: string) {
    onPatchTab({
      selected: tab.selected.includes(id)
        ? tab.selected.filter((x) => x !== id)
        : [...tab.selected, id],
    })
  }

  /** §15.3: aprovação em lote, mas só do eixo criativo. */
  function approveSelected() {
    if (tab.selected.length === 0) {
      onSay('Selecione um ou mais materiais.')
      return
    }
    onPatchProduct({
      materials: product.materials.map((m) =>
        tab.selected.includes(m.id) ? { ...m, creative: 'approved' as const } : m,
      ),
    })
    onSay(
      `${tab.selected.length} ${tab.selected.length === 1 ? 'material aprovado' : 'materiais aprovados'}. A liberação por canal é uma decisão separada.`,
    )
    onPatchTab({ selected: [] })
  }

  if (product.materials.length === 0) {
    return (
      <>
        <SectionTitle />
        <Hint>
          Este produto ainda não tem materiais. Use <strong>Nova criação</strong> no Dock
          ou o pacote inteligente para gerar.
        </Hint>
      </>
    )
  }

  return (
    <>
      <SectionTitle />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            value={tab.perspective}
            onChange={(perspective) => onPatchTab({ perspective })}
            options={[
              { value: 'material' as const, label: 'Por material' },
              { value: 'marketplace' as const, label: 'Por marketplace' },
            ]}
          />
          {tab.perspective === 'marketplace' ? (
            <select
              value={tab.channel}
              onChange={(e) => onPatchTab({ channel: e.target.value as Marketplace })}
              aria-label="Canal"
              className="h-8 rounded-lg border border-line bg-soft px-2 text-[11px] text-text outline-none"
            >
              {product.marketplaces.map((m) => (
                <option key={m} value={m}>
                  {MARKETPLACE_LABELS[m]}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {/* §9.3: galeria e lista representam os mesmos materiais. */}
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: 'gallery' as const, label: 'Galeria' },
              { value: 'list' as const, label: 'Lista' },
            ]}
          />
          <Button small variant="outline" onClick={approveSelected}>
            <Icon name="check" size={15} />
            Aprovar seleção
            {tab.selected.length > 0 ? ` (${tab.selected.length})` : ''}
          </Button>
        </div>
      </div>

      {shown.length === 0 ? (
        <Hint>
          Nenhum material avaliado para {MARKETPLACE_LABELS[tab.channel]} ainda. Use a
          seção Revisão para liberar.
        </Hint>
      ) : view === 'gallery' ? (
        <div className="grid grid-cols-3 gap-3.5 max-[1180px]:grid-cols-2 max-[500px]:grid-cols-1">
          {shown.map((m) => (
            <GalleryCard
              key={m.id}
              material={m}
              product={product}
              channel={tab.perspective === 'marketplace' ? tab.channel : null}
              checked={tab.selected.includes(m.id)}
              onToggle={() => toggle(m.id)}
              onEdit={() => setEditing(m)}
            />
          ))}
        </div>
      ) : (
        <Panel padded={false}>
          <ul>
            {shown.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 border-b border-line p-3 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={tab.selected.includes(m.id)}
                  onChange={() => toggle(m.id)}
                  aria-label={`Selecionar ${MATERIAL_LABELS[m.kind]}`}
                  className="size-4"
                  style={{ accentColor: 'var(--orange)' }}
                />
                <span className="size-10 shrink-0 overflow-hidden rounded-lg bg-white">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt="" className="size-full object-contain" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-xs">
                    {MATERIAL_LABELS[m.kind]}
                  </strong>
                  <small className="text-[11px] text-sub">
                    {METHOD_LABELS[m.method]} · v{activeVersion(m)?.version ?? 1}
                  </small>
                </span>
                <CreativeChip state={m.creative} />
                {tab.perspective === 'marketplace' ? (
                  <ReleaseChip state={m.release[tab.channel] ?? 'not_evaluated'} />
                ) : null}
                <Button small variant="outline" onClick={() => setEditing(m)}>
                  <Icon name="edit" size={13} />
                  Editar
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <p className="mt-3.5 text-xs text-sub">
        A aprovação criativa não substitui a liberação para cada marketplace.
      </p>

      {editing ? (
        <ImageEditor
          material={editing}
          product={product}
          onClose={() => setEditing(null)}
          onPatchProduct={onPatchProduct}
          onSay={onSay}
        />
      ) : null}
    </>
  )
}

function SectionTitle() {
  return (
    <>
      <div className="eyebrow">Biblioteca visual</div>
      <h2 className="mt-2 mb-1.5 text-[27px] tracking-[-.048em]">Imagens do produto</h2>
      <p className="mb-5 text-xs text-sub">
        Selecione, revise ou crie novas versões. As prévias são ilustrativas.
      </p>
    </>
  )
}

function GalleryCard({
  material,
  product,
  channel,
  checked,
  onToggle,
  onEdit,
}: {
  material: Material
  product: Product
  channel: Marketplace | null
  checked: boolean
  onToggle: () => void
  onEdit: () => void
}) {
  const version = activeVersion(material)
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-[17px] border border-line bg-solid transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-[rgba(255,106,0,.3)]">
      <div className="relative grid h-[155px] shrink-0 place-items-center overflow-hidden bg-[#f3f2f0]">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          aria-label={`Selecionar ${MATERIAL_LABELS[material.kind]}`}
          className="absolute top-2.5 left-2.5 size-[17px]"
          style={{ accentColor: 'var(--orange)' }}
        />
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt="" className="size-full object-contain" />
        ) : (
          <Icon name="image" size={28} className="text-[#9aa0a6]" />
        )}
      </div>
      <div className="p-3">
        <strong className="block truncate text-xs">{MATERIAL_LABELS[material.kind]}</strong>
        <small className="mt-1 block text-[10px] text-sub">
          {METHOD_LABELS[material.method]} · v{version?.version ?? 1}
        </small>
        <div className="mt-2.5 flex items-center justify-between gap-1.5">
          <div className="flex flex-wrap gap-1">
            <CreativeChip state={material.creative} />
            {channel ? (
              <ReleaseChip state={material.release[channel] ?? 'not_evaluated'} />
            ) : null}
          </div>
          <Button small variant="outline" onClick={onEdit}>
            <Icon name="edit" size={13} />
            Editar
          </Button>
        </div>
      </div>
    </article>
  )
}

/* ── Editor híbrido (§14) ────────────────────────────────── */

function ImageEditor({
  material,
  product,
  onClose,
  onPatchProduct,
  onSay,
}: {
  material: Material
  product: Product
  onClose: () => void
  onPatchProduct: (patch: Partial<Product>) => void
  onSay: (m: string) => void
}) {
  const [command, setCommand] = useState(COMMANDS[0])
  const [instruction, setInstruction] = useState('')
  const [compare, setCompare] = useState(false)

  /** §14.3: nova versão, a anterior permanece. */
  function createVersion() {
    const next = material.versions.length + 1
    const id = `${material.id}-v${next}`
    onPatchProduct({
      materials: product.materials.map((m) =>
        m.id === material.id
          ? {
              ...m,
              creative: 'review' as const,
              activeVersionId: id,
              versions: [
                ...m.versions,
                {
                  id,
                  parentId: m.activeVersionId,
                  version: next,
                  createdAt: new Date().toISOString(),
                  method: 'ai_economic' as const,
                  prompt: [command, instruction].filter(Boolean).join(' · '),
                },
              ],
            }
          : m,
      ),
    })
    onSay(`Versão ${next} criada. A anterior continua disponível.`)
    onClose()
  }

  return (
    <Modal
      wide
      eyebrow="Edição híbrida"
      title={MATERIAL_LABELS[material.kind]}
      onClose={onClose}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => {
              onPatchProduct({
                materials: product.materials.map((m) =>
                  m.id === material.id ? { ...m, creative: 'approved' as const } : m,
                ),
              })
              onSay('Aprovado. A liberação por canal continua pendente.')
              onClose()
            }}
          >
            <Icon name="check" size={16} />
            Aprovar atual
          </Button>
          <Button variant="primary" onClick={createVersion}>
            <Icon name="sparkles" size={16} />
            Criar versão
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4 max-[500px]:flex-col">
        <div className="w-[180px] max-w-[40%] shrink-0 max-[500px]:w-full max-[500px]:max-w-none">
          <div className="aspect-square overflow-hidden rounded-[15px] bg-white">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt="" className="size-full object-contain" />
            ) : null}
          </div>
          {/* §14.2: comparar versões lado a lado. */}
          {material.versions.length > 1 ? (
            <Button
              small
              variant="outline"
              full
              className="mt-2"
              onClick={() => setCompare((v) => !v)}
            >
              <Icon name="copy" size={13} />
              {compare ? 'Ocultar comparação' : 'Comparar versões'}
            </Button>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <Field label="Comando visual">
            <Select value={command} onChange={(e) => setCommand(e.target.value)}>
              {COMMANDS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field
            label="Instrução adicional"
            hint="Comando e texto livre são combináveis (§14)."
          >
            <Textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Descreva o ajuste, preservando o produto original…"
            />
          </Field>
          <Hint>
            Cada edição cria uma versão nova; a anterior continua aprovada. Esta
            interface não chama API real.
          </Hint>
        </div>
      </div>

      {compare ? (
        <div className="mt-4">
          <div className="eyebrow mb-2">Versões</div>
          <div className="flex gap-2 overflow-x-auto">
            {material.versions.map((v) => (
              <div
                key={v.id}
                className={`min-w-[120px] rounded-xl border p-2 ${
                  v.id === material.activeVersionId
                    ? 'border-[var(--orange)]'
                    : 'border-line'
                }`}
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-white">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt="" className="size-full object-contain" />
                  ) : null}
                </div>
                <strong className="mt-1.5 block text-[11px]">v{v.version}</strong>
                <small className="block text-[10px] text-sub">
                  {v.prompt ?? 'Original'}
                </small>
                {v.id === material.activeVersionId ? (
                  <div className="mt-1">
                    <Chip tone="orange">Ativa</Chip>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
