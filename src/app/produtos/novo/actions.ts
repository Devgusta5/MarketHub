'use server'

import { redirect } from 'next/navigation'
import { createProduct, skuExists } from '@/lib/store'

export type NewProductState = {
  error: string | null
  field: 'name' | 'sku' | null
}

export async function createProductAction(
  _prev: NewProductState,
  formData: FormData,
): Promise<NewProductState> {
  // Server Actions são alcançáveis por POST direto: validar aqui, não só no form.
  const name = String(formData.get('name') ?? '').trim()
  const sku = String(formData.get('sku') ?? '').trim()

  if (name.length < 3) {
    return { error: 'O nome precisa ter pelo menos 3 caracteres.', field: 'name' }
  }
  if (!sku) {
    return { error: 'Informe o SKU do produto.', field: 'sku' }
  }
  if (await skuExists(sku)) {
    return {
      error: `Já existe um produto com o SKU ${sku}. Use outro identificador.`,
      field: 'sku',
    }
  }

  const product = await createProduct({ name, sku })
  redirect(`/produtos/${product.id}`)
}
