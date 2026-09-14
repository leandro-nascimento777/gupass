import { FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUiStore } from '@/lib/stores/ui-store'

/**
 * "Nova Cotação" — abre por cima da tela atual via atalho da QuickActionsBar
 * (nunca navega, ver referência real). Módulo de Cotações ainda não
 * construído (próximo na ordem da spec, item 5); moldura já segue a
 * referência capturada (ícone/título/subtítulo do dialog).
 */
export function NovaCotacaoDialog() {
  const open = useUiStore((s) => s.novaCotacaoDialogOpen)
  const setOpen = useUiStore((s) => s.setNovaCotacaoDialogOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex-row items-center gap-3 space-y-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="size-5" />
          </div>
          <div className="text-left">
            <DialogTitle>Nova Cotação</DialogTitle>
            <DialogDescription>Informe os dados do lead para iniciar o processo de cotação.</DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
          <FileText className="size-8" />
          <p className="font-medium text-foreground">Módulo em construção</p>
          <p>O Kanban de cotações (6 estágios) e este formulário entram em uma próxima sessão.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
