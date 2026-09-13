import { subscriptionAdapter } from '../adapters/subscription.adapter'

export function getSubscription() {
  return subscriptionAdapter.fetch()
}
