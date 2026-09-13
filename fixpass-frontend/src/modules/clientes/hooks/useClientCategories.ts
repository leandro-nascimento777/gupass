import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createClientCategory,
  deleteClientCategory,
  fetchClientCategories,
  updateClientCategory,
} from '@/lib/api/clients'
import type { ClientCategory } from '@/types/entities'

export function useClientCategories(q?: string) {
  return useQuery({
    queryKey: ['client-categories', q],
    queryFn: () => fetchClientCategories({ q }),
  })
}

export function useCreateClientCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ClientCategory>) => createClientCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-categories'] })
      toast.success('Categoria criada.')
    },
    onError: () => toast.error('Não foi possível criar a categoria.'),
  })
}

export function useUpdateClientCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientCategory> }) => updateClientCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-categories'] })
      toast.success('Categoria atualizada.')
    },
    onError: () => toast.error('Não foi possível atualizar a categoria.'),
  })
}

export function useDeleteClientCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteClientCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-categories'] })
      toast.success('Categoria removida.')
    },
    onError: () => toast.error('Não foi possível remover a categoria.'),
  })
}
