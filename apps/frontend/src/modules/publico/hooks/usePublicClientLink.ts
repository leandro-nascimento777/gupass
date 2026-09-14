import { useQuery } from '@tanstack/react-query'
import { resolvePublicClientLink } from '../services/public-client-link.service'

export function usePublicClientLink(slug: string) {
  return useQuery({
    queryKey: ['public-client-link', slug],
    queryFn: () => resolvePublicClientLink(slug),
    enabled: Boolean(slug),
    retry: false,
  })
}
