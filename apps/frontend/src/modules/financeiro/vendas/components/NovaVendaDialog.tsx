import { ShoppingCart } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUiStore } from '@/lib/stores/ui-store'

/**
 * "Nova Venda" — abre por cima da tela atual via atalho da QuickActionsBar
 * (nunca navega, ver referência real: wizard de 5 passos com abas
 * Cliente/Origem/Itens/Pagamento/Confirmar). Módulo de Vendas ainda não
 * construído (item 7 da ordem da spec); moldura já segue a referência.
 */
export function NovaVendaDialog() {
  const open = useUiStore((s) => s.novaVendaDialogOpen)
  const setOpen = useUiStore((s) => s.setNovaVendaDialogOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex-row items-center gap-3 space-y-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <ShoppingCart className="size-5" />
          </div>
          <div className="text-left">
            <DialogTitle>Nova Venda</DialogTitle>
            <DialogDescription>Busque ou cadastre rapidamente um novo cliente.</DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
          <ShoppingCart className="size-8" />
          <p className="font-medium text-foreground">Módulo em construção</p>
          <p>O wizard de 5 passos (Cliente → Origem → Itens → Pagamento → Confirmar) entra em uma próxima sessão.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
