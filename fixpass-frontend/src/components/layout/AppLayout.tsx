import { Outlet } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Topbar } from './Topbar'
import { QuickActionsBar } from './QuickActionsBar'
import { WhatsappFab } from './WhatsappFab'
import { CommandPalette } from './CommandPalette'

/**
 * Layout autenticado — SEM sidebar fixa (ver referência real: navegação vive no
 * topbar com dropdowns Emissões/Cadastro/Gestão + menu completo via hamburger,
 * não uma coluna lateral permanente).
 */
export function AppLayout() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-svh bg-background">
        <Topbar />
        <main className="mx-auto flex w-[min(1280px,calc(100%-2rem))] flex-col gap-4 py-4">
          <QuickActionsBar />
          <Outlet />
        </main>
        <WhatsappFab />
        <CommandPalette />
      </div>
    </TooltipProvider>
  )
}
