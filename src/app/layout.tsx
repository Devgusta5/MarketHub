import type { Metadata } from 'next'
import { Saira_Condensed, Martian_Mono } from 'next/font/google'
import './globals.css'

// Painel: condensada, técnica, cabe muita coluna sem apertar a leitura.
const display = Saira_Condensed({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

// Dados: mono desenhada para grade — códigos, SKU, números, rótulos.
const data = Martian_Mono({
  variable: '--font-data',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'MarketHub — Despacho',
  description:
    'Central de produtos e conteúdo: uma ficha por produto, adaptada para cada marketplace.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${data.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full bg-deep">{children}</body>
    </html>
  )
}
