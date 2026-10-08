import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { APPEARANCE_INIT, AppearanceProvider } from '@/components/appearance'
import { AppShell } from '@/components/shell'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'MarketHub',
    template: '%s · MarketHub',
  },
  description:
    'Centralize, organize e prepare seus produtos para cada marketplace.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      data-accent="orange"
      data-density="comfortable"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Aplica o tema salvo antes da primeira pintura. */}
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_INIT }} />
      </head>
      <body className="font-sans min-h-full">
        <AppearanceProvider>
          <AppShell>{children}</AppShell>
        </AppearanceProvider>
      </body>
    </html>
  )
}
