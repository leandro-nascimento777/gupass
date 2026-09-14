import { create } from 'zustand'

/**
 * Estado global de UI (não é dado de servidor — isso vive no TanStack Query).
 * Ver regra de implementação: nada de localStorage para dado de negócio, só
 * preferências efêmeras de UI (aqui mantidas só em memória por enquanto).
 */
interface UiState {
  hideFinancialValues: boolean
  toggleHideFinancialValues: () => void

  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  /**
   * Os atalhos da QuickActionsBar (Novo Bilhete/Cliente/Cotação/Venda) abrem o
   * modal correspondente de onde o usuário estiver — nunca navegam pra uma
   * página (ver referência real: o modal aparece por cima do Dashboard). Por
   * isso o estado do dialog "Novo Cliente" mora aqui, global, e não como
   * estado local de ClientesPage.
   */
  novoClienteDialogOpen: boolean
  setNovoClienteDialogOpen: (open: boolean) => void

  novoBilheteSheetOpen: boolean
  setNovoBilheteSheetOpen: (open: boolean) => void

  novaCotacaoDialogOpen: boolean
  setNovaCotacaoDialogOpen: (open: boolean) => void

  novaVendaDialogOpen: boolean
  setNovaVendaDialogOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  hideFinancialValues: false,
  toggleHideFinancialValues: () => set((s) => ({ hideFinancialValues: !s.hideFinancialValues })),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  novoClienteDialogOpen: false,
  setNovoClienteDialogOpen: (open) => set({ novoClienteDialogOpen: open }),

  novoBilheteSheetOpen: false,
  setNovoBilheteSheetOpen: (open) => set({ novoBilheteSheetOpen: open }),

  novaCotacaoDialogOpen: false,
  setNovaCotacaoDialogOpen: (open) => set({ novaCotacaoDialogOpen: open }),

  novaVendaDialogOpen: false,
  setNovaVendaDialogOpen: (open) => set({ novaVendaDialogOpen: open }),
}))
