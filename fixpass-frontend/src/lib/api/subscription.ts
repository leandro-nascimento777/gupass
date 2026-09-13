import { httpClient } from './http-client'
import type { Subscription } from '@/types/entities'

export function fetchSubscription() {
  return httpClient.get<Subscription>('/subscription')
}
