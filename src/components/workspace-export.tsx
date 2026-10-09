'use client'

/**
 * Exportação segura — §17.
 *
 * Exporta SOMENTE o que está aprovado e liberado para o canal. O que
 * ficou de fora entra num relatório com motivo e ação sugerida — não
 * basta omitir em silêncio (§17.2).
 */
import { useState } from 'react'
import { Modal } from './modal'
import { Icon } from './icon'
import { Button, Chip, Hint, Panel, Select } from './ui'
import { clientName } from '@/lib/seed'
import {
  CHANNEL_RELEASE_LABELS,
  CREATIVE_STATE_LABELS,
  MARKETPLACE_LABELS,
  MATERIAL_LABELS,
  releasedFor,
  type Marketplace,
  type Material,
  type Product,
} from '@/lib/domain'

/** Motivo e ação, como o §17.2 exige — não só "não aprovado". */
function exclusionReason(material: Material, channel: Marketplace): {
  reason: string
  action: string
  rule: string
} {
  if (material.creative !== 'approved') {
    return {
      reason: `Qualidade: ${CREATIVE_STATE_LABELS[material.creative]}`,
      action: 'Revisar e aprovar na seção Imagens',
      rule: 'Aprovação criativa obrigatória',
    }
  }
  const release = material.release[channel] ?? 'not_evaluated'
  return {
    reason: `Liberação: ${CHANNEL_RELEASE_LABELS[release]}`,
    action: `Liberar para ${MARKETPLACE_LABELS[channel]} na seção Revisão`,
    rule: 'Liberação por canal obrigatória',
  }
}

export function WsExport({
  product,
  onClose,
  onSay,
}: {
  product: Product
  onClose: () => void
  onSay: (m: string) => void
}) {
  const [channel, setChannel] = useState<Marketplace>(
    product.marketplaces[0] ?? 'mercado_livre',
  )

  const included = releasedFor(product, channel)
  const excluded = product.materials.filter((m) => !included.includes(m))

  return (
    <Modal
      eyebrow="Exportação segura"
      title="Preparar pacote"
      hint="Só materiais aprovados e liberados entram no pacote."
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Voltar
          </Button>
          <Button
            variant="primary"
            disabled={included.length === 0}
            title={
              included.length === 0
                ? 'Nenhum material liberado neste canal'
                : undefined
            }
            onClick={() => {
              onSay(
                `Prévia calculada: ${included.length} ${included.length === 1 ? 'material' : 'materiais'}. O ZIP real exige backend.`,
              )
              onClose()
            }}
          >
            <Icon name="download" size={17} />
            Prévia da exportação
          </Button>
        </>
      }
    >
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-semibold text-sub">Marketplace</label>
        <Select
          value={channel}
          onChange={(e) => setChannel(e.target.value as Marketplace)}
        >
          {product.marketplaces.map((m) => (
            <option key={m} value={m}>
              {MARKETPLACE_LABELS[m]}
            </option>
          ))}
        </Select>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        {(
          [
            [included.length, 'Liberados'],
            [excluded.length, 'Pendentes'],
            [product.marketplaces.length, 'Canais'],
          ] as const
        ).map(([v, l]) => (
          <div key={l} className="rounded-2xl bg-soft p-4">
            <strong className="block text-[22px] tracking-[-.04em]">{v}</strong>
            <span className="text-[11px] text-sub">{l}</span>
          </div>
        ))}
      </div>

      {/* §17.3: pacote vazio não vira ZIP vazio — manda revisar. */}
      {included.length === 0 ? (
        <Hint>
          Nenhum material liberado em {MARKETPLACE_LABELS[channel]}. Passe pela seção
          Revisão antes de exportar — um pacote vazio não é gerado.
        </Hint>
      ) : (
        <Panel padded={false} className="mb-3">
          <div className="border-b border-line p-3 text-xs font-semibold">
            Entram no pacote
          </div>
          <ul>
            {included.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-2 border-b border-line p-3 text-xs last:border-b-0"
              >
                <Icon name="check" size={14} className="text-[var(--ok)]" />
                {MATERIAL_LABELS[m.kind]}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {excluded.length > 0 ? (
        <Panel padded={false}>
          <div className="border-b border-line p-3">
            <strong className="text-xs">Relatório de exclusões</strong>
            <p className="mt-1 text-[11px] text-sub">
              {clientName(product.clientId)} · {product.sku} ·{' '}
              {MARKETPLACE_LABELS[channel]}
            </p>
          </div>
          <ul>
            {excluded.map((m) => {
              const { reason, action, rule } = exclusionReason(m, channel)
              return (
                <li key={m.id} className="border-b border-line p-3 last:border-b-0">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-xs">{MATERIAL_LABELS[m.kind]}</strong>
                    <Chip tone="amber">{reason}</Chip>
                  </div>
                  <p className="mt-1.5 text-[11px] text-sub">{action}</p>
                  <p className="mt-0.5 text-[10px] text-sub opacity-70">Regra: {rule}</p>
                </li>
              )
            })}
          </ul>
        </Panel>
      ) : null}

      <div className="mt-4">
        <Hint>
          A liberação técnica por marketplace e a geração real de ZIP exigem o backend.
          Nenhuma conformidade é certificada aqui.
        </Hint>
      </div>
    </Modal>
  )
}
