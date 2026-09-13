import { useQuery } from '@tanstack/react-query'
import { getSubscription } from '../services/subscription.service'

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: getSubscription,
    staleTime: 5 * 60_000,
  })
}
