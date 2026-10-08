import { PageHeader } from '@/components/shell'
import { AppearanceSettings } from './appearance-settings'

export const metadata = { title: 'Configurações' }

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader title="Configurações" />
      <AppearanceSettings />
    </div>
  )
}
