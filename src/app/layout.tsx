import type { Metadata } from 'next'
import './globals.css'
import { PREFS_INIT, PrefsProvider } from '@/lib/prefs'

export const metadata: Metadata = {
  title: 'markethub',
  description: 'Central de produção de materiais para marketplaces.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" data-theme="dark" className="h-full" suppressHydrationWarning>
      <head>
        {/* Aplica o tema salvo antes da primeira pintura. */}
        <script dangerouslySetInnerHTML={{ __html: PREFS_INIT }} />
      </head>
      <body className="h-full overflow-hidden">
        <PrefsProvider>{children}</PrefsProvider>
      </body>
    </html>
  )
}
