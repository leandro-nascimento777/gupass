import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createManagedLink,
  createTemporaryLink,
  deleteManagedLink,
  deleteTemporaryLink,
  getPublicLinkSettings,
  updatePublicLinkSettings,
} from '../services/public-link.service'

const QUERY_KEY = ['clients', 'public-link-settings']

export function usePublicLinkSettings() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getPublicLinkSettings })
}

export function useUpdatePublicLinkSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updatePublicLinkSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Aparência atualizada.')
    },
    onError: () => toast.error('Não foi possível salvar a aparência.'),
  })
}

export function useCreateManagedLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createManagedLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Link criado.')
    },
    onError: (error: Error) => toast.error(error.message || 'Não foi possível criar o link.'),
  })
}

export function useDeleteManagedLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteManagedLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Link removido.')
    },
  })
}

export function useCreateTemporaryLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTemporaryLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Link temporário gerado.')
    },
  })
}

export function useDeleteTemporaryLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTemporaryLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
