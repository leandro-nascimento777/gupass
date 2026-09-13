import { useQuery } from '@tanstack/react-query'
import { getClient } from '../services/clients.service'
import { getClientHistory } from '../services/client-history.service'

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => getClient(id),
    enabled: Boolean(id),
  })
}

export function useClientHistory(id: string) {
  return useQuery({
    queryKey: ['clients', id, 'history'],
    queryFn: () => getClientHistory(id),
    enabled: Boolean(id),
  })
}
