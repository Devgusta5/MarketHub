/**
 * Rótulos da interface.
 *
 * O documento mestre chama de "cliente" quem é atendido, e o código segue
 * isso (client_id). Mas na operação do dia a dia o termo usado é "empresa",
 * então é o que aparece na tela.
 *
 * Para trocar o vocabulário visível, mexa só aqui.
 */
export const L = {
  /** Quem é atendido. Mestre: "cliente". Operação: "empresa". */
  client: 'Empresa',
  clientPlural: 'Empresas',
  clientLower: 'empresa',
  clientPluralLower: 'empresas',

  product: 'Produto',
  productPlural: 'Produtos',

  /** A organização dona do sistema. */
  org: 'Ecommerce+',
} as const
