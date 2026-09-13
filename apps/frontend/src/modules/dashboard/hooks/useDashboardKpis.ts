import { useQuery } from '@tanstack/react-query'
import { getDashboardKpis, type DashboardPeriod } from '../services/dashboard.service'

export type { DashboardPeriod }

export function useDashboardKpis(period: DashboardPeriod) {
  return useQuery({
    queryKey: ['dashboard', period],
    queryFn: () => getDashboardKpis(period),
  })
}
