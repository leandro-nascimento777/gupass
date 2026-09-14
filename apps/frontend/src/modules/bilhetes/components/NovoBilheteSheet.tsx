import { Ticket } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useUiStore } from '@/lib/stores/ui-store'

/**
 * Painel lateral "Novo Bilhete" — abre por cima da tela atual via atalho da
 * QuickActionsBar (nunca navega, ver referência real). O módulo de Bilhetes
 * ainda não foi construído (próximo na ordem da spec, item 6); a moldura
 * (ícone/título/subtítulo do painel) já segue a referência capturada.
 */
export function NovoBilheteSheet() {
  const open = useUiStore((s) => s.novoBilheteSheetOpen)
  const setOpen = useUiStore((s) => s.setNovoBilheteSheetOpen)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Ticket className="size-4" /> Novo Bilhete
          </SheetTitle>
          <SheetDescription>Selecione o método de emissão para iniciar.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
          <Ticket className="size-8" />
          <p className="font-medium text-foreground">Módulo em construção</p>
          <p>A emissão de bilhetes (seleção de companhia, formulário por CIA) entra em uma próxima sessão.</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
