/**
 * Ilustrações dos produtos de demonstração.
 *
 * Os desenhos vêm do protótipo v2, convertidos em data URI uma única vez
 * por `scripts/build-artwork.mjs` e guardados em `generated.json`.
 *
 * Gerar em tempo de render quebrava a hidratação: `encodeURIComponent`
 * produz escapes sutilmente diferentes no Node e no navegador, então o
 * `src` do servidor não batia com o do cliente.
 *
 * §6.2: o produto real usa a foto original ou uma capa personalizada;
 * sem isso, placeholder neutro. Estas ilustrações ocupam esse lugar
 * enquanto não há fotos reais.
 */
import generated from './generated.json'

const ARTWORK = generated as Record<string, string>

export const ARTWORK_KINDS = Object.keys(ARTWORK)

export function artwork(kind: string): string | null {
  return ARTWORK[kind] ?? null
}
