import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createQuoteFromLead, deleteQuote, listQuotesForBoard, moveQuoteToStage, type NewQuoteLead } from '../services/quotes.service'
import type { Quote, QuoteStage } from '@/types/entities'

const BOARD_KEY = ['quotes', 'board']

export function useQuotesBoard() {
  return useQuery({ queryKey: BOARD_KEY, queryFn: listQuotesForBoard })
}

export function useCreateQuote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lead: NewQuoteLead) => createQuoteFromLead(lead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY })
      toast.success('Cotação criada.')
    },
    onError: () => toast.error('Não foi possível criar a cotação.'),
  })
}

export function useMoveQuote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ quote, toStage }: { quote: Quote; toStage: QuoteStage }) => moveQuoteToStage(quote, toStage),
    // Atualização otimista: o card já troca de coluna na hora, sem esperar o
    // round-trip da API — essencial pra drag-and-drop parecer instantâneo.
    onMutate: async ({ quote, toStage }) => {
      await queryClient.cancelQueries({ queryKey: BOARD_KEY })
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof listQuotesForBoard>>>(BOARD_KEY)
      if (previous) {
        queryClient.setQueryData(BOARD_KEY, {
          ...previous,
          data: previous.data.map((q) => (q.id === quote.id ? { ...q, stage: toStage } : q)),
        })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(BOARD_KEY, context.previous)
      toast.error('Não foi possível mover a cotação.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY })
    },
  })
}

export function useDeleteQuote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteQuote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY })
      toast.success('Cotação removida.')
    },
  })
}
