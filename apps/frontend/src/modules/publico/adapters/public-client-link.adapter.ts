import { httpClient } from '@/lib/api/http-client'
import type { PublicClientLinkInfo } from '@/types/entities'

export const publicClientLinkAdapter = {
  resolve(slug: string) {
    return httpClient.get<PublicClientLinkInfo>(`/public/client-link/${slug}`)
  },
}
