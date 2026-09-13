import { httpClient } from '@/lib/api/http-client'
import type { Subscription } from '@/types/entities'

export const subscriptionAdapter = {
  fetch() {
    return httpClient.get<Subscription>('/subscription')
  },
}
