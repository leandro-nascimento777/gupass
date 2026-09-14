import { Outlet } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NovoClienteDialog } from '@/modules/clientes/components/NovoClienteDialog'
import { NovoBilheteSheet } from '@/modules/bilhetes/components/NovoBilheteSheet'
import { NovaCotacaoDialog } from '@/modules/cotacoes/components/NovaCotacaoDialog'
import { NovaVendaDialog } from '@/modules/financeiro/vendas/components/NovaVendaDialog'
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

        {/* Atalhos da QuickActionsBar: abrem por cima da tela atual, nunca navegam. */}
        <NovoClienteDialog />
        <NovoBilheteSheet />
        <NovaCotacaoDialog />
        <NovaVendaDialog />
      </div>
    </TooltipProvider>
  )
}
