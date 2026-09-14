import { useQuery } from '@tanstack/react-query'
import { listAgencyMembers } from '../services/members.service'

export function useAgencyMembers() {
  return useQuery({ queryKey: ['members', 'all'], queryFn: () => listAgencyMembers() })
}
