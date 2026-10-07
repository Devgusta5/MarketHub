'use client'

import { useActionState } from 'react'
import { createProductAction, type NewProductState } from './actions'

const initialState: NewProductState = { error: null }

const FIELD: React.CSSProperties = {
  fontSize: 14,
  height: 42,
  letterSpacing: '0.03em',
}

export function NewProductForm() {
  const [state, action, pending] = useActionState(createProductAction, initialState)

  return (
    <form action={action} className="border border-rule-strong bg-panel">
      <div className="px-4 py-3">
        <label htmlFor="name" className="label">
          produto
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={3}
          autoComplete="off"
          placeholder="Frigideira Antiaderente 24cm"
          className="mt-1.5 w-full bg-transparent outline-none"
          style={FIELD}
        />
      </div>

      <div className="perforation" />

      <div className="px-4 py-3">
        <label htmlFor="sku" className="label">
          sku
        </label>
        <input
          id="sku"
          name="sku"
          required
          autoComplete="off"
          placeholder="FRT-4201"
          className="font-mono mt-1.5 w-full bg-transparent uppercase outline-none"
          style={FIELD}
        />
      </div>

      {state.error ? (
        <>
          <div className="perforation" />
          <p
            role="alert"
            className="px-4 py-3"
            style={{ fontSize: 13, color: 'var(--alert)' }}
          >
            {state.error}
          </p>
        </>
      ) : null}

      <div className="border-t border-rule-strong p-3">
        <button
          type="submit"
          disabled={pending}
          className="font-mono w-full font-semibold transition-opacity hover:opacity-85 disabled:opacity-50"
          style={{
            fontSize: 11,
            letterSpacing: '0.14em',
            background: 'var(--alert)',
            color: 'var(--alert-ink)',
            height: 40,
          }}
        >
          {pending ? 'ABRINDO…' : 'ABRIR TALÃO'}
        </button>
      </div>
    </form>
  )
}
