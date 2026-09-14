import { useUiStore } from '@/lib/stores/ui-store'
import { quickActions, type QuickActionKind } from './nav-config'

/** Barra de ações rápidas (verde, cheia largura) — ver referência real, abaixo do topbar. */
export function QuickActionsBar() {
  const setNovoBilheteSheetOpen = useUiStore((s) => s.setNovoBilheteSheetOpen)
  const setNovoClienteDialogOpen = useUiStore((s) => s.setNovoClienteDialogOpen)
  const setNovaCotacaoDialogOpen = useUiStore((s) => s.setNovaCotacaoDialogOpen)
  const setNovaVendaDialogOpen = useUiStore((s) => s.setNovaVendaDialogOpen)

  function handleClick(kind: QuickActionKind) {
    switch (kind) {
      case 'bilhete':
        return setNovoBilheteSheetOpen(true)
      case 'cliente':
        return setNovoClienteDialogOpen(true)
      case 'cotacao':
        return setNovaCotacaoDialogOpen(true)
      case 'venda':
        return setNovaVendaDialogOpen(true)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 rounded-2xl bg-brand-primary px-6 py-3 text-white">
      {quickActions.map((action) => (
        <button
          key={action.kind}
          type="button"
          onClick={() => handleClick(action.kind)}
          className="flex items-center gap-2 text-sm font-bold hover:opacity-80"
        >
          <action.icon className="size-4" />
          {action.label}
        </button>
      ))}
    </div>
  )
}
