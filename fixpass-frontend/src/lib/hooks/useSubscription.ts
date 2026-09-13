import { useQuery } from '@tanstack/react-query'
import { fetchSubscription } from '@/lib/api/subscription'

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: fetchSubscription,
    staleTime: 5 * 60_000,
  })
}
