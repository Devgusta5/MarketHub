import { Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/shell'
import { Card, SectionHeading } from '@/components/ui'

export const metadata = { title: 'Assistente de IA' }

/**
 * §14: a IA aparece no contexto em que resolve a tarefa, não como
 * chatbot isolado. Esta página explica onde encontrá-la e quais são
 * as regras — ela não é um lugar para "conversar com a IA".
 */
const ACTIONS = [
  {
    title: 'Sugerir título otimizado',
    where: 'Ficha do produto · por canal',
    detail: 'Respeita o limite de caracteres e o estilo de cada marketplace.',
  },
  {
    title: 'Gerar ou melhorar descrição',
    where: 'Ficha do produto · informações base',
    detail: 'A partir dos atributos e do nome do produto.',
  },
  {
    title: 'Sugerir tags',
    where: 'Ficha do produto · tags',
    detail: 'Palavras-chave de busca a partir do conteúdo existente.',
  },
  {
    title: 'Adaptar para este marketplace',
    where: 'Ficha do produto · painel do canal',
    detail: 'Converte o conteúdo base para as regras do canal escolhido.',
  },
  {
    title: 'Identificar produto pela imagem',
    where: 'Ficha do produto · imagens',
    detail: 'Sugere nome, categoria e atributos a partir de uma foto.',
  },
]

const RULES = [
  'A sugestão aparece em prévia, antes de ser aplicada.',
  'Você pode aceitar, editar ou descartar.',
  'O que mudou fica destacado.',
  'Conteúdo aprovado nunca é sobrescrito em silêncio.',
  '"Gerado" é diferente de "aprovado" e de "publicado".',
  'A decisão final é sempre sua.',
]

export default function AssistantPage() {
  return (
    <div className="mx-auto w-full max-w-[860px] px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="Assistente de IA"
        description="A IA trabalha dentro das telas, no ponto em que você precisa dela."
      />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-accent-border bg-accent-surface px-4 py-3">
        <Sparkles size={15} className="mt-0.5 shrink-0 text-accent-text" aria-hidden />
        <p className="text-[13px] leading-relaxed">
          <strong className="font-medium">Ainda não está ativo.</strong>{' '}
          <span className="text-text-secondary">
            As ações abaixo aparecem desabilitadas na interface até a integração
            com o provedor de IA ser configurada.
          </span>
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_280px]">
        <Card>
          <SectionHeading hint="Onde cada ação aparece no produto.">
            O que a IA faz
          </SectionHeading>
          <ul className="divide-y divide-border">
            {ACTIONS.map((action) => (
              <li key={action.title} className="py-3 first:pt-0 last:pb-0">
                <p className="text-[13px] font-medium">{action.title}</p>
                <p className="mt-0.5 text-[11px] text-text-tertiary">{action.where}</p>
                <p className="mt-1 text-[13px] leading-snug text-text-secondary">
                  {action.detail}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionHeading>Regras</SectionHeading>
          <ul className="space-y-2.5">
            {RULES.map((rule) => (
              <li key={rule} className="flex gap-2 text-[13px] leading-snug">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                {rule}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
