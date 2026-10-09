/**
 * Extrai as ilustrações dos produtos do protótipo v2 e grava como data
 * URIs prontos em src/lib/artwork/generated.json.
 *
 * Gerar em tempo de render quebra a hidratação: encodeURIComponent produz
 * escapes diferentes no Node e no navegador. Então geramos uma vez só.
 *
 * Uso: node scripts/build-artwork.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const html = readFileSync(join(root, 'docs/prototipo/markethub_v2.html'), 'utf8')

const start = html.indexOf('const KINDS=')
const end = html.indexOf('const seed=')
if (start < 0 || end < 0) {
  throw new Error('Não achei o bloco de artwork no protótipo.')
}

// O protótipo define KINDS e artwork() em sequência; envolvemos num IIFE
// para extrair as duas sem poluir o escopo.
const { KINDS, artwork } = eval(`(function(){${html.slice(start, end)}; return { KINDS, artwork }})()`)

const out = {}
for (const kind of KINDS) out[kind] = artwork(kind)

const target = join(root, 'src/lib/artwork/generated.json')
writeFileSync(target, JSON.stringify(out))
console.log(`${KINDS.length} desenhos gravados em ${target}`)
