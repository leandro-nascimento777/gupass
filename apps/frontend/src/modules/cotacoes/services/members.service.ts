import { membersAdapter } from '../adapters/members.adapter'

export function listAgencyMembers(q?: string) {
  return membersAdapter.list({ q })
}
