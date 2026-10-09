'use client'

/**
 * Nova Criação — §7, §8, §9.
 *
 * Janela flutuante, não formulário longo. Clicar fora minimiza em vez
 * de cancelar; a miniatura é arrastável e restaurável. Minimizar nunca
 * remove campos, anexos ou comandos (§8).
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from './icon'
import { Button, Chip, Field, Hint, Input, Progress, Segmented, Select } from './ui'
import { CLIENTS } from '@/lib/seed'
import { L } from '@/lib/labels'
import {
  MARKETPLACES,
  MARKETPLACE_LABELS,
  MATERIAL_LABELS,
  PROFILE_HINTS,
  PROFILE_LABELS,
  PRODUCTION_PROFILES,
  type MaterialKind,
  type ProductionProfile,
} from '@/lib/domain'
import {
  guessName,
  packageSummary,
  plannedMethod,
  suggestedMaterials,
  type Creation,
} from '@/lib/creation'

const ALL_MATERIALS: MaterialKind[] = [
  'cover',
  'in_use',
  'benefits',
  'technical',
  'measures',
  'faq',
]

export function CreationWindow({
  creation,
  onChange,
  onMinimize,
  onRestore,
  onConfirmIdentity,
  onAuthorize,
  onFinish,
}: {
  creation: Creation
  onChange: (patch: Partial<Creation>) => void
  onMinimize: () => void
  onRestore: () => void
  /** Passo 6: cria o produto e a bolinha. */
  onConfirmIdentity: () => void
  /** Passo 8: autoriza a produção — decisão separada da identidade. */
  onAuthorize: () => void
  onFinish: (openWorkspace: boolean) => void
}) {
  if (!creation.open) return null
  if (creation.minimized) {
    return <CreationMini creation={creation} onRestore={onRestore} onChange={onChange} />
  }
  return (
    <CreationPanel
      creation={creation}
      onChange={onChange}
      onMinimize={onMinimize}
      onConfirmIdentity={onConfirmIdentity}
      onAuthorize={onAuthorize}
      onFinish={onFinish}
    />
  )
}

/* ── Miniatura arrastável (§8) ───────────────────────────── */

const MINI_LABEL: Record<Creation['stage'], string> = {
  input: 'Rascunho salvo',
  analyzing: 'Analisando (simulado)',
  confirm: 'Aguardando confirmação',
  package: 'Aguardando autorização',
  done: 'Materiais disponíveis',
}

function CreationMini({
  creation,
  onRestore,
  onChange,
}: {
  creation: Creation
  onRestore: () => void
  onChange: (patch: Partial<Creation>) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDraggable(ref, (x, y) => onChange({ position: { x, y } }))

  return (
    <div
      ref={ref}
      className="glass fixed z-[30] flex max-w-[275px] min-w-[220px] cursor-move touch-none items-center gap-2.5 rounded-[17px] px-3 py-2.5"
      style={
        creation.position
          ? { left: creation.position.x, top: creation.position.y }
          : { top: 130, right: 28 }
      }
    >
      <span className="grid size-[38px] shrink-0 place-items-center rounded-xl bg-soft text-[var(--orange)]">
        <Icon name={creation.stage === 'analyzing' ? 'activity' : 'sparkles'} size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block truncate text-xs">
          {creation.name || 'Nova criação'}
        </strong>
        <small className="block text-[10px] text-sub">{MINI_LABEL[creation.stage]}</small>
      </span>
      <button
        onClick={onRestore}
        title="Restaurar"
        aria-label="Restaurar janela"
        className="flex size-9 items-center justify-center rounded-xl text-sub hover:bg-soft hover:text-text"
      >
        <Icon name="maximize" size={18} />
      </button>
    </div>
  )
}

/* ── Janela ──────────────────────────────────────────────── */

function CreationPanel({
  creation,
  onChange,
  onMinimize,
  onConfirmIdentity,
  onAuthorize,
  onFinish,
}: {
  creation: Creation
  onChange: (patch: Partial<Creation>) => void
  onMinimize: () => void
  onConfirmIdentity: () => void
  onAuthorize: () => void
  onFinish: (openWorkspace: boolean) => void
}) {
  const winRef = useRef<HTMLElement>(null)
  const handleRef = useRef<HTMLElement>(null)
  useDraggable(handleRef, undefined, winRef)

  // Esc minimiza — §8: fechar a interface não é cancelar a tarefa.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onMinimize()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onMinimize])

  const expanded = creation.stage === 'confirm' || creation.stage === 'package'

  return (
    <div className="fixed inset-0 z-[32]">
      <button
        className="absolute inset-0 cursor-default backdrop-blur-[5px]"
        style={{ background: 'rgba(7,9,14,.18)' }}
        aria-label="Minimizar janela"
        onClick={onMinimize}
      />
      <section
        ref={winRef}
        role="dialog"
        aria-modal="true"
        aria-label="Nova criação"
        className={`absolute overflow-hidden rounded-[23px] border border-line bg-solid shadow-deep ${
          expanded
            ? 'top-[8vh] left-1/2 max-h-[85vh] w-[min(735px,calc(100vw-24px))] -translate-x-1/2 overflow-y-auto'
            : 'top-[calc(50%-225px)] left-1/2 w-[496px] max-w-[calc(100vw-24px)] -translate-x-1/2'
        }`}
      >
        <header
          ref={handleRef}
          className="flex h-[53px] cursor-move touch-none items-center justify-between border-b border-line px-4 select-none"
        >
          <span className="flex gap-[7px]" aria-hidden>
            {['#ff6159', '#ffbd2e', '#28c840'].map((c) => (
              <i key={c} className="block size-2.5 rounded-full" style={{ background: c }} />
            ))}
          </span>
          <span className="flex items-center gap-2 text-[11px] font-bold">
            <Icon name="sparkles" size={15} />
            Nova criação
            <Chip>DEMO</Chip>
          </span>
          <button
            onClick={onMinimize}
            title="Minimizar e continuar"
            aria-label="Minimizar e continuar"
            className="flex size-9 items-center justify-center rounded-xl text-sub hover:bg-soft hover:text-text"
          >
            <Icon name="minus" size={16} />
          </button>
        </header>

        <div className="p-[22px] max-[500px]:p-4">
          {creation.stage === 'input' ? (
            <StepInput creation={creation} onChange={onChange} />
          ) : null}
          {creation.stage === 'analyzing' ? <StepAnalyzing onMinimize={onMinimize} /> : null}
          {creation.stage === 'confirm' ? (
            <StepConfirm
              creation={creation}
              onChange={onChange}
              onConfirm={onConfirmIdentity}
            />
          ) : null}
          {creation.stage === 'package' ? (
            <StepPackage
              creation={creation}
              onChange={onChange}
              onAuthorize={onAuthorize}
            />
          ) : null}
          {creation.stage === 'done' ? <StepDone onFinish={onFinish} /> : null}
        </div>
      </section>
    </div>
  )
}

/* ── Passo 1: entrada ────────────────────────────────────── */

function StepInput({
  creation,
  onChange,
}: {
  creation: Creation
  onChange: (patch: Partial<Creation>) => void
}) {
  const [error, setError] = useState<string | null>(null)

  function onFile(file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        // Reduz antes de guardar: imagem grande estoura o armazenamento
        // local, que é a limitação conhecida do protótipo.
        const canvas = document.createElement('canvas')
        const scale = Math.min(1, 460 / Math.max(img.width, img.height))
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
        onChange({
          imageDataUrl: canvas.toDataURL('image/jpeg', 0.74),
          fileName: file.name,
        })
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className="mb-6 text-center">
        <Chip tone="orange">
          <Icon name="sparkles" size={14} />
          Criação inteligente
        </Chip>
        <h2 className="mt-3 mb-2 text-[27px] tracking-[-.048em]">
          O que vamos criar hoje?
        </h2>
        <p className="text-xs text-sub">
          Comece com uma imagem, print ou link do produto.
        </p>
      </div>

      <label
        className="relative block cursor-pointer rounded-[17px] border border-dashed p-[22px] text-center transition-colors hover:bg-[var(--orange-light)]"
        style={{
          borderColor: 'rgba(255,106,0,.45)',
          background: 'linear-gradient(120deg, rgba(255,106,0,.03), transparent)',
        }}
      >
        {creation.imageDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={creation.imageDataUrl}
            alt="Imagem enviada"
            className="mx-auto h-[88px] max-w-full rounded-xl object-contain"
          />
        ) : (
          <span className="flex justify-center text-[var(--orange)]">
            <Icon name="upload" size={34} />
          </span>
        )}
        <span className="mt-2 mb-1 block font-bold">
          {creation.fileName || 'Arraste uma imagem ou selecione um arquivo'}
        </span>
        <span className="block text-xs text-sub">
          PNG, JPG ou WebP · somente no navegador
        </span>
        <input
          type="file"
          accept="image/*"
          aria-label="Selecionar imagem"
          onChange={(e) => onFile(e.target.files?.[0])}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </label>

      <div className="relative my-3 h-px bg-line text-center">
        <span className="relative -top-[11px] bg-solid px-2 text-[11px] text-sub">OU</span>
      </div>

      <Field label="Link ou nome do produto">
        <Input
          value={creation.link}
          onChange={(e) => {
            onChange({ link: e.target.value })
            setError(null)
          }}
          placeholder="Cole um link ou digite o nome do produto"
        />
      </Field>

      {error ? <p className="mb-2 text-[11px] text-[var(--bad)]">{error}</p> : null}

      <Button
        variant="primary"
        full
        onClick={() => {
          if (!creation.link.trim() && !creation.imageDataUrl) {
            setError('Informe o nome, link ou uma imagem do produto.')
            return
          }
          onChange({ stage: 'analyzing', name: guessName(creation) })
        }}
      >
        <Icon name="sparkles" size={17} />
        Analisar produto (simulação)
      </Button>

      <p className="mt-3 text-center text-xs text-sub">
        Nenhum arquivo será enviado a uma IA nesta versão.
      </p>
    </>
  )
}

/* ── Passo 2: análise ────────────────────────────────────── */

function StepAnalyzing({ onMinimize }: { onMinimize: () => void }) {
  return (
    <div className="px-4 py-11 text-center">
      <span
        className="mx-auto grid size-16 place-items-center rounded-[23px] text-white"
        style={{ background: 'var(--accent-gradient)' }}
      >
        <Icon name="sparkles" size={30} />
      </span>
      <h2 className="mt-6 text-[27px] tracking-[-.048em]">Analisando referência…</h2>
      <p className="mx-auto mt-3 mb-5 max-w-[300px] text-xs leading-relaxed text-sub">
        Demonstração de identificação do produto. Você pode minimizar e continuar
        navegando.
      </p>
      <div className="mx-auto max-w-[330px]">
        <Progress done={1} total={3} />
      </div>
      <div className="mt-6">
        <Button variant="outline" onClick={onMinimize}>
          <Icon name="minus" size={16} />
          Minimizar janela
        </Button>
      </div>
    </div>
  )
}

/* ── Passo 3: confirmação de identidade (§7.2) ───────────── */

function StepConfirm({
  creation,
  onChange,
  onConfirm,
}: {
  creation: Creation
  onChange: (patch: Partial<Creation>) => void
  onConfirm: () => void
}) {
  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--orange)' }}>
        Etapa 2 de 3 · Confirmação inteligente
      </div>
      <h2 className="mt-1.5 mb-2 text-[27px] tracking-[-.048em]">Revise o produto</h2>
      <p className="mb-5 text-xs leading-relaxed text-sub">
        Os dados abaixo são uma simulação. Confirme a identidade e a{' '}
        {L.clientLower} antes de gerar materiais.
      </p>

      <div className="flex items-start gap-[18px] max-[500px]:flex-col">
        <div className="aspect-square w-40 shrink-0 overflow-hidden rounded-[20px] bg-white shadow-soft max-[500px]:w-full">
          {creation.imageDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={creation.imageDataUrl}
              alt="Referência do produto"
              className="size-full object-contain"
            />
          ) : (
            <span className="grid size-full place-items-center text-xs text-[#73777e]">
              Sem imagem
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Field label="Nome do produto">
            <Input
              value={creation.name}
              onChange={(e) => onChange({ name: e.target.value })}
            />
          </Field>
          <Field label={L.client}>
            <Select
              value={creation.clientId}
              onChange={(e) => onChange({ clientId: e.target.value })}
            >
              {CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="SKU (opcional)">
            <Input
              value={creation.sku}
              onChange={(e) => onChange({ sku: e.target.value })}
              placeholder="Ex.: PROD-001"
            />
          </Field>
        </div>
      </div>

      <div className="my-5">
        <Hint>
          <Icon name="info" size={16} className="mr-1 inline align-text-bottom" />O
          protótipo não identifica o objeto na foto: o nome inserido pode ser corrigido
          manualmente. Na versão real, a IA mostrará fontes e níveis de confiança.
        </Hint>
      </div>

      <div className="eyebrow">Marketplaces</div>
      <div className="mt-2.5 mb-5 flex flex-wrap gap-2">
        {MARKETPLACES.map((m) => {
          const on = creation.marketplaces.includes(m)
          return (
            <label
              key={m}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-soft px-3 py-1.5 text-[11px]"
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() =>
                  onChange({
                    marketplaces: on
                      ? creation.marketplaces.filter((x) => x !== m)
                      : [...creation.marketplaces, m],
                  })
                }
                style={{ accentColor: 'var(--orange)' }}
              />
              {MARKETPLACE_LABELS[m]}
            </label>
          )
        })}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onChange({ stage: 'input' })}>
          Voltar
        </Button>
        <Button
          variant="primary"
          disabled={!creation.name.trim() || creation.marketplaces.length === 0}
          onClick={onConfirm}
        >
          <Icon name="check" size={16} />
          Confirmar identidade e {L.clientLower}
        </Button>
      </div>
    </>
  )
}

/* ── Passo 4: pacote (§9) ────────────────────────────────── */

function StepPackage({
  creation,
  onChange,
  onAuthorize,
}: {
  creation: Creation
  onChange: (patch: Partial<Creation>) => void
  onAuthorize: () => void
}) {
  const summary = packageSummary(creation)

  return (
    <>
      <div className="eyebrow" style={{ color: 'var(--orange)' }}>
        Etapa 3 de 3 · Pacote inteligente
      </div>
      <h2 className="mt-1.5 mb-2 text-[27px] tracking-[-.048em]">
        O que vamos produzir?
      </h2>
      <p className="mb-5 text-xs leading-relaxed text-sub">
        O produto já está cadastrado e a bolinha apareceu na Home. Esta é uma
        autorização separada: aqui você decide o que gerar.
      </p>

      <div className="eyebrow">Perfil de produção</div>
      <div className="mt-2.5 mb-2">
        <Segmented
          value={creation.profile}
          onChange={(profile: ProductionProfile) =>
            onChange({ profile, selectedMaterials: suggestedMaterials(profile) })
          }
          options={PRODUCTION_PROFILES.map((p) => ({
            value: p,
            label: PROFILE_LABELS[p],
          }))}
        />
      </div>
      <p className="mb-5 text-[11px] text-sub">{PROFILE_HINTS[creation.profile]}</p>

      {creation.profile === 'register' ? (
        <Hint>
          Nenhum arquivo será gerado. O produto fica cadastrado e você pode produzir
          materiais depois, pelo Workspace.
        </Hint>
      ) : (
        <>
          <div className="eyebrow">Materiais</div>
          <div className="mt-2.5 grid grid-cols-2 gap-3 max-[500px]:grid-cols-1">
            {ALL_MATERIALS.map((kind) => {
              const on = creation.selectedMaterials.includes(kind)
              const plan = plannedMethod(kind, creation.profile)
              return (
                <label
                  key={kind}
                  className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-soft p-3"
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() =>
                      onChange({
                        selectedMaterials: on
                          ? creation.selectedMaterials.filter((k) => k !== kind)
                          : [...creation.selectedMaterials, kind],
                      })
                    }
                    className="mt-1"
                    style={{ accentColor: 'var(--orange)' }}
                  />
                  <span className="min-w-0">
                    <strong className="block text-xs">{MATERIAL_LABELS[kind]}</strong>
                    <small className="mt-1 block text-[10px] text-sub">
                      {plan.method} · {plan.why}
                    </small>
                  </span>
                </label>
              )
            })}
          </div>

          <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-xl bg-soft p-3">
            <input
              type="checkbox"
              checked={creation.withVideo}
              onChange={(e) => onChange({ withVideo: e.target.checked })}
              className="mt-1"
              style={{ accentColor: 'var(--orange)' }}
            />
            <span>
              <strong className="block text-xs">Adicionar vídeo opcional</strong>
              <small className="block text-[10px] text-sub">
                Storyboard editável antes da renderização
              </small>
            </span>
          </label>

          {/* §9.2: seis materiais não exigem seis gerações pagas. */}
          <div className="mt-4">
            <Hint>
              <strong>
                {summary.paid} {summary.paid === 1 ? 'geração paga' : 'gerações pagas'}
              </strong>{' '}
              de {summary.items.length}{' '}
              {summary.items.length === 1 ? 'material' : 'materiais'}
              {summary.reused > 0
                ? ` — ${summary.reused} por reutilização ou template.`
                : '.'}{' '}
              Custo real neste protótipo: R$ 0,00.
            </Hint>
          </div>
        </>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={() => onChange({ stage: 'done' })}>
          Depois
        </Button>
        <Button variant="primary" onClick={onAuthorize}>
          <Icon name="check" size={16} />
          {creation.profile === 'register'
            ? 'Concluir cadastro'
            : 'Autorizar produção'}
        </Button>
      </div>
    </>
  )
}

/* ── Passo 5: concluído ──────────────────────────────────── */

function StepDone({ onFinish }: { onFinish: (openWorkspace: boolean) => void }) {
  return (
    <div className="px-4 py-7 text-center">
      <span
        className="mx-auto grid size-[62px] place-items-center rounded-[22px] text-white"
        style={{ background: '#26a478' }}
      >
        <Icon name="check" size={29} />
      </span>
      <h2 className="mt-4 mb-2 text-[27px] tracking-[-.048em]">Produto cadastrado</h2>
      <p className="mx-auto max-w-[400px] text-xs leading-relaxed text-sub">
        A bolinha já está na Home. As tarefas aparecem na Central de Atividades.
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <Button variant="outline" onClick={() => onFinish(false)}>
          Voltar à Home
        </Button>
        <Button variant="primary" onClick={() => onFinish(true)}>
          Abrir workspace
          <Icon name="arrow" size={16} />
        </Button>
      </div>
    </div>
  )
}

/* ── Arrastar ────────────────────────────────────────────── */

/**
 * Arrasta `target` (ou o próprio handle) pelo handle, preso à tela.
 * §8: a miniatura é arrastável dentro dos limites da janela.
 */
function useDraggable(
  handleRef: React.RefObject<HTMLElement | null>,
  onMove?: (x: number, y: number) => void,
  targetRef?: React.RefObject<HTMLElement | null>,
) {
  const moveRef = useRef(onMove)
  useEffect(() => {
    moveRef.current = onMove
  }, [onMove])

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, input, select, textarea, label')) {
        return
      }
      const el = targetRef?.current ?? handleRef.current
      const handle = handleRef.current
      if (!el || !handle) return

      const rect = el.getBoundingClientRect()
      const start = { x: e.clientX, y: e.clientY, left: rect.left, top: rect.top }
      handle.setPointerCapture(e.pointerId)

      function onPointerMove(ev: PointerEvent) {
        if (ev.pointerId !== e.pointerId) return
        const x = Math.max(
          8,
          Math.min(window.innerWidth - rect.width - 8, start.left + ev.clientX - start.x),
        )
        const y = Math.max(
          8,
          Math.min(window.innerHeight - rect.height - 8, start.top + ev.clientY - start.y),
        )
        el!.style.left = `${x}px`
        el!.style.top = `${y}px`
        el!.style.right = 'auto'
        el!.style.transform = 'none'
        moveRef.current?.(x, y)
      }

      function stop() {
        handle!.removeEventListener('pointermove', onPointerMove)
        handle!.removeEventListener('pointerup', stop)
        handle!.removeEventListener('pointercancel', stop)
      }

      handle.addEventListener('pointermove', onPointerMove)
      handle.addEventListener('pointerup', stop)
      handle.addEventListener('pointercancel', stop)
    },
    [handleRef, targetRef],
  )

  useEffect(() => {
    const handle = handleRef.current
    if (!handle) return
    handle.addEventListener('pointerdown', onPointerDown)
    return () => handle.removeEventListener('pointerdown', onPointerDown)
  }, [handleRef, onPointerDown])
}
