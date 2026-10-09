'use client'

/**
 * Painéis do Dock: Launchpad, Empresas, Ajustes, Atividades e Conta.
 *
 * §6.7: o Launchpad flutua sobre a Home desfocada e traz as ferramentas.
 * Os ícones daqui são das FERRAMENTAS — não confundir com as bolinhas de
 * produto da Home.
 */
import { useState } from 'react'
import { Modal } from './modal'
import { Icon, type IconName } from './icon'
import { Button, Chip, Hint, Progress } from './ui'
import { CLIENTS } from '@/lib/seed'
import { L } from '@/lib/labels'
import { JOB_STATE_LABELS, type Job, type Product } from '@/lib/domain'
import { usePrefs } from '@/lib/prefs'

/* ── Launchpad (§6.7) ────────────────────────────────────── */

export type ToolKey = 'images' | 'video' | 'content' | 'fiscal' | 'library' | 'metrics'

const TOOLS: Array<{ key: ToolKey; icon: IconName; name: string; color: string }> = [
  { key: 'images', icon: 'image', name: 'Estúdio de Imagens', color: '#ff6a00' },
  { key: 'video', icon: 'video', name: 'Estúdio de Vídeos', color: '#7461d6' },
  { key: 'content', icon: 'document', name: 'Conteúdo Comercial', color: '#4f80bc' },
  { key: 'fiscal', icon: 'receipt', name: 'Dados Fiscais', color: '#35a687' },
  { key: 'library', icon: 'folder', name: 'Biblioteca', color: '#808a99' },
  { key: 'metrics', icon: 'chart', name: 'Métricas', color: '#343c49' },
]

export function Launchpad({
  onClose,
  onTool,
}: {
  onClose: () => void
  onTool: (key: ToolKey) => void
}) {
  const [all, setAll] = useState(false)

  if (all) {
    return (
      <Modal
        wide
        eyebrow="Biblioteca de aplicativos"
        title="Todas as ferramentas"
        onClose={onClose}
      >
        <div className="grid grid-cols-2 gap-3 max-[500px]:grid-cols-1">
          {TOOLS.map((t) => (
            <button
              key={t.key}
              onClick={() => onTool(t.key)}
              className="flex items-center gap-3 rounded-2xl bg-soft p-4 text-left transition-[transform,background] duration-200 hover:-translate-y-1 hover:bg-[var(--orange-light)]"
            >
              <span
                className="grid size-[45px] shrink-0 place-items-center rounded-[14px] text-white"
                style={{ background: t.color }}
              >
                <Icon name={t.icon} size={20} />
              </span>
              <span className="min-w-0">
                <strong className="block text-xs">{t.name}</strong>
                <span className="block text-[11px] text-sub">
                  Abrir módulo e escolher produto
                </span>
              </span>
            </button>
          ))}
        </div>
      </Modal>
    )
  }

  return (
    <Modal eyebrow="Central de ferramentas" title="Launchpad" onClose={onClose}>
      <div className="grid grid-cols-3 gap-3 max-[500px]:grid-cols-2">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTool(t.key)}
            className="flex min-h-[114px] flex-col items-center justify-center gap-2.5 rounded-[17px] bg-soft px-2.5 py-4 text-center text-xs font-semibold transition-[transform,background] duration-200 hover:-translate-y-1 hover:bg-[var(--orange-light)]"
          >
            <span
              className="grid size-[46px] place-items-center rounded-[15px] text-white"
              style={{ background: t.color }}
            >
              <Icon name={t.icon} size={23} />
            </span>
            {t.name}
          </button>
        ))}
      </div>
      <div className="my-3 h-px bg-line" />
      <Button variant="outline" full onClick={() => setAll(true)}>
        <Icon name="apps" size={17} />
        Ver todas as ferramentas
        <Icon name="arrow" size={16} />
      </Button>
    </Modal>
  )
}

/* ── Empresas atendidas ──────────────────────────────────── */

export function ClientsPanel({
  products,
  onClose,
  onPick,
}: {
  products: Product[]
  onClose: () => void
  onPick: (clientId: string) => void
}) {
  return (
    <Modal
      wide
      eyebrow="Biblioteca compartilhada"
      title={`${L.clientPlural} e produtos`}
      hint={`Todas as ${L.clientPluralLower} estão disponíveis nesta versão de testes.`}
      onClose={onClose}
    >
      <div className="grid grid-cols-2 gap-3 max-[500px]:grid-cols-1">
        {CLIENTS.map((c) => {
          const count = products.filter((p) => p.clientId === c.id).length
          return (
            <button
              key={c.id}
              onClick={() => onPick(c.id)}
              className="flex items-center gap-3 rounded-2xl bg-soft p-4 text-left transition-[transform,background] duration-200 hover:-translate-y-1 hover:bg-[var(--orange-light)]"
            >
              <span className="grid size-[45px] shrink-0 place-items-center rounded-[14px] bg-solid text-[var(--orange)]">
                <Icon name="building" size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-xs">{c.name}</strong>
                <span className="block text-[11px] text-sub">
                  {count} {count === 1 ? 'produto' : 'produtos'}
                </span>
              </span>
              <Icon name="arrow" size={17} className="text-sub" />
            </button>
          )
        })}
      </div>
    </Modal>
  )
}

/* ── Central de Atividades (§12) ─────────────────────────── */

export function ActivitiesPanel({
  jobs,
  onClose,
  onOpenJob,
}: {
  jobs: Job[]
  onClose: () => void
  onOpenJob: (job: Job) => void
}) {
  return (
    <Modal
      eyebrow="Gerenciador de tarefas"
      title="Atividades"
      hint="As tarefas abaixo são demonstrativas, sem uso de APIs externas."
      onClose={onClose}
    >
      {jobs.length === 0 ? (
        <Hint>
          Sem atividades recentes. Use <strong>Nova criação</strong> no Dock para testar
          uma análise simulada.
        </Hint>
      ) : (
        <ul className="flex flex-col gap-2">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="flex items-center gap-2.5 rounded-[14px] border border-line p-3"
            >
              <span className="grid size-[45px] shrink-0 place-items-center rounded-[14px] bg-soft text-[var(--orange)]">
                <Icon name={job.kind === 'analysis' ? 'search' : 'sparkles'} size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-xs">{job.name}</strong>
                <span className="text-[11px] text-sub">{JOB_STATE_LABELS[job.state]}</span>
                {job.state === 'processing' ? (
                  <div className="mt-2">
                    <Progress done={job.done} total={job.total} />
                    <span className="mt-1 block text-[10px] text-sub">
                      {job.done} de {job.total} prontas
                    </span>
                  </div>
                ) : null}
              </div>
              <Button small variant="outline" onClick={() => onOpenJob(job)}>
                Abrir
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}

/* ── Ajustes (§22, §31) ──────────────────────────────────── */

type SettingsTab = 'apis' | 'costs' | 'visual' | 'about'

const TABS: Array<{ key: SettingsTab; label: string }> = [
  { key: 'apis', label: 'Integrações de IA' },
  { key: 'costs', label: 'Orçamentos' },
  { key: 'visual', label: 'Aparência' },
  { key: 'about', label: 'Sistema' },
]

export function SettingsPanel({
  onClose,
  onRecenter,
}: {
  onClose: () => void
  onRecenter: () => void
}) {
  const [tab, setTab] = useState<SettingsTab>('apis')
  const { theme, hydrated, toggleTheme } = usePrefs()

  return (
    <Modal
      wide
      eyebrow="Configurações"
      title="Preferências e integrações"
      onClose={onClose}
    >
      <div className="grid grid-cols-[190px_minmax(0,1fr)] gap-5 max-[800px]:grid-cols-1">
        <div className="flex flex-col gap-1 max-[800px]:flex-row max-[800px]:flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              aria-pressed={tab === t.key}
              className={`rounded-xl p-3 text-left text-xs transition-colors max-[800px]:p-2 ${
                tab === t.key
                  ? 'bg-[var(--orange-light)] text-[var(--orange)]'
                  : 'text-sub hover:bg-soft hover:text-text'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div>
          {tab === 'apis' ? <ApiSettings /> : null}
          {tab === 'costs' ? <CostSettings /> : null}
          {tab === 'visual' ? (
            <section>
              <SettingsHeading
                title="Aparência"
                hint="Ajustes pessoais deste navegador."
              />
              <Row
                icon="sun"
                title="Tema da interface"
                hint="Modo claro e escuro"
                action={
                  <Button small variant="outline" onClick={toggleTheme}>
                    {hydrated && theme === 'dark' ? 'Ativar claro' : 'Ativar escuro'}
                  </Button>
                }
              />
              <Row
                icon="target"
                title="Universo espacial"
                hint="Centralizar a câmera no catálogo"
                action={
                  <Button
                    small
                    variant="outline"
                    onClick={() => {
                      onRecenter()
                      onClose()
                    }}
                  >
                    Centralizar
                  </Button>
                }
              />
            </section>
          ) : null}
          {tab === 'about' ? (
            <section>
              <SettingsHeading
                title="Sobre este protótipo"
                hint="Porte do protótipo v2 para Next.js · demonstração local"
              />
              <Hint>
                Nenhuma chave real, login externo ou API é utilizada. Os produtos de
                exemplo existem apenas nesta sessão.
              </Hint>
            </section>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}

function SettingsHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-[18px]">
      <h3 className="text-[17px] tracking-[-.025em]">{title}</h3>
      <p className="mt-1.5 text-xs text-sub">{hint}</p>
    </div>
  )
}

function Row({
  icon,
  title,
  hint,
  action,
}: {
  icon: IconName
  title: string
  hint: string
  action: React.ReactNode
}) {
  return (
    <div className="mb-2.5 flex items-center gap-3 rounded-[15px] border border-line p-4">
      <span className="grid size-[45px] shrink-0 place-items-center rounded-[14px] bg-soft text-[var(--orange)]">
        <Icon name={icon} size={21} />
      </span>
      <div className="min-w-0 flex-1">
        <strong className="block text-xs">{title}</strong>
        <span className="block text-[11px] text-sub">{hint}</span>
      </div>
      {action}
    </div>
  )
}

/** §22.2, regra inegociável: nunca pedir chave real no navegador. */
function ApiSettings() {
  const providers: Array<[string, string, IconName]> = [
    ['OpenAI', 'Análise, texto e imagem', 'sparkles'],
    ['Google Gemini', 'Visão e imagens econômicas', 'image'],
    ['Runway', 'Vídeo generativo opcional', 'video'],
  ]
  return (
    <section>
      <SettingsHeading
        title="Integrações de Inteligência Artificial"
        hint="Prepare os provedores que poderão alimentar o markethub."
      />
      <div className="mb-4">
        <Hint>
          <strong>Cofre de chaves — apenas representação visual.</strong> Não cole
          credenciais reais aqui. As chaves ficarão no servidor, cifradas, com acesso
          administrativo separado.
        </Hint>
      </div>
      {providers.map(([name, desc, icon]) => (
        <Row
          key={name}
          icon={icon}
          title={name}
          hint={desc}
          action={
            <div className="flex items-center gap-2">
              <Chip>Não conectado</Chip>
              <Button small variant="outline" disabled>
                Configurar
              </Button>
            </div>
          }
        />
      ))}
    </section>
  )
}

/** §25: um orçamento global e sublimites por empresa atendida. */
function CostSettings() {
  return (
    <section>
      <SettingsHeading
        title="Gestor financeiro de IA"
        hint={`Orçamento global com limites por ${L.clientLower}, bloqueio ao esgotar e retomada após recarga confirmada.`}
      />
      <div className="mb-4 rounded-2xl bg-soft p-4">
        <span className="text-[11px] text-sub">Orçamento demonstrativo global</span>
        <strong className="block text-[22px] tracking-[-.04em]">R$ 500,00</strong>
        <span className="text-[11px] text-sub">
          Consumo real de API neste protótipo: R$ 0,00
        </span>
        <div className="mt-3">
          <Progress done={0} total={100} />
        </div>
      </div>
      {CLIENTS.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between border-b border-line py-2.5 last:border-b-0"
        >
          <span className="text-xs">{c.name}</span>
          <Chip>Limite configurável no backend</Chip>
        </div>
      ))}
      <div className="mt-4">
        <Hint>
          O protótipo não processa pagamentos nem verifica créditos de fornecedores.
        </Hint>
      </div>
    </section>
  )
}

/* ── Conta ───────────────────────────────────────────────── */

export function ProfilePanel({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Conta compartilhada" onClose={onClose}>
      <Hint>
        Este protótipo representa uma conta interna compartilhada. O gerenciamento de
        chaves de API exigirá autenticação administrativa independente na versão
        funcional.
      </Hint>
      <div className="mt-4 flex items-center gap-3">
        <span className="grid size-[45px] place-items-center rounded-[14px] bg-soft text-[var(--orange)]">
          <Icon name="user" size={20} />
        </span>
        <div>
          <strong className="block text-xs">Equipe interna</strong>
          <p className="text-[11px] text-sub">
            Acesso demonstrativo a todas as {L.clientPluralLower}
          </p>
        </div>
      </div>
    </Modal>
  )
}
