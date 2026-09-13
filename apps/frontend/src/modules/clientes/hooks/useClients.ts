import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createClientFromWizard,
  deleteClient,
  listClients,
  type ListClientsParams,
} from '../services/clients.service'
import type { ClientFormValues } from '../validators/client.schema'
import type { PersonType } from '@/types/entities'

export function useClients(params: ListClientsParams) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => listClients(params),
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ personType, values }: { personType: PersonType; values: ClientFormValues }) =>
      createClientFromWizard(personType, values),
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
