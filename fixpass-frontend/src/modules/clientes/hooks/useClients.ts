import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createClient,
  deleteClient,
  fetchClients,
  type ListClientsParams,
} from '@/lib/api/clients'
import type { Client } from '@/types/entities'

export function useClients(params: ListClientsParams) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => fetchClients(params),
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Client>) => createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente cadastrado com sucesso.')
    },
    onError: () => {
      toast.error('Não foi possível cadastrar o cliente. Tente novamente.')
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente removido.')
    },
    onError: () => {
      toast.error('Não foi possível remover o cliente.')
    },
  })
}
