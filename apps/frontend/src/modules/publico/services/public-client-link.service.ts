import { publicClientLinkAdapter } from '../adapters/public-client-link.adapter'

export function resolvePublicClientLink(slug: string) {
  return publicClientLinkAdapter.resolve(slug)
}
