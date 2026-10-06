'use client'

import { useActionState } from 'react'
import { createProductAction, type NewProductState } from './actions'

const initialState: NewProductState = { error: null }

export function NewProductForm() {
  const [state, action, pending] = useActionState(createProductAction, initialState)

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-xs text-muted">
          Nome do produto
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={3}
          placeholder="Frigideira Antiaderente 24cm"
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="sku" className="block text-xs text-muted">
          SKU
        </label>
        <input
          id="sku"
          name="sku"
          required
          placeholder="FRT-4201"
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm outline-none focus:border-accent"
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {pending ? 'Criando…' : 'Criar produto'}
      </button>
    </form>
  )
}
