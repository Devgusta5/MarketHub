'use client'

import { useActionState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { createProductAction, type NewProductState } from './actions'

const initialState: NewProductState = { error: null, field: null }

const INPUT =
  'mt-1.5 h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] outline-none transition-colors placeholder:text-text-tertiary focus:border-accent'

export function NewProductForm() {
  const [state, action, pending] = useActionState(createProductAction, initialState)

  return (
    <Card>
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-xs font-medium text-text-secondary">
            Nome do produto
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={3}
            autoComplete="off"
            placeholder="Frigideira Antiaderente 24cm"
            aria-invalid={state.field === 'name'}
            aria-describedby={state.field === 'name' ? 'form-error' : undefined}
            className={INPUT}
          />
        </div>

        <div>
          <label htmlFor="sku" className="text-xs font-medium text-text-secondary">
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            required
            autoComplete="off"
            placeholder="FRT-4201"
            aria-invalid={state.field === 'sku'}
            aria-describedby={state.field === 'sku' ? 'form-error' : undefined}
            className={`${INPUT} font-mono`}
          />
          <p className="mt-1.5 text-[11px] text-text-tertiary">
            Identificador único do produto no catálogo.
          </p>
        </div>

        {state.error ? (
          <p
            id="form-error"
            role="alert"
            className="flex items-start gap-2 rounded-md bg-danger-surface px-3 py-2 text-[13px] text-text-primary"
          >
            <AlertCircle size={13} className="mt-0.5 shrink-0 text-danger" aria-hidden />
            {state.error}
          </p>
        ) : null}

        <Button type="submit" variant="primary" disabled={pending} className="w-full">
          {pending ? 'Criando…' : 'Criar produto'}
        </Button>
      </form>
    </Card>
  )
}
