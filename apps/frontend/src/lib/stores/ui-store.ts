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
}

export const useUiStore = create<UiState>((set) => ({
  hideFinancialValues: false,
  toggleHideFinancialValues: () => set((s) => ({ hideFinancialValues: !s.hideFinancialValues })),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}))
